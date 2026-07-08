import { writable } from "svelte/store";
import {
	getStoredTheme,
	setStoredTheme,
	type Theme,
} from "$lib/services/storage/theme.service";

interface ThemeState {
	current: Theme;
	isInitialized: boolean;
}

function createThemeStore() {
	const { subscribe, set, update } = writable<ThemeState>({
		current: "light",
		isInitialized: false,
	});

	return {
		subscribe,

		/**
		 * Initialize theme from localStorage or system preference
		 */
		initializeTheme: () => {
			if (typeof window === "undefined") {
				return;
			}

			// Try to get stored theme first
			let theme = getStoredTheme();

			// If no stored theme, use system preference
			if (!theme) {
				const prefersDark = window.matchMedia(
					"(prefers-color-scheme: dark)",
				).matches;
				theme = prefersDark ? "dark" : "light";
				setStoredTheme(theme);
			}

			// Apply theme to document
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}

			// Update store
			set({ current: theme, isInitialized: true });
		},

		/**
		 * Set theme explicitly
		 */
		setTheme: (theme: Theme) => {
			if (typeof window === "undefined") {
				return;
			}

			// Apply theme to document
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}

			// Save to localStorage
			setStoredTheme(theme);

			// Update store
			update((state) => ({ ...state, current: theme }));
		},

		/**
		 * Toggle between light and dark theme
		 */
		toggleTheme: () => {
			update((state) => {
				const newTheme: Theme = state.current === "light" ? "dark" : "light";

				if (typeof window !== "undefined") {
					// Apply theme to document
					if (newTheme === "dark") {
						document.documentElement.classList.add("dark");
					} else {
						document.documentElement.classList.remove("dark");
					}

					// Save to localStorage
					setStoredTheme(newTheme);
				}

				return { ...state, current: newTheme };
			});
		},
	};
}

export const themeStore = createThemeStore();
