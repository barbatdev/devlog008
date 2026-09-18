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
	if (typeof b.name !== 'string' || b.name.length === 0) return null;
	if (typeof b.description !== 'string') return null;
	if (typeof b.price !== 'number' || Number.isNaN(b.price)) return null;
	if (typeof b.isActive !== 'boolean') return null;
	return { name: b.name, description: b.description, price: b.price, isActive: b.isActive };
}
