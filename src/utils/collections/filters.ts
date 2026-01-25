import type { CollectionEntry } from 'astro:content'
import { config } from 'dotenv'

config()

export const postsFilter = {
	'filter-published-on-production': ({ data }: CollectionEntry<'posts'>) =>
		(process.env.NODE_ENV || import.meta.env.NODE_ENV) === 'production' ? data.isDraft : true,
}
