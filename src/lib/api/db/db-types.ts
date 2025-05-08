import {
	User, Holding, Newsletter, Note,
	AboutSection, Event, GalleryImage
} from '@/lib/types';

export interface Database {
	users: User;
	holdings: Holding;
	newsletters: Newsletter;
	notes: Note;
	about_sections: AboutSection;
	events: Event;
	gallery_images: GalleryImage;
	cash: { id: string; amount: number; };
}

export type QueryResult<T> = {
	data: T[];
	count?: number;
};

export type TableType<T extends keyof Database> = Database[T];