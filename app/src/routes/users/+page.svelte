<script lang="ts">
	// Migration of WIN_JSONS: users table from dummyjson.com and the
	// Map / Filter / Reduce / Combine demo (classic and lambda versions).
	import { onMount } from 'svelte';
	import type { User } from '$lib/types';

	let users: User[] = $state([]);
	let output: string[] = $state([]);

	// Equivalent of the getUsers window procedure.
	async function getUsers(): Promise<void> {
		const res = await fetch('https://dummyjson.com/users');
		if (res.ok) {
			const json = await res.json();
			users = json.users;
		}
	}

	// --- BTN_MAP: classic (getIPAddress) and lambda versions ---
	function mapClassic(): void {
		function getIPAddress(user: User): string {
			return user.ip;
		}
		output = users.map(getIPAddress);
	}
	function mapLambda(): void {
		output = users.map((user) => `IP Address: ${user.ip}`);
	}

	// --- BTN_FILTER: classic (filterUsers) and lambda versions ---
	function filterClassic(): void {
		function filterUsers(user: User): boolean {
			return user.gender === 'male' && user.eyeColor === 'Green';
		}
		output = users.filter(filterUsers).map((u) => `${u.firstName} ${u.lastName}`);
	}
	function filterLambda(): void {
		output = users
			.filter((user) => user.gender === 'male' && user.eyeColor === 'Green')
			.map((u) => `${u.firstName} ${u.lastName}`);
	}

	// --- BTN_REDUCE: classic (_reduce) and lambda versions ---
	function reduceClassic(): void {
		function reduce(maxAge: number, user: User): number {
			return Math.max(user.age, maxAge);
		}
		output = [String(users.reduce(reduce, 0))];
	}
	function reduceLambda(): void {
		output = [String(users.reduce((maxAge, user) => Math.max(user.age, maxAge), 0))];
	}

	// --- BTN_COMBINE: filter + reduce chained (lambda version in the original) ---
	function combineLambda(): void {
		const result = users
			.filter((user) => user.gender === 'male' && user.eyeColor === 'Amber')
			.reduce((maxAge, user) => Math.max(user.age, maxAge), 0);
		output = [String(result)];
	}

	const columns: { key: keyof User | 'hair_color' | 'hair_type'; label: string }[] = [
		{ key: 'id', label: 'Id' },
		{ key: 'firstName', label: 'First name' },
		{ key: 'lastName', label: 'Last name' },
		{ key: 'maidenName', label: 'Maiden name' },
		{ key: 'age', label: 'Age' },
		{ key: 'gender', label: 'Gender' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'username', label: 'Username' },
		{ key: 'password', label: 'Password' },
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
		{ key: 'university', label: 'University' },
		{ key: 'userAgent', label: 'User agent' }
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
	<h1>Users (JSON demo)</h1>

	<div class="actions">
		<button onclick={mapClassic}>Map (classic)</button>
		<button onclick={mapLambda}>Map (lambda)</button>
		<button onclick={filterClassic}>Filter (classic)</button>
		<button onclick={filterLambda}>Filter (lambda)</button>
		<button onclick={reduceClassic}>Reduce (classic)</button>
		<button onclick={reduceLambda}>Reduce (lambda)</button>
		<button onclick={combineLambda}>Combine</button>
	</div>

	{#if output.length > 0}
		<section>
			<h2>Output</h2>
			<ul>
				{#each output as line}
					<li>{line}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<div class="table-wrap">
		<table>
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
							<td>{cell(user, col.key as string)}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<p><a href="/">Home</a></p>
</main>

<style>
	main {
		font-family: system-ui, sans-serif;
		max-width: 1400px;
		margin: 2rem auto;
		padding: 0 1rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}
	.table-wrap {
		overflow-x: auto;
	}
	table {
		border-collapse: collapse;
		font-size: 0.75rem;
		white-space: nowrap;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 0.3rem 0.5rem;
		text-align: left;
	}
</style>
