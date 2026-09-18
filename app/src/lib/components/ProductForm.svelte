<script lang="ts">
	// Migration of WIN_Product: product create/modify form.
	// BTN_OK serializes the screen to JSON and calls addProduct/modifyProduct
	// (POST /api/product or PUT /api/product/[id]).
	import type { Product } from '$lib/types';

	let { product = null, onSaved }: { product?: Product | null; onSaved?: () => void } = $props();

	let name = $state(product?.name ?? '');
	let description = $state(product?.description ?? '');
	let price = $state(product?.price ?? 0);
	let isActive = $state(product?.isActive ?? true);
	let error = $state('');

	async function save(): Promise<void> {
		error = '';
		const body = JSON.stringify({ name, description, price, isActive });
		const isNew = product === null;
		const res = await fetch(isNew ? '/api/product' : `/api/product/${product!.IDproduct}`, {
			method: isNew ? 'POST' : 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body
		});
		if (res.ok) {
			onSaved?.();
		} else {
			error = `Error ${res.status}: could not save the product.`;
		}
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); save(); }}>
	{#if product}
		<p>IDproduct: {product.IDproduct}</p>
	{/if}
	<label>
		Name
		<input bind:value={name} required />
	</label>
	<label>
		Description
		<textarea bind:value={description}></textarea>
	</label>
	<label>
		Price
		<input type="number" step="0.01" bind:value={price} required />
	</label>
	<label class="checkbox">
		<input type="checkbox" bind:checked={isActive} /> IsActive
	</label>
	{#if error}
		<p class="error">{error}</p>
	{/if}
	<div class="actions">
		<button type="submit">OK</button>
		<a href="/products"><button type="button">Cancel</button></a>
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 420px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	label.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	.error {
		color: #b00020;
	}
</style>
