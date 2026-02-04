// In-memory cache service with LRU eviction
import { CACHE_MAX_SIZE, CACHE_TTL } from '$lib/constants/api-config';

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

class CacheService {
	private cache: Map<string, CacheEntry<unknown>>;
	private readonly maxSize: number;

	constructor(maxSize: number = CACHE_MAX_SIZE) {
		this.cache = new Map();
		this.maxSize = maxSize;
	}

	get<T>(key: string): T | null {
		const entry = this.cache.get(key) as CacheEntry<T> | undefined;

		if (!entry) {
			return null;
		}

		// Check if entry is expired
		const now = Date.now();
		if (now - entry.timestamp > CACHE_TTL) {
			this.cache.delete(key);
			return null;
		}

		// Move to end (LRU)
		this.cache.delete(key);
		this.cache.set(key, entry);

		return entry.data;
	}

	set<T>(key: string, data: T): void {
		// If at max size, remove oldest (first) entry
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey) {
				this.cache.delete(firstKey);
			}
		}

		this.cache.set(key, {
			data,
			timestamp: Date.now()
		});
	}

	has(key: string): boolean {
		return this.cache.has(key) && this.get(key) !== null;
	}

	clear(): void {
		this.cache.clear();
	}

	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	size(): number {
		return this.cache.size;
	}
}

// Singleton instance
export const cacheService = new CacheService();
