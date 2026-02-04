<script lang="ts">
	import type { EvolutionChain, ChainLink } from '$lib/types/species.types';
	import { formatPokemonName, getPokemonSpriteUrl } from '$lib/utils/pokemon.utils';

	export let chain: EvolutionChain;

	function extractIdFromUrl(url: string): number {
		const matches = url.match(/\/(\d+)\//);
		return matches ? parseInt(matches[1], 10) : 0;
	}

	function getEvolutionTrigger(link: ChainLink): string {
		if (link.evolution_details.length === 0) return '';

		const detail = link.evolution_details[0];
		const parts: string[] = [];

		if (detail.min_level) {
			parts.push(`Level ${detail.min_level}`);
		}

		if (detail.item) {
			parts.push(formatPokemonName(detail.item.name));
		}

		if (detail.min_happiness) {
			parts.push(`Happiness ${detail.min_happiness}`);
		}

		if (detail.trigger.name === 'trade') {
			parts.push('Trade');
		}

		return parts.join(', ') || detail.trigger.name;
	}

	function renderChainLink(link: ChainLink, depth: number = 0): any {
		const speciesId = extractIdFromUrl(link.species.url);
		const spriteUrl = getPokemonSpriteUrl(speciesId, 'official-artwork');

		return {
			id: speciesId,
			name: link.species.name,
			spriteUrl,
			evolvesTo: link.evolves_to.map((evo) => ({
				...renderChainLink(evo, depth + 1),
				trigger: getEvolutionTrigger(evo)
			}))
		};
	}

	$: evolutionData = renderChainLink(chain.chain);

	function renderEvolution(data: any): any {
		return { data };
	}
</script>

<div class="flex items-center justify-center flex-wrap gap-4">
	{#each [evolutionData] as evo}
		<div class="flex items-center gap-4 flex-wrap justify-center">
			<!-- Current Pokemon -->
			<a href="/pokemon/{evo.id}" class="flex flex-col items-center group">
				<div class="w-32 h-32 bg-gray-100 rounded-lg p-2 group-hover:shadow-lg transition-shadow">
					<img src={evo.spriteUrl} alt={evo.name} class="w-full h-full object-contain" />
				</div>
				<span class="text-sm font-medium mt-2 capitalize">{formatPokemonName(evo.name)}</span>
			</a>

			<!-- Evolutions -->
			{#if evo.evolvesTo && evo.evolvesTo.length > 0}
				{#each evo.evolvesTo as nextEvo}
					<div class="flex items-center gap-4">
						<!-- Arrow with trigger -->
						<div class="flex flex-col items-center">
							<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
							</svg>
							{#if nextEvo.trigger}
								<span class="text-xs text-gray-500 text-center max-w-20">{nextEvo.trigger}</span>
							{/if}
						</div>

						<!-- Next Pokemon -->
						<div class="flex flex-col items-center">
							<a href="/pokemon/{nextEvo.id}" class="flex flex-col items-center group">
								<div class="w-32 h-32 bg-gray-100 rounded-lg p-2 group-hover:shadow-lg transition-shadow">
									<img src={nextEvo.spriteUrl} alt={nextEvo.name} class="w-full h-full object-contain" />
								</div>
								<span class="text-sm font-medium mt-2 capitalize">{formatPokemonName(nextEvo.name)}</span>
							</a>

							<!-- Further evolutions (recursive) -->
							{#if nextEvo.evolvesTo && nextEvo.evolvesTo.length > 0}
								<div class="flex items-center gap-4 mt-4">
									{#each nextEvo.evolvesTo as finalEvo}
										<div class="flex items-center gap-4">
											<div class="flex flex-col items-center">
												<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
												</svg>
												{#if finalEvo.trigger}
													<span class="text-xs text-gray-500 text-center max-w-20">{finalEvo.trigger}</span>
												{/if}
											</div>
											<a href="/pokemon/{finalEvo.id}" class="flex flex-col items-center group">
												<div class="w-32 h-32 bg-gray-100 rounded-lg p-2 group-hover:shadow-lg transition-shadow">
													<img src={finalEvo.spriteUrl} alt={finalEvo.name} class="w-full h-full object-contain" />
												</div>
												<span class="text-sm font-medium mt-2 capitalize">{formatPokemonName(finalEvo.name)}</span>
											</a>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/each}
</div>
