import { AboutSection } from '@/lib/types';
import { apiFetch } from './fetch';

interface AboutSectionResponse {
	message: string;
}

export const aboutApi = {
	getAllSections: () =>
		apiFetch<AboutSection[]>('about'),

	getSectionById: (id: string) =>
		apiFetch<AboutSection>(`admin/about/${id}`),

	createSection: (sectionData: Partial<AboutSection>) =>
		apiFetch<AboutSection>('admin/about', {
			method: 'POST',
			body: sectionData
		}),

	updateSection: (id: string, sectionData: Partial<AboutSection>) =>
		apiFetch<AboutSectionResponse>(`admin/about/${id}`, {
			method: 'PUT',
			body: sectionData
		}),

	deleteSection: (id: string) =>
		apiFetch<AboutSectionResponse>(`admin/about/${id}`, {
			method: 'DELETE'
		}),

	reorderSection: (id: string, direction: 'up' | 'down') =>
		apiFetch<AboutSectionResponse>(`admin/about/reorder/${id}`, {
			method: 'POST',
			body: { direction }
		})
};