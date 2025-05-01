import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

// Create a Supabase client with the admin key for server-side operations

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_KEY
);

/**
 * Get user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserByEmail(email) {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('email', email)
		.single();

	if (error) {
		console.error('Error fetching user by email:', error);
		return null;
	}

	return data;
}

/**
 * Get user by ID
 * @param {string} id - User's ID
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserById(id) {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching user by ID:', error);
		return null;
	}

	return data;
}

/**
 * Create a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Promise<Object|null>} Created user or null
 */
export async function createUser({ name, email, password }) {
	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const { data, error } = await supabase
		.from('users')
		.insert([
			{
				name,
				email,
				password: hashedPassword,
				role: 'user', // Default role
				is_active: true
			}
		])
		.select()
		.single();

	if (error) {
		console.error('Error creating user:', error);
		throw error;
	}

	return data;
}

/**
 * Update user role
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise<boolean>} Success status
 */
export async function updateUserRole(userId, role) {
	const { error } = await supabase
		.from('users')
		.update({ role })
		.eq('id', userId);

	if (error) {
		console.error('Error updating user role:', error);
		return false;
	}

	return true;
}

/**
 * Update user active status
 * @param {string} userId - User ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<boolean>} Success status
 */
export async function updateUserStatus(userId, isActive) {
	const { error } = await supabase
		.from('users')
		.update({ is_active: isActive })
		.eq('id', userId);

	if (error) {
		console.error('Error updating user status:', error);
		return false;
	}

	return true;
}

/**
 * Get all users
 * @returns {Promise<Array>} Array of users
 */
export async function getAllUsers() {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching all users:', error);
		return [];
	}

	return data;
}

/**
 * Verify password against stored hash
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Whether password matches
 */
export async function verifyPassword(plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Update user information
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update (name, email, description)
 * @returns {Promise<boolean>} Success status
 */
export async function updateUser(userId, userData) {
	const { error } = await supabase
		.from('users')
		.update({
			name: userData.name,
			email: userData.email,
			description: userData.description,
			phone: userData.phone
		})
		.eq('id', userId);

	if (error) {
		console.error('Error updating user:', error);
		return false;
	}

	return true;
}

/**
 * Update user password
 * @param {string} userId - User ID
 * @param {string} hashedPassword - New hashed password
 * @returns {Promise<boolean>} Success status
 */
export async function updateUserPassword(userId, hashedPassword) {
	const { error } = await supabase
		.from('users')
		.update({ password: hashedPassword })
		.eq('id', userId);

	if (error) {
		console.error('Error updating user password:', error);
		return false;
	}

	return true;
}


/**
 * Upload a profile picture
 * @param {File} file - The file to upload
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object|null>} Profile picture metadata or null
 */
export async function uploadProfilePicture(file, userId) {
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
	const filePath = `profile_pictures/${userId}/${fileName}`;

	const { error } = await supabase.storage
		.from('profile-pictures')
		.upload(filePath, file);

	if (error) {
		console.error('Error uploading profile picture:', error);
		return null;
	}

	const { data } = supabase.storage
		.from('profile-pictures')
		.getPublicUrl(filePath);

	return {
		name: fileName,
		originalName: file.name,
		url: data.publicUrl,
		path: filePath,
		type: file.type,
		size: file.size
	};
}

/**
 * Update user profile picture URL
 * @param {string} userId - User ID
 * @param {string} profilePictureUrl - URL to the profile picture
 * @returns {Promise<boolean>} Success status
 */
export async function updateUserProfilePicture(userId, profilePictureUrl) {
	const { error } = await supabase
		.from('users')
		.update({ profile_picture: profilePictureUrl })
		.eq('id', userId);

	if (error) {
		console.error('Error updating user profile picture:', error);
		return false;
	}

	return true;
}

/**
 * Get user by role
 * @param {string} role - User role to search for
 * @returns {Promise<Array>} Array of users with specified role
 */
export async function getUsersByRole(role) {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('role', role);

	if (error) {
		console.error('Error fetching users by role:', error);
		return [];
	}

	return data || [];
}

/**
 * Get leadership users (president and vice_president)
 * @returns {Promise<Object>} Object containing president and vice_president user data
 */
export async function getLeadershipUsers() {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.in('role', ['president', 'vice_president']);

	if (error) {
		console.error('Error fetching leadership users:', error);
		return { president: null, vicePresident: null };
	}

	const president = data.find(user => user.role === 'president') || null;
	const vicePresident = data.find(user => user.role === 'vice_president') || null;

	return { president, vicePresident };
}

/**
 * Create a new user with extended profile data
 * @param {Object} userData - User data (name, email, password, etc.)
 * @returns {Promise<Object|null>} Created user or null
 */
export async function createUserExtended({ name, email, password, title = '', description = '', profile_picture = null, phone = null }) {
	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const { data, error } = await supabase
		.from('users')
		.insert([
			{
				name,
				email,
				password: hashedPassword,
				role: 'user',
				is_active: true,
				title,
				description,
				profile_picture,
				phone
			}
		])
		.select()
		.single();

	if (error) {
		console.error('Error creating user:', error);
		throw error;
	}

	return data;
}





/**
 * Get all holdings
 * @returns {Promise<Array>} Array of holdings
 */
export async function getAllHoldings() {
	const { data, error } = await supabase
		.from('holdings')
		.select('*')
		.order('ticker');

	if (error) {
		console.error('Error fetching holdings:', error);
		return [];
	}

	return data || [];
}

/**
 * Get holding by ID
 * @param {string} id - Holding ID
 * @returns {Promise<Object|null>} Holding object or null
 */
export async function getHoldingById(id) {
	const { data, error } = await supabase
		.from('holdings')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching holding by ID:', error);
		return null;
	}

	return data;
}

