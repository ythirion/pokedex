// Pokemon store for list and pagination state
import { derived, writable } from "svelte/store";
import { DEFAULT_PAGE_SIZE } from "$lib/constants/api-config";
import {
	getPokemonById,
	getPokemonList,
} from "$lib/services/api/pokemon.service";
import { getSpeciesById } from "$lib/services/api/species.service";
import type {
	EnrichedPokemon,
	Pokemon,
	PokemonListItem,
} from "$lib/types/pokemon.types";

interface PokemonState {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	pokemonList: PokemonListItem[];
	enrichedCache: Map<number, Pokemon>;
	isLoading: boolean;
	error: string | null;
}

const initialState: PokemonState = {
	currentPage: 1,
	pageSize: DEFAULT_PAGE_SIZE,
	totalCount: 0,
	pokemonList: [],
	enrichedCache: new Map(),
	isLoading: false,
	error: null,
};

function createPokemonStore() {
	const { subscribe, set, update } = writable<PokemonState>(initialState);

	return {
		subscribe,
		/**
		 * Load a page of Pokemon
		 */
		loadPage: async (
			page: number = 1,
			limit?: number,
			customOffset?: number,
		) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const pageSize = limit || DEFAULT_PAGE_SIZE;
				const offset =
					customOffset !== undefined
						? customOffset
						: (page - 1) * DEFAULT_PAGE_SIZE;
				const response = await getPokemonList(pageSize, offset);

				update((state) => ({
					...state,
					currentPage: page,
					pageSize,
					totalCount: response.count,
					pokemonList: response.results,
					isLoading: false,
				}));
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Failed to load Pokemon";
				update((state) => ({
					...state,
					isLoading: false,
					error: errorMessage,
				}));
			}
		},

		/**
		 * Enrich Pokemon with full details including legendary status
		 */
		enrichPokemon: async (ids: number[]) => {
			try {
				const promises = ids.map(async (id) => {
					try {
						const [pokemon, species] = await Promise.all([
							getPokemonById(id),
							getSpeciesById(id),
						]);

						// Get French name
						const frenchName =
							species.names.find((n) => n.language.name === "fr")?.name ||
							pokemon.name;

						return {
							id,
							pokemon,
							isLegendary: species.is_legendary,
							isMythical: species.is_mythical,
							frenchName,
						};
					} catch (error) {
						console.error(`Failed to enrich Pokemon ${id}:`, error);
						return null;
					}
				});

				const results = await Promise.all(promises);

				update((state) => {
					const newCache = new Map(state.enrichedCache);
					const dataMap = new Map<
						number,
						{ isLegendary: boolean; isMythical: boolean; frenchName: string }
					>();

					results.forEach((result) => {
						if (result) {
							newCache.set(result.id, result.pokemon);
							dataMap.set(result.id, {
								isLegendary: result.isLegendary,
								isMythical: result.isMythical,
								frenchName: result.frenchName,
							});
						}
					});

					// Update pokemonList with legendary info and french names
					const updatedList = state.pokemonList.map((p) => ({
						...p,
						isLegendary: dataMap.get(p.id)?.isLegendary,
						isMythical: dataMap.get(p.id)?.isMythical,
						frenchName: dataMap.get(p.id)?.frenchName,
					}));

					return {
						...state,
						enrichedCache: newCache,
						pokemonList: updatedList,
					};
				});
			} catch (error) {
				console.error("Failed to enrich Pokemon:", error);
			}
		},

		/**
		 * Enrich a specific list of Pokemon IDs (for filtered metadata)
		 */
		enrichMetadataPage: async (ids: number[]) => {
			try {
				const promises = ids.map(async (id) => {
					try {
						const [pokemon, species] = await Promise.all([
							getPokemonById(id),
							getSpeciesById(id),
						]);

						// Get French name
						const frenchName =
							species.names.find((n) => n.language.name === "fr")?.name ||
							pokemon.name;

						return {
							id,
							pokemon,
							isLegendary: species.is_legendary,
							isMythical: species.is_mythical,
							frenchName,
						};
					} catch (error) {
						console.error(`Failed to enrich Pokemon ${id}:`, error);
						return null;
					}
				});

				const results = await Promise.all(promises);

				update((state) => {
					const newCache = new Map(state.enrichedCache);

					results.forEach((result) => {
						if (result) {
							newCache.set(result.id, result.pokemon);
						}
					});

					return {
						...state,
						enrichedCache: newCache,
					};
				});
			} catch (error) {
				console.error("Failed to enrich Pokemon page:", error);
			}
		},

		/**
		 * Reset store to initial state
		 */
		reset: () => set(initialState),
	};
}

export const pokemonStore = createPokemonStore();

/**
 * Derived store for current page Pokemon with enriched data
 */
export const currentPagePokemon = derived(
	pokemonStore,
	($store): EnrichedPokemon[] => {
		return $store.pokemonList.map((item) => ({
			...item,
			pokemon: $store.enrichedCache.get(item.id),
		}));
	},
);

/**
 * Derived store for total pages
 */
export const totalPages = derived(pokemonStore, ($store) =>
	Math.ceil($store.totalCount / $store.pageSize),
);
