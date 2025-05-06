import { db } from './supabase';

export async function getAll(
	table: string,
	orderColumn?: string,
	ascending: boolean = false,
	gte?: { column: string, cmp: string | number | boolean },
	lt?: { column: string, cmp: string | number | boolean },
	paginationRange?: { l: number, r: number },
	count?: string,
): Promise<{ data: unknown[], count?: number }> {
	let query = db.from(table);

	if (count) {
		query = query.select('*', { count: count });
	} else {
		query = query.select('*');
	}

	if (orderColumn) { query = query.order(orderColumn, { ascending: ascending }); }
	if (gte) { query = query.gte(gte.column, gte.cmp); }
	if (lt) { query = query.lt(lt.column, lt.cmp); }
	if (paginationRange) { query = query.range(paginationRange.l, paginationRange.r); }

	const response = await query;

	if (response.error) {
		console.error(`Error fetching ${table}:`, response.error);
		return { data: [] };
	}

	if (count) {
		return {
			data: response.data || [],
			count: response.count
		};
	}

	return { data: response.data || [] };
}

export async function getByField(
	table: string,
	field: string,
	value: string | number | boolean
): Promise<unknown | null> {
	const { data, error } = await db
		.from(table)
		.select('*')
		.eq(field, value)
		.single();

	if (error) {
		console.error(`Error fetching ${table} by ${field}:`, error);
		return null;
	}

	return data;
}

export async function getById(table: string, id: string): Promise<unknown | null> {
	return await getByField(table, 'id', id);
}

export async function create(table: string, item: Record<string, unknown>): Promise<unknown | null> {
	const { data, error } = await db
		.from(table)
		.insert([item])
		.select()
		.single();

	if (error) {
		console.error(`Error creating ${table}:`, error);
		return null;
	}

	return data;
}

export async function update(table: string, id: string, item: Record<string, unknown>): Promise<boolean> {
	const { error } = await db
		.from(table)
		.update(item)
		.eq('id', id);

	if (error) {
		console.error(`Error updating ${table}:`, error);
		return false;
	}

	return true;
}

export async function remove(table: string, id: string): Promise<boolean> {
	const { error } = await db
		.from(table)
		.delete()
		.eq('id', id);

	if (error) {
		console.error(`Error deleting from ${table}:`, error);
		return false;
	}

	return true;
}

export async function extractUrl(url: string): Promise<{ bucket: string, path: string } | null> {
	try {
		if (!url) return null;

		// Match bucket and file path from URL
		// Format: https://[domain]/storage/v1/object/public/[bucket]/[filepath]
		const regex = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/;
		const match = url.match(regex);

		if (!match || match.length < 3) return null;

		return {
			bucket: match[1],
			path: match[2]
		};
	} catch (error) {
		console.error('Error extracting file path from url:', error);
		return null;
	}
}

export async function deleteFileFromBucket(bucket: string, path: string): Promise<boolean> {
	try {
		const { error } = await db.storage
			.from(bucket)
			.remove([path]);

		if (error) {
			console.error(`Error deleting file from ${bucket}:`, error);
			return false;
		}

		return true;
	} catch (error) {
		console.error(`Error deleting file from ${bucket}:`, error);
		return false;
	}
}

export async function uploadFileToBucket(
	bucket: string,
	path: string,
	file: File,
	fileName: string
): Promise<{
	name: string,
	originalName: string,
	url: string,
	path: string,
	type: string,
	size: number
} | null> {
	try {
		const { error } = await db.storage
			.from(bucket)
			.upload(path, file);

		if (error) {
			console.error(`Error uploading file to ${bucket}:`, error);
			return null;
		}

		const { data } = db.storage
			.from(bucket)
			.getPublicUrl(path);

		return {
			name: fileName,
			originalName: file.name,
			url: data.publicUrl,
			path: path,
			type: file.type,
			size: file.size
		};
	} catch (error) {
		console.error(`Error uploading file to ${bucket}:`, error);
		return null;
	}
}



export async function getPaginated<T>({
	table,
	page = 1,
	pageSize = 10,
	year = null,
	search = null,
	dateField = 'date',
	searchFields = ['title', 'content'],
	orderBy = 'date',
	ascending = false
}: {
	table: string;
	page?: number;
	pageSize?: number;
	year?: string | null;
	search?: string | null;
	dateField?: string;
	searchFields?: string[];
	orderBy?: string;
	ascending?: boolean;
}): Promise<{ data: T[]; total: number; totalPages: number }> {
	const offset = (page - 1) * pageSize;
	let gteParam = undefined;
	let ltParam = undefined;

	if (year) {
		const startDate = `${year}-01-01`;
		const endDate = `${year}-12-31`;
		gteParam = { column: dateField, cmp: startDate };
		ltParam = { column: dateField, cmp: endDate };
	}

	const result = await getAll(
		table,
		orderBy,
		ascending,
		gteParam,
		ltParam,
		{ l: offset, r: offset + pageSize - 1 },
		'exact'
	);

	let data = result.data as T[];

	// Search filter
	if (search) {
		const searchLower = search.toLowerCase();
		data = data.filter(item => {
			return searchFields.some(field => {
				const value = item[field]?.toLowerCase();
				return value && value.includes(searchLower);
			});
		});
	}

	return {
		data,
		total: result.count || data.length,
		totalPages: Math.ceil((result.count || data.length) / pageSize)
	};
}

export async function getYears<T extends Record<string, unknown>>({
	items,
	dateField = 'date'
}: {
	items: T[];
	dateField?: string;
}): Promise<number[]> {
	const years = [...new Set(
		items
			.map(item => {
				const date = item[dateField];
				return date ? new Date(date).getFullYear() : null;
			})
			.filter(year => year !== null)
	)].sort((a, b) => b - a);

	return years;
}