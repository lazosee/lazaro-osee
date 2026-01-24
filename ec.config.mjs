import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { defineEcConfig } from 'astro-expressive-code'

export default defineEcConfig({
	textMarkers: true,
	frames: true,
	themes: ['github-light-default', 'github-dark-default'],
	shiki: {
		engine: 'oniguruma',
		transformers: [],
	},
	useDarkModeMediaQuery: true,
	themeCssSelector: (theme, _) => `[data-code-theme='${theme.name}']`,
	plugins: [pluginLineNumbers()],
})
