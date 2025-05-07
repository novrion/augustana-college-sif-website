import { Attachment } from './attachment';

export interface Newsletter {
	id: string;
	title: string;
	date: string;
	author: string;
	content: string;
	attachments?: Attachment[];
}