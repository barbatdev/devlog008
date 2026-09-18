<script lang="ts">
	import ProductForm from '$lib/components/ProductForm.svelte';
	import type { Product } from '$lib/types';

	let { params }: { params: { id: string } } = $props();

	let product: Product | null = $state(null);
	let notFound = $state(false);

	// Equivalent of getProduct: load the product before opening the form.
	$effect(() => {
		fetch(`/api/product/${params.id}`)
			.then((res) => {
				if (!res.ok) throw new Error(String(res.status));
				return res.json();
			})
			.then((data: Product) => (product = data))
			.catch(() => (notFound = true));
	});

	function onSaved(): void {
		window.location.href = '/products';
	}
</script>

<main>
	<h1>Modify product</h1>
	{#if notFound}
		<p>Product not found (404).</p>
	{:else if product}
		<ProductForm {product} onSaved={onSaved} />
	{:else}
		<p>Loading…</p>
	{/if}
</main>

<style>
	main {
		font-family: system-ui, sans-serif;
		max-width: 640px;
		margin: 2rem auto;
		padding: 0 1rem;
	}
</style>
