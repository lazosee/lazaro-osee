import type { CollectionEntry } from 'astro:content'

export type PostData = CollectionEntry<'posts'>['data']
export type WorkData = CollectionEntry<'work-category'>['data']
export type AuthorData = CollectionEntry<'authors'>['data']

export interface AuthorMetadata extends AuthorData {
	id: string
}

export interface WorkMetadata extends WorkData {
	id: string
}

export interface PostMetadata extends PostData {
	slug: string
	id: string
}
