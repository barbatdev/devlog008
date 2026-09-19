<script lang="ts">
	// Migration of WIN_Products with the RefactorIA design system.
	import ProductForm from '$lib/components/ProductForm.svelte';
	import type { Product } from '$lib/types';

	let { params }: { params: { id: string } } = $props();

	let product: Product | null = $state(null);
	let notFound = $state(false);
	let errorMessage = $state('');

	$effect(() => {
		fetch(`/api/product/${params.id}`)
			.then((res) => {
				if (res.status === 404) {
					notFound = true;
					return null;
				}
				if (!res.ok) throw new Error(String(res.status));
				return res.json();
			})
			.then((data: Product | null) => {
				if (data) product = data;
			})
			.catch(() => {
				errorMessage = 'Could not load the product. Please try again later.';
			});
	});

	function onSaved(id: number): void {
		window.location.href = `/products?saved=${id}`;
	}
</script>

<main>
	<h1>Modify product</h1>
	{#if notFound}
		<p class="error">Product not found (404).</p>
	{:else if errorMessage}
		<p class="error" role="alert">{errorMessage}</p>
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
