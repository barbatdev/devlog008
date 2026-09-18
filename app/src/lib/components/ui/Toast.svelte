<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toasts } from '$lib/stores/toast';
</script>

<div class="toasts" aria-live="polite">
	{#each $toasts as toast (toast.id)}
		<div class="toast" transition:fly={{ y: 16, duration: 250 }}>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="M3 8.5L6.5 12L13 4.5" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			{toast.message}
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		bottom: var(--space-4);
		right: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		z-index: 100;
	}
	.toast {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: var(--dark-700);
		color: var(--light-100);
		border: 1px solid var(--brand-500);
		border-radius: var(--radius-md);
		padding: var(--space-3) var(--space-4);
		font-size: 0.85rem;
		font-weight: 500;
		box-shadow: var(--shadow-md);
	}
</style>