/**
 * Create a new holding
 * @param {Object} holdingData - Holding data
 * @returns {Promise<Object|null>} Created holding or null
 */
export async function createHolding(holdingData) {
	const { data, error } = await supabase
		.from('holdings')
		.insert([holdingData])
		.select()
		.single();

	if (error) {
		console.error('Error creating holding:', error);
		return null;
	}

	return data;
}

/**
 * Update an existing holding
 * @param {string} id - Holding ID
 * @param {Object} holdingData - Updated holding data
 * @returns {Promise<boolean>} Success status
 */
export async function updateHolding(id, holdingData) {
	const { error } = await supabase
		.from('holdings')
		.update(holdingData)
		.eq('id', id);

	if (error) {
		console.error('Error updating holding:', error);
		return false;
	}

	return true;
}

/**
 * Delete a holding
 * @param {string} id - Holding ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteHolding(id) {
	const { error } = await supabase
		.from('holdings')
		.delete()
		.eq('id', id);

	if (error) {
		console.error('Error deleting holding:', error);
		return false;
	}

	return true;
}

/**
 * Get current cash balance
 * @returns {Promise<number>} Cash balance (defaults to 0)
 */
export async function getCashBalance() {
	const { data, error } = await supabase
		.from('cash_balance')
		.select('amount')
		.maybeSingle(); // Use maybeSingle to handle no rows without error

	if (error) {
		console.error('Error fetching cash balance:', error);
		return 0;
	}

	// If no record exists, return 0
	if (!data) {
		return 0;
	}

	return data.amount || 0;
}

/**
 * Update cash balance
 * @param {number} amount - New cash balance amount
 * @returns {Promise<boolean>} Success status
 */
export async function updateCashBalance(amount) {
	// First check if any cash record exists
	const { data: existingRecord } = await supabase
		.from('cash_balance')
		.select('id')
		.maybeSingle();

	let id = existingRecord?.id;

	// If no record exists, create one
	if (!id) {
		const { data: newRecord, error: insertError } = await supabase
			.from('cash_balance')
			.insert([{ amount }])
			.select('id')
			.single();

		if (insertError) {
			console.error('Error creating cash balance:', insertError);
			return false;
		}

		return true;
	}

	// Otherwise update the existing record
	const { error } = await supabase
		.from('cash_balance')
		.update({ amount })
		.eq('id', id);

	if (error) {
		console.error('Error updating cash balance:', error);
		return false;
	}

	return true;
}





/**
 * Get all meeting minutes
 * @returns {Promise<Array>} Array of meeting minutes
 */
export async function getAllMeetingMinutes() {
	const { data, error } = await supabase
		.from('meeting_minutes')
		.select('*')
		.order('date', { ascending: false });

	if (error) {
		console.error('Error fetching meeting minutes:', error);
		return [];
	}

	return data || [];
}

/**
 * Get meeting minute by ID
 * @param {string} id - Meeting minute ID
 * @returns {Promise<Object|null>} Meeting minute object or null
 */
export async function getMeetingMinuteById(id) {
	const { data, error } = await supabase
		.from('meeting_minutes')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching meeting minute by ID:', error);
		return null;
	}

	return data;
}

/**
 * Create a new meeting minute entry
 * @param {Object} meetingData - Meeting minute data
 * @returns {Promise<Object|null>} Created meeting minute or null
 */
export async function createMeetingMinute(meetingData) {
	const { data, error } = await supabase
		.from('meeting_minutes')
		.insert([meetingData])
		.select()
		.single();

	if (error) {
		console.error('Error creating meeting minute:', error);
		return null;
	}

	return data;
}

/**
 * Update an existing meeting minute
 * @param {string} id - Meeting minute ID
 * @param {Object} meetingData - Updated meeting minute data
 * @returns {Promise<boolean>} Success status
 */
export async function updateMeetingMinute(id, meetingData) {
	const { error } = await supabase
		.from('meeting_minutes')
		.update(meetingData)
		.eq('id', id);

	if (error) {
		console.error('Error updating meeting minute:', error);
		return false;
	}

	return true;
}

/**
 * Delete a meeting minute
 * @param {string} id - Meeting minute ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteMeetingMinute(id) {
	const { error } = await supabase
		.from('meeting_minutes')
		.delete()
		.eq('id', id);

	if (error) {
		console.error('Error deleting meeting minute:', error);
		return false;
	}

	return true;
}

/**
 * Get meeting minutes with pagination and filters
 * @param {Object} options - Pagination and filter options
 * @param {number} options.page - Page number (starting from 1)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.year - Filter by year (optional)
 * @param {string} options.search - Search term for title or content (optional)
 * @returns {Promise<{data: Array, total: number, totalPages: number}>} Paginated results
 */
export async function getPaginatedMeetingMinutes({
	page = 1,
	pageSize = 10,
	year = null,
	search = null
}) {
	// Calculate offset for pagination
	const offset = (page - 1) * pageSize;

	// Start building the query
	let query = supabase
		.from('meeting_minutes')
		.select('*', { count: 'exact' });

	// Apply year filter if provided
	if (year) {
		const startDate = `${year}-01-01`;
		const endDate = `${year}-12-31`;
		query = query.gte('date', startDate).lte('date', endDate);
	}

	// Apply search filter if provided
	if (search) {
		query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
	}

	// Apply pagination and ordering
	const { data, error, count } = await query
		.order('date', { ascending: false })
		.range(offset, offset + pageSize - 1);

	if (error) {
		console.error('Error fetching paginated meeting minutes:', error);
		return { data: [], total: 0, totalPages: 0 };
	}

	// Calculate total pages
	const totalPages = Math.ceil(count / pageSize);

	return {
		data: data || [],
		total: count || 0,
		totalPages
	};
}

/**
 * Get all available years that have meeting minutes
 * @returns {Promise<Array>} Array of years
 */
export async function getMeetingMinutesYears() {
	// This query uses PostgreSQL date_trunc to extract years
	const { data, error } = await supabase
		.rpc('get_meeting_minutes_years');

	if (error) {
		console.error('Error fetching meeting minute years:', error);
		return [];
	}

	return data || [];
}




// Add these functions to your existing supabase.js file

/**
 * Get all newsletters
 * @returns {Promise<Array>} Array of newsletters
 */
