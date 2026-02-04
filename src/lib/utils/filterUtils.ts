// Utility functions for client-side filtering of Pokemon
import type { PokemonMetadata } from '$lib/types/pokemon.types';
import type { PokemonTypeString } from '$lib/types/common.types';
import { getGenerationById } from '$lib/constants/generations';

export interface FilterCriteria {
	types: PokemonTypeString[];
	generation: number | null;
	legendaryOnly: boolean;
	searchQuery: string;
}

/**
 * Apply client-side filters to Pokemon metadata
 */
export function applyClientSideFilters(
	metadata: PokemonMetadata[],
	criteria: FilterCriteria
): PokemonMetadata[] {
	let result = metadata;

	// Filter by search query (name or french name, case-insensitive)
	if (criteria.searchQuery) {
		const query = criteria.searchQuery.toLowerCase();
		result = result.filter(
			(p) =>
				p.name.toLowerCase().includes(query) ||
				p.frenchName?.toLowerCase().includes(query)
		);
	}

	// Filter by types (Pokemon must have ALL selected types)
	if (criteria.types.length > 0) {
		result = result.filter((p) =>
			criteria.types.every((type) => p.types.includes(type))
		);
	}

	// Filter by legendary/mythical status
	if (criteria.legendaryOnly) {
		result = result.filter((p) => p.isLegendary || p.isMythical);
	}

	// Filter by generation
	if (criteria.generation !== null) {
		result = result.filter((p) => p.generation === criteria.generation);
	}

	return result;
}

/**
 * Paginate filtered results
 */
export function paginateResults<T>(
	results: T[],
	page: number,
	pageSize: number
): T[] {
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	return results.slice(startIndex, endIndex);
}

/**
 * Calculate total pages for pagination
 */
export function calculateTotalPages(totalItems: number, pageSize: number): number {
	return Math.ceil(totalItems / pageSize);
}

/**
 * Get generation number from Pokemon ID
 */
export function getGenerationNumber(pokemonId: number): number {
	const generation = getGenerationById(pokemonId);
	return generation ? generation.id : 1; // Default to Gen 1 if not found
}
