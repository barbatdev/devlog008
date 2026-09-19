// Shared validation for the product API payloads.

export interface ProductData {
	name: string;
	description: string;
	price: number;
	isActive: boolean;
}

export function validateProductBody(body: unknown): ProductData | null {
	if (typeof body !== 'object' || body === null) return null;
	const b = body as Record<string, unknown>;
	// Parity oracle: migrated WinDev schema (name VARCHAR(50), price NUMERIC(24,6)).
	if (typeof b.name !== 'string' || b.name.length === 0 || b.name.length > 50) return null;
	if (typeof b.description !== 'string') return null;
	if (typeof b.price !== 'number' || !Number.isFinite(b.price) || b.price <= 0) return null;
	// NUMERIC(24,6): at most 6 decimal places.
	if (!Number.isInteger(b.price * 1e6)) return null;
	if (typeof b.isActive !== 'boolean') return null;
	return { name: b.name, description: b.description, price: b.price, isActive: b.isActive };
}
