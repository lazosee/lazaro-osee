export const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY

export type LocalStorageKey = `osee:${string}`

export interface SubscriptionResult {
	message: string
	success: boolean
}

export const NOTIFICATION_ID_STORAGE_KEY = 'osee:browser-notification-id' satisfies LocalStorageKey

export async function subscribeUser(): Promise<SubscriptionResult> {
	const alreadySubscribed = isSubscribed()
	if (alreadySubscribed) {
		return {
			message: 'Thanks! You are already subscribed to our notifications',
			success: true,
		}
	}

	const registration = await navigator.serviceWorker.ready
	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey:
			'BBzYwtHdNwUK6dJtZcqw4m9UGjI2hFtGK9TXB7Q0Mx3Le53DvN6KD5aUCKne66ivbPoVf_64rw8HimUudEGTVMc',
	})

	// Send this 'subscription' object to your server via fetch()
	const res = await fetch('/api/push-notification', {
		method: 'POST',
		body: JSON.stringify(subscription),
		headers: { 'Content-Type': 'application/json' },
	})

	if (res.ok) {
		const { id }: { id: string } = await res.json()
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

export async function unsubscribeUser(): Promise<SubscriptionResult> {
	const id = getNotificationId()

	if (id) {
		const res = await fetch('/api/push-notification', {
			method: 'DELETE',
			body: JSON.stringify({ endpoint: id }),
			headers: { 'Content-Type': 'application/json' },
		})

		if (res.ok) {
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
