// Pokemon API service
import { pokeAPIClient } from './pokeapi';
import type { Pokemon, PokemonListResponse, PokemonListItem } from '$lib/types/pokemon.types';

/**
 * Extract Pokemon ID from PokeAPI URL
 * Example: https://pokeapi.co/api/v2/pokemon/25/ -> 25
 */
export function extractIdFromUrl(url: string): number {
	const matches = url.match(/\/pokemon\/(\d+)\//);
	if (!matches || !matches[1]) {
		throw new Error(`Could not extract ID from URL: ${url}`);
	}
	return parseInt(matches[1], 10);
}

/**
 * Get paginated list of Pokemon
 */
export async function getPokemonList(
	limit: number = 20,
	offset: number = 0
): Promise<PokemonListResponse> {
	const endpoint = `/pokemon?limit=${limit}&offset=${offset}`;
	const response = await pokeAPIClient.get<{
		count: number;
		next: string | null;
		previous: string | null;
		results: Array<{ name: string; url: string }>;
	}>(endpoint);

	// Enrich results with IDs
	const results: PokemonListItem[] = response.results.map((item) => ({
		...item,
		id: extractIdFromUrl(item.url)
	}));

	return {
		...response,
		results
	};
}

/**
 * Get Pokemon details by ID
 */
export async function getPokemonById(id: number): Promise<Pokemon> {
	const endpoint = `/pokemon/${id}`;
	return pokeAPIClient.get<Pokemon>(endpoint);
}

/**
 * Get Pokemon details by name
 */
export async function getPokemonByName(name: string): Promise<Pokemon> {
	const endpoint = `/pokemon/${name.toLowerCase()}`;
	return pokeAPIClient.get<Pokemon>(endpoint);
}

/**
 * Batch fetch Pokemon by IDs
 * Returns a Map of id -> Pokemon
 */
export async function getPokemonBatch(ids: number[]): Promise<Map<number, Pokemon>> {
	const results = new Map<number, Pokemon>();

	// Fetch all in parallel
	const promises = ids.map(async (id) => {
		try {
			const pokemon = await getPokemonById(id);
			results.set(id, pokemon);
		} catch (error) {
			console.error(`Failed to fetch Pokemon ${id}:`, error);
		}
	});

	await Promise.all(promises);

	return results;
}

/**
 * Search Pokemon by name (partial match)
 * Note: PokeAPI doesn't support search, so we need to fetch the list first
 */
export async function searchPokemonByName(query: string, limit: number = 10): Promise<PokemonListItem[]> {
	// For a full implementation, you'd need to fetch all Pokemon names first
	// For now, we'll fetch a large list and filter client-side
	const response = await getPokemonList(1000, 0);
	const lowerQuery = query.toLowerCase();

	return response.results
		.filter((pokemon) => pokemon.name.includes(lowerQuery))
		.slice(0, limit);
}
