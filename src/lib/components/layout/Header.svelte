<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="bg-red-600 text-white shadow-lg">
	<div class="container mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<h1 class="text-2xl font-bold">Pokédex</h1>
			</a>

			<nav class="flex gap-4">
				<a
					href="/"
					class="px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
					class:bg-red-700={$page.url.pathname === '/'}
				>
					Accueil
				</a>
				<a
					href="/favorites"
					class="px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
					class:bg-red-700={$page.url.pathname === '/favorites'}
				>
					Favoris
				</a>
			</nav>
		</div>
	</div>
</header>
