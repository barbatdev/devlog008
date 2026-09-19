<script lang="ts">
	// Migration of WIN_Products with the RefactorIA design system.
	import { onMount } from 'svelte';
	import type { Product } from '$lib/types';
	import { productCellLabel } from '$lib/utils/format';
	import Card from '$lib/components/ui/Card.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let products: Product[] = $state([]);
	let loading = $state(true);
	let errorMessage = $state('');
	let selectedId: number | null = $state(null);
	let savedId: number | null = $state(null);

	async function getProducts(): Promise<void> {
		loading = true;
		errorMessage = '';
		try {
			const res = await fetch('/api/product');
			if (!res.ok) {
				errorMessage = `Could not load products (error ${res.status}).`;
				return;
			}
			products = await res.json();
		} catch {
			errorMessage = 'Could not load products. Please try again.';
		} finally {
			loading = false;
		}
	}

	function createNew(): void {
		window.location.href = '/products/new';
	}

	function modify(): void {
		if (selectedId !== null) {
			window.location.href = `/products/${selectedId}`;
		}
	}

	onMount(() => {
		// User reward: pulse the row just created/updated (?saved=<id>).
		const params = new URLSearchParams(window.location.search);
		const saved = params.get('saved');
		if (saved !== null) {
			savedId = Number(saved);
			window.history.replaceState({}, '', '/products');
		}
		getProducts();
	});
</script>

<main>
	<header>
		<h1>Products</h1>
		<div class="actions">
			<Button variant="primary" onclick={createNew}>＋ Create new</Button>
			<Button variant="subtle" onclick={modify} disabled={selectedId === null}>✎ Modify</Button>
		</div>
	</header>

	<Card>
		<Table>
			<thead>
				<tr>
					<th><span class="sr-only">Select</span></th>
					<th>IDproduct</th>
					<th>Name</th>
					<th>Description</th>
					<th>Price</th>
					<th>IsActive</th>
				</tr>
			</thead>
			<tbody>
				{#if loading}
					{#each Array(3) as _, i (i)}
						<tr>
							{#each Array(6) as __, j (j)}
								<td><span class="skeleton"></span></td>
							{/each}
						</tr>
					{/each}
				{:else if errorMessage}
					<tr>
						<td colspan="5" class="error-state">
							<p role="alert">{errorMessage}</p>
							<Button variant="subtle" onclick={getProducts}>Retry</Button>
						</td>
					</tr>
				{:else if products.length === 0}
					<tr>
						<td colspan="6" class="empty">No products yet. Create the first one.</td>
					</tr>
				{:else}
					{#each products as product (product.IDproduct)}
					<tr
						class:selected={selectedId === product.IDproduct}
						class:pulse={savedId === product.IDproduct}
						onclick={() => (selectedId = product.IDproduct)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								selectedId = product.IDproduct;
							}
						}}
						tabindex="0"
					>
						<td class="select-cell">
							<input
								type="radio"
								name="selected-product"
								checked={selectedId === product.IDproduct}
								onchange={() => (selectedId = product.IDproduct)}
								aria-label={`Select product ${product.name}`}
							/>
						</td>
						<td>{product.IDproduct}</td>
							<td>{product.name}</td>
							<td class="muted">{product.description || '—'}</td>
							<td>{product.price}</td>
							<td>
								<Badge
									tone={product.isActive ? 'success' : 'neutral'}
									label={productCellLabel(product.isActive)}
								/>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</Table>
	</Card>
</main>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-6);
	}
	h1 {
		margin: 0;
		font-size: 1.5rem;
	}
	.actions {
		display: flex;
		gap: var(--space-2);
	}
	.select-cell {
		width: 2.5rem;
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
	.muted {
		color: var(--muted);
	}
	.empty {
		text-align: center;
		color: var(--muted);
		padding: var(--space-8);
	}
	.error-state {
		text-align: center;
		padding: var(--space-8);
	}
	.error-state p {
		color: var(--danger);
		margin: 0 0 var(--space-4);
	}
	.skeleton {
		display: inline-block;
		width: 80%;
		height: 0.8em;
		border-radius: var(--radius-sm);
		background: linear-gradient(90deg, var(--dark-700) 25%, var(--dark-800) 50%, var(--dark-700) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.2s infinite linear;
	}
	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}
</style>
