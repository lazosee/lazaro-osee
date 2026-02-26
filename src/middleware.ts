import { D1_REST_URL } from '@/db/worker'
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
	const path = context.url.pathname

	// 1. ROUTE GUARD: Only run Auth logic for admin and keystatic
	const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/keystatic')

	// Skip everything else (home page, blog, assets)
	if (!isProtectedRoute) {
		context.locals.user = null
		return next()
	}

	// 2. COOKIE CHECK
	const sessionId = context.cookies.get('app_session')?.value

	if (!sessionId) {
		context.locals.user = null
	} else {
		try {
			// 3. VERIFY WITH D1
			const response = await fetch(`${D1_REST_URL}/query`, {
				method: 'POST',
				body: JSON.stringify({
					query: 'SELECT * FROM sessions WHERE id = ? LIMIT 1;',
					params: [sessionId],
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
				},
			})

			// Handle non-JSON or empty responses safely
			const data = await response.json()
			const session = data?.results?.[0] // Safer than direct array destructuring

			const now = Math.floor(Date.now() / 1000)

			if (session && session.expires_at > now) {
				context.locals.user = { email: session.user_id }
			} else {
				context.locals.user = null
				// Only delete if we are on a protected route to avoid weird side effects
				context.cookies.delete('app_session', { path: '/' })
			}
		} catch (e) {
			console.error('Auth middleware error:', e)
			context.locals.user = null
		}
	}

	// 4. REDIRECT LOGIC
	// If it's a protected route, it's NOT the login page, and user is null -> Redirect
	if (isProtectedRoute && !path.startsWith('/admin/login') && !context.locals.user) {
		return context.redirect('/admin/login')
	}

	return next()
})
