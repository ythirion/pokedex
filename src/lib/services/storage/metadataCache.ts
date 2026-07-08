// localStorage cache service for Pokemon metadata
import type { PokemonMetadata } from "$lib/types/pokemon.types";

const CACHE_KEY = "pokedex_metadata";
const CACHE_VERSION = 1;
const CACHE_TTL_HOURS = 24;

interface CacheData {
	version: number;
	timestamp: number;
	metadata: PokemonMetadata[];
}

/**
 * Check if metadata cache is valid (not expired and correct version)
 */
export function isMetadataCacheValid(): boolean {
	if (typeof window === "undefined") return false;

	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (!cached) return false;

		const data: CacheData = JSON.parse(cached);

		// Check version
		if (data.version !== CACHE_VERSION) {
			return false;
		}

		// Check TTL
		const now = Date.now();
		const age = now - data.timestamp;
		const maxAge = CACHE_TTL_HOURS * 60 * 60 * 1000; // Convert to milliseconds

		return age < maxAge;
	} catch {
		return false;
	}
}

/**
 * Get Pokemon metadata from cache
 * Returns null if cache is invalid or doesn't exist
 */
export function getMetadataFromCache(): PokemonMetadata[] | null {
	if (!isMetadataCacheValid()) return null;

	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (!cached) return null;

		const data: CacheData = JSON.parse(cached);
		return data.metadata;
	} catch (error) {
		console.error("Failed to read metadata from cache:", error);
		return null;
	}
}

/**
 * Save Pokemon metadata to cache
 */
export function setMetadataInCache(metadata: PokemonMetadata[]): void {
	if (typeof window === "undefined") return;

	try {
		const data: CacheData = {
			version: CACHE_VERSION,
			timestamp: Date.now(),
			metadata,
		};

		localStorage.setItem(CACHE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error("Failed to save metadata to cache:", error);
	}
}

/**
 * Clear metadata cache
 */
export function clearMetadataCache(): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(CACHE_KEY);
	} catch (error) {
		console.error("Failed to clear metadata cache:", error);
	}
}
