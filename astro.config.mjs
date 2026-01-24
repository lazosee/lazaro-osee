import markdoc from '@astrojs/markdoc'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import expressiveCode from 'astro-expressive-code'

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		markdoc(),
		keystatic(),
		expressiveCode({
			frames: true,
			themes: ['github-light-default', 'github-dark-default'],
			shiki: true,
		}),
	],
	devToolbar: {
		enabled: false,
	},
	i18n: {
		defaultLocale: 'en-US',
		locales: ['en-US', 'es-ES'],
		fallback: {
			'es-ES': 'en-US',
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},
})
