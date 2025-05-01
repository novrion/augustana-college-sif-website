'use client';

import { useState, useEffect } from 'react';
import './StockTicker.css'; // Import the CSS file

export default function StockTicker() {
	const [holdings, setHoldings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchHoldingsData = async () => {
			// setError(null); // Optional: clear error on refetch attempt
			try {
				const response = await fetch('/api/portfolio/holdings');
				if (!response.ok) {
					throw new Error(`Failed to fetch holdings data (Status: ${response.status})`);
				}
				const data = await response.json();
				const validHoldings = data.filter(holding =>
					typeof holding.percent_change === 'number' && !isNaN(holding.percent_change)
				);
				const sortedHoldings = [...validHoldings].sort((a, b) => b.percent_change - a.percent_change);
				setHoldings(sortedHoldings);
			} catch (err) {
				console.error('Error fetching holdings data:', err);
				setError(err.message || 'Failed to load stock data');
				setHoldings([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchHoldingsData();
		const intervalId = setInterval(fetchHoldingsData, 60 * 1000);
		return () => clearInterval(intervalId);
	}, []);

	if (isLoading) {
		return <div className="ticker-wrapper " />
	}

	if (error) {
		// Decide whether to show error or hide completely
		return <div className="ticker-wrapper ticker-error"><span>Error: {error}</span></div>;
		// return null; // Alternatively, hide on error
	}

	if (holdings.length === 0) {
		return null; // Hide if no data after loading
	}

	const renderHolding = (holding, index, keyPrefix) => {
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
			{/* Render the list 4 times to ensure sufficient width for seamless scroll */}
			<div className="ticker">
				{holdings.map((holding, index) => renderHolding(holding, index, 'item1'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item2'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item3'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item4'))}
			</div>
		</div>
	);
}