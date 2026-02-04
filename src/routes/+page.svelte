<script lang="ts">
	import { onMount } from 'svelte';
	import { pokemonStore, currentPagePokemon, totalPages } from '$lib/stores/pokemon.store';
	import { searchStore } from '$lib/stores/search.store';
	import { filtersStore } from '$lib/stores/filters.store';
	import PokemonGrid from '$lib/components/pokemon/PokemonGrid.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import FilterPanel from '$lib/components/ui/FilterPanel.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import { GENERATIONS } from '$lib/constants/generations';
	import type { EnrichedPokemon } from '$lib/types/pokemon.types';

	$: store = $pokemonStore;
	$: pokemon = $currentPagePokemon;
	$: pages = $totalPages;
	$: search = $searchStore;
	$: filters = $filtersStore;

	// Filter Pokemon based on search and filters
	$: filteredPokemon = (() => {
		let result = pokemon;

		// Apply search filter
		if (search.debouncedQuery) {
			const query = search.debouncedQuery.toLowerCase();
			result = result.filter((p) =>
				p.name.toLowerCase().includes(query) ||
				p.frenchName?.toLowerCase().includes(query)
			);
		}

		// Apply generation filter
		if (filters.generation !== null) {
			const gen = GENERATIONS.find((g) => g.id === filters.generation);
			if (gen) {
				const [start, end] = gen.range;
				result = result.filter((p) => p.id >= start && p.id <= end);
			}
		}

		// Apply legendary filter
		if (filters.legendaryOnly) {
			result = result.filter((p) => p.isLegendary || p.isMythical);
		}

		// Apply type filter (requires enriched data)
		if (filters.types.length > 0) {
			result = result.filter((p) => {
				if (!p.pokemon) return false;
				return p.pokemon.types.some((t) => filters.types.includes(t.type.name as any));
			});
		}

		return result;
	})() as EnrichedPokemon[];

	// Check if any filter is active
	$: hasActiveFilters =
		filters.generation !== null ||
		filters.legendaryOnly ||
		filters.types.length > 0 ||
		search.debouncedQuery.length > 0;

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
		if (hasActiveFilters) {
			// Don't change pages when filters are active
			return;
		}

		const newPage = event.detail;
		await pokemonStore.loadPage(newPage);

		// Enrich new Pokemon
		const ids = $currentPagePokemon.map((p) => p.id);
		await pokemonStore.enrichPokemon(ids);

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

	{#if store.error}
		<ErrorMessage message={store.error} retry={handleRetry} />
	{:else}
		<PokemonGrid pokemon={filteredPokemon} isLoading={store.isLoading} />

		{#if !store.isLoading && filteredPokemon.length > 0 && !hasActiveFilters}
			<Pagination currentPage={store.currentPage} totalPages={pages} on:change={handlePageChange} />
		{/if}

		{#if hasActiveFilters && !store.isLoading}
			<div class="text-center py-6 text-gray-600">
				{filteredPokemon.length} Pokémon trouvé{filteredPokemon.length > 1 ? 's' : ''}
			</div>
		{/if}
	{/if}
</div>