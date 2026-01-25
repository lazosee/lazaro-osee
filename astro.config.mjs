import markdoc from '@astrojs/markdoc'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import { defineConfig } from 'astro/config'
import { config } from 'dotenv'

import tailwindcss from '@tailwindcss/vite'

import expressiveCode from 'astro-expressive-code'

import node from '@astrojs/node'
import vercel from '@astrojs/vercel'

config({ quiet: true })

const isProd = process.env.NODE_ENV === 'production'

console.log(isProd)

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

	output: 'server',
	adapter: isProd ? vercel({ webAnalytics: { enabled: true } }) : node({ mode: 'standalone' }),
})
