<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<section class="card">
	{@render children()}
</section>

<style>
	.card {
		background: var(--dark-800);
		border: 1px solid var(--dark-700);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		box-shadow: var(--shadow-md);
	}
</style>