export async function getAllNewsletters() {
	const { data, error } = await supabase
		.from('newsletters')
		.select('*')
		.order('date', { ascending: false });

	if (error) {
		console.error('Error fetching newsletters:', error);
		return [];
	}

	return data || [];
}

/**
 * Get newsletter by ID
 * @param {string} id - Newsletter ID
 * @returns {Promise<Object|null>} Newsletter object or null
 */
export async function getNewsletterById(id) {
	const { data, error } = await supabase
		.from('newsletters')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching newsletter by ID:', error);
		return null;
	}

	return data;
}

/**
 * Create a new newsletter entry
 * @param {Object} newsletterData - Newsletter data
 * @returns {Promise<Object|null>} Created newsletter or null
 */
export async function createNewsletter(newsletterData) {
	const { data, error } = await supabase
		.from('newsletters')
		.insert([newsletterData])
		.select()
		.single();

	if (error) {
		console.error('Error creating newsletter:', error);
		return null;
	}

	return data;
}

/**
 * Update an existing newsletter
 * @param {string} id - Newsletter ID
 * @param {Object} newsletterData - Updated newsletter data
 * @returns {Promise<boolean>} Success status
 */
export async function updateNewsletter(id, newsletterData) {
	const { error } = await supabase
		.from('newsletters')
		.update(newsletterData)
		.eq('id', id);

	if (error) {
		console.error('Error updating newsletter:', error);
		return false;
	}

	return true;
}

/**
 * Delete a newsletter
 * @param {string} id - Newsletter ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteNewsletter(id) {
	const { error } = await supabase
		.from('newsletters')
		.delete()
		.eq('id', id);

	if (error) {
		console.error('Error deleting newsletter:', error);
		return false;
	}

	return true;
}

/**
 * Get newsletters with pagination and filters
 * @param {Object} options - Pagination and filter options
 * @param {number} options.page - Page number (starting from 1)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.year - Filter by year (optional)
 * @param {string} options.search - Search term for title or content (optional)
 * @returns {Promise<{data: Array, total: number, totalPages: number}>} Paginated results
 */
export async function getPaginatedNewsletters({
	page = 1,
	pageSize = 10,
	year = null,
	search = null
}) {
	// Calculate offset for pagination
	const offset = (page - 1) * pageSize;

	// Start building the query
	let query = supabase
		.from('newsletters')
		.select('*', { count: 'exact' });

	// Apply year filter if provided
	if (year) {
		const startDate = `${year}-01-01`;
		const endDate = `${year}-12-31`;
		query = query.gte('date', startDate).lte('date', endDate);
	}

	// Apply search filter if provided
	if (search) {
		query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
	}

	// Apply pagination and ordering
	const { data, error, count } = await query
		.order('date', { ascending: false })
		.range(offset, offset + pageSize - 1);

	if (error) {
		console.error('Error fetching paginated newsletters:', error);
		return { data: [], total: 0, totalPages: 0 };
	}

	// Calculate total pages
	const totalPages = Math.ceil(count / pageSize);

	return {
		data: data || [],
		total: count || 0,
		totalPages
	};
}

/**
 * Get all available years that have newsletters
 * @returns {Promise<Array>} Array of years
 */
export async function getNewsletterYears() {
	// This query uses PostgreSQL date_trunc to extract years
	const { data, error } = await supabase
		.rpc('get_newsletter_years');

	if (error) {
		console.error('Error fetching newsletter years:', error);
		return [];
	}

	return data || [];
}

/**
 * Upload a file attachment for a newsletter
 * @param {File} file - The file to upload
 * @param {string} newsletterId - The ID of the newsletter
 * @returns {Promise<Object|null>} File metadata or null
 */
export async function uploadNewsletterAttachment(file, newsletterId) {
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
	const filePath = `newsletter_attachments/${newsletterId}/${fileName}`;

	const { error } = await supabase.storage
		.from('attachments')
		.upload(filePath, file);

	if (error) {
		console.error('Error uploading file:', error);
		return null;
	}

	const { data } = supabase.storage
		.from('attachments')
		.getPublicUrl(filePath);

	return {
		name: fileName,
		originalName: file.name,
		url: data.publicUrl,
		path: filePath,
		type: file.type,
		size: file.size
	};
}

/**
 * Get attachments for a newsletter
 * @param {string} newsletterId - The ID of the newsletter
 * @returns {Promise<Array>} Array of attachment objects
 */
export async function getNewsletterAttachments(newsletterId) {
	const { data, error } = await supabase.storage
		.from('attachments')
		.list(`newsletter_attachments/${newsletterId}`);

	if (error) {
		console.error('Error fetching attachments:', error);
		return [];
	}

	return data.map(file => {
		const url = supabase.storage
			.from('attachments')
			.getPublicUrl(`newsletter_attachments/${newsletterId}/${file.name}`).data.publicUrl;

		return {
			name: file.name,
			url: url,
			path: `newsletter_attachments/${newsletterId}/${file.name}`,
			type: file.metadata?.mimetype || '',
			size: file.metadata?.size || 0
		};
	});
}

/**
 * Delete a newsletter attachment
 * @param {string} filePath - Path to the file in storage
 * @returns {Promise<boolean>} Success status
 */
export async function deleteNewsletterAttachment(filePath) {
	const { error } = await supabase.storage
		.from('attachments')
		.remove([filePath]);

	if (error) {
		console.error('Error deleting attachment:', error);
		return false;
	}

	return true;
}






// About Us management
export async function getAllAboutSections() {
	const { data, error } = await supabase
		.from('about_sections')
		.select('*')
		.order('order_index');

	if (error) {
		console.error('Error fetching about sections:', error);
		return [];
	}

	return data || [];
}

export async function getAboutSectionById(id) {
	const { data, error } = await supabase
		.from('about_sections')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching about section by id:', error);
		return null
	}

	return data
}

export async function createAboutSection(aboutSectionData) {
	const { data, error } = await supabase
		.from('about_sections')
		.insert([aboutSectionData])
		.select()
		.single();

	if (error) {
		console.error('Error creating about section:', error);
		return null;
	}

	return data;
}

export async function updateAboutSection(id, aboutSectionData) {
	const { error } = await supabase
		.from('about_sections')
		.update(aboutSectionData)
		.eq('id', id);

	if (error) {
		console.error('Error updating about section:', error);
		return false;
	}

	return true;
}

export async function deleteAboutSection(id) {
	const { error } = await supabase
		.from("about_sections")
		.delete()
		.eq("id", id);

	if (error) {
		console.error('Error deleting about section:', error);
		return false;
	}

	return true;
}






/**
 * Get the maximum order_index from gallery images
 * @returns {Promise<number>} Max order index or 0 if no images exist
 */
export async function getMaxGalleryImageOrderIndex() {
	const { data, error } = await supabase
		.from('gallery_images')
		.select('order_index')
		.order('order_index', { ascending: false })
		.limit(1);

	if (error || !data || data.length === 0) {
		return 0;
	}

	return data[0].order_index || 0;
}

/**
 * Update order_index of a gallery image
 * @param {string} id - Gallery image ID
 * @param {number} orderIndex - New order index
 * @returns {Promise<boolean>} Success status
 */
export async function updateGalleryImageOrder(id, orderIndex) {
	const { error } = await supabase
		.from('gallery_images')
		.update({ order_index: orderIndex })
		.eq('id', id);

	if (error) {
		console.error('Error updating gallery image order:', error);
		return false;
	}

	return true;
}

/**
 * Reorder a gallery image (move up or down)
 * @param {string} id - Gallery image ID to reorder
 * @param {string} direction - Direction to move ('up' or 'down')
 * @returns {Promise<boolean>} Success status
 */
export async function reorderGalleryImage(id, direction) {
	// Get the current image
	const { data: currentImage, error: currentError } = await supabase
		.from('gallery_images')
		.select('*')
		.eq('id', id)
		.single();

	if (currentError || !currentImage) {
		console.error('Error fetching current image:', currentError);
		return false;
	}

	// Find the adjacent image based on direction
	const operator = direction === 'up' ? 'lt' : 'gt';
	const ordering = direction === 'up' ? { ascending: false } : { ascending: true };

	const { data: adjacentImage, error: adjacentError } = await supabase
		.from('gallery_images')
		.select('*')
		.filter('order_index', operator, currentImage.order_index)
		.order('order_index', ordering)
		.limit(1)
		.single();

	if (adjacentError || !adjacentImage) {
		// No adjacent image means this image is already at the boundary
		return true;
	}

	// Swap order indices
	const tempOrderIndex = currentImage.order_index;

	// Update both images
	const updates = [
		updateGalleryImageOrder(currentImage.id, adjacentImage.order_index),
		updateGalleryImageOrder(adjacentImage.id, tempOrderIndex)
	];

	// Wait for both updates to complete
	const results = await Promise.all(updates);

	// Return true only if both updates succeeded
	return results.every(result => result === true);
}

/**
 * Modified version of getAllGalleryImages to respect order_index
 * @returns {Promise<Array>} Array of gallery images
 */
export async function getAllGalleryImages() {
	const { data, error } = await supabase
		.from('gallery_images')
		.select('*')
		.order('order_index', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching gallery images:', error);
		return [];
	}

	return data || [];
}

/**
 * Modified version of createGalleryImage to set initial order_index
 * @param {Object} imageData - Gallery image data
 * @returns {Promise<Object|null>} Created gallery image or null
 */
export async function createGalleryImage(imageData) {
	// Get max order index and increment by 1
	const maxOrderIndex = await getMaxGalleryImageOrderIndex();
	const newOrderIndex = maxOrderIndex + 1;

	// Add order_index to image data
	const imageWithOrder = {
		...imageData,
		order_index: newOrderIndex
	};

	const { data, error } = await supabase
		.from('gallery_images')
		.insert([imageWithOrder])
		.select()
		.single();

	if (error) {
		console.error('Error creating gallery image:', error);
		return null;
	}

	return data;
}

/**
 * Get gallery image by ID
 * @param {string} id - Gallery image ID
 * @returns {Promise<Object|null>} Gallery image object or null
 */
export async function getGalleryImageById(id) {
	const { data, error } = await supabase
		.from('gallery_images')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching gallery image by ID:', error);
		return null;
	}

	return data;
}

/**
 * Upload a gallery image
 * @param {File} file - The file to upload
 * @returns {Promise<Object|null>} Image metadata or null
 */
export async function uploadGalleryImage(file) {
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
	const filePath = `gallery_images/${fileName}`;

	const { error } = await supabase.storage
		.from('gallery')
		.upload(filePath, file);

	if (error) {
		console.error('Error uploading gallery image:', error);
		return null;
	}

	const { data } = supabase.storage
		.from('gallery')
		.getPublicUrl(filePath);

	return {
		name: fileName,
		originalName: file.name,
		url: data.publicUrl,
		path: filePath,
		type: file.type,
		size: file.size
	};
}

/**
 * Delete a gallery image
 * @param {string} id - Gallery image ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteGalleryImage(id) {
	// First get the image to get its path
	const image = await getGalleryImageById(id);

	if (!image || !image.src) {
		return false;
	}

	// Extract the path from the URL
	const urlParts = image.src.split('/');
	const fileName = urlParts[urlParts.length - 1];
	const filePath = `gallery_images/${fileName}`;

	// Delete the file from storage
	const { error: storageError } = await supabase.storage
		.from('gallery')
		.remove([filePath]);

	if (storageError) {
		console.error('Error deleting file from storage:', storageError);
		// Continue anyway to try deleting the database record
	}

	// Delete the database record
	const { error } = await supabase
		.from('gallery_images')
		.delete()
		.eq('id', id);

	if (error) {
		console.error('Error deleting gallery image:', error);
		return false;
	}

	return true;
}

/**
 * Update a gallery image
 * @param {string} id - Gallery image ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<boolean>} Success status
 */
export async function updateGalleryImage(id, updateData) {
	const { error } = await supabase
		.from('gallery_images')
		.update(updateData)
		.eq('id', id);

	if (error) {
		console.error('Error updating gallery image:', error);
		return false;
	}

	return true;
}

