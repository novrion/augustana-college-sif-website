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
			description: userData.description
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
 * Initialize database connection (not needed for Supabase)
 */
export async function initDb() {
	// No initialization needed for Supabase
	return true;
}