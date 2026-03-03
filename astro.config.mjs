import markdoc from '@astrojs/markdoc'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import { defineConfig } from 'astro/config'
import { config } from 'dotenv'

import expressiveCode from 'astro-expressive-code'

import node from '@astrojs/node'
import vercel from '@astrojs/vercel'

import sitemap from '@astrojs/sitemap'

config({ quiet: true })

const isProd = process.env.NODE_ENV === 'production'

// https://astro.build/config
export default defineConfig({
	site: 'https://www.lazaroosee.xyz',
	integrations: [
		sitemap({
			filter: (page) => {
				// Exclude the 404 page from the sitemap
				return (
					!page.includes('404') &&
					!page.includes('/admin') &&
					!page.includes('/keystatic') &&
					!page.includes('/login') &&
					!page.includes('/register') &&
					!page.includes('/api')
				)
			},
		}),
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
		plugins: [],
	},

	output: 'server',
	adapter: isProd ? vercel({ webAnalytics: { enabled: true } }) : node({ mode: 'standalone' }),
})
