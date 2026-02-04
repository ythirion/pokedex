<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-12 h-12',
		lg: 'w-16 h-16'
	};
</script>

<div class="flex items-center justify-center p-8">
	<div
		class={`${sizeClasses[size]} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin`}
	></div>
</div>
