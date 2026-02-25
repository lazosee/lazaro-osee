import { D1_REST_URL } from '@/db/worker'
import { defineMiddleware } from 'astro:middleware'

console.log('Middleware loaded')

export const onRequest = defineMiddleware(async (context, next) => {
	const sessionId = context.cookies.get('app_session')?.value
	console.log('Cookie Found:', sessionId)

	// 1. If no cookie, user is definitely not logged in
	if (!sessionId) {
		context.locals.user = null
	} else {
		try {
			// 2. Verify session with your D1 REST API
			const response = await fetch(`${D1_REST_URL}/query`, {
				method: 'POST',
				body: JSON.stringify({
					query: 'SELECT * FROM sessions WHERE id = ? LIMIT ?;',
					params: [sessionId, 1],
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
				},
			})
			const {
				results: [session],
			} = await response.json()

			console.dir(session, { depth: Infinity })

			const now = Math.floor(Date.now() / 1000)

			// 3. Validate existence and expiration
			if (session && session.expires_at > now) {
				context.locals.user = { email: session.user_id }
			} else {
				context.locals.user = null
				context.cookies.delete('app_session') // Clean up stale cookie
			}
		} catch (e) {
			console.error('Auth middleware error:', e)
			context.locals.user = null
		}
	}

	// 4. Protect Routes: Redirect if trying to access /admin without a user
	if (
		(context.url.pathname.startsWith('/admin') || context.url.pathname.startsWith('/keystatic')) &&
		!context.url.pathname.startsWith('/admin/login') &&
		!context.locals.user
	) {
		return context.redirect('/admin/login')
	}

	return next()
})
