import { addSubscriber, deleteSubscriber } from '@/utils/notifications/push-notifications'
import type { APIContext } from 'astro'

type Payload = {
	endpoint: string
	expirationTime: number | null
	id: `${string}-${string}-${string}-${string}-${string}`
	keys: {
		auth: string
		p256dh: string
	}
}

export async function POST({ request }: APIContext): Promise<Response> {
	const payload = (await request.json()) as Payload

	try {
		const result = await addSubscriber(payload)
		return Response.json(result, { status: 201 })
	} catch (error) {
		console.error('Error adding subscriber:', error)
		return Response.json(
			{ message: 'Internal Server Error', success: false, status: 'error', id: null },
			{ status: 500 }
		)
	}
}

export async function DELETE({ request }: APIContext): Promise<Response> {
	const { id } = (await request.json()) as Pick<Payload, 'id'>

	try {
		const result = await deleteSubscriber(id)
		return Response.json(result, { status: 209 })
	} catch (error) {
		console.error('Error deleting subscriber:', error)
		return Response.json(
			{ message: 'Internal Server Error', success: false, status: 'error', id: null },
			{ status: 500 }
		)
	}
}
