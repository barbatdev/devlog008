<script lang="ts">
	import '../app.css';
	import Toast from '$lib/components/ui/Toast.svelte';
	let { children } = $props();
</script>

<div class="nav">
	<a class="brand" href="/">
		<img class="mark" src="/beard-logo.svg" alt="" width="22" height="22" />
		Refactor<span>izando</span>
	</a>
	<nav>
		<a href="/products">Products</a>
		<a href="/users">Users</a>
	</nav>
</div>

<main>
	{@render children?.()}
</main>

<Toast />

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-6);
		background: rgba(11, 7, 20, 0.85);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--dark-700);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: 700;
		font-size: 1.05rem;
		letter-spacing: -0.01em;
		color: var(--light-100);
	}
	.mark {
		display: block;
		border-radius: var(--radius-sm);
		user-select: none;
	}
	.brand span {
		color: var(--brand-500);
	}
	nav {
		display: flex;
		gap: var(--space-4);
	}
	nav a {
		color: var(--muted);
		font-weight: 500;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		transition:
			color var(--speed-fast) var(--ease-out),
			background var(--speed-fast) var(--ease-out);
	}
	nav a:hover {
		color: var(--light-100);
		background: var(--dark-800);
	}
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-8) var(--space-6);
	}
</style>
