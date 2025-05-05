export interface Event {
	id: string;
	speaker_name: string;
	role?: string;
	company?: string;
	title?: string;
	date: string;
	description: string;
	location: string;
	time: string;
	contact?: string;
}