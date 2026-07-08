// Pokemon utility functions
import { SPRITES_BASE } from "$lib/constants/api-config";

/**
 * Extract Pokemon ID from PokeAPI URL
 */
export function extractPokemonId(url: string): number {
	const matches = url.match(/\/(\d+)\//);
	if (!matches?.[1]) {
		throw new Error(`Could not extract ID from URL: ${url}`);
	}
	return parseInt(matches[1], 10);
}

/**
 * Format Pokemon name for display
 * Example: "bulbasaur" -> "Bulbasaur"
 */
export function formatPokemonName(name: string): string {
	return name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Format Pokemon ID with leading zeros
 * Example: 1 -> "#001", 25 -> "#025"
 */
export function formatPokemonId(id: number): string {
	return `#${id.toString().padStart(3, "0")}`;
}

/**
 * Get Pokemon sprite URL
 */
export function getPokemonSpriteUrl(
	id: number,
	variant: "default" | "shiny" | "official-artwork" = "default",
): string {
	if (variant === "official-artwork") {
		return `${SPRITES_BASE}/other/official-artwork/${id}.png`;
	}

	if (variant === "shiny") {
		return `${SPRITES_BASE}/shiny/${id}.png`;
	}

	return `${SPRITES_BASE}/${id}.png`;
}

/**
 * Get stat name display in French
 */
export function getStatName(statName: string): string {
	const nameMap: Record<string, string> = {
		hp: "PV",
		attack: "Attaque",
		defense: "Défense",
		"special-attack": "Atq. Spé",
		"special-defense": "Déf. Spé",
		speed: "Vitesse",
	};

	return nameMap[statName] || statName;
}

/**
 * Get French name from Pokemon species data
 */
export function getFrenchName(
	names: Array<{ name: string; language: { name: string } }>,
): string {
	const frenchName = names.find((n) => n.language.name === "fr");
	return frenchName ? frenchName.name : "";
}

/**
 * Get stat color for display
 */
export function getStatColor(statName: string): string {
	const colorMap: Record<string, string> = {
		hp: "bg-green-500",
		attack: "bg-red-500",
		defense: "bg-blue-500",
		"special-attack": "bg-purple-500",
		"special-defense": "bg-yellow-500",
		speed: "bg-pink-500",
	};

	return colorMap[statName] || "bg-gray-500";
}

/**
 * Convert height from decimeters to meters
 */
export function formatHeight(heightInDecimeters: number): string {
	const meters = heightInDecimeters / 10;
	return `${meters.toFixed(1)} m`;
}

/**
 * Convert weight from hectograms to kilograms
 */
export function formatWeight(weightInHectograms: number): string {
	const kilograms = weightInHectograms / 10;
	return `${kilograms.toFixed(1)} kg`;
}
