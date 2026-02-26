import type { SubscriptionResult } from '@/types/push'

export const PUBLIC_VAPID_KEY = import.meta.env.PUBLIC_VAPID_KEY

export type LocalStorageKey = `osee:${string}`

export const NOTIFICATION_ID_STORAGE_KEY = 'osee:browser-notification-id' satisfies LocalStorageKey

function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

export async function subscribeUser(): Promise<Omit<SubscriptionResult, 'id' | 'status'>> {
	const alreadySubscribed = isSubscribed()
	if (alreadySubscribed) {
		return {
			message: 'Thanks! You are already subscribed to our notifications',
			success: true,
		}
	}

	const registration = await navigator.serviceWorker.ready
	const subscription = (
		await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
		})
	).toJSON()

	// Send this 'subscription' object to your server via fetch()
	if (subscription.expirationTime == undefined) subscription.expirationTime = null

	const payload = {
		...subscription,
		endpoint: subscription.endpoint ?? '',
		expirationTime: subscription.expirationTime
			? Number(subscription.expirationTime.toFixed())
			: null,
		id: crypto.randomUUID(),
		keys: {
			auth: subscription.keys?.auth ?? '',
			p256dh: subscription.keys?.p256dh ?? '',
		},
	} satisfies {
		endpoint: string
		expirationTime: number | null
		id: `${string}-${string}-${string}-${string}-${string}`
		keys: {
			auth: string
			p256dh: string
		}
	}

	const res = (await fetch('/api/push-notification', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	}).then((res) => res.json())) as SubscriptionResult

	if (res && res.success) {
		const { id } = res
		setNotificationId(id)

		return {
			message: 'Thanks! You are now subscribed to our notifications',
			success: true,
		}
	} else {
		return {
			message: 'Sorry! Something went wrong. Please try again later.',
			success: false,
		}
	}
}

export function isSubscribed(): boolean {
	return getNotificationId() !== null
}

export function getNotificationId(): string | null {
	return localStorage.getItem(NOTIFICATION_ID_STORAGE_KEY)
}

export function setNotificationId(id: string) {
	localStorage.setItem(NOTIFICATION_ID_STORAGE_KEY, id)
}

export async function unsubscribeUser(): Promise<Omit<SubscriptionResult, 'id' | 'status'>> {
	const id = getNotificationId()

	if (id) {
		const res = (await (
			await fetch('/api/push-notification', {
				method: 'DELETE',
				body: JSON.stringify({ id }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
		).json()) as SubscriptionResult

		if (res && res.success) {
			localStorage.removeItem(NOTIFICATION_ID_STORAGE_KEY)
			return {
				message: 'You are now unsubscribed from our notifications',
				success: true,
			}
		}
		return {
			message: 'Could not unsubscribe. Please try again later.',
			success: false,
		}
	} else {
		return {
			message: 'You are not subscribed to our notifications',
			success: true,
		}
	}
}
