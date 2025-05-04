export interface Newsletter {
	id: string;
	title: string;
	date: string;
	author: string;
	content: string;
	attachments?: Attachment[];
}

export interface Attachment {
	name: string;
	originalName?: string;
	url: string;
	path: string;
	type: string;
	size: number;
}