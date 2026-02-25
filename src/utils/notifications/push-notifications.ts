import webpush from 'web-push'

export async function sendPushNotification({
	publicKey,
	privateKey,
}: {
	publicKey: string
	privateKey: string
}) {
	webpush.setVapidDetails('mailto:your-email@example.com', publicKey, privateKey)

	// Get all subscriptions
	const res = await fetch('https://qflflj3l-3000.uks1.devtunnels.ms/notifications')
	const subscriptions = (await res.json()) as webpush.PushSubscription[]
	if (!subscriptions || subscriptions.length < 1) return

	const notifications = subscriptions.map((result) => {
		const subscription = result as unknown as webpush.PushSubscription

		// Trigger this when "something happens"
		const payload = JSON.stringify({ title: 'New Post!', body: 'Lazaro just posted.' })

		webpush
			.sendNotification(subscription, payload)
			.catch((err) => console.error('Error sending push:', err))
	})

	await Promise.all(notifications)
}
