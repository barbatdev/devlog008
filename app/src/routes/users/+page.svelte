<script lang="ts">
	// Migration of WIN_JSONS with the RefactorIA design system:
	// Map / Filter / Reduce / Combine demo with staggered output animation.
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { User } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let users: User[] = $state([]);
	let loading = $state(true);
	let output: string[] = $state([]);
	let outputKey = $state(0);

	async function getUsers(): Promise<void> {
		const res = await fetch('https://dummyjson.com/users');
		if (res.ok) {
			const json = await res.json();
			users = json.users;
		}
		loading = false;
	}

	function setOutput(lines: string[]): void {
		output = lines;
		outputKey++;
	}

	// --- BTN_MAP: classic (getIPAddress) and lambda versions ---
	function mapClassic(): void {
		function getIPAddress(user: User): string {
			return user.ip;
		}
		setOutput(users.map(getIPAddress));
	}
	function mapLambda(): void {
		setOutput(users.map((user) => `IP Address: ${user.ip}`));
	}

	// --- BTN_FILTER: classic (filterUsers) and lambda versions ---
	function filterClassic(): void {
		function filterUsers(user: User): boolean {
			return user.gender === 'male' && user.eyeColor === 'Green';
		}
		setOutput(users.filter(filterUsers).map((u) => `${u.firstName} ${u.lastName}`));
	}
	function filterLambda(): void {
		setOutput(
			users
				.filter((user) => user.gender === 'male' && user.eyeColor === 'Green')
				.map((u) => `${u.firstName} ${u.lastName}`)
		);
	}

	// --- BTN_REDUCE: classic (_reduce) and lambda versions ---
	function reduceClassic(): void {
		function reduce(maxAge: number, user: User): number {
			return Math.max(user.age, maxAge);
		}
		setOutput([`Max age: ${users.reduce(reduce, 0)}`]);
	}
	function reduceLambda(): void {
		setOutput([`Max age: ${users.reduce((maxAge, user) => Math.max(user.age, maxAge), 0)}`]);
	}

	// --- BTN_COMBINE: filter + reduce chained ---
	function combineLambda(): void {
		const result = users
			.filter((user) => user.gender === 'male' && user.eyeColor === 'Amber')
			.reduce((maxAge, user) => Math.max(user.age, maxAge), 0);
		setOutput([`Max age (male, Amber): ${result}`]);
	}

	const columns: { key: string; label: string }[] = [
		{ key: 'id', label: 'Id' },
		{ key: 'firstName', label: 'First name' },
		{ key: 'lastName', label: 'Last name' },
		{ key: 'maidenName', label: 'Maiden name' },
		{ key: 'age', label: 'Age' },
		{ key: 'gender', label: 'Gender' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'username', label: 'Username' },
		{ key: 'birthDate', label: 'Birth date' },
		{ key: 'bloodGroup', label: 'Blood group' },
		{ key: 'height', label: 'Height' },
		{ key: 'weight', label: 'Weight' },
		{ key: 'eyeColor', label: 'Eye color' },
		{ key: 'hair_color', label: 'Hair color' },
		{ key: 'hair_type', label: 'Hair type' },
		{ key: 'domain', label: 'Domain' },
		{ key: 'ip', label: 'IP' },
		{ key: 'macAddress', label: 'MAC address' },
		{ key: 'university', label: 'University' }
	];

	function cell(user: User, key: string): string {
		if (key === 'hair_color') return user.hair.color;
		if (key === 'hair_type') return user.hair.type;
		return String(user[key as keyof User] ?? '');
	}

	onMount(() => {
		getUsers();
	});
</script>

<main>
	<header>
		<h1>Users <span class="accent">— JSON demo</span></h1>
		<p class="muted">Map · Filter · Reduce · Combine, classic and lambda versions (WLanguage migration)</p>
	</header>

	<Card>
		<div class="actions">
			<Button variant="subtle" onclick={mapClassic}>Map · classic</Button>
			<Button variant="subtle" onclick={mapLambda}>Map · lambda</Button>
			<Button variant="subtle" onclick={filterClassic}>Filter · classic</Button>
			<Button variant="subtle" onclick={filterLambda}>Filter · lambda</Button>
			<Button variant="subtle" onclick={reduceClassic}>Reduce · classic</Button>
			<Button variant="subtle" onclick={reduceLambda}>Reduce · lambda</Button>
			<Button variant="primary" onclick={combineLambda}>⚡ Combine</Button>
		</div>

		{#if output.length > 0}
			<ul class="output" in:fly={{ y: 8, duration: 250 }}>
				{#key outputKey}
					{#each output as line, i (i)}
						<li in:fly={{ y: 10, delay: i * 40, duration: 300 }}>{line}</li>
					{/each}
				{/key}
			</ul>
		{:else}
			<p class="muted hint">Run one of the operations above to see results here.</p>
		{/if}
	</Card>

	<Card>
		{#if loading}
			<p class="muted">Loading users…</p>
		{:else}
			<Table>
				<thead>
					<tr>
						{#each columns as col}
							<th>{col.label}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each users as user (user.id)}
						<tr>
							{#each columns as col}
								<td>{cell(user, col.key)}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</Table>
		{/if}
	</Card>
</main>

<style>
	header {
		margin-bottom: var(--space-6);
	}
	h1 {
		margin: 0 0 var(--space-1);
		font-size: 1.5rem;
	}
	.accent {
		color: var(--brand-500);
		font-weight: 400;
	}
	.muted {
		color: var(--muted);
	}
	.actions {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		margin-bottom: var(--space-4);
	}
	.output {
		list-style: none;
		margin: 0;
		padding: var(--space-3) var(--space-4);
		background: var(--dark-900);
		border: 1px solid var(--dark-700);
		border-radius: var(--radius-md);
		max-height: 220px;
		overflow-y: auto;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.8rem;
		color: var(--light-300);
	}
	.hint {
		text-align: center;
		padding: var(--space-4);
	}
	main :global(.card + .card) {
		margin-top: var(--space-6);
	}
</style>
