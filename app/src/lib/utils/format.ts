// Pure formatting helpers shared by product UI components.

const priceFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

export function formatPrice(price: number): string {
	return priceFormatter.format(price);
}

export function productCellLabel(isActive: boolean): string {
	return isActive ? 'Yes' : 'No';
}
