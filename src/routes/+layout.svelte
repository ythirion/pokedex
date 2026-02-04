<script lang="ts">
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import { themeStore } from '$lib/stores/theme.store';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		themeStore.initializeTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Pokédex - Explore All Pokemon</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
	<Header />
	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>
