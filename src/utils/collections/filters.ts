import type { CollectionEntry } from 'astro:content'

export const postsFilter = {
	'filter-published-on-production': ({ data }: CollectionEntry<'posts'>) =>
		import.meta.env.NODE_ENV === 'production' ? data.isDraft : true,
}
