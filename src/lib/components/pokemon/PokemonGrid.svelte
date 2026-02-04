<script lang="ts">
	import type { EnrichedPokemon } from '$lib/types/pokemon.types';
	import PokemonCard from './PokemonCard.svelte';
	import PokeballLoader from '../ui/PokeballLoader.svelte';
	import { favoritesStore } from '$lib/stores/favorites.store';

	export let pokemon: EnrichedPokemon[];
	export let isLoading: boolean = false;

	$: favorites = $favoritesStore;
</script>

{#if isLoading}
	<PokeballLoader size="lg" />
{:else if pokemon.length === 0}
	<div class="text-center py-12">
		<p class="text-gray-500 dark:text-gray-400 text-lg">Aucun Pokémon trouvé</p>
	</div>
{:else}
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
		{#each pokemon as poke (poke.id)}
			<PokemonCard
				pokemon={poke}
				isFavorite={favorites.has(poke.id)}
				isLegendary={poke.isLegendary || poke.isMythical || false}
			/>
		{/each}
	</div>
{/if}
