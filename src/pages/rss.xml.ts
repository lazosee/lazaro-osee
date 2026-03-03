import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'

export async function GET({ site }: APIContext) {
	const posts = await getCollection('posts')
	const blog = posts.filter((post) => !post.data.isDraft)

	return rss({
		title: "Lazaro Osee's Blog",
		description:
			'From exploring modern web frameworks like Astro and Markdoc, read insights on software development, architecture, and creative coding.',
		site: site?.href ?? 'https://lazaroosee.xyz/',
		stylesheet: '/rss-styles.xsl',
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.excerpt,
			link: `/posts/${post.slug}/`,
			author: 'Lazaro Osee',
		})),
	})
}
