'use client'

import { useState, useEffect } from 'react';
import { Holding } from "@/lib/types/holding"
import "@/styles/ticker.css";

export default function Ticker() {
	const [holdings, setHoldings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

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

	if (isLoading) {
		return <div className="ticker-wrapper " />
	}

	if (error) {
		return <div className="ticker-wrapper ticker-error"><span>Error: {error}</span></div>;
		// return null; // Alternatively, hide on error
	}

	if (holdings.length === 0) {
		return null;
	}

	const renderHolding = (holding: Holding, index: number, keyPrefix: string) => {
		const isPositive = holding.percent_change >= 0;
		const colorClass = isPositive ? 'positive' : 'negative';
		const arrow = isPositive ? '▲' : '▼';
		return (
			<span key={`${keyPrefix}-${holding.ticker}-${index}`} className="ticker-item">
				<span className={`ticker-symbol ${colorClass}`}>{holding.ticker}</span>
				<span className={`ticker-change ${colorClass}`}>{arrow}{Math.abs(holding.percent_change).toFixed(2)}</span>
			</span>
		);
	};

	return (
		<div className="ticker-wrapper">
			<div className="ticker">
				{holdings.map((holding, index) => renderHolding(holding, index, 'item1'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item2'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item3'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item4'))}
			</div>
		</div>
	);
}