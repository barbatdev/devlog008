<script lang="ts">
	// Migration of WIN_Products with the RefactorIA design system.
	import ProductForm from '$lib/components/ProductForm.svelte';

	function onSaved(id: number): void {
		window.location.href = `/products?saved=${id}`;
	}
</script>

<main>
	<h1>New product</h1>
	<ProductForm product={null} onSaved={onSaved} />
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
</style>
