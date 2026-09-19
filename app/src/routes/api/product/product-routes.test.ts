// Route-level tests for /api/product and /api/product/[id].
// Uses a fresh in-memory better-sqlite3 DB per test via vi.doMock('$lib/server/db'),
// real Request objects, and closes the DB in afterEach (cortex test plan).

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

type Db = InstanceType<typeof Database>;

type RouteHandler = (event?: { request?: Request; params?: Record<string, string> }) => Promise<Response>;

let db: Db | { prepare: () => never };

function makeDb(): Db {
	const d = new Database(':memory:');
	d.exec(`
		CREATE TABLE product (
			IDproduct INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT NOT NULL,
			price NUMERIC(24, 6) NOT NULL,
			isActive INTEGER NOT NULL
		);
	`);
	d.prepare(
		`INSERT INTO product (name, description, price, isActive) VALUES ('pantalla 24', '', 133, 1)`
	).run();
	return d;
}

function useDb(target: Db | { prepare: () => never }): void {
	vi.resetModules();
	vi.doMock('$lib/server/db', () => ({ db: target }));
}

async function loadRoutes() {
	const collection = (await import('./+server')) as unknown as { GET: RouteHandler; POST: RouteHandler };
	const item = (await import('./[id]/+server')) as unknown as { GET: RouteHandler; PUT: RouteHandler };
	return { collection, item };
}

function jsonRequest(url: string, method: string, body: unknown): Request {
	return new Request(url, {
		method,
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	});
}

function event(extra: Record<string, unknown>): { request?: Request; params?: Record<string, string> } {
	return extra;
}

afterEach(() => {
	if (db instanceof Database) db.close();
	db = undefined as unknown as Db;
	vi.doUnmock('$lib/server/db');
	vi.resetModules();
});

describe('GET /api/product', () => {
	it('returns 200 with the seeded products', async () => {
		db = makeDb();
		useDb(db);
		const { collection } = await loadRoutes();
		const res = await collection.GET(event({}));
		expect(res.status).toBe(200);
		const products = (await res.json()) as Array<{ IDproduct: number; name: string }>;
		expect(products).toHaveLength(1);
		expect(products[0].name).toBe('pantalla 24');
	});

	it('returns the same 500 JSON shape when the DB fails', async () => {
		db = { prepare: () => { throw new Error('db down'); } };
		useDb(db);
		const { collection } = await loadRoutes();
		const res = await collection.GET(event({}));
		expect(res.status).toBe(500);
		expect(await res.json()).toEqual({ error: 'Internal server error' });
	});
});

describe('POST /api/product', () => {
	it('creates a product and returns 201', async () => {
		db = makeDb();
		useDb(db);
		const { collection } = await loadRoutes();
		const res = await collection.POST(
			event({ request: jsonRequest('http://localhost/api/product', 'POST', { name: 'mouse', description: '', price: 45.5, isActive: false }) })
		);
		expect(res.status).toBe(201);
		const saved = (await res.json()) as { IDproduct: number; name: string };
		expect(saved.name).toBe('mouse');
	});

	it('returns 422 for a name longer than 50 characters', async () => {
		db = makeDb();
		useDb(db);
		const { collection } = await loadRoutes();
		const res = await collection.POST(
			event({ request: jsonRequest('http://localhost/api/product', 'POST', { name: 'a'.repeat(51), description: '', price: 1, isActive: true }) })
		);
		expect(res.status).toBe(422);
		expect(await res.json()).toEqual({ error: 'Invalid format.' });
	});

	it('returns 422 for a price with more than 6 decimal places', async () => {
		db = makeDb();
		useDb(db);
		const { collection } = await loadRoutes();
		const res = await collection.POST(
			event({ request: jsonRequest('http://localhost/api/product', 'POST', { name: 'mouse', description: '', price: 0.1234567, isActive: true }) })
		);
		expect(res.status).toBe(422);
		expect(await res.json()).toEqual({ error: 'Invalid format.' });
	});

	it('returns 422 for a non-positive price', async () => {
		db = makeDb();
		useDb(db);
		const { collection } = await loadRoutes();
		const res = await collection.POST(
			event({ request: jsonRequest('http://localhost/api/product', 'POST', { name: 'mouse', description: '', price: 0, isActive: true }) })
		);
		expect(res.status).toBe(422);
	});
});

describe('GET /api/product/[id]', () => {
	it('returns 200 for an existing product', async () => {
		db = makeDb();
		useDb(db);
		const { item } = await loadRoutes();
		const res = await item.GET(event({ params: { id: '1' } }));
		expect(res.status).toBe(200);
		const product = (await res.json()) as { IDproduct: number };
		expect(product.IDproduct).toBe(1);
	});

	it('returns 404 for an unknown id', async () => {
		db = makeDb();
		useDb(db);
		const { item } = await loadRoutes();
		const res = await item.GET(event({ params: { id: '999' } }));
		expect(res.status).toBe(404);
	});

	it('returns the same 500 JSON shape when the DB fails', async () => {
		db = { prepare: () => { throw new Error('db down'); } };
		useDb(db);
		const { item } = await loadRoutes();
		const res = await item.GET(event({ params: { id: '1' } }));
		expect(res.status).toBe(500);
		expect(await res.json()).toEqual({ error: 'Internal server error' });
	});
});

describe('PUT /api/product/[id]', () => {
	it('updates an existing product and returns 200', async () => {
		db = makeDb();
		useDb(db);
		const { item } = await loadRoutes();
		const res = await item.PUT(
			event({
				params: { id: '1' },
				request: jsonRequest('http://localhost/api/product/1', 'PUT', { name: 'pantalla 27', description: '', price: 200, isActive: true })
			})
		);
		expect(res.status).toBe(200);
		const saved = (await res.json()) as { name: string };
		expect(saved.name).toBe('pantalla 27');
	});

	it('returns 404 when the product does not exist', async () => {
		db = makeDb();
		useDb(db);
		const { item } = await loadRoutes();
		const res = await item.PUT(
			event({
				params: { id: '999' },
				request: jsonRequest('http://localhost/api/product/999', 'PUT', { name: 'x', description: '', price: 1, isActive: true })
			})
		);
		expect(res.status).toBe(404);
	});

	it('returns the same 500 JSON shape when the pre-update lookup fails', async () => {
		db = { prepare: () => { throw new Error('db down'); } };
		useDb(db);
		const { item } = await loadRoutes();
		const res = await item.PUT(
			event({
				params: { id: '1' },
				request: jsonRequest('http://localhost/api/product/1', 'PUT', { name: 'x', description: '', price: 1, isActive: true })
			})
		);
		expect(res.status).toBe(500);
		expect(await res.json()).toEqual({ error: 'Internal server error' });
	});
});
