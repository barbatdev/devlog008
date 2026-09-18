<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		onclick,
		children
	}: {
		variant?: 'primary' | 'subtle';
		type?: 'button' | 'submit';
		disabled?: boolean;
		onclick?: () => void;
		children: Snippet;
	} = $props();
</script>

<button {type} {disabled} {onclick} class={variant}>
	{@render children()}
</button>

<style>
	button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform var(--speed-fast) var(--ease-out),
			background var(--speed-fast) var(--ease-out),
			border-color var(--speed-fast) var(--ease-out),
			box-shadow var(--speed-fast) var(--ease-out);
	}
	button:active:not(:disabled) {
		transform: scale(0.97);
	}
	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.primary {
		background: var(--brand-500);
		color: var(--light-100);
	}
	.primary:hover:not(:disabled) {
		background: var(--brand-600);
		box-shadow: var(--shadow-glow);
	}
	.subtle {
		background: var(--dark-800);
		color: var(--light-200);
		border-color: var(--dark-700);
	}
	.subtle:hover:not(:disabled) {
		border-color: var(--brand-500);
		color: var(--light-100);
	}
</style>
