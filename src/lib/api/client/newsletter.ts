import { Newsletter, Attachment } from '@/lib/types';
import { apiFetch } from './fetch';

interface NewsletterCreateResponse {
	id: string;
	title: string;
}

interface NewsletterUpdateResponse {
	message: string;
}

interface NewsletterDeleteResponse {
	message: string;
}

interface NewsletterAttachmentResponse extends Attachment {
	message?: string;
}

interface PaginatedNewslettersResponse {
	data: Newsletter[];
	total: number;
	totalPages: number;
}

export const newsletterApi = {
	getAllNewsletters: () =>
		apiFetch<Newsletter[]>('newsletters'),

	getPaginatedNewsletters: (page = 1, pageSize = 10, year?: string | null, search?: string | null) => {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('pageSize', pageSize.toString());
		if (year) params.set('year', year);
		if (search) params.set('search', search);

		return apiFetch<PaginatedNewslettersResponse>(`newsletters?${params.toString()}`);
	},

	getNewsletterYears: () =>
		apiFetch<number[]>('newsletters/years'),

	getNewsletterById: (id: string) =>
		apiFetch<Newsletter>(`admin/newsletter/${id}`),

	createNewsletter: (newsletterData: Partial<Newsletter>) =>
		apiFetch<NewsletterCreateResponse>('admin/newsletter', {
			method: 'POST',
			body: newsletterData
		}),

	updateNewsletter: (id: string, newsletterData: Partial<Newsletter>) =>
		apiFetch<NewsletterUpdateResponse>(`admin/newsletter/${id}`, {
			method: 'PUT',
			body: newsletterData
		}),

	deleteNewsletter: (id: string) =>
		apiFetch<NewsletterDeleteResponse>(`admin/newsletter/${id}`, {
			method: 'DELETE'
		}),

	uploadAttachment: (file: File, newsletterId?: string) => {
		const formData = new FormData();
		formData.append('file', file);
		if (newsletterId) formData.append('newsletterId', newsletterId);

		return apiFetch<NewsletterAttachmentResponse>('admin/newsletter/attachment', {
			method: 'POST',
			formData
		});
	},

	deleteAttachment: (path: string) =>
		apiFetch<NewsletterAttachmentResponse>(`admin/newsletter/attachment?path=${encodeURIComponent(path)}`, {
			method: 'DELETE'
		})
};