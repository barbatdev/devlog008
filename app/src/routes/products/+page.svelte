<script lang="ts">
	// Migration of WIN_Products: table of products with Create / Modify actions.
	import { onMount } from 'svelte';
	import type { Product } from '$lib/types';

	let products: Product[] = $state([]);
	let selectedId: number | null = $state(null);

	// Equivalent of the getProducts window procedure.
	async function getProducts(): Promise<void> {
		const res = await fetch('/api/product');
		if (res.ok) {
			products = await res.json();
		}
	}

	// Equivalent of OPT_CreateNew: Open(WIN_Product) with no id.
	function createNew(): void {
		window.location.href = '/products/new';
	}

	// Equivalent of OPT_Modify: Open(WIN_Product, COL_IDproduct).
	function modify(): void {
		if (selectedId !== null) {
			window.location.href = `/products/${selectedId}`;
		}
	}

	onMount(() => {
		getProducts();
	});
</script>

<main>
	<h1>Products</h1>

	<div class="actions">
		<button onclick={createNew}>Create new</button>
		<button onclick={modify} disabled={selectedId === null}>Modify</button>
	</div>

	<table>
		<thead>
			<tr>
				<th>IDproduct</th>
				<th>Name</th>
				<th>Description</th>
				<th>Price</th>
				<th>IsActive</th>
			</tr>
		</thead>
		<tbody>
			{#each products as product (product.IDproduct)}
				<tr
					class:selected={selectedId === product.IDproduct}
					onclick={() => (selectedId = product.IDproduct)}
					onkeydown={(e) => e.key === 'Enter' && (selectedId = product.IDproduct)}
					role="button"
					tabindex="0"
				>
					<td>{product.IDproduct}</td>
					<td>{product.name}</td>
					<td>{product.description}</td>
					<td>{product.price}</td>
					<td>{product.isActive ? 'Yes' : 'No'}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<p><a href="/">Home</a></p>
</main>

<style>
	main {
		font-family: system-ui, sans-serif;
		max-width: 860px;
		margin: 2rem auto;
		padding: 0 1rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 0.4rem 0.6rem;
		text-align: left;
	}
	tbody tr {
		cursor: pointer;
	}
	tbody tr.selected {
		background: #e0ecff;
	}
</style>
