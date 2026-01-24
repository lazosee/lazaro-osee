import bluesky from './bluesky/index.svg'
import github from './github/index.svg'
import twitter from './twitter/index.svg'

export const iconsRecord = {
	github: github,
	bluesky: bluesky,
	twitter: twitter,
} as const

export const iconNames = ['github', 'bluesky', 'twitter'] as const

export const icons = {
	record: iconsRecord,
	names: iconNames,
}
