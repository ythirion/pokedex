<script lang="ts">
	export let message: string;
	export let retry: (() => void) | null = null;
</script>

<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center transition-colors">
	<div class="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Erreur</div>
	<p class="text-red-700 dark:text-red-300 mb-4">{message}</p>
	{#if retry}
		<button on:click={retry} class="btn btn-primary">Réessayer</button>
	{/if}
</div>
