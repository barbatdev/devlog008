<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
</script>

<main class="home">
	<h1>Refactor<span>izando</span></h1>
	<p class="muted">WinDev "Refactorizando" project migrated to SvelteKit + SQLite.</p>

	<div class="grid">
		<a href="/products" class="tile">
			<Card>
				<h2>📦 Products</h2>
				<p class="muted">CRUD of products — migrated from WIN_Products / WIN_Product and the Mproduct REST webservice.</p>
			</Card>
		</a>
		<a href="/users" class="tile">
			<Card>
				<h2>🧪 Users demo</h2>
				<p class="muted">Map · Filter · Reduce · Combine over dummyjson users — migrated from WIN_JSONS.</p>
			</Card>
		</a>
	</div>
</main>

<style>
	.home {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	h1 {
		font-size: 2.2rem;
		margin: var(--space-8) 0 0;
	}
	h1 span {
		color: var(--brand-500);
	}
	.muted {
		color: var(--muted);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: var(--space-4);
		margin-top: var(--space-8);
		text-align: left;
	}
	.tile {
		transition: transform var(--speed-fast) var(--ease-out);
	}
	.tile:hover {
		transform: translateY(-3px);
	}
	h2 {
		font-size: 1.05rem;
		margin: 0 0 var(--space-2);
	}
</style>
