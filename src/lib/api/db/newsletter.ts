import { Newsletter, Attachment } from '@/lib/types';
import { getAll, getById, create, update, remove, uploadFileToBucket, deleteFileFromBucket, getPaginated, getYears, getAllAttachments } from './common';

const table = 'newsletters';

export async function getAllNewsletters(): Promise<Newsletter[]> {
	const result = await getAll(table, 'date', false);
	return result.data as Newsletter[];
}

export async function getNewsletterById(id: string): Promise<Newsletter | null> {
	return (await getById(table, id)) as Newsletter | null;
}

export async function createNewsletter(newsletter: Record<string, unknown>): Promise<Newsletter | null> {
	return (await create(table, newsletter)) as Newsletter | null;
}

export async function updateNewsletter(id: string, newsletter: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, newsletter);
}

export async function deleteNewsletter(id: string): Promise<boolean> {
	try {
		const attachments = await getAllAttachments('attachments', `newsletter_attachments/${id}`);
		for (const attachment of attachments) {
			await deleteNewsletterAttachment(attachment.path);
		}

		return await remove(table, id);
	} catch (error) {
		console.error('Error deleting newsletter and attachments:', error);
		return false;
	}
}

export async function getNewsletterAttachments(id: string): Promise<Attachment[]> {
	return await getAllAttachments('attachments', `newsletter_attachments/${id}`);
}

export async function uploadNewsletterAttachment(id: string, file: File): Promise<object | null> {
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
	const path = `newsletter_attachments/${id}/${fileName}`;
	return await uploadFileToBucket('attachments', path, file, fileName);
}

export async function deleteNewsletterAttachment(path: string): Promise<boolean> {
	return await deleteFileFromBucket('attachments', path);
}

export async function getPaginatedNewsletters(params: {
	page?: number;
	pageSize?: number;
	year?: string | null;
	search?: string | null;
}): Promise<{ data: Newsletter[]; total: number; totalPages: number }> {
	const result = await getPaginated<Record<string, unknown>>({
		table,
		...params
	});

	return {
		data: result.data as unknown as Newsletter[],
		total: result.total,
		totalPages: result.totalPages
	};
}

export async function getNewsletterYears(): Promise<number[]> {
	const newsletters = await getAllNewsletters();
	return getYears({
		items: newsletters as unknown as Record<string, unknown>[]
	});
}