export function formatCurrency(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(value);
}

export function formatPercent(value: number, addPlusSign = false): string {
	const prefix = addPlusSign && value > 0 ? '+' : '';
	return `${prefix}${value.toFixed(2)}%`;
}

export function formatFileSize(bytes: number): string {
	if (!bytes) return '';
	const units = ['B', 'KB', 'MB', 'GB'];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export function formatRole(userRole: string): string {
	return userRole
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};