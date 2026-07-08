// Common API types from PokeAPI

export interface NamedAPIResource {
	name: string;
	url: string;
}

export type PokemonTypeString =
	| "normal"
	| "fire"
	| "water"
	| "electric"
	| "grass"
	| "ice"
	| "fighting"
	| "poison"
	| "ground"
	| "flying"
	| "psychic"
	| "bug"
	| "rock"
	| "ghost"
	| "dragon"
	| "dark"
	| "steel"
	| "fairy";

export interface Generation {
	id: number;
	name: string;
	range: [number, number]; // [start, end] Pokemon IDs
}
