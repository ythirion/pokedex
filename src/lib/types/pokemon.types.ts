// Pokemon types from PokeAPI
import type { NamedAPIResource, PokemonTypeString } from './common.types';

export interface PokemonListItem {
	name: string;
	url: string;
	id: number;
}

export interface PokemonListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: PokemonListItem[];
}

export interface PokemonSprites {
	front_default: string | null;
	front_shiny: string | null;
	front_female: string | null;
	front_shiny_female: string | null;
	back_default: string | null;
	back_shiny: string | null;
	back_female: string | null;
	back_shiny_female: string | null;
	other?: {
		'official-artwork'?: {
			front_default: string | null;
			front_shiny: string | null;
		};
		dream_world?: {
			front_default: string | null;
			front_female: string | null;
		};
		home?: {
			front_default: string | null;
			front_female: string | null;
			front_shiny: string | null;
			front_shiny_female: string | null;
		};
	};
}

export interface PokemonType {
	slot: number;
	type: NamedAPIResource;
}

export interface PokemonStat {
	base_stat: number;
	effort: number;
	stat: NamedAPIResource;
}

export interface PokemonAbility {
	ability: NamedAPIResource;
	is_hidden: boolean;
	slot: number;
}

export interface Pokemon {
	id: number;
	name: string;
	height: number; // in decimeters
	weight: number; // in hectograms
	base_experience: number;
	sprites: PokemonSprites;
	types: PokemonType[];
	stats: PokemonStat[];
	abilities: PokemonAbility[];
	species: NamedAPIResource;
	order: number;
}

// Enriched Pokemon for UI display
export interface EnrichedPokemon extends PokemonListItem {
	pokemon?: Pokemon;
	isLoading?: boolean;
	error?: string;
	isLegendary?: boolean;
	isMythical?: boolean;
	frenchName?: string;
}
