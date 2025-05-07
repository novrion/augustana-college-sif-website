import { User } from '@/lib/types';
import { apiFetch } from './fetch';

interface LoginResponse {
	user: User;
}

interface RegisterResponse {
	user: User;
	message: string;
}

interface ProfileUpdateResponse {
	message: string;
}

interface PasswordChangeResponse {
	message: string;
}

interface ProfilePictureResponse {
	profilePicture: string;
	message: string;
}

export const authApi = {
	register: (name: string, email: string, password: string) =>
		apiFetch<RegisterResponse>('auth/register', {
			method: 'POST',
			body: { name, email, password }
		}),

	updateProfile: (data: Partial<User>) =>
		apiFetch<ProfileUpdateResponse>('auth/profile', {
			method: 'PUT',
			body: data
		}),

	uploadProfilePicture: (file: File) => {
		const formData = new FormData();
		formData.append('file', file);

		return apiFetch<ProfilePictureResponse>('auth/upload-profile-picture', {
			method: 'POST',
			formData
		});
	},

	changePassword: (currentPassword: string, newPassword: string) =>
		apiFetch<PasswordChangeResponse>('auth/change-password', {
			method: 'POST',
			body: { currentPassword, newPassword }
		}),
};