// Favorites localStorage service
const STORAGE_KEY = 'pokedex-favorites';

/**
 * Get favorites from localStorage
 */
export function getFavorites(): Set<number> {
	if (typeof window === 'undefined') {
		return new Set();
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return new Set();
		}

		const parsed = JSON.parse(stored);
		return new Set<number>(parsed);
	} catch (error) {
		console.error('Failed to load favorites:', error);
		return new Set();
	}
}

/**
 * Save favorites to localStorage
 */
export function saveFavorites(favorites: Set<number>): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		const array = Array.from(favorites);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
	} catch (error) {
		console.error('Failed to save favorites:', error);
	}
}

/**
 * Add a Pokemon to favorites
 */
export function addFavorite(id: number): Set<number> {
	const favorites = getFavorites();
	favorites.add(id);
	saveFavorites(favorites);
	return favorites;
}

/**
 * Remove a Pokemon from favorites
 */
export function removeFavorite(id: number): Set<number> {
	const favorites = getFavorites();
	favorites.delete(id);
	saveFavorites(favorites);
	return favorites;
}

/**
 * Toggle a Pokemon favorite status
 */
export function toggleFavorite(id: number): Set<number> {
	const favorites = getFavorites();
	if (favorites.has(id)) {
		favorites.delete(id);
	} else {
		favorites.add(id);
	}
	saveFavorites(favorites);
	return favorites;
}

/**
 * Check if a Pokemon is favorited
 */
export function isFavorite(id: number): boolean {
	const favorites = getFavorites();
	return favorites.has(id);
}

/**
 * Clear all favorites
 */
export function clearFavorites(): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear favorites:', error);
	}
}
