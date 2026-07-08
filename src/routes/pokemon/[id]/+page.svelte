<script lang="ts">
import { page } from "$app/stores";
import PokemonDetail from "$lib/components/pokemon/PokemonDetail.svelte";

$: id = parseInt($page.params.id || "1", 10);
</script>

<svelte:head>
	<title>Pokemon #{id} - Pokédex</title>
</svelte:head>

<PokemonDetail {id} />
