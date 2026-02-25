// This is a minimal Service Worker
self.addEventListener('install', (event) => {
	console.log('Service Worker installing...')
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	console.log('Service Worker activated!')
})

// Optional: Handle what happens when the user clicks the notification
self.addEventListener('notificationclick', (event) => {
	event.notification.close()
	console.log(event.notification.data)
	event.waitUntil(
		clients.openWindow('/') // Opens your blog root
	)
})

self.addEventListener('push', (event) => {
	const data = event.data.json()

	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: '/favicon.svg',
			badge: '/favicon.svg',
			data: data.payload ?? {},
		})
	)
})
