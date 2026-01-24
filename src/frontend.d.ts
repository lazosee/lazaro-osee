import type { ThemeManager } from './utils/frontend/theme'

declare global {
	interface Window {
		/** * Your custom app object
		 */
		__app__: {
			version: string
			init: () => void
			themeManager: ThemeManager
		}
	}
}
