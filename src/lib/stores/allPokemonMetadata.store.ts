// Store for all Pokemon metadata (for client-side filtering)
import { writable, derived } from 'svelte/store';
import type { PokemonMetadata } from '$lib/types/pokemon.types';
import type { PokemonTypeString } from '$lib/types/common.types';
import { getPokemonList, getPokemonById } from '$lib/services/api/pokemon.service';
import { getSpeciesById } from '$lib/services/api/species.service';
import {
	getMetadataFromCache,
	setMetadataInCache,
	clearMetadataCache as clearCache
} from '$lib/services/storage/metadataCache';
import { getGenerationNumber } from '$lib/utils/filterUtils';

interface MetadataState {
	allPokemon: PokemonMetadata[];
	isLoading: boolean;
	isLoaded: boolean;
	error: string | null;
	lastFetched: number;
}

const initialState: MetadataState = {
	allPokemon: [],
	isLoading: false,
	isLoaded: false,
	error: null,
	lastFetched: 0
};

function createAllPokemonMetadataStore() {
	const { subscribe, set, update } = writable<MetadataState>(initialState);

	return {
		subscribe,

		/**
		 * Load all Pokemon metadata
		 * First checks localStorage cache, then fetches from API if needed
		 */
		loadAllMetadata: async () => {
			// Check if already loaded
			let currentState: MetadataState | undefined;
			const unsubscribe = subscribe((state) => {
				currentState = state;
			});
			unsubscribe();

			if (currentState?.isLoading || currentState?.isLoaded) {
				return;
			}

			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				// Try to load from cache first
				const cached = getMetadataFromCache();
				if (cached && cached.length > 0) {
					update((state) => ({
						...state,
						allPokemon: cached,
						isLoading: false,
						isLoaded: true,
						lastFetched: Date.now()
					}));
					return;
				}

				// Fetch all Pokemon list (1025 items)
				const response = await getPokemonList(1025, 0);

				// Enrich with species data in batches to avoid overwhelming the API
				const batchSize = 50;
				const allMetadata: PokemonMetadata[] = [];

				for (let i = 0; i < response.results.length; i += batchSize) {
					const batch = response.results.slice(i, i + batchSize);

					const batchMetadata = await Promise.all(
						batch.map(async (item) => {
							try {
								// Fetch Pokemon and Species data in parallel
								const [pokemon, species] = await Promise.all([
									getPokemonById(item.id),
									getSpeciesById(item.id)
								]);

								// Extract types
								const types = pokemon.types.map((t) => t.type.name as PokemonTypeString);

								// Get French name
								const frenchName =
									species.names.find((n) => n.language.name === 'fr')?.name ||
									pokemon.name;

								// Calculate generation
								const generation = getGenerationNumber(item.id);

								const metadata: PokemonMetadata = {
									id: item.id,
									name: pokemon.name,
									frenchName,
									isLegendary: species.is_legendary,
									isMythical: species.is_mythical,
									types,
									generation
								};

								return metadata;
							} catch (error) {
								console.error(`Failed to enrich Pokemon ${item.id}:`, error);
								// Return minimal metadata on error
								return {
									id: item.id,
									name: item.name,
									types: [],
									generation: getGenerationNumber(item.id)
								} as PokemonMetadata;
							}
						})
					);

					allMetadata.push(...batchMetadata);

					// Update progress
					update((state) => ({
						...state,
						allPokemon: allMetadata
					}));
				}

				// Save to cache
				setMetadataInCache(allMetadata);

				update((state) => ({
					...state,
					isLoading: false,
					isLoaded: true,
					lastFetched: Date.now()
				}));
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Failed to load Pokemon metadata';
				update((state) => ({
					...state,
					isLoading: false,
					error: errorMessage
				}));
			}
		},

		/**
		 * Clear metadata cache and reset store
		 */
		clearCache: () => {
			clearCache();
			set(initialState);
		},

		/**
		 * Reset store to initial state
		 */
		reset: () => set(initialState)
	};
}

export const allPokemonMetadata = createAllPokemonMetadataStore();

/**
 * Derived store: Get metadata by ID
 */
export const getMetadataById = derived(
	allPokemonMetadata,
	($store) => (id: number) => {
		return $store.allPokemon.find((p) => p.id === id);
	}
);
