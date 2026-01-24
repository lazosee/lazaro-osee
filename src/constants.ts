import bluesky from '@/assets/icons/bluesky/index.svg'
import github from '@/assets/icons/github/index.svg'
import x from '@/assets/icons/twitter/index.svg'
import type { SvgComponent } from 'astro/types'

export interface Link {
	href: string
	label: string
}

export interface Social {
	label: string
	icon: SvgComponent & ImageMetadata
}

export const links = [
	{ href: '/', label: 'Home' },
	{ href: '/posts', label: 'Posts' },
	{ href: '/uses', label: 'Uses' },
] as Link[]

export const socials = [
	{ label: 'github', icon: github },
	{ label: 'bluesky', icon: bluesky },
	{ label: 'X', icon: x },
] as Social[]
