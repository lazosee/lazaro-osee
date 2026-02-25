/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.css'

declare namespace App {
	interface Locals {
		user: {
			email: string
		} | null
	}
}
