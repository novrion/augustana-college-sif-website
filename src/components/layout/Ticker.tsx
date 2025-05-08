'use client'

import { useTickerContext } from "@/contexts/TickerContext";
import { Holding } from '@/lib/types';
import "@/styles/ticker.css";

export default function Ticker() {
	const { holdings, isLoading, error } = useTickerContext();

	if (isLoading) {
		return <div className="ticker-wrapper " />
	}

	if (error) {
		return <div className="ticker-wrapper ticker-error"><span>Error: {error}</span></div>;
	}

	if (holdings.length === 0) {
		return null;
	}

	const renderHolding = (holding: Holding, index: number, keyPrefix: string) => {
		const isPositive = holding.percent_change! >= 0;
		const colorClass = isPositive ? 'positive' : 'negative';
		const arrow = isPositive ? '▲' : '▼';
		return (
			<span key={`${keyPrefix}-${holding.ticker}-${index}`} className="ticker-item">
				<span className={`ticker-symbol ${colorClass}`}>{holding.ticker}</span>
				<span className={`ticker-change ${colorClass}`}>{arrow}{Math.abs(holding.percent_change!).toFixed(2)}</span>
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