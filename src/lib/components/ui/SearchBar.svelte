<script lang="ts">
	import { searchStore } from '$lib/stores/search.store';

	let inputValue = '';

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		inputValue = target.value;
		searchStore.setQuery(inputValue);
	}

	function clearSearch() {
		inputValue = '';
		searchStore.clear();
	}
</script>

<div class="relative">
	<div class="relative">
		<input
			type="text"
			value={inputValue}
			on:input={handleInput}
			placeholder="Rechercher un Pokémon par nom..."
			class="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 outline-none transition-all"
		/>

		<svg
			class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>

		{#if inputValue}
			<button
				on:click={clearSearch}
				class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
				aria-label="Clear search"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{/if}
	</div>
</div>
