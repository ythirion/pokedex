// Base PokeAPI client with caching
import { BASE_URL } from '$lib/constants/api-config';
import { cacheService } from './cache.service';

class PokeAPIClient {
	private readonly baseURL: string;

	constructor(baseURL: string = BASE_URL) {
		this.baseURL = baseURL;
	}

	/**
	 * Generic GET request with caching
	 */
	async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
		const cacheKey = `${this.baseURL}${endpoint}`;

		// Check cache first
		if (useCache) {
			const cached = cacheService.get<T>(cacheKey);
			if (cached !== null) {
				return cached;
			}
		}

		try {
			const response = await fetch(cacheKey);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Store in cache
			if (useCache) {
				cacheService.set(cacheKey, data);
			}

			return data as T;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
			}
			throw new Error(`Failed to fetch ${endpoint}: Unknown error`);
		}
	}

	/**
	 * Fetch from absolute URL (for pagination links)
	 */
	async getAbsolute<T>(url: string, useCache: boolean = true): Promise<T> {
		const cacheKey = url;

		// Check cache first
		if (useCache) {
			const cached = cacheService.get<T>(cacheKey);
			if (cached !== null) {
				return cached;
			}
		}

		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Store in cache
			if (useCache) {
				cacheService.set(cacheKey, data);
			}

			return data as T;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to fetch ${url}: ${error.message}`);
			}
			throw new Error(`Failed to fetch ${url}: Unknown error`);
		}
	}
}

// Singleton instance
export const pokeAPIClient = new PokeAPIClient();
