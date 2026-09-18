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

	it('rejects a payload with non-boolean isActive', () => {
		expect(validateProductBody({ name: 'a', description: '', price: 1, isActive: 'yes' })).toBeNull();
	});
});
