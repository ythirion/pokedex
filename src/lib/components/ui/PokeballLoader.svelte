<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizeClasses = {
		sm: 'w-12 h-12',
		md: 'w-20 h-20',
		lg: 'w-28 h-28'
	};
</script>

<div class="flex items-center justify-center p-8">
	<div class={`${sizeClasses[size]} relative`}>
		<svg
			viewBox="0 0 100 100"
			class="animate-spin"
			style="animation-duration: 1s;"
		>
			<!-- Top half (red) -->
			<path
				d="M 50 10 A 40 40 0 0 1 90 50 L 50 50 Z"
				fill="#DC2626"
				stroke="#1F2937"
				stroke-width="2"
			/>

			<!-- Bottom half (white) -->
			<path
				d="M 50 50 L 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 10 50 L 50 50 Z"
				fill="#FFFFFF"
				stroke="#1F2937"
				stroke-width="2"
			/>

			<!-- Middle line -->
			<line
				x1="10"
				y1="50"
				x2="90"
				y2="50"
				stroke="#1F2937"
				stroke-width="3"
			/>

			<!-- Center button (outer circle) -->
			<circle
				cx="50"
				cy="50"
				r="12"
				fill="#FFFFFF"
				stroke="#1F2937"
				stroke-width="3"
			/>

			<!-- Center button (inner circle) -->
			<circle
				cx="50"
				cy="50"
				r="6"
				fill="#F3F4F6"
				stroke="#1F2937"
				stroke-width="1.5"
			/>
		</svg>
	</div>
</div>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
