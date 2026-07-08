<script lang="ts">
import { base } from "$app/paths";
import { favoritesStore } from "$lib/stores/favorites.store";
import type { EnrichedPokemon } from "$lib/types/pokemon.types";
import { formatPokemonId, getPokemonSpriteUrl } from "$lib/utils/pokemon.utils";
import { getTypeColors, translateType } from "$lib/utils/type-colors";

export let pokemon: EnrichedPokemon;
export let isFavorite: boolean = false;
export let isLegendary: boolean = false;

function toggleFavorite(e: MouseEvent) {
	e.preventDefault();
	e.stopPropagation();
	favoritesStore.toggle(pokemon.id);
}

$: spriteUrl = getPokemonSpriteUrl(pokemon.id, "official-artwork");
$: pokemonData = pokemon.pokemon;
$: mainType = pokemonData?.types[0]?.type.name || "normal";
$: typeColors = getTypeColors(mainType);
$: hp = pokemonData?.stats.find((s) => s.stat.name === "hp")?.base_stat || 0;
</script>

<a
	href="{base}/pokemon/{pokemon.id}"
	class="pokemon-card block relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
	class:legendary-card={isLegendary}
	style="background: linear-gradient(135deg, {typeColors.bg.replace('bg-', '')} 0%, #ffffff 100%);"
>
	<!-- Effet holographique pour légendaires -->
	{#if isLegendary}
		<div class="holographic-effect"></div>
	{/if}

	<!-- Badge favori -->
	<button
		on:click={toggleFavorite}
		class="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
		aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
	>
		<svg
			class="w-5 h-5 transition-colors"
			class:text-red-500={isFavorite}
			class:fill-current={isFavorite}
			class:text-gray-400={!isFavorite}
			class:dark:text-gray-500={!isFavorite}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
			/>
		</svg>
	</button>

	<!-- En-tête de la carte -->
	<div class="relative z-10 p-3">
		<div class="flex items-start justify-between mb-2">
			<div class="flex-1">
				<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
					{pokemon.frenchName || pokemon.name}
				</h3>
				{#if pokemonData}
					<div class="flex gap-1 mt-1">
						{#each pokemonData.types as typeInfo}
							<span
								class="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-100"
							>
								{translateType(typeInfo.type.name)}
							</span>
						{/each}
					</div>
				{/if}
			</div>
			{#if pokemonData}
				<div class="text-right ml-2">
					<div class="text-xs font-semibold text-gray-600 dark:text-gray-400">PV</div>
					<div class="text-2xl font-bold text-red-600">{hp}</div>
				</div>
			{/if}
		</div>

		<!-- Image du Pokémon -->
		<div class="pokemon-image-container relative bg-white/40 backdrop-blur-sm rounded-xl p-3 mb-2 border-2 border-white/60">
			<img
				src={spriteUrl}
				alt={pokemon.name}
				loading="lazy"
				class="w-full h-28 object-contain drop-shadow-2xl"
			/>
			{#if isLegendary}
				<div class="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
					<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					Légendaire
				</div>
			{/if}
		</div>

		<!-- Pied de carte -->
		<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2">
			<div class="text-center">
				<div class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">N°{formatPokemonId(pokemon.id).replace('#', '')}</div>
				{#if pokemonData}
					<div class="flex justify-around text-xs">
						<div>
							<div class="font-bold text-gray-700 dark:text-gray-300">ATQ</div>
							<div class="font-semibold text-gray-900 dark:text-gray-100">
								{pokemonData.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0}
							</div>
						</div>
						<div>
							<div class="font-bold text-gray-700 dark:text-gray-300">DÉF</div>
							<div class="font-semibold text-gray-900 dark:text-gray-100">
								{pokemonData.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0}
							</div>
						</div>
						<div>
							<div class="font-bold text-gray-700 dark:text-gray-300">VIT</div>
							<div class="font-semibold text-gray-900 dark:text-gray-100">
								{pokemonData.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</a>

<style>
	.pokemon-card {
		border-radius: 1rem;
		border: 3px solid rgba(255, 255, 255, 0.8);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		position: relative;
		width: 100%;
		max-width: 260px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
	}

	.legendary-card {
		border: 3px solid #fbbf24;
		box-shadow: 0 0 30px rgba(251, 191, 36, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3);
		animation: pulse-legendary 2s ease-in-out infinite;
	}

	@keyframes pulse-legendary {
		0%, 100% {
			box-shadow: 0 0 30px rgba(251, 191, 36, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3);
		}
		50% {
			box-shadow: 0 0 50px rgba(251, 191, 36, 0.8), 0 10px 30px rgba(0, 0, 0, 0.3);
		}
	}

	.holographic-effect {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			45deg,
			rgba(255, 0, 0, 0.1) 0%,
			rgba(255, 154, 0, 0.1) 10%,
			rgba(208, 222, 33, 0.1) 20%,
			rgba(79, 220, 74, 0.1) 30%,
			rgba(63, 218, 216, 0.1) 40%,
			rgba(47, 201, 226, 0.1) 50%,
			rgba(28, 127, 238, 0.1) 60%,
			rgba(95, 21, 242, 0.1) 70%,
			rgba(186, 12, 248, 0.1) 80%,
			rgba(251, 7, 217, 0.1) 90%,
			rgba(255, 0, 0, 0.1) 100%
		);
		background-size: 300% 300%;
		animation: holographic 3s ease infinite;
		pointer-events: none;
		z-index: 1;
		opacity: 0.6;
	}

	@keyframes holographic {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.pokemon-card:hover .holographic-effect {
		opacity: 0.9;
	}
</style>
