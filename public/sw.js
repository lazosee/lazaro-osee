let isDarkMode = true

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'THEME_CHANGE') {
		isDarkMode = event.data.isDark
		console.log('Service Worker updated theme state:', isDarkMode)
	}
})

self.addEventListener('install', (event) => {
	console.log('Service Worker installing...')
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	console.log('Service Worker activated!')
})

self.addEventListener('push', (event) => {
	const data = event.data.json()

	const title = data.title || 'New Update from Lazaro Osee'
	const options = {
		body: data.body || 'Click to see what is new on the site.',
		icon: isDarkMode ? '/favicon-dark.svg' : '/favicon.svg',
		badge: isDarkMode ? '/favicon-dark.svg' : '/favicon.svg',
		data: {
			url: data.link || '/',
		},
	}

	event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
	event.notification.close()

	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
			const targetUrl = event.notification.data.url
			if (!targetUrl) return

			// 1. Normalize the target URL (remove trailing slashes for better matching)
			const normalizedTarget = targetUrl.replace(/\/$/, '')

			for (const client of clientsList) {
				const normalizedClientUrl = client.url.replace(/\/$/, '')

				// 2. Check if the tab is already open (normalized match)
				if (normalizedClientUrl === normalizedTarget && 'focus' in client) {
					return client.focus()
				}
			}

			// 3. Fallback: If no match, try to find ANY tab from your site to reuse
			// This prevents opening new tabs if the user is already on your site
			if (clientsList.length > 0) {
				const firstClient = clientsList[0]
				if ('navigate' in firstClient) {
					firstClient.navigate(targetUrl)
					return firstClient.focus()
				}
			}

			// 4. Final fallback: Open a new window
			if (clients.openWindow) {
				return clients.openWindow(targetUrl)
			}
		})
	)
})
