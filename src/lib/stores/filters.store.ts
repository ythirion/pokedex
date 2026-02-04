// Filters store for type and generation filtering
import { writable } from 'svelte/store';
import type { PokemonTypeString } from '$lib/types/common.types';

interface FiltersState {
	types: PokemonTypeString[];
	generation: number | null;
	legendaryOnly: boolean;
}

const initialState: FiltersState = {
	types: [],
	generation: null,
	legendaryOnly: false
};

function createFiltersStore() {
	const { subscribe, set, update } = writable<FiltersState>(initialState);

	return {
		subscribe,

		/**
		 * Set selected types
		 */
		setTypes: (types: PokemonTypeString[]) => {
			update((state) => ({ ...state, types }));
		},

		/**
		 * Toggle a type filter
		 */
		toggleType: (type: PokemonTypeString) => {
			update((state) => {
				const types = state.types.includes(type)
					? state.types.filter((t) => t !== type)
					: [...state.types, type];
				return { ...state, types };
			});
		},

		/**
		 * Set generation filter
		 */
		setGeneration: (generation: number | null) => {
			update((state) => ({ ...state, generation }));
		},

		/**
		 * Toggle legendary only filter
		 */
		toggleLegendary: () => {
			update((state) => ({ ...state, legendaryOnly: !state.legendaryOnly }));
		},

		/**
		 * Clear all filters
		 */
		clear: () => {
			set(initialState);
		}
	};
}

export const filtersStore = createFiltersStore();
