<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Pokédex - Explore All Pokemon</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Header />
	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>
