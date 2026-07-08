<script lang="ts">
import { onMount } from "svelte";
import { base } from "$app/paths";
import PokemonGrid from "$lib/components/pokemon/PokemonGrid.svelte";
import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";
import { getPokemonBatch } from "$lib/services/api/pokemon.service";
import { getSpeciesById } from "$lib/services/api/species.service";
import { favoritesStore } from "$lib/stores/favorites.store";
import type { EnrichedPokemon } from "$lib/types/pokemon.types";

let favoritePokemon: EnrichedPokemon[] = [];
let isLoading = true;

$: favorites = $favoritesStore;

onMount(async () => {
	await loadFavorites();
});

async function loadFavorites() {
	isLoading = true;
	const favoriteIds = Array.from($favoritesStore);

	if (favoriteIds.length === 0) {
		favoritePokemon = [];
		isLoading = false;
		return;
	}

	try {
		const pokemonMap = await getPokemonBatch(favoriteIds);

		// Fetch species data for French names and legendary status
		const speciesPromises = favoriteIds.map(async (id) => {
			try {
				const species = await getSpeciesById(id);
				const frenchName =
					species.names.find((n) => n.language.name === "fr")?.name || "";
				return {
					id,
					frenchName,
					isLegendary: species.is_legendary,
					isMythical: species.is_mythical,
				};
			} catch (error) {
				console.error(`Failed to fetch species for Pokemon ${id}:`, error);
				return null;
			}
		});

		const speciesData = await Promise.all(speciesPromises);
		const speciesMap = new Map(
			speciesData.filter((s) => s !== null).map((s) => [s!.id, s!]),
		);

		favoritePokemon = favoriteIds
			.map((id) => {
				const pokemon = pokemonMap.get(id);
				if (!pokemon) return null;

				const species = speciesMap.get(id);

				return {
					id,
					name: pokemon.name,
					url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
					pokemon,
					frenchName: species?.frenchName,
					isLegendary: species?.isLegendary,
					isMythical: species?.isMythical,
				} as EnrichedPokemon;
			})
			.filter((p): p is EnrichedPokemon => p !== null);
	} catch (error) {
		console.error("Failed to load favorites:", error);
	} finally {
		isLoading = false;
	}
}

// Reload when favorites change
$: if ($favoritesStore) {
	loadFavorites();
}
</script>

<svelte:head>
	<title>Favoris - Pokédex</title>
</svelte:head>

<div class="space-y-6">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-2">Pokémon Favoris</h1>
		<p class="text-gray-600">
			{favorites.size} {favorites.size === 1 ? 'Pokémon' : 'Pokémon'}
		</p>
	</div>

	{#if isLoading}
		<LoadingSpinner size="lg" />
	{:else if favoritePokemon.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500 text-lg mb-4">Vous n'avez pas encore de Pokémon favoris</p>
            <a href="{base}/" class="btn btn-primary">Parcourir les Pokémon</a>
		</div>
	{:else}
		<PokemonGrid pokemon={favoritePokemon} isLoading={false} />
	{/if}
</div>
