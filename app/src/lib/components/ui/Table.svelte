<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="table-wrap">
	<table>
		{@render children()}
	</table>
</div>

<style>
	.table-wrap {
		overflow-x: auto;
		border: 1px solid var(--dark-700);
		border-radius: var(--radius-md);
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	:global(th) {
		text-align: left;
		padding: var(--space-3) var(--space-3);
		color: var(--muted);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: var(--dark-800);
		border-bottom: 1px solid var(--dark-700);
		white-space: nowrap;
	}
	:global(td) {
		padding: var(--space-3);
		border-bottom: 1px solid var(--dark-700);
		color: var(--light-200);
		font-size: 0.85rem;
	}
	:global(tbody tr:last-child td) {
		border-bottom: none;
	}
	:global(tbody tr) {
		background: var(--dark-800);
		transition: background var(--speed-fast) var(--ease-out);
	}
	:global(tbody tr:hover) {
		background: var(--dark-700);
	}
	:global(tbody tr.selected) {
		background: var(--brand-tint);
		box-shadow: inset 2px 0 0 var(--brand-500);
	}
	:global(tbody tr.pulse) {
		animation: pulse-row 1.6s var(--ease-out) 1;
	}
	@keyframes pulse-row {
		0% {
			background: var(--brand-tint);
		}
		70% {
			background: var(--brand-tint);
		}
		100% {
			background: var(--dark-800);
		}
	}
</style>
