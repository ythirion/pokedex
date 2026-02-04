<script lang="ts">
	export let message: string;
	export let retry: (() => void) | null = null;
</script>

<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
	<div class="text-red-600 text-lg font-semibold mb-2">Erreur</div>
	<p class="text-red-700 mb-4">{message}</p>
	{#if retry}
		<button on:click={retry} class="btn btn-primary">Réessayer</button>
	{/if}
</div>
