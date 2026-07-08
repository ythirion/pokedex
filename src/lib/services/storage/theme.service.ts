// Theme localStorage service
const THEME_STORAGE_KEY = "pokedex_theme";

export type Theme = "light" | "dark";

/**
 * Get theme from localStorage
 */
export function getStoredTheme(): Theme | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (!stored) {
			return null;
		}

		return stored as Theme;
	} catch (error) {
		console.error("Failed to load theme:", error);
		return null;
	}
}

/**
 * Save theme to localStorage
 */
export function setStoredTheme(theme: Theme): void {
	if (typeof window === "undefined") {
		return;
	}

	try {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch (error) {
		console.error("Failed to save theme:", error);
	}
}

/**
 * Clear theme from localStorage
 */
export function clearStoredTheme(): void {
	if (typeof window === "undefined") {
		return;
	}

	try {
		localStorage.removeItem(THEME_STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear theme:", error);
	}
}
