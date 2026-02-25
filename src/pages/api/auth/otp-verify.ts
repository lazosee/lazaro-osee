import { D1_REST_URL } from '@/db/worker'
import type { APIContext } from 'astro'

// src/pages/api/auth/otp-verify.ts
export async function POST({ request, cookies }: APIContext) {
	const { email, code } = await request.json()
	const now = Math.floor(Date.now() / 1000)

	// 1. Fetch OTP from D1
	const res = await fetch(`${D1_REST_URL}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
		},
		body: JSON.stringify({
			query: 'SELECT * FROM otp_codes WHERE email = ? LIMIT ?;',
			params: [email, 1],
		}),
	})
	const {
		results: [record],
	} = await res.json()

	// 2. Validate
	if (!record || record.code !== code || record.expires_at < now) {
		return new Response('Invalid or expired code', { status: 401 })
	}

	// 3. Create Session
	const sessionId = crypto.randomUUID()
	const sessionExpires = now + 60 * 60 * 24 * 7 // 7 days

	await fetch(`${D1_REST_URL}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
		},
		body: JSON.stringify({
			query: 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?);',
			params: [sessionId, email, sessionExpires],
		}),
	})

	// 4. Set Cookie
	cookies.set('app_session', sessionId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		expires: new Date(sessionExpires * 1000),
	})

	return new Response(JSON.stringify({ success: true }))
}
