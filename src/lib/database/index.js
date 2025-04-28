import * as supabaseProvider from './supabase';

// Export the current database provider
// This allows us to easily switch providers by changing this import
const dbProvider = supabaseProvider;

export const {
	// User management
	getUserByEmail,
	getUserById,
	createUser,
	updateUserRole,
	updateUserStatus,
	getAllUsers,
	verifyPassword,

	// Portfolio management
	getAllHoldings,
	getHoldingById,
	createHolding,
	updateHolding,
	deleteHolding,
	getCashBalance,
	updateCashBalance,

	// Initialize connection (if needed)
	initDb
} = dbProvider;