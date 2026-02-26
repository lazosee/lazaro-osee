/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.css'
declare module '*.heif' {
	const src: string
	// export default src
}

declare namespace App {
	interface Locals {
		user: {
			email: string
		} | null
	}
}
