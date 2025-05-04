import bcrypt from 'bcrypt';
import { User, UserWithCredentials } from '@/lib/types/user';
import { getAll, getById, getByField, create, update, remove, extractUrl, uploadFileToBucket, deleteFileFromBucket } from './common';

const table = 'users';

export async function getAllUsers(): Promise<User[]> {
	const result = await getAll(table, 'created_at', false);
	return result.data as User[];
}

export async function getUserById(id: string): Promise<User | null> {
	return (await getById(table, id)) as User | null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
	return (await getByField(table, 'email', email)) as User | null;
}

export async function getUserCredentialsByEmail(email: string): Promise<UserWithCredentials | null> {
	return (await getByField(table, 'email', email)) as UserWithCredentials | null;
}

export async function createUser(userData: Record<string, unknown>): Promise<User | null> {
	const { name, email, password } = userData as { name: string, email: string, password: string };

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const userRecord = {
		name,
		email,
		password: hashedPassword,
		role: 'user',
		is_active: true
	};

	return (await create(table, userRecord)) as User | null;
}

export async function updateUser(id: string, userData: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, userData);
}

export async function updateUserPassword(id: string, password: string): Promise<boolean> {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	return await update(table, id, { password: hashedPassword });
}

export async function updateUserRole(id: string, role: string): Promise<boolean> {
	return await update(table, id, { role });
}

export async function updateUserStatus(id: string, isActive: boolean): Promise<boolean> {
	return await update(table, id, { is_active: isActive });
}

export async function updateUserProfilePicture(id: string, url: string): Promise<boolean> {
	return await update(table, id, { profile_picture: url });
}

export async function deleteUser(id: string): Promise<boolean> {
	return await remove(table, id);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
	return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function uploadProfilePicture(id: string, file: File, oldUrl: string = ''): Promise<object | null> {
	try {
		// Clean up old profile picture if it exists
		if (oldUrl) {
			const fileInfo = await extractUrl(oldUrl);
			if (fileInfo) {
				const { bucket, path } = fileInfo;
				await deleteFileFromBucket(bucket, path);
			}
		}

		// Upload new profile picture
		const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
		const path = `profile_pictures/${id}/${fileName}`;
		return await uploadFileToBucket('profile_pictures', path, file, fileName);
	} catch (error) {
		console.error('Error in uploadProfilePicture:', error);
		return null;
	}
}