// Pokemon Species and Evolution API service

import type { EvolutionChain, PokemonSpecies } from "$lib/types/species.types";
import { pokeAPIClient } from "./pokeapi";

/**
 * Get Pokemon species by ID
 */
export async function getSpeciesById(id: number): Promise<PokemonSpecies> {
	const endpoint = `/pokemon-species/${id}`;
	return pokeAPIClient.get<PokemonSpecies>(endpoint);
}

/**
 * Get Pokemon species by name
 */
export async function getSpeciesByName(name: string): Promise<PokemonSpecies> {
	const endpoint = `/pokemon-species/${name.toLowerCase()}`;
	return pokeAPIClient.get<PokemonSpecies>(endpoint);
}

/**
 * Get evolution chain from URL
 */
export async function getEvolutionChain(url: string): Promise<EvolutionChain> {
	return pokeAPIClient.getAbsolute<EvolutionChain>(url);
}

/**
 * Get full evolution data for a Pokemon ID
 * This combines species fetch + evolution chain fetch
 */
export async function getFullEvolutionData(
	id: number,
): Promise<{ species: PokemonSpecies; evolutionChain: EvolutionChain }> {
	try {
		// First get species to get evolution chain URL
		const species = await getSpeciesById(id);

		// Then fetch evolution chain
		const evolutionChain = await getEvolutionChain(species.evolution_chain.url);

		return { species, evolutionChain };
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(
				`Failed to get evolution data for Pokemon ${id}: ${error.message}`,
			);
		}
		throw new Error(
			`Failed to get evolution data for Pokemon ${id}: Unknown error`,
		);
	}
}

/**
 * Extract Pokemon IDs from evolution chain
 */
export function extractEvolutionIds(chain: EvolutionChain): number[] {
	const ids: number[] = [];

	function traverse(link: EvolutionChain["chain"]) {
		// Extract ID from species URL
		const matches = link.species.url.match(/\/pokemon-species\/(\d+)\//);
		if (matches?.[1]) {
			ids.push(parseInt(matches[1], 10));
		}

		// Recursively traverse evolves_to
		link.evolves_to.forEach((evolution) => {
			traverse(evolution);
		});
	}

	traverse(chain.chain);

	return ids;
}
