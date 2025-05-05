'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Holding } from "@/lib/types/holding";

interface TickerContextType {
	holdings: Holding[];
	isLoading: boolean;
	error: string | null;
}

const TickerContext = createContext<TickerContextType>({
	holdings: [],
	isLoading: true,
	error: null
});

export const useTickerContext = () => useContext(TickerContext);

export function TickerProvider({ children }: { children: React.ReactNode }) {
	const [holdings, setHoldings] = useState<Holding[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchHoldings = async () => {
			try {
				const response = await fetch("/api/holdings");
				if (!response.ok) {
					throw new Error(`Failed to fetch holdings (status: ${response.status})`);
				}

				const holdings: Holding[] = await response.json();
				const validHoldings: Holding[] = holdings.filter(holding => typeof holding.percent_change === "number");
				const sortedHoldings: Holding[] = [...validHoldings].sort((a, b) => b.percent_change - a.percent_change);
				setHoldings(sortedHoldings);
			} catch (err) {
				console.error("Error fetching holdings:", err);
				setError(err.message || "Failed to load stock data");
				setHoldings([])
			} finally {
				setIsLoading(false);
			}
		};

		fetchHoldings();
		const intervalId = setInterval(fetchHoldings, 60 * 1000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<TickerContext.Provider value={{ holdings, isLoading, error }}>
			{children}
		</TickerContext.Provider>
	);
}