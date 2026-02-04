// Favorites store with localStorage sync
import { writable } from 'svelte/store';
import { getFavorites, saveFavorites } from '$lib/services/storage/favorites.service';

function createFavoritesStore() {
	// Initialize from localStorage
	const initialFavorites = getFavorites();
	const { subscribe, set, update } = writable<Set<number>>(initialFavorites);

	return {
		subscribe,

		/**
		 * Add Pokemon to favorites
		 */
		add: (id: number) => {
			update((favorites) => {
				const newFavorites = new Set(favorites);
				newFavorites.add(id);
				saveFavorites(newFavorites);
				return newFavorites;
			});
		},

		/**
		 * Remove Pokemon from favorites
		 */
		remove: (id: number) => {
			update((favorites) => {
				const newFavorites = new Set(favorites);
				newFavorites.delete(id);
				saveFavorites(newFavorites);
				return newFavorites;
			});
		},

		/**
		 * Toggle Pokemon favorite status
		 */
		toggle: (id: number) => {
			update((favorites) => {
				const newFavorites = new Set(favorites);
				if (newFavorites.has(id)) {
					newFavorites.delete(id);
				} else {
					newFavorites.add(id);
				}
				saveFavorites(newFavorites);
				return newFavorites;
			});
		},

		/**
		 * Check if Pokemon is favorited
		 */
		has: (id: number, favorites: Set<number>): boolean => {
			return favorites.has(id);
		},

		/**
		 * Clear all favorites
		 */
		clear: () => {
			const newFavorites = new Set<number>();
			saveFavorites(newFavorites);
			set(newFavorites);
		},

		/**
		 * Load favorites from localStorage (useful after page refresh)
		 */
		load: () => {
			const favorites = getFavorites();
			set(favorites);
		}
	};
}

export const favoritesStore = createFavoritesStore();
