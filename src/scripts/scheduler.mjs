// scripts/scheduler.js
import { updateNextStockPrice } from './stock-price-scheduler/stockPriceUpdater.mjs';
import fs from 'fs';
import path from 'path';

// Configuration
const CONFIG = {
	// Update interval in milliseconds (12 seconds = 5 per minute)
	updateInterval: 12000,

	// Market hours (Eastern Time)
	marketHours: {
		start: 9, // 9 AM ET
		end: 16, // 4 PM ET
		days: [1, 2, 3, 4, 5] // Monday to Friday
	},

	// Update less frequently after hours
	afterHoursInterval: 5 * 60 * 1000, // 5 minutes

	// Log file paths
	logDir: path.resolve(process.cwd(), 'logs'),
	logFile: 'stock-updates.log',
	errorLogFile: 'stock-updates-error.log'
};

// Initialize
(function init() {
	// Create log directory if it doesn't exist
	if (!fs.existsSync(CONFIG.logDir)) {
		fs.mkdirSync(CONFIG.logDir, { recursive: true });
	}
})();

// Log helper
function log(message, isError = false) {
	const timestamp = new Date().toISOString();
	const logEntry = `[${timestamp}] ${message}\n`;

	// Output to console
	if (isError) {
		console.error(logEntry);
	} else {
		console.log(logEntry);
	}

	// Output to file
	const logFile = isError ?
		path.join(CONFIG.logDir, CONFIG.errorLogFile) :
		path.join(CONFIG.logDir, CONFIG.logFile);

	fs.appendFile(logFile, logEntry, (err) => {
		if (err) console.error('Failed to write to log file:', err);
	});
}

// Check if market is open
function isMarketOpen() {
	const now = new Date();
	const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

	// Convert to Eastern Time (rough approximation)
	const etHour = (now.getUTCHours() - 4) % 24; // Adjust for daylight saving as needed
	if (etHour < 0) etHour += 24;

	return (
		CONFIG.marketHours.days.includes(day) &&
		etHour >= CONFIG.marketHours.start &&
		etHour < CONFIG.marketHours.end
	);
}

// Get appropriate update interval
function getUpdateInterval() {
	return isMarketOpen() ? CONFIG.updateInterval : CONFIG.afterHoursInterval;
}

// Main update function
async function runUpdate() {
	try {
		const result = await updateNextStockPrice();

		if (result.success) {
			log(`✅ ${result.message}`);
		} else {
			log(`❌ ${result.message}`, true);
		}
	} catch (error) {
		log(`Fatal error in runUpdate: ${error.message}`, true);
	}

	// Schedule next update with adjusted interval
	const interval = getUpdateInterval();
	setTimeout(runUpdate, interval);

	log(`Next update scheduled in ${interval / 1000} seconds`);
}

// Start the scheduler
log('Stock price updater service started');
runUpdate();