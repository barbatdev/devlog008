import { describe, expect, it } from 'vitest';
import { validateProductBody } from '$lib/server/product-validation';

describe('validateProductBody', () => {
	it('accepts a valid payload', () => {
		const body = { name: 'pantalla 24', description: '', price: 133, isActive: true };
		expect(validateProductBody(body)).toEqual(body);
	});

	it('rejects a null body', () => {
		expect(validateProductBody(null)).toBeNull();
	});

	it('rejects a non-object body', () => {
		expect(validateProductBody('product')).toBeNull();
	});

	it('rejects a payload with missing name', () => {
		expect(validateProductBody({ description: '', price: 1, isActive: true })).toBeNull();
	});

	it('rejects a payload with empty name', () => {
		expect(validateProductBody({ name: '', description: '', price: 1, isActive: true })).toBeNull();
	});

	it('rejects a payload with non-string description', () => {
		expect(validateProductBody({ name: 'a', description: 5, price: 1, isActive: true })).toBeNull();
	});

	it('rejects a payload with non-number price', () => {
		expect(validateProductBody({ name: 'a', description: '', price: '133', isActive: true })).toBeNull();
	});

	it('rejects a payload with NaN price', () => {
		expect(validateProductBody({ name: 'a', description: '', price: Number.NaN, isActive: true })).toBeNull();
	});

	it('accepts a 50-character name (VARCHAR(50) parity)', () => {
		const name = 'a'.repeat(50);
		expect(validateProductBody({ name, description: '', price: 1, isActive: true })).toEqual({
			name,
			description: '',
			price: 1,
			isActive: true
		});
	});

	it('rejects a name longer than 50 characters (VARCHAR(50) parity)', () => {
		const name = 'a'.repeat(51);
		expect(validateProductBody({ name, description: '', price: 1, isActive: true })).toBeNull();
	});

	it('rejects a non-finite (Infinity) price', () => {
		expect(
			validateProductBody({ name: 'a', description: '', price: Number.POSITIVE_INFINITY, isActive: true })
		).toBeNull();
	});

	it('rejects a price of zero', () => {
		expect(validateProductBody({ name: 'a', description: '', price: 0, isActive: true })).toBeNull();
	});

	it('rejects a negative price', () => {
		expect(validateProductBody({ name: 'a', description: '', price: -1, isActive: true })).toBeNull();
	});

	it('accepts a price with up to 6 decimal places (NUMERIC(24,6) parity)', () => {
		expect(
			validateProductBody({ name: 'a', description: '', price: 133.123456, isActive: true })
		).toEqual({ name: 'a', description: '', price: 133.123456, isActive: true });
	});

	it('rejects a price with more than 6 decimal places (NUMERIC(24,6) parity)', () => {
		expect(
			validateProductBody({ name: 'a', description: '', price: 0.1234567, isActive: true })
		).toBeNull();
	});

	it('rejects a payload with non-boolean isActive', () => {
		expect(validateProductBody({ name: 'a', description: '', price: 1, isActive: 'yes' })).toBeNull();
	});
});
