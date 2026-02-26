import { devWebUrl, isProduction, productionWebUrl } from '@/constants'
import {
	getAllSubscribers,
	getSubscribersByIds,
	sendPushNotification,
} from '@/utils/notifications/push-notifications.ts'
import type { APIContext } from 'astro'

const webUrl = isProduction ? productionWebUrl : devWebUrl

export async function POST({ request }: APIContext) {
	const data = await request.json()

	const subscriptions = data.subscriptions
		? await getSubscribersByIds(data.subscriptions)
		: await getAllSubscribers()

	await sendPushNotification({
		publicKey:
			'BBzYwtHdNwUK6dJtZcqw4m9UGjI2hFtGK9TXB7Q0Mx3Le53DvN6KD5aUCKne66ivbPoVf_64rw8HimUudEGTVMc',
		privateKey: '1b719eyd4L_1ct1u6hjgOyYrPpbExeD6l4dq9pJ2QkY',
		data: {
			title: data.title,
			body: data.body,
			link: `https://${webUrl}/${data.link}`,
		},
		subscriptions: subscriptions,
	})

	return new Response(JSON.stringify({ message: 'Hello, world' }))
}
