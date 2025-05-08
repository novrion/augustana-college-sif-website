export function formatDateForInput(dateString?: string): string {
	if (!dateString) {
		// Get today's date in YYYY-MM-DD format
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// Create date object with UTC noon time to avoid timezone issues
	const date = new Date(`${dateString}T12:00:00Z`);
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(
	dateString: string,
	options: {
		format?: 'short' | 'medium' | 'long' | 'full';
		includeWeekday?: boolean;
	} = {}
): string {
	if (!dateString) return 'Date not available';

	const { format = 'medium', includeWeekday = false } = options;

	// Create date object with UTC noon time to avoid timezone issues
	const date = new Date(`${dateString}T12:00:00Z`);

	const formatOptions: Intl.DateTimeFormatOptions = {
		timeZone: 'UTC',
		year: 'numeric',
		month: format === 'short' ? 'short' : 'long',
		day: 'numeric',
	};

	if (includeWeekday) {
		formatOptions.weekday = 'long';
	}

	return date.toLocaleDateString('en-US', formatOptions);
}

export function isPastDate(dateString: string): boolean {
	if (!dateString) return false;

	const eventDate = new Date(`${dateString}T12:00:00Z`);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return eventDate < today;
}

export function getYearFromDate(dateString: string): number {
	const date = new Date(`${dateString}T12:00:00Z`);
	return date.getUTCFullYear();
}