import type { APIRoute } from 'astro'

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /keystatic/

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site)
	return new Response(getRobotsTxt(sitemapURL), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0',
			'Content-Disposition': 'inline',
		},
	})
}
