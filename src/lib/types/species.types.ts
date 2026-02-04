// Pokemon Species and Evolution types from PokeAPI
import type { NamedAPIResource } from './common.types';

export interface FlavorTextEntry {
	flavor_text: string;
	language: NamedAPIResource;
	version: NamedAPIResource;
}

export interface Genus {
	genus: string;
	language: NamedAPIResource;
}

export interface PokemonSpecies {
	id: number;
	name: string;
	order: number;
	gender_rate: number;
	capture_rate: number;
	base_happiness: number;
	is_baby: boolean;
	is_legendary: boolean;
	is_mythical: boolean;
	hatch_counter: number;
	has_gender_differences: boolean;
	forms_switchable: boolean;
	growth_rate: NamedAPIResource;
	pokedex_numbers: Array<{
		entry_number: number;
		pokedex: NamedAPIResource;
	}>;
	egg_groups: NamedAPIResource[];
	color: NamedAPIResource;
	shape: NamedAPIResource;
	evolves_from_species: NamedAPIResource | null;
	evolution_chain: {
		url: string;
	};
	habitat: NamedAPIResource | null;
	generation: NamedAPIResource;
	names: Array<{
		name: string;
		language: NamedAPIResource;
	}>;
	flavor_text_entries: FlavorTextEntry[];
	genera: Genus[];
}

export interface EvolutionDetail {
	item: NamedAPIResource | null;
	trigger: NamedAPIResource;
	gender: number | null;
	held_item: NamedAPIResource | null;
	known_move: NamedAPIResource | null;
	known_move_type: NamedAPIResource | null;
	location: NamedAPIResource | null;
	min_level: number | null;
	min_happiness: number | null;
	min_beauty: number | null;
	min_affection: number | null;
	needs_overworld_rain: boolean;
	party_species: NamedAPIResource | null;
	party_type: NamedAPIResource | null;
	relative_physical_stats: number | null;
	time_of_day: string;
	trade_species: NamedAPIResource | null;
	turn_upside_down: boolean;
}

export interface ChainLink {
	is_baby: boolean;
	species: NamedAPIResource;
	evolution_details: EvolutionDetail[];
	evolves_to: ChainLink[];
}

export interface EvolutionChain {
	id: number;
	baby_trigger_item: NamedAPIResource | null;
	chain: ChainLink;
}
