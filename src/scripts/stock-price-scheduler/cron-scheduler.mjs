import cron from 'node-cron';
import { updateNextStockPrice } from './stockPriceUpdater.mjs';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Set up logging
const logFile = path.join(logsDir, 'stock-updates.log');

function log(message, isError = false) {
	const timestamp = new Date().toISOString();
	const logEntry = `[${timestamp}] ${message}\n`;

	// Log to console
	if (isError) {
		console.error(logEntry);
	} else {
		console.log(logEntry);
	}

	// Append to log file
	fs.appendFileSync(logFile, logEntry);
}

// Record startup
log('Stock price updater service starting with node-cron');

// Function to check if it's market hours (M-F, 9:30 AM - 4 PM ET)
function isMarketHours() {
	const now = new Date();
	const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

	// If weekend, not market hours
	if (day === 0 || day === 6) return false;

	// Convert to Eastern Time (rough approximation)
	const offset = -4; // EDT (adjust for standard time if needed)
	const hours = (now.getUTCHours() + offset + 24) % 24;
	const minutes = now.getUTCMinutes();
	const timeInMinutes = hours * 60 + minutes;

	// Market hours: 9:30 AM - 4:00 PM ET
	const marketOpen = 9 * 60 + 30;  // 9:30 AM ET
	const marketClose = 16 * 60;     // 4:00 PM ET

	return timeInMinutes >= marketOpen && timeInMinutes < marketClose;
}

// Define update schedules
const DURING_MARKET_SCHEDULE = '*/12 * * * * *'; // Every 12 seconds during market hours
const AFTER_HOURS_SCHEDULE = '*/5 * * * *';     // Every 5 minutes after hours

// Run during market hours (higher frequency)
cron.schedule(DURING_MARKET_SCHEDULE, async () => {
	if (isMarketHours()) {
		log('Running market hours update');
		try {
			await updateNextStockPrice();
		} catch (error) {
			log(`Error in stock update: ${error.message}`, true);
		}
	}
});

// Run after hours (lower frequency)
cron.schedule(AFTER_HOURS_SCHEDULE, async () => {
	if (!isMarketHours()) {
		log('Running after-hours update');
		try {
			await updateNextStockPrice();
		} catch (error) {
			log(`Error in stock update: ${error.message}`, true);
		}
	}
});

// Keep the process running
log('Scheduler running, press Ctrl+C to stop');