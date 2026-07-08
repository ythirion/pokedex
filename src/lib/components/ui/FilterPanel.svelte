<script lang="ts">
import { GENERATIONS } from "$lib/constants/generations";
import { POKEMON_TYPES } from "$lib/constants/pokemon-types";
import { filtersStore } from "$lib/stores/filters.store";
import type { PokemonTypeString } from "$lib/types/common.types";
import { getTypeColors, translateType } from "$lib/utils/type-colors";

let isOpen = false;

$: filters = $filtersStore;

function toggleType(type: PokemonTypeString) {
	filtersStore.toggleType(type);
}

function setGeneration(genId: number | null) {
	filtersStore.setGeneration(genId);
}

function clearFilters() {
	filtersStore.clear();
}

function toggleLegendary() {
	filtersStore.toggleLegendary();
}

$: hasActiveFilters =
	filters.types.length > 0 ||
	filters.generation !== null ||
	filters.legendaryOnly;
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-4 mb-6 transition-colors">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Filtres</h3>
		<div class="flex gap-2">
			{#if hasActiveFilters}
				<button on:click={clearFilters} class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
					Effacer tout
				</button>
			{/if}
			<button
				on:click={() => (isOpen = !isOpen)}
				class="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
			>
				{isOpen ? 'Masquer' : 'Afficher'}
			</button>
		</div>
	</div>

	<div class:hidden={!isOpen} class="space-y-6 md:block">
		<!-- Generation Filter -->
		<div>
			<label for="generation-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Génération</label>
			<select
				id="generation-select"
				value={filters.generation ?? ''}
				on:change={(e) => {
					const value = e.currentTarget.value;
					setGeneration(value ? parseInt(value) : null);
				}}
				class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 outline-none"
			>
				<option value="">Toutes les générations</option>
				{#each GENERATIONS as gen}
					<option value={gen.id}>{gen.name}</option>
				{/each}
			</select>
		</div>

		<!-- Legendary Filter -->
		<div>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					type="checkbox"
					checked={filters.legendaryOnly}
					on:change={toggleLegendary}
					class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
				/>
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
					<svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					Pokémon Légendaires uniquement
				</span>
			</label>
		</div>

		<!-- Type Filters -->
		<div>
			<div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Types</div>
			<div class="flex flex-wrap gap-2">
				{#each POKEMON_TYPES as type}
					{@const colors = getTypeColors(type)}
					{@const isSelected = filters.types.includes(type)}
					<button
						on:click={() => toggleType(type)}
						class={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-all ${
							isSelected
								? `${colors.bg} ${colors.text} ${colors.border}`
								: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
						}`}
					>
						{translateType(type)}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
