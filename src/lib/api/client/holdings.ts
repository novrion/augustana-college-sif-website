import { Holding } from '@/lib/types';
import { apiFetch } from './fetch';

interface HoldingResponse {
	message: string;
	holding?: Holding;
}

interface SymbolLookupResult {
	symbol: string;
	displaySymbol: string;
	description: string;
	type: string;
}

interface SymbolLookupResponse {
	count: number;
	result: SymbolLookupResult[];
}

interface CashBalanceResponse {
	message: string;
}

export const holdingsApi = {
	getAllHoldings: () =>
		apiFetch<Holding[]>('holdings'),

	getHoldingById: (id: string) =>
		apiFetch<Holding>(`holdings/${id}`),

	createHolding: (holdingData: Partial<Holding>) =>
		apiFetch<HoldingResponse>('admin/holdings', {
			method: 'POST',
			body: holdingData
		}),

	updateHolding: (id: string, holdingData: Partial<Holding>) =>
		apiFetch<HoldingResponse>(`admin/holdings/${id}`, {
			method: 'POST',
			body: { ...holdingData, id }
		}),

	deleteHolding: (id: string) =>
		apiFetch<HoldingResponse>(`admin/holdings/${id}`, {
			method: 'DELETE',
			body: { id }
		}),

	updateCashBalance: (amount: number) =>
		apiFetch<CashBalanceResponse>('admin/holdings/update-cash', {
			method: 'POST',
			body: { amount }
		}),

	querySymbol: (query: string) =>
		apiFetch<SymbolLookupResponse>(`admin/holdings/query?query=${encodeURIComponent(query)}`)
};