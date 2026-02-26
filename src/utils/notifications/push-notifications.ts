import { D1_REST_URL } from '@/db/worker'
import webpush from 'web-push'

type Payload = {
	endpoint: string
	expirationTime: number | null
	id: `${string}-${string}-${string}-${string}-${string}`
	keys: {
		auth: string
		p256dh: string
	}
}

export async function addSubscriber(sub: Payload) {
	const availableRes = await fetch(`${D1_REST_URL}/rest/notification_subscriptions`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
		},
	})
	const available = (await availableRes.json())['results'] as {
		id: string
		endpoint: string
		expiration_time: number | null
		key_p256dh: string
		key_auth: string
	}[]

	if (available.length > 0 && available.some((a) => a.id === sub.id)) {
		console.log('Subscription already exists')
		return {
			message: 'Subscription already exists',
			status: 'available',
			success: true,
			id: sub.id,
		}
	}

	const res = await fetch(`${D1_REST_URL}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
		},
		body: JSON.stringify({
			query: `INSERT INTO notification_subscriptions (id, endpoint, expiration_time, key_p256dh, key_auth) VALUES (?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET endpoint = ?, expiration_time = ?, key_p256dh = ?, key_auth = ? RETURNING *;`,
			params: [
				sub.id,
				sub.endpoint,
				sub.expirationTime ?? null,
				sub.keys.p256dh,
				sub.keys.auth,
				sub.endpoint,
				sub.expirationTime ?? null,
				sub.keys.p256dh,
				sub.keys.auth,
			],
		}),
	})

	const result = await res.json()
	if (result.error) throw new Error(result.error)
	if (result.success)
		return {
			message: 'Subscription added successfully',
			status: 'success',
			success: true,
			id: result['results'][0]['id'] as string,
		}
}

export async function getAllSubscribers() {
	const res = await fetch(`${D1_REST_URL}/rest/notification_subscriptions`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
		},
	})

	const subscribers = (await res.json())['results'] as {
		id: string
		endpoint: string
		expiration_time: number | null
		key_p256dh: string
		key_auth: string
	}[]

	return subscribers.map(
		(sub) =>
			({
				id: sub.id,
				endpoint: sub.endpoint,
				expirationTime: sub.expiration_time,
				keys: {
					p256dh: sub.key_p256dh,
					auth: sub.key_auth,
				},
			}) satisfies webpush.PushSubscription & { id: string }
	)
}

export async function getSubscribersByIds(idList: string[]) {
	const subs: (webpush.PushSubscription & { id: string })[] = []

	for (const id of idList) {
		const res = await fetch(`${D1_REST_URL}/query`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
			},
			body: JSON.stringify({
				query: `SELECT * FROM notification_subscriptions WHERE id = ?`,
				params: [id],
			}),
		})

		const [sub] = (await res.json())['results'] as {
			id: string
			endpoint: string
			expiration_time: number | null
			key_p256dh: string
			key_auth: string
		}[]

		if (sub) {
			subs.push({
				id: sub.id,
				endpoint: sub.endpoint,
				expirationTime: sub.expiration_time,
				keys: {
					p256dh: sub.key_p256dh,
					auth: sub.key_auth,
				},
			} satisfies webpush.PushSubscription & { id: string })
		}
	}

	return subs
}

export async function deleteSubscriber(id: string) {
	const res = await fetch(`${D1_REST_URL}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CLOUDFLARE_D1_SECRET}`,
		},
		body: JSON.stringify({
			query: `DELETE FROM notification_subscriptions WHERE id = ? RETURNING *;`,
			params: [id],
		}),
	})

	const result = await res.json()
	if (result.error) throw new Error(result.error)
	if (result.success)
		return {
			message: 'Subscription deleted successfully',
			status: 'success',
			success: true,
		}
}

export async function sendPushNotification({
	publicKey,
	privateKey,
	data,
	subscriptions = [],
}: {
	publicKey: string
	privateKey: string
	subscriptions: (webpush.PushSubscription & { id: string })[]
	data: {
		title: string
		body: string
		link: string
	}
}) {
	webpush.setVapidDetails('mailto:me@lazaroosee.xyz', publicKey, privateKey)

	// Send
	if (!subscriptions || subscriptions.length < 1) return

	const notifications = subscriptions.map((result) => {
		const subscription = {
			endpoint: result.endpoint,
			expirationTime: result.expirationTime,
			keys: {
				auth: result.keys.auth,
				p256dh: result.keys.p256dh,
			},
		}

		// Trigger this when "something happens"
		const payload = JSON.stringify(data)

		webpush
			.sendNotification(subscription, payload)
			.catch((err) => console.error('Error sending push:', err))
	})

	await Promise.all(notifications)
}
