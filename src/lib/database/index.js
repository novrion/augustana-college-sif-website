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
	updateUser,
	updateUserPassword,
	uploadProfilePicture,
	updateUserProfilePicture,
	getUsersByRole,
	getLeadershipUsers,
	createUserExtended,
	uploadProfilePictureWithCleanup,

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

	// Gallery management
	getAllGalleryImages,
	getGalleryImageById,
	uploadGalleryImage,
	createGalleryImage,
	deleteGalleryImage,
	getMaxGalleryImageOrderIndex,
	updateGalleryImageOrder,
	reorderGalleryImage,
	updateGalleryImage,
	updateGalleryImageWithCleanup,

	// File management utilities
	extractFilePathFromUrl,
	deleteFileFromStorage,

	// Guest speaker management
	getAllSpeakers,
	getSpeakerById,
	createSpeaker,
	updateSpeaker,
	deleteSpeaker,
	getUpcomingSpeakers,
	getPastSpeakers,

	// Initialize connection (if needed)
	initDb
} = dbProvider;