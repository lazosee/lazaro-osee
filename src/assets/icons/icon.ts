import type { SvgComponent } from 'astro/types'
import { z } from 'astro/zod'

export const IconNameSchema = z.enum([
	'github',
	'bluesky',
	'twitter',
	'move-right',
	'sun',
	'moon',
	'book',
	'quote',
	'bell',
	'auto-awesome-mosaic',
	'code',
])

export type IconName = z.infer<typeof IconNameSchema>

export { default as Icon } from './Icon.astro'

export const getIcon = async (icon_name: IconName) =>
	(await import(`./${icon_name}/index.svg`)).default as SvgComponent & ImageMetadata
