// REST API migrated from the WinDev WEBDEV webservice (class Mproduct).
// GET /api/product/[id] -> Read
// PUT /api/product/[id] -> Modification

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import type { Product } from '$lib/types';
import { validateProductBody } from '$lib/server/product-validation';

interface ProductRow {
	IDproduct: number;
	name: string;
	description: string;
	price: number;
	isActive: number;
}

function toProduct(row: ProductRow): Product {
	return {
		IDproduct: row.IDproduct,
		name: row.name,
		description: row.description,
		price: row.price,
		isActive: row.isActive === 1
	};
}

function findProduct(id: number): ProductRow | undefined {
	return db.prepare('SELECT * FROM product WHERE IDproduct = ?').get(id) as
		| ProductRow
		| undefined;
}

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id)) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	try {
		const row = findProduct(id);
		if (!row) {
			return json({ error: 'Not found' }, { status: 404 });
		}

		return json(toProduct(row));
	} catch {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id)) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid format.' }, { status: 422 });
	}

	const data = validateProductBody(body);
	if (!data) {
		return json({ error: 'Invalid format.' }, { status: 422 });
	}

	try {
		const existing = findProduct(id);
		if (!existing) {
			return json({ error: 'Not found' }, { status: 404 });
		}

		db.prepare('UPDATE product SET name = ?, description = ?, price = ?, isActive = ? WHERE IDproduct = ?')
			.run(data.name, data.description, data.price, data.isActive ? 1 : 0, id);
		const row = findProduct(id) as ProductRow;
		return json(toProduct(row));
	} catch {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
