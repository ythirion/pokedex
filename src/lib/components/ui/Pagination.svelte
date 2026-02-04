<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let currentPage: number;
	export let totalPages: number;

	const dispatch = createEventDispatcher<{ change: number }>();

	function handlePrevious() {
		if (currentPage > 1) {
			dispatch('change', currentPage - 1);
		}
	}

	function handleNext() {
		if (currentPage < totalPages) {
			dispatch('change', currentPage + 1);
		}
	}

	function handlePage(page: number) {
		dispatch('change', page);
	}

	// Generate page numbers to display
	$: pageNumbers = (() => {
		const pages: (number | string)[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			// Show all pages
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show first, last, and pages around current
			pages.push(1);

			if (currentPage > 3) {
				pages.push('...');
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push('...');
			}

			pages.push(totalPages);
		}

		return pages;
	})();
</script>

<div class="flex items-center justify-center gap-2 py-8">
	<button
		on:click={handlePrevious}
		disabled={currentPage === 1}
		class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
	>
		Précédent
	</button>

	{#each pageNumbers as page}
		{#if typeof page === 'number'}
			<button
				on:click={() => handlePage(page)}
				class="px-4 py-2 rounded-lg font-medium transition-colors"
				class:bg-blue-500={currentPage === page}
				class:text-white={currentPage === page}
				class:bg-gray-200={currentPage !== page}
				class:text-gray-800={currentPage !== page}
				class:hover:bg-gray-300={currentPage !== page}
			>
				{page}
			</button>
		{:else}
			<span class="px-2 text-gray-500">{page}</span>
		{/if}
	{/each}

	<button
		on:click={handleNext}
		disabled={currentPage === totalPages}
		class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
	>
		Suivant
	</button>
</div>
