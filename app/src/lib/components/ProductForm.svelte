<script lang="ts">
	// Migration of WIN_Product with the RefactorIA design system:
	// inline validation, brand focus rings, saving spinner and toast rewards.
	import { get } from 'svelte/store';
	import type { Product } from '$lib/types';
	import { showToast } from '$lib/stores/toast';
	import { formatPrice } from '$lib/utils/format';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { product = null, onSaved }: { product?: Product | null; onSaved?: (id: number) => void } = $props();

	let name = $state(product?.name ?? '');
	let description = $state(product?.description ?? '');
	let price = $state<number | null>(product?.price ?? null);
	let isActive = $state(product?.isActive ?? true);
	let saving = $state(false);
	let serverError = $state('');

	const NAME_MAX_LENGTH = 50;

	let touchedName = $state(false);

	const nameError = $derived(
		touchedName && name.trim().length === 0
			? 'Name is required.'
			: touchedName && name.trim().length > NAME_MAX_LENGTH
				? `Name must be ${NAME_MAX_LENGTH} characters or fewer.`
				: ''
	);
	// Client rules mirror the server (validateProductBody): finite, > 0, max 6 decimals.
	const priceError = $derived(
		price === null || price <= 0
			? 'Price must be greater than zero.'
			: !Number.isInteger(price * 1e6)
				? 'Price must have at most 6 decimal places.'
				: ''
	);
	const formValid = $derived(
		name.trim().length > 0 &&
			name.trim().length <= NAME_MAX_LENGTH &&
			price !== null &&
			price > 0 &&
			Number.isInteger(price * 1e6)
	);

	async function save(): Promise<void> {
		if (!formValid || saving) return;
		saving = true;
		serverError = '';
		const body = JSON.stringify({ name: name.trim(), description, price, isActive });
		const isNew = product === null;
		try {
			const res = await fetch(isNew ? '/api/product' : `/api/product/${product!.IDproduct}`, {
				method: isNew ? 'POST' : 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body
			});
			if (res.ok) {
				const saved: Product = await res.json();
				// User reward: toast confirmation.
				showToast(isNew ? 'Product created' : 'Product saved');
				onSaved?.(saved.IDproduct);
			} else {
				serverError = `Error ${res.status}: could not save the product.`;
			}
		} catch {
			serverError = 'Could not save the product. Please try again.';
		} finally {
			saving = false;
		}
	}

	let preview = $derived(price !== null && price > 0 ? formatPrice(price) : '—');
</script>

<Card>
	<form onsubmit={(e) => { e.preventDefault(); save(); }} novalidate>
		{#if product}
			<p class="id">IDproduct: <strong>{product.IDproduct}</strong></p>
		{/if}

		<label>
			Name
			<input
				id="product-name"
				bind:value={name}
				class:invalid={nameError}
				onblur={() => (touchedName = true)}
				placeholder="e.g. pantalla 24"
				aria-invalid={nameError ? 'true' : undefined}
				aria-describedby={nameError ? 'product-name-error' : undefined}
			/>
			{#if nameError}<span id="product-name-error" class="error">{nameError}</span>{/if}
		</label>

		<label>
			Description
			<textarea bind:value={description} rows="3" placeholder="Optional details"></textarea>
		</label>

		<label>
			Price
			<input
				id="product-price"
				type="number"
				step="0.01"
				min="0"
				bind:value={price}
				class:invalid={priceError}
				placeholder="0.00"
				aria-invalid={priceError ? 'true' : undefined}
				aria-describedby={priceError ? 'product-price-error' : undefined}
			/>
			{#if priceError}<span id="product-price-error" class="error">{priceError}</span>{/if}
			<span class="preview">{preview}</span>
		</label>

		<label class="checkbox">
			<input type="checkbox" bind:checked={isActive} /> IsActive
		</label>

		{#if serverError}
			<p class="error" role="alert">{serverError}</p>
		{/if}

		<div class="actions">
			<Button type="submit" variant="primary" disabled={saving || !formValid}>
				{#if saving}
					<span class="spinner" aria-hidden="true"></span> Saving…
				{:else}
					Save
				{/if}
			</Button>
			<Button type="button" variant="subtle" onclick={() => (window.location.href = '/products')}>Cancel</Button>
		</div>
	</form>
</Card>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.id {
		margin: 0;
		color: var(--muted);
		font-size: 0.85rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		font-weight: 500;
		color: var(--light-300);
		font-size: 0.85rem;
	}
	input,
	textarea {
		font: inherit;
		color: var(--light-100);
		background: var(--dark-900);
		border: 1px solid var(--dark-700);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
		outline: none;
		transition:
			border-color var(--speed-fast) var(--ease-out),
			box-shadow var(--speed-fast) var(--ease-out);
	}
	input:focus,
	textarea:focus {
		border-color: var(--brand-500);
		box-shadow: var(--shadow-glow);
	}
	input.invalid {
		border-color: var(--danger);
	}
	.checkbox {
		flex-direction: row;
		align-items: center;
		gap: var(--space-2);
	}
	.error {
		color: var(--danger);
		font-size: 0.8rem;
	}
	.preview {
		color: var(--muted);
		font-size: 0.8rem;
	}
	.actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}
	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: var(--light-100);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