/**
 * Delete a gallery image file from storage
 * @param {string} url - URL of the file to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteGalleryImageFile(url) {
	try {
		// Extract the file path from the URL
		const urlObj = new URL(url);
		const pathParts = urlObj.pathname.split('/');
		const bucketName = pathParts[1]; // Usually "gallery"

		// The file path will be everything after the bucket name
		const filePath = pathParts.slice(2).join('/');

		// Delete the file from storage
		const { error } = await supabase.storage
			.from(bucketName)
			.remove([filePath]);

		if (error) {
			console.error('Error deleting gallery image file:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Error parsing URL for file deletion:', error);
		return false;
	}
}

// Add or update these functions in lib/supabase.js

/**
 * Extract file path from a Supabase storage URL
 * @param {string} url - The Supabase storage URL
 * @returns {Object|null} Object containing bucket and filePath, or null if invalid
 */
export function extractFilePathFromUrl(url) {
	try {
		if (!url) return null;

		// Match bucket and file path from URL
		// Format: https://[domain]/storage/v1/object/public/[bucket]/[filepath]
		const regex = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/;
		const match = url.match(regex);

		if (!match || match.length < 3) return null;

		return {
			bucket: match[1],
			filePath: match[2]
		};
	} catch (error) {
		console.error('Error extracting file path from URL:', error);
		return null;
	}
}

/**
 * Delete a file from Supabase storage
 * @param {string} url - URL of the file to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteFileFromStorage(url) {
	try {
		if (!url) return false;

		const fileInfo = extractFilePathFromUrl(url);
		if (!fileInfo) return false;

		const { bucket, filePath } = fileInfo;

		// Delete the file from storage
		const { error } = await supabase.storage
			.from(bucket)
			.remove([filePath]);

		if (error) {
			console.error(`Error deleting file from ${bucket}:`, error);
			return false;
		}

		console.log(`Successfully deleted file from ${bucket}: ${filePath}`);
		return true;
	} catch (error) {
		console.error('Error deleting file from storage:', error);
		return false;
	}
}

/**
 * Enhanced version of updateGalleryImage that also handles file cleanup
 * @param {string} id - Gallery image ID
 * @param {Object} updateData - Data to update
 * @param {string|null} oldImageUrl - URL of the old image to delete (if replacing)
 * @returns {Promise<boolean>} Success status
 */
export async function updateGalleryImageWithCleanup(id, updateData, oldImageUrl = null) {
	try {
		// Delete old image if provided and a new one is being set
		if (oldImageUrl && updateData.src && oldImageUrl !== updateData.src) {
			await deleteFileFromStorage(oldImageUrl);
		}

		// Update the database record
		const { error } = await supabase
			.from('gallery_images')
			.update(updateData)
			.eq('id', id);

		if (error) {
			console.error('Error updating gallery image:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Error in updateGalleryImageWithCleanup:', error);
		return false;
	}
}

/**
 * Enhanced version of uploadProfilePicture that also handles cleanup
 * @param {File} file - The file to upload
 * @param {string} userId - The ID of the user
 * @param {string|null} oldImageUrl - URL of the old profile picture to delete
 * @returns {Promise<Object|null>} Profile picture metadata or null
 */
export async function uploadProfilePictureWithCleanup(file, userId, oldImageUrl = null) {
	try {
		// Delete old profile picture if it exists
		if (oldImageUrl) {
			await deleteFileFromStorage(oldImageUrl);
		}

		// Now upload the new file
		const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
		const filePath = `profile_pictures/${userId}/${fileName}`;

		const { error } = await supabase.storage
			.from('profile-pictures')
			.upload(filePath, file);

		if (error) {
			console.error('Error uploading profile picture:', error);
			return null;
		}

		const { data } = supabase.storage
			.from('profile-pictures')
			.getPublicUrl(filePath);

		return {
			name: fileName,
			originalName: file.name,
			url: data.publicUrl,
			path: filePath,
			type: file.type,
			size: file.size
		};
	} catch (error) {
		console.error('Error in uploadProfilePictureWithCleanup:', error);
		return null;
	}
}



/**
 * Get all guest speakers
 * @returns {Promise<Array>} Array of guest speakers
 */
export async function getAllSpeakers() {
	const { data, error } = await supabase
		.from('guest_speakers')
		.select('*')
		.order('event_date', { ascending: true });

	if (error) {
		console.error('Error fetching speakers:', error);
		return [];
	}

	return data || [];
}

/**
 * Get speaker by ID
 * @param {string} id - Speaker ID
 * @returns {Promise<Object|null>} Speaker object or null
 */
export async function getSpeakerById(id) {
	const { data, error } = await supabase
		.from('guest_speakers')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching speaker by ID:', error);
		return null;
	}

	return data;
}

/**
 * Create a new guest speaker event
 * @param {Object} speakerData - Speaker data
 * @returns {Promise<Object|null>} Created speaker or null
 */
export async function createSpeaker(speakerData) {
	const { data, error } = await supabase
		.from('guest_speakers')
		.insert([speakerData])
		.select()
		.single();

	if (error) {
		console.error('Error creating speaker:', error);
		return null;
	}

	return data;
}

/**
 * Update a guest speaker event
 * @param {string} id - Speaker ID
 * @param {Object} speakerData - Updated speaker data
 * @returns {Promise<boolean>} Success status
 */
export async function updateSpeaker(id, speakerData) {
	const { error } = await supabase
		.from('guest_speakers')
		.update(speakerData)
		.eq('id', id);

	if (error) {
		console.error('Error updating speaker:', error);
		return false;
	}

	return true;
}

/**
 * Delete a guest speaker event
 * @param {string} id - Speaker ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSpeaker(id) {
	const { error } = await supabase
		.from('guest_speakers')
		.delete()
		.eq('id', id);

	if (error) {
		console.error('Error deleting speaker:', error);
		return false;
	}

	return true;
}

export async function getUpcomingSpeakers() {
	// Get current date at the start of the day (midnight) in local time
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayString = today.toISOString().split('T')[0];

	const { data, error } = await supabase
		.from('guest_speakers')
		.select('*')
		.gte('event_date', todayString)
		.order('event_date', { ascending: true });

	if (error) {
		console.error('Error fetching upcoming speakers:', error);
		return [];
	}

	return data || [];
}

export async function getPastSpeakers(page = 1, pageSize = 10) {
	// Get current date at the start of the day (midnight) in local time
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayString = today.toISOString().split('T')[0];

	// Calculate pagination offset
	const offset = (page - 1) * pageSize;

	const { data, count, error } = await supabase
		.from('guest_speakers')
		.select('*', { count: 'exact' })
		.lt('event_date', todayString)
		.order('event_date', { ascending: false })
		.range(offset, offset + pageSize - 1);

	if (error) {
		console.error('Error fetching past speakers:', error);
		return { data: [], total: 0, totalPages: 0 };
	}

	// Calculate total pages
	const totalPages = Math.ceil((count || 0) / pageSize);

	return {
		data: data || [],
		total: count || 0,
		totalPages
	};
}








/**
 * Update price for a single holding
 * @param {string} id - Holding ID
 * @param {number} currentPrice - Current stock price
 * @returns {Promise<boolean>} Success status
 */
export async function updateHoldingPrice(id, currentPrice) {
	const { error } = await supabase
		.from('holdings')
		.update({
			current_price: currentPrice,
			last_updated: new Date().toISOString()
		})
		.eq('id', id);

	if (error) {
		console.error('Error updating holding price:', error);
		return false;
	}

	return true;
}

/**
 * Get holding that was least recently updated
 * @returns {Promise<Object|null>} Holding object or null
 */
export async function getLeastRecentlyUpdatedHolding() {
	const { data, error } = await supabase
		.from('holdings')
		.select('*')
		.order('last_updated', { ascending: true })
		.limit(1)
		.single();

	if (error) {
		console.error('Error fetching least recently updated holding:', error);
		return null;
	}

	return data;
}





/**
 * Initialize database connection (not needed for Supabase)
 */
export async function initDb() {
	// No initialization needed for Supabase
	return true;
}