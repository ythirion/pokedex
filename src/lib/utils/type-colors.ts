// Pokemon type color mappings for Tailwind
import type { PokemonTypeString } from "$lib/types/common.types";

interface TypeColors {
	bg: string;
	text: string;
	border: string;
}

export const TYPE_COLORS: Record<PokemonTypeString, TypeColors> = {
	normal: {
		bg: "bg-gray-400",
		text: "text-gray-800",
		border: "border-gray-500",
	},
	fire: {
		bg: "bg-red-500",
		text: "text-white",
		border: "border-red-600",
	},
	water: {
		bg: "bg-blue-500",
		text: "text-white",
		border: "border-blue-600",
	},
	electric: {
		bg: "bg-yellow-400",
		text: "text-gray-900",
		border: "border-yellow-500",
	},
	grass: {
		bg: "bg-green-500",
		text: "text-white",
		border: "border-green-600",
	},
	ice: {
		bg: "bg-cyan-400",
		text: "text-gray-900",
		border: "border-cyan-500",
	},
	fighting: {
		bg: "bg-orange-600",
		text: "text-white",
		border: "border-orange-700",
	},
	poison: {
		bg: "bg-purple-500",
		text: "text-white",
		border: "border-purple-600",
	},
	ground: {
		bg: "bg-yellow-600",
		text: "text-white",
		border: "border-yellow-700",
	},
	flying: {
		bg: "bg-indigo-400",
		text: "text-white",
		border: "border-indigo-500",
	},
	psychic: {
		bg: "bg-pink-500",
		text: "text-white",
		border: "border-pink-600",
	},
	bug: {
		bg: "bg-green-600",
		text: "text-white",
		border: "border-green-700",
	},
	rock: {
		bg: "bg-yellow-700",
		text: "text-white",
		border: "border-yellow-800",
	},
	ghost: {
		bg: "bg-purple-700",
		text: "text-white",
		border: "border-purple-800",
	},
	dragon: {
		bg: "bg-indigo-600",
		text: "text-white",
		border: "border-indigo-700",
	},
	dark: {
		bg: "bg-gray-800",
		text: "text-white",
		border: "border-gray-900",
	},
	steel: {
		bg: "bg-gray-500",
		text: "text-white",
		border: "border-gray-600",
	},
	fairy: {
		bg: "bg-pink-400",
		text: "text-gray-900",
		border: "border-pink-500",
	},
};

export function getTypeColors(type: string): TypeColors {
	const normalized = type.toLowerCase() as PokemonTypeString;
	return (
		TYPE_COLORS[normalized] || {
			bg: "bg-gray-400",
			text: "text-gray-800",
			border: "border-gray-500",
		}
	);
}

// Translation map for Pokemon types in French
const TYPE_TRANSLATIONS: Record<PokemonTypeString, string> = {
	normal: "Normal",
	fire: "Feu",
	water: "Eau",
	electric: "Électrik",
	grass: "Plante",
	ice: "Glace",
	fighting: "Combat",
	poison: "Poison",
	ground: "Sol",
	flying: "Vol",
	psychic: "Psy",
	bug: "Insecte",
	rock: "Roche",
	ghost: "Spectre",
	dragon: "Dragon",
	dark: "Ténèbres",
	steel: "Acier",
	fairy: "Fée",
};

export function translateType(type: string): string {
	const normalized = type.toLowerCase() as PokemonTypeString;
	return TYPE_TRANSLATIONS[normalized] || type;
}
