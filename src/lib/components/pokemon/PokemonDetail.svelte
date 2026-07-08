<script lang="ts">
import { base } from "$app/paths";
import { getPokemonById } from "$lib/services/api/pokemon.service";
import { getFullEvolutionData } from "$lib/services/api/species.service";
import { favoritesStore } from "$lib/stores/favorites.store";
import type { Pokemon } from "$lib/types/pokemon.types";
import type { EvolutionChain, PokemonSpecies } from "$lib/types/species.types";
import {
	formatHeight,
	formatPokemonId,
	formatPokemonName,
	formatWeight,
	getStatColor,
	getStatName,
} from "$lib/utils/pokemon.utils";
import { getTypeColors, translateType } from "$lib/utils/type-colors";
import ErrorMessage from "../ui/ErrorMessage.svelte";
import PokeballLoader from "../ui/PokeballLoader.svelte";
import EvolutionChainComponent from "./EvolutionChain.svelte";

export let id: number;

let pokemon: Pokemon | null = null;
let species: PokemonSpecies | null = null;
let evolutionChain: EvolutionChain | null = null;
let isLoading = true;
let error: string | null = null;

$: favorites = $favoritesStore;
$: isFavorite = favorites.has(id);

// Reload Pokemon when ID changes
$: if (id) {
	loadPokemon();
}

async function loadPokemon() {
	isLoading = true;
	error = null;

	// Scroll to top when changing Pokemon
	if (typeof window !== "undefined") {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	try {
		// Load Pokemon and evolution data in parallel
		const [pokemonData, evolutionData] = await Promise.all([
			getPokemonById(id),
			getFullEvolutionData(id),
		]);

		pokemon = pokemonData;
		species = evolutionData.species;
		evolutionChain = evolutionData.evolutionChain;
	} catch (err) {
		error = err instanceof Error ? err.message : "Failed to load Pokemon";
	} finally {
		isLoading = false;
	}
}

function toggleFavorite() {
	favoritesStore.toggle(id);
}

function getDescription(): string {
	if (!species) return "";
	const entry = species.flavor_text_entries.find(
		(e) => e.language.name === "fr",
	);
	return entry ? entry.flavor_text.replace(/\f/g, " ") : "";
}

function getFrenchName(): string {
	if (!species || !pokemon) return formatPokemonName(pokemon?.name || "");
	const frenchName = species.names.find((n) => n.language.name === "fr")?.name;
	return frenchName || formatPokemonName(pokemon.name);
}
</script>

{#if isLoading}
	<PokeballLoader size="lg" />
{:else if error}
	<ErrorMessage message={error} retry={loadPokemon} />
{:else if pokemon && species}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<a href="{base}/" class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
				</svg>
				Retour à la liste
			</a>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-8 transition-colors">
			<!-- Header -->
			<div class="flex justify-between items-start mb-6">
				<div>
					<div class="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">
						{formatPokemonId(pokemon.id)}
					</div>
					<h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
						{getFrenchName()}
					</h1>
					<div class="flex gap-2">
						{#each pokemon.types as typeInfo}
							{@const colors = getTypeColors(typeInfo.type.name)}
							<span class={`px-4 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
								{translateType(typeInfo.type.name)}
							</span>
						{/each}
					</div>
				</div>

				<button
					on:click={toggleFavorite}
					class="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
				>
					<svg
						class="w-8 h-8 transition-colors"
						class:text-red-500={isFavorite}
						class:fill-current={isFavorite}
						class:text-gray-400={!isFavorite}
						class:dark:text-gray-500={!isFavorite}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
					</svg>
				</button>
			</div>

			<div class="grid md:grid-cols-2 gap-8 mb-8">
				<div>
					<img
						src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
						alt={pokemon.name}
						class="w-full max-w-sm mx-auto"
					/>
				</div>

				<div class="space-y-4">
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed">{getDescription()}</p>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Taille</div>
							<div class="font-semibold text-gray-900 dark:text-gray-100">{formatHeight(pokemon.height)}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Poids</div>
							<div class="font-semibold text-gray-900 dark:text-gray-100">{formatWeight(pokemon.weight)}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Expérience de base</div>
							<div class="font-semibold text-gray-900 dark:text-gray-100">{pokemon.base_experience}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Catégorie</div>
							<div class="font-semibold capitalize text-gray-900 dark:text-gray-100">
								{species.genera.find((g) => g.language.name === 'fr')?.genus || 'Inconnu'}
							</div>
						</div>
					</div>

					<div>
						<h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Capacités</h3>
						<div class="flex flex-wrap gap-2">
							{#each pokemon.abilities as ability}
								<span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full text-sm capitalize">
									{ability.ability.name.replace('-', ' ')}
									{#if ability.is_hidden}
										<span class="text-xs text-gray-500 dark:text-gray-400">(Cachée)</span>
									{/if}
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div class="mb-8">
				<h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Statistiques de base</h2>
				<div class="space-y-3">
					{#each pokemon.stats as stat}
						{@const statName = getStatName(stat.stat.name)}
						{@const statColor = getStatColor(stat.stat.name)}
						{@const percentage = (stat.base_stat / 255) * 100}
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{statName}</span>
								<span class="text-sm font-bold text-gray-900 dark:text-gray-100">{stat.base_stat}</span>
							</div>
							<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div
									class={`h-2 rounded-full ${statColor}`}
									style="width: {percentage}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			{#if evolutionChain}
				<div>
					<h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Chaîne d'évolution</h2>
					<EvolutionChainComponent chain={evolutionChain} />
				</div>
			{/if}
		</div>
	</div>
{/if}
