<script lang="ts">
	import { onMount } from 'svelte';
	import { pokemonStore, currentPagePokemon, totalPages } from '$lib/stores/pokemon.store';
	import { allPokemonMetadata } from '$lib/stores/allPokemonMetadata.store';
	import { searchStore } from '$lib/stores/search.store';
	import { filtersStore } from '$lib/stores/filters.store';
	import PokemonGrid from '$lib/components/pokemon/PokemonGrid.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import FilterPanel from '$lib/components/ui/FilterPanel.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import { GENERATIONS } from '$lib/constants/generations';
	import { DEFAULT_PAGE_SIZE } from '$lib/constants/api-config';
	import { applyClientSideFilters, paginateResults, calculateTotalPages } from '$lib/utils/filterUtils';
	import type { EnrichedPokemon, PokemonMetadata } from '$lib/types/pokemon.types';

	$: store = $pokemonStore;
	$: pokemon = $currentPagePokemon;
	$: pages = $totalPages;
	$: search = $searchStore;
	$: filters = $filtersStore;
	$: metadata = $allPokemonMetadata;

	// Detect if we need to load all metadata (for non-generation filters)
	$: hasActiveNonGenFilters =
		filters.types.length > 0 ||
		filters.legendaryOnly ||
		search.debouncedQuery.length > 0;

	// Load all metadata when non-generation filters are active
	$: if (hasActiveNonGenFilters && !metadata.isLoaded && !metadata.isLoading) {
		allPokemonMetadata.loadAllMetadata();
	}

	// Local pagination state for filtered results
	let filteredPage = 1;

	// Reset filtered page when filters change
	$: if (filters || search.debouncedQuery) {
		filteredPage = 1;
	}

	// Apply filters to metadata or current page
	$: filteredMetadata = (() => {
		if (hasActiveNonGenFilters && metadata.isLoaded) {
			// Use client-side filtering on all metadata
			return applyClientSideFilters(metadata.allPokemon, {
				types: filters.types,
				generation: filters.generation,
				legendaryOnly: filters.legendaryOnly,
				searchQuery: search.debouncedQuery
			});
		}
		return [];
	})();

	// Paginate filtered results
	$: paginatedMetadata = hasActiveNonGenFilters && metadata.isLoaded
		? paginateResults(filteredMetadata, filteredPage, DEFAULT_PAGE_SIZE)
		: [];

	// Calculate total pages for filtered results
	$: filteredTotalPages = hasActiveNonGenFilters && metadata.isLoaded
		? calculateTotalPages(filteredMetadata.length, DEFAULT_PAGE_SIZE)
		: 0;

	// Convert paginated metadata to EnrichedPokemon format
	$: enrichedFilteredPokemon = paginatedMetadata.map((meta): EnrichedPokemon => ({
		id: meta.id,
		name: meta.name,
		url: `https://pokeapi.co/api/v2/pokemon/${meta.id}/`,
		pokemon: store.enrichedCache.get(meta.id),
		isLegendary: meta.isLegendary,
		isMythical: meta.isMythical,
		frenchName: meta.frenchName
	}));

	// Final filtered Pokemon to display
	$: filteredPokemon = (hasActiveNonGenFilters && metadata.isLoaded
		? enrichedFilteredPokemon
		: (() => {
			// Apply generation filter to current page if active
			let result = pokemon;

			if (filters.generation !== null) {
				const gen = GENERATIONS.find((g) => g.id === filters.generation);
				if (gen) {
					const [start, end] = gen.range;
					result = result.filter((p) => p.id >= start && p.id <= end);
				}
			}

			return result;
		})()) as EnrichedPokemon[];

	// Check if any filter is active
	$: hasActiveFilters = hasActiveNonGenFilters || filters.generation !== null;

	async function loadPokemonData() {
		// If generation filter is active, load all Pokemon from that generation
		if (filters.generation !== null) {
			const gen = GENERATIONS.find((g) => g.id === filters.generation);
			if (gen) {
				const [start, end] = gen.range;
				const count = end - start + 1;
				await pokemonStore.loadPage(1, count, start - 1);
			}
		} else {
			// Load first page normally
			await pokemonStore.loadPage(1);
		}

		// Enrich Pokemon with details
		const ids = pokemon.map((p) => p.id);
		await pokemonStore.enrichPokemon(ids);
	}

	// Enrich filtered metadata page when it changes
	$: if (hasActiveNonGenFilters && metadata.isLoaded && paginatedMetadata.length > 0) {
		const ids = paginatedMetadata.map((m) => m.id);
		pokemonStore.enrichMetadataPage(ids);
	}

	let previousGeneration: number | null = null;

	onMount(async () => {
		await loadPokemonData();
		previousGeneration = filters.generation;
	});

	// Reload when generation filter changes
	$: if (previousGeneration !== null && filters.generation !== previousGeneration) {
		previousGeneration = filters.generation;
		loadPokemonData();
	}

	async function handlePageChange(event: CustomEvent<number>) {
		const newPage = event.detail;

		if (hasActiveNonGenFilters && metadata.isLoaded) {
			// Change filtered page
			filteredPage = newPage;
		} else {
			// Normal pagination
			await pokemonStore.loadPage(newPage);

			// Enrich new Pokemon
			const ids = $currentPagePokemon.map((p) => p.id);
			await pokemonStore.enrichPokemon(ids);
		}

		// Scroll to top
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleRetry() {
		pokemonStore.loadPage(store.currentPage);
	}
</script>

<svelte:head>
	<title>Pokédex - Tous les Pokémon</title>
</svelte:head>

<div class="space-y-6">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-2">Pokédex</h1>
		<p class="text-gray-600">Explorez tous les {store.totalCount} Pokémon</p>
	</div>

	<SearchBar />

	<FilterPanel />

	{#if store.error || metadata.error}
		<ErrorMessage message={store.error || metadata.error || 'Error loading data'} retry={handleRetry} />
	{:else}
		<PokemonGrid
			pokemon={filteredPokemon}
			isLoading={store.isLoading || (hasActiveNonGenFilters && metadata.isLoading)}
		/>

		{#if !store.isLoading && !metadata.isLoading}
			{#if hasActiveNonGenFilters && metadata.isLoaded}
				<!-- Filtered results pagination -->
				<div class="text-center py-6">
					<p class="text-gray-600 mb-4">
						{filteredMetadata.length} Pokémon trouvé{filteredMetadata.length > 1 ? 's' : ''}
					</p>
					{#if filteredTotalPages > 1}
						<Pagination
							currentPage={filteredPage}
							totalPages={filteredTotalPages}
							on:change={handlePageChange}
						/>
					{/if}
				</div>
			{:else if !hasActiveFilters && filteredPokemon.length > 0}
				<!-- Normal pagination -->
				<Pagination
					currentPage={store.currentPage}
					totalPages={pages}
					on:change={handlePageChange}
				/>
			{:else if filters.generation !== null && filteredPokemon.length > 0}
				<!-- Generation filter active -->
				<div class="text-center py-6 text-gray-600">
					{filteredPokemon.length} Pokémon trouvé{filteredPokemon.length > 1 ? 's' : ''}
				</div>
			{/if}
		{/if}
	{/if}
</div>