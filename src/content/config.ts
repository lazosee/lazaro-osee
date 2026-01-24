// @ts-ignore
import { iconNames } from '@/assets/icons'
import { defineCollection, reference, z } from 'astro:content'

const posts = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			excerpt: z.string(),
			cover: image(),
			isDraft: z.boolean(),
			pubDate: z.date(),
			authors: z.array(reference('authors')),
		}),
})

const authors = defineCollection({
	type: 'data',
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			image: image(),
			posts: z.array(reference('posts')),
			socials: z.array(
				z.object({
					label: z.string(),
					href: z.string({}).url(),
					icon: z.enum(iconNames),
				})
			),
		}),
})

export const collections = { posts, authors }
