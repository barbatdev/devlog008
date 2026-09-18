<script lang="ts">
	let {
		tone = 'neutral',
		label
	}: { tone?: 'success' | 'neutral' | 'brand'; label: string } = $props();
</script>

<span class="badge {tone}">{label}</span>

<style>
	.badge {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.success {
		background: rgba(46, 204, 143, 0.15);
		color: var(--success);
	}
	.neutral {
		background: var(--dark-700);
		color: var(--muted);
	}
	.brand {
		background: var(--brand-tint);
		color: var(--brand-500);
	}
</style>
