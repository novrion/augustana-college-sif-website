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