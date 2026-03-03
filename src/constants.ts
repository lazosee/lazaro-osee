import bluesky from '@/assets/icons/bluesky/index.svg'
import github from '@/assets/icons/github/index.svg'
import x from '@/assets/icons/twitter/index.svg'
import type { SvgComponent } from 'astro/types'

export const isProduction = import.meta.env.VERCEL_ENV === 'production'

export const devDbUrl = 'https://5wbm4vgs-3000.uks1.devtunnels.ms'
export const devWebUrl = 'fkc5gltd-4321.uks1.devtunnels.ms'

export const productionWebUrl =
	import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL ?? 'www.lazaroosee.xyz'

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
	{ href: '/work', label: 'Work' },
	{ href: '/uses', label: 'Uses' },
] as Link[]

export const socials = [
	{ label: 'github', icon: github },
	{ label: 'bluesky', icon: bluesky },
	{ label: 'X', icon: x },
] as Social[]
