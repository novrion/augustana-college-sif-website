'use client'

import { useTickerContext } from "@/contexts/TickerContext";
import { Holding } from '@/lib/types';
import "@/styles/ticker.css";

const BASE_HOLDINGS_COUNT = 40;
const BASE_DURATION_SECONDS = 120;

export default function Ticker() {
	const { holdings, isLoading, error } = useTickerContext();

	if (isLoading) {
		return <div className="ticker-wrapper " />
	}

	if (error) {
		return <div className="ticker-wrapper ticker-error"><span>Error: {error}</span></div>;
	}

	if (!holdings || holdings.length === 0) {
		return null;
	}

	const secondsPerHolding = BASE_DURATION_SECONDS / BASE_HOLDINGS_COUNT;
	const dynamicDuration = holdings.length * secondsPerHolding;
	const minDuration = 5;
	const finalDuration = Math.max(dynamicDuration, minDuration);

	const renderHolding = (holding: Holding, index: number, keyPrefix: string) => {
		const percentChange = holding.percent_change ?? 0;
		const isPositive = percentChange >= 0;
		const colorClass = isPositive ? 'positive' : 'negative';
		const arrow = isPositive ? '▲' : '▼';
		return (
			<span key={`${keyPrefix}-${holding.ticker}-${index}`} className="ticker-item">
				<span className={`ticker-symbol ${colorClass}`}>{holding.ticker}</span>
				<span className={`ticker-change ${colorClass}`}>{arrow}{Math.abs(percentChange).toFixed(2)}</span>
			</span>
		);
	};

	return (
		<div className="ticker-wrapper">
			<div
				className="ticker"
				style={{ animationDuration: `${finalDuration}s` }}
			>
				{holdings.map((holding, index) => renderHolding(holding, index, 'item1'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item2'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item3'))}
				{holdings.map((holding, index) => renderHolding(holding, index, 'item4'))}
			</div>
		</div>
	);
}