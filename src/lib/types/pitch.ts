export interface Pitch {
	id: string;
	title: string;
	analyst: string;
	date: string;
	description?: string;
	is_buy: boolean;
	amount: number;
	company: string;
	symbol: string;
	created_at?: string;
	updated_at?: string;
}