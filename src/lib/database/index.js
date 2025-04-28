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

	// Meeting minutes management
	getAllMeetingMinutes,
	getMeetingMinuteById,
	createMeetingMinute,
	updateMeetingMinute,
	deleteMeetingMinute,
	getPaginatedMeetingMinutes,
	getMeetingMinutesYears,

	// Newsletter management
	getAllNewsletters,
	getNewsletterById,
	createNewsletter,
	updateNewsletter,
	deleteNewsletter,
	getPaginatedNewsletters,
	getNewsletterYears,
	uploadNewsletterAttachment,
	getNewsletterAttachments,
	deleteNewsletterAttachment,

	// About Us management
	getAllAboutSections,
	getAboutSectionById,
	createAboutSection,
	updateAboutSection,
	deleteAboutSection,

	// Initialize connection (if needed)
	initDb
} = dbProvider;