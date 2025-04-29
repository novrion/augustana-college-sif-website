'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfilePicture from '../ProfilePicture';

export default function UserTable({ users }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();
	const { data: session } = useSession();

	// Check current user's role
	const isVicePresident = session?.user?.role === 'vice_president';
	const isAdmin = session?.user?.role === 'admin';
	const isPresident = session?.user?.role === 'president';

	// Role hierarchy for access control
	const roleHierarchy = {
		'admin': 3,
		'president': 2,
		'vice_president': 1,
		'portfolio-access': 0,
		'user': 0
	};

	// Get user's hierarchy level
	const getUserLevel = (role) => {
		return roleHierarchy[role] || 0;
	};

	// Current user's level
	const currentUserLevel = getUserLevel(session?.user?.role);

	const handleRoleChange = async (userId, newRole, currentRole) => {
		// Prevent changing roles if target user has higher or equal hierarchy
		const targetUserLevel = getUserLevel(currentRole);
		if (targetUserLevel >= currentUserLevel) {
			setError(`You cannot modify users with ${currentRole} role`);
			return;
		}

		// Prevent assigning roles higher than the current user's role
		const newRoleLevel = getUserLevel(newRole);
		if (newRoleLevel >= currentUserLevel) {
			setError(`You cannot assign a role higher than or equal to your own role`);
			return;
		}

		// President can't modify their own role
		if (isPresident && userId === session.user.id) {
			setError('You cannot modify your own role');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch('/api/admin/users/update-role', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					role: newRole,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update role');
			}

			// Refresh the page to show updated roles
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleActive = async (userId, currentStatus, userRole) => {
		// Prevent changing status if target user has higher or equal hierarchy
		const targetUserLevel = getUserLevel(userRole);
		if (targetUserLevel >= currentUserLevel) {
			setError(`You cannot modify users with ${userRole} role`);
			return;
		}

		// President can't deactivate themselves
		if (userId === session.user.id) {
			setError('You cannot deactivate your own account');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch('/api/admin/users/toggle-active', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					isActive: !currentStatus,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update user status');
			}

			// Refresh the page to show updated status
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to determine if user can edit a particular user
	const canEditUser = (userRole) => {
		if (!session?.user?.role) return false;

		const targetUserLevel = getUserLevel(userRole);
		const currentUserLevel = getUserLevel(session.user.role);

		// Can only edit users with lower hierarchy level
		return currentUserLevel > targetUserLevel;
	};

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] overflow-hidden">
			{error && (
				<div className="p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
					{error}
				</div>
			)}

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
					<thead className="bg-gray-50 dark:bg-gray-800">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
								User
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
								Role
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
						{users.map((user) => (
							<tr key={user.id}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="flex-shrink-0 h-10 w-10">
											<ProfilePicture
												src={user.profile_picture || '/default-avatar.svg'}
												alt={`${user.name}'s profile`}
												size="small"
											/>
										</div>
										<div className="ml-4">
											<div className="text-sm font-medium font-[family-name:var(--font-geist-mono)]">
												{user.name}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500 dark:text-gray-300 font-[family-name:var(--font-geist-mono)]">
										{user.email}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<select
										value={user.role}
										onChange={(e) => handleRoleChange(user.id, e.target.value, user.role)}
										disabled={isLoading || !canEditUser(user.role)}
										className={`text-sm rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-gray-800 font-[family-name:var(--font-geist-mono)] ${!canEditUser(user.role) ? 'opacity-60 cursor-not-allowed' : ''}`}
									>
										<option value="user">User</option>
										<option value="portfolio-access">Portfolio Access</option>
										<option value="vice_president">Vice President</option>
										<option value="president">President</option>
										<option value="admin">Admin</option>
									</select>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-[family-name:var(--font-geist-mono)] ${user.is_active
										? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
										: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
										}`}>
										{user.is_active ? 'Active' : 'Inactive'}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<div className="flex space-x-3">
										{canEditUser(user.role) && (
											<button
												onClick={() => handleToggleActive(user.id, user.is_active, user.role)}
												disabled={isLoading}
												className="cursor-pointer text-blue-500 hover:underline font-[family-name:var(--font-geist-mono)]"
											>
												{user.is_active ? 'Deactivate' : 'Activate'}
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}