import { D1_REST_URL } from '@/db/worker'
import { sendOtpEmailDirectly } from '@/utils/resend'
import type { APIContext } from 'astro'

export async function POST({ request }: APIContext) {
	const { email } = await request.json()
	const now = Math.floor(Date.now() / 1000)

	// 1. Check Cooldown via your REST API
	const getRes = await fetch(`${D1_REST_URL}/query`, {
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
	const existing = await getRes.json()

	if (existing && now - existing.created_at < 60) {
		return new Response(
			JSON.stringify({
				error: `Wait ${60 - (now - existing.created_at)}s`,
			}),
			{ status: 429 }
		)
	}

	// 2. Generate New Data
	const otp = Math.floor(100000 + Math.random() * 900000).toString()
	const expiresAt = now + 60 * 5 // 5 mins

	// 3. Save to D1 via your REST API
	await fetch(`${D1_REST_URL}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
		},
		body: JSON.stringify({
			query:
				'INSERT OR REPLACE INTO otp_codes (email, code, created_at, expires_at) VALUES (?, ?, ?, ?);',
			params: [email, otp, now, expiresAt],
		}),
	})

	// 4. Trigger your existing Email API
	const data = await sendOtpEmailDirectly(email, otp)

	return new Response(JSON.stringify({ success: true, data }))
}
