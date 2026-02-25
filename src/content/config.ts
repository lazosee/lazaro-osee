// @ts-ignore
import { iconNames } from '@/assets/icons'
import { IconNameSchema } from '@/assets/icons/icon'
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

export const workCategory = defineCollection({
	type: 'data',
	schema: z.object({
		icon: IconNameSchema,
		title: z.string(),
		subtitle: z.string(),
		featured: z.boolean().default(false),
	}),
})

export const collections = { posts, authors, 'work-category': workCategory }
