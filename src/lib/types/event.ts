export interface Event {
	id: string;
	speaker_name: string;
	role?: string;
	company?: string;
	title?: string;
	event_date: string;
	description: string;
	location: string;
	time: string;
	contact?: string;
}