// Search store with debouncing
import { writable } from "svelte/store";
import { DEBOUNCE_DELAY } from "$lib/constants/api-config";
import { debounce } from "$lib/utils/debounce";

interface SearchState {
	query: string;
	debouncedQuery: string;
}

const initialState: SearchState = {
	query: "",
	debouncedQuery: "",
};

function createSearchStore() {
	const { subscribe, set, update } = writable<SearchState>(initialState);

	// Debounced function to update debouncedQuery
	const updateDebouncedQuery = debounce((query: string) => {
		update((state) => ({ ...state, debouncedQuery: query }));
	}, DEBOUNCE_DELAY);

	return {
		subscribe,

		/**
		 * Set search query (with debouncing)
		 */
		setQuery: (query: string) => {
			update((state) => ({ ...state, query }));
			updateDebouncedQuery(query);
		},

		/**
		 * Clear search
		 */
		clear: () => {
			set(initialState);
		},
	};
}

export const searchStore = createSearchStore();
