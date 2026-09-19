<script lang="ts">
	import { BEARD_ART_ROWS } from '$lib/assets/beard-art';

	const REVEAL_INTERVAL_MS = 40;

	let visibleRows = $state(0);

	$effect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		let timers: ReturnType<typeof setTimeout>[] = [];

		const clearTimers = () => {
			for (const timer of timers) clearTimeout(timer);
			timers = [];
		};

		const apply = () => {
			clearTimers();
			if (query.matches) {
				visibleRows = BEARD_ART_ROWS.length;
				return;
			}
			visibleRows = 0;
			BEARD_ART_ROWS.forEach((_, index) => {
				timers.push(
					setTimeout(() => {
						visibleRows = index + 1;
					}, index * REVEAL_INTERVAL_MS)
				);
			});
		};

		apply();
		query.addEventListener('change', apply);

		return () => {
			query.removeEventListener('change', apply);
			clearTimers();
		};
	});
</script>

<div class="beard-hero">
	<div class="art" aria-hidden="true">
		{#each BEARD_ART_ROWS as row, index (index)}
			<div class="row" class:hidden={index >= visibleRows}>{row}</div>
		{/each}
	</div>
	<span class="sr-only">Refactoriza Braille beard logo</span>
</div>

<style>
	.beard-hero {
		display: flex;
		justify-content: center;
		margin-top: var(--space-6);
	}
	.art {
		font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.55rem;
		line-height: 1.15;
		color: var(--light-300);
		white-space: pre;
		text-align: center;
		user-select: none;
	}
	.row {
		display: block;
		transition: opacity var(--speed-fast) var(--ease-out);
	}
	.row.hidden {
		opacity: 0;
	}
	@media (max-width: 480px) {
		.art {
			font-size: 0.4rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.row {
			transition: none;
		}
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
