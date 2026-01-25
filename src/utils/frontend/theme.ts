type Theme = 'light' | 'dark' | 'system'

export class ThemeManager {
	private readonly storageKey = 'user-theme-preference'
	private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

	constructor() {
		this.init()
	}

	/**
	 * Initializes the theme based on stored preference or system default.
	 */
	private init(): void {
		const savedTheme = localStorage.getItem(this.storageKey) as Theme | null
		this.applyTheme(savedTheme || 'system')
		this.listenToSystemChanges()
	}

	/**
	 * Applies the theme to the HTML document.
	 */
	public applyTheme(theme: Theme): void {
		const root = document.documentElement
		let effectiveTheme: 'light' | 'dark'

		if (theme === 'system') {
			effectiveTheme = this.mediaQuery.matches ? 'dark' : 'light'
			localStorage.removeItem(this.storageKey)
		} else {
			effectiveTheme = theme
			localStorage.setItem(this.storageKey, theme)
		}

		root.setAttribute('data-theme', effectiveTheme)
		// Optional: Sync with CSS color-scheme property
		root.style.setProperty('color-scheme', effectiveTheme)

		// Update code blocks after theme is changed
		if (this.getResolvedTheme() === 'dark') {
			root.setAttribute('data-code-theme', 'github-dark-default')
		} else {
			root.setAttribute('data-code-theme', 'github-light-default')
		}
	}

	/**
	 * Listens for changes in the OS-level dark mode setting.
	 */
	private listenToSystemChanges(): void {
		this.mediaQuery.addEventListener('change', (e) => {
			const savedTheme = localStorage.getItem(this.storageKey)
			// Only auto-update if the user hasn't set a manual override
			if (!savedTheme) {
				this.applyTheme('system')
			}
		})
	}

	/**
	 * Returns the currently active theme.
	 */
	public getTheme(): Theme {
		return (localStorage.getItem(this.storageKey) as Theme) || 'system'
	}

	/**
	 * Resolves the actual theme currently being rendered.
	 * If the preference is 'system', it returns 'light' or 'dark' based on the OS.
	 */
	public getResolvedTheme(): 'light' | 'dark' {
		const stored = localStorage.getItem(this.storageKey) as Theme | null

		// If a manual override exists, return it
		if (stored && stored !== 'system') {
			return stored
		}

		// Otherwise, resolve the system preference
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
}

export const themeManager = new ThemeManager()
