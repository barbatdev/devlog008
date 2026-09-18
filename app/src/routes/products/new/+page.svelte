<script lang="ts">
	import ProductForm from '$lib/components/ProductForm.svelte';

	function onSaved(): void {
		window.location.href = '/products';
	}
</script>

<main>
	<h1>New product</h1>
	<ProductForm product={null} onSaved={onSaved} />
</main>

<style>
	main {
		font-family: system-ui, sans-serif;
		max-width: 640px;
		margin: 2rem auto;
		padding: 0 1rem;
	}
</style>
