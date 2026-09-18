<script lang="ts">
	// Migration of WIN_Products with the RefactorIA design system.
	import ProductForm from '$lib/components/ProductForm.svelte';
	import type { Product } from '$lib/types';

	let { params }: { params: { id: string } } = $props();

	let product: Product | null = $state(null);
	let notFound = $state(false);

	$effect(() => {
		fetch(`/api/product/${params.id}`)
			.then((res) => {
				if (!res.ok) throw new Error(String(res.status));
				return res.json();
			})
			.then((data: Product) => (product = data))
			.catch(() => (notFound = true));
	});

	function onSaved(id: number): void {
		window.location.href = `/products?saved=${id}`;
	}
</script>

<main>
	<h1>Modify product</h1>
	{#if notFound}
		<p class="error">Product not found (404).</p>
	{:else if product}
		<ProductForm {product} onSaved={onSaved} />
	{:else}
		<p class="muted">Loading…</p>
	{/if}
</main>

<style>
	main {
		max-width: 520px;
		margin: 0 auto;
	}
	h1 {
		font-size: 1.35rem;
		margin-bottom: var(--space-6);
	}
	.error {
		color: var(--danger);
	}
	.muted {
		color: var(--muted);
	}
</style>
