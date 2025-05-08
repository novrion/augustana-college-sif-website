import { db } from './supabase';
import { getYearFromDate } from '@/lib/utils';
import { User, Holding, Newsletter, Note, AboutSection, Event, GalleryImage, Attachment } from '@/lib/types';

export interface Database {
	users: User;
	holdings: Holding;
	newsletters: Newsletter;
	notes: Note;
	about_sections: AboutSection;
	events: Event;
	gallery_images: GalleryImage;
	cash: { id: string; amount: number };
}

type Tables = keyof Database;
type TableRow<T extends Tables> = Database[T];

interface QueryResult<T> {
	data: T[];
	count?: number | null;
}

export async function getAll<T extends Tables>(
	table: T,
	orderColumn?: string,
	ascending: boolean = false,
	gte?: { column: string; cmp: string | number | boolean },
	lt?: { column: string; cmp: string | number | boolean },
	paginationRange?: { l: number; r: number },
	count?: "exact" | "planned" | "estimated"
): Promise<QueryResult<TableRow<T>>> {
	try {
		let query = db.from(table).select('*', { count: count ? count : undefined });
		if (orderColumn) { query = query.order(orderColumn, { ascending }); }
		if (gte) { query = query.gte(gte.column, gte.cmp); }
		if (lt) { query = query.lt(lt.column, lt.cmp); }
		if (paginationRange) { query = query.range(paginationRange.l, paginationRange.r); }

		const response = await query;

		if (response.error) {
			console.error(`Error fetching ${table}:`, response.error);
			return { data: [] };
		}

		if (!Array.isArray(response.data)) { return { data: [] }; }
		const validData = response.data.filter(item =>
			item !== null &&
			typeof item === 'object' &&
			!('error' in item)
		);

		return {
			data: validData as TableRow<T>[],
			count: response.count
		};
	} catch (error) {
		console.error(`Error in getAll for ${table}:`, error);
		return { data: [] };
	}
}

export async function getByField<T extends Tables>(
	table: T,
	field: string,
	value: string | number | boolean
): Promise<TableRow<T> | null> {
	try {
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
	} catch (error) {
		console.error(`Error in getByField for ${table}:`, error);
		return null;
	}
}

export async function getById<T extends Tables>(
	table: T,
	id: string
): Promise<TableRow<T> | null> {
	return await getByField(table, 'id', id);
}

export async function create<T extends Tables>(
	table: T,
	item: Record<string, unknown>
): Promise<TableRow<T> | null> {
	try {
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
	} catch (error) {
		console.error(`Error in create for ${table}:`, error);
		return null;
	}
}

export async function update<T extends Tables>(
	table: T,
	id: string,
	item: Record<string, unknown>
): Promise<boolean> {
	try {
		const { error } = await db
			.from(table)
			.update(item)
			.eq('id', id);

		if (error) {
			console.error(`Error updating ${table}:`, error);
			return false;
		}

		return true;
	} catch (error) {
		console.error(`Error in update for ${table}:`, error);
		return false;
	}
}

export async function remove<T extends Tables>(
	table: T,
	id: string
): Promise<boolean> {
	try {
		const { error } = await db
			.from(table)
			.delete()
			.eq('id', id);

		if (error) {
			console.error(`Error deleting from ${table}:`, error);
			return false;
		}

		return true;
	} catch (error) {
		console.error(`Error in remove for ${table}:`, error);
		return false;
	}
}

export async function extractUrl(
	url: string
): Promise<{ bucket: string; path: string } | null> {
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

export async function deleteFileFromBucket(
	bucket: string,
	path: string
): Promise<boolean> {
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
): Promise<Attachment | null> {
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

interface PaginationParams {
	table: string;
	page?: number;
	pageSize?: number;
	year?: string | null;
	search?: string | null;
	dateField?: string;
	searchFields?: string[];
	orderBy?: string;
	ascending?: boolean;
}

export async function getPaginated<T extends Record<string, unknown>>({
	table,
	page = 1,
	pageSize = 10,
	year = null,
	search = null,
	dateField = 'date',
	searchFields = ['title', 'content'],
	orderBy = 'date',
	ascending = false
}: PaginationParams): Promise<{ data: T[]; total: number; totalPages: number }> {
	try {
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
			table as Tables,
			orderBy,
			ascending,
			gteParam,
			ltParam,
			{ l: offset, r: offset + pageSize - 1 },
			'exact'
		);

		// Fixed type conversion by using unknown as intermediate type
		let data = result.data as unknown as T[];

		// Search filter
		if (search) {
			const searchLower = search.toLowerCase();
			data = data.filter(item => {
				return searchFields.some(field => {
					// Safe check for string values before calling toLowerCase
					const value = item[field];
					return typeof value === 'string' && value.toLowerCase().includes(searchLower);
				});
			});
		}

		return {
			data,
			total: result.count || data.length,
			totalPages: Math.ceil((result.count || data.length) / pageSize)
		};
	} catch (error) {
		console.error(`Error in getPaginated for ${table}:`, error);
		return {
			data: [],
			total: 0,
			totalPages: 0
		};
	}
}

interface YearsParams {
	items: Record<string, unknown>[];
	dateField?: string;
}

export async function getYears({
	items,
	dateField = 'date'
}: YearsParams): Promise<number[]> {
	try {
		const years = [...new Set(
			items
				.map(item => {
					const date = item[dateField];
					return typeof date === 'string' ? getYearFromDate(date) : null;
				})
				.filter((year): year is number => year !== null)
		)].sort((a, b) => b - a);

		return years;
	} catch (error) {
		console.error('Error in getYears:', error);
		return [];
	}
}