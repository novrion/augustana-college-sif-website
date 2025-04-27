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
 * Initialize database connection (not needed for Supabase)
 */
export async function initDb() {
	// No initialization needed for Supabase
	return true;
}