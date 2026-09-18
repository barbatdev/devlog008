// REST API migrated from the WinDev WEBDEV webservice (class Mproduct).
// GET /api/product        -> ReadAll
// POST /api/product       -> Creation

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { validateProductBody } from '$lib/server/product-validation';
import type { Product } from '$lib/types';

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

export const GET: RequestHandler = async () => {
	try {
		const rows = db.prepare('SELECT * FROM product').all() as ProductRow[];
		return json(rows.map(toProduct));
	} catch {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
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
		const result = db
			.prepare('INSERT INTO product (name, description, price, isActive) VALUES (?, ?, ?, ?)')
			.run(data.name, data.description, data.price, data.isActive ? 1 : 0);
		const row = db
			.prepare('SELECT * FROM product WHERE IDproduct = ?')
			.get(result.lastInsertRowid) as ProductRow;
		return json(toProduct(row), { status: 201 });
	} catch {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
