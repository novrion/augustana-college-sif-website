import { User, UserRole } from '@/lib/types';
import { apiFetch } from './fetch';

interface UserResponse {
	message: string;
}

interface LeadershipResponse {
	president: User | null;
	vicePresident: User | null;
}

export const usersApi = {
	getAllUsers: () =>
		apiFetch<User[]>('admin/users'),

	getUser: (id: string) =>
		apiFetch<User>(`admin/users/${id}`),

	deleteUser: (id: string) =>
		apiFetch<UserResponse>(`admin/users/${id}`, {
			method: 'DELETE'
		}),

	updateUserRole: (id: string, role: UserRole) =>
		apiFetch<UserResponse>(`admin/users/${id}/role`, {
			method: 'PUT',
			body: { role }
		}),

	updateUserStatus: (id: string, isActive: boolean) =>
		apiFetch<UserResponse>(`admin/users/${id}/status`, {
			method: 'PUT',
			body: { isActive }
		}),

	transferRole: (newUserId: string, role: UserRole) =>
		apiFetch<UserResponse>('admin/users/transfer-role', {
			method: 'POST',
			body: { newUserId, role }
		}),

	getLeadership: () =>
		apiFetch<LeadershipResponse>('contact/leadership')
};