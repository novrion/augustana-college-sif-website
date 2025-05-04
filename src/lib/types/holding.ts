export interface Holding {
	id: string;
	ticker: string;
	company_name: string;
	sector?: string;
	share_count: number;
	cost_basis: number;
	current_price: number;
	purchase_date: string;
	last_updated?: string;
	percent_change?: number;
}