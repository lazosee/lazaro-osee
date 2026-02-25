import type { APIContext } from 'astro'

export async function POST({ request }: APIContext): Promise<Response> {
	const data = await request.json()

	const res = await fetch('https://qflflj3l-3000.uks1.devtunnels.ms/notifications', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	})

	const result = await res.json()

	return Response.json({
		id: result.id,
	})
}

export async function DELETE({ request }: APIContext): Promise<Response> {
	const data = await request.json()

	const res = await fetch('https://qflflj3l-3000.uks1.devtunnels.ms/notifications', {
		method: 'DELETE',
		body: JSON.stringify(data.id),
		headers: { 'Content-Type': 'application/json' },
	})

	const result = await res.json()

	return Response.json({
		id: result.id,
	})
}
