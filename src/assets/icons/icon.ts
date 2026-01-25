import type { SvgComponent } from 'astro/types'

export type IconName = 'github' | 'bluesky' | 'twitter' | 'move-right' | 'sun' | 'moon' | 'book'

export { default as Icon } from './Icon.astro'

export const getIcon = async (icon_name: IconName) =>
	(await import(`./${icon_name}/index.svg`)).default as SvgComponent & ImageMetadata
