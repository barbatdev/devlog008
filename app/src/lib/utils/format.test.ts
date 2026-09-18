import { describe, expect, it } from 'vitest';
import { formatPrice, productCellLabel } from './format';

describe('formatPrice', () => {
	it('formats an integer price with two decimals', () => {
		expect(formatPrice(133)).toBe('$133.00');
	});

	it('formats a decimal price', () => {
		expect(formatPrice(45.5)).toBe('$45.50');
	});

	it('formats zero', () => {
		expect(formatPrice(0)).toBe('$0.00');
	});

	it('groups thousands', () => {
		expect(formatPrice(1234.5)).toBe('$1,234.50');
	});
});

describe('productCellLabel', () => {
	it('returns Yes for active products', () => {
		expect(productCellLabel(true)).toBe('Yes');
	});

	it('returns No for inactive products', () => {
		expect(productCellLabel(false)).toBe('No');
	});
});
