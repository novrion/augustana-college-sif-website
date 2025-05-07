import { Event } from '@/lib/types';
import { apiFetch } from './fetch';

interface EventResponse {
	message: string;
}

interface PaginatedEventsResponse {
	data: Event[];
	total: number;
	totalPages: number;
}

export const eventsApi = {
	getUpcomingEvents: () =>
		apiFetch<Event[]>('events?type=upcoming'),

	getPastEvents: (page = 1, pageSize = 10) =>
		apiFetch<PaginatedEventsResponse>(`events?type=past&page=${page}&pageSize=${pageSize}`),

	getEventById: (id: string) =>
		apiFetch<Event>(`admin/events/${id}`),

	createEvent: (eventData: Partial<Event>) =>
		apiFetch<Event>('admin/events', {
			method: 'POST',
			body: eventData
		}),

	updateEvent: (id: string, eventData: Partial<Event>) =>
		apiFetch<EventResponse>(`admin/events/${id}`, {
			method: 'PUT',
			body: eventData
		}),

	deleteEvent: (id: string) =>
		apiFetch<EventResponse>(`admin/events/${id}`, {
			method: 'DELETE'
		}),

	getAllEvents: () =>
		apiFetch<Event[]>('admin/events')
};