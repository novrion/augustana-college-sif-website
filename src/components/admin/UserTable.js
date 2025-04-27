'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserTable({ users }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleRoleChange = async (userId, newRole) => {
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

	const handleToggleActive = async (userId, currentStatus) => {
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
								Name
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
									<div className="text-sm font-medium font-[family-name:var(--font-geist-mono)]">
										{user.name}
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
										onChange={(e) => handleRoleChange(user.id, e.target.value)}
										disabled={isLoading}
										className="text-sm rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-gray-800 font-[family-name:var(--font-geist-mono)]"
									>
										<option value="user">User</option>
										<option value="portfolio-access">Portfolio Access</option>
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
									<button
										onClick={() => handleToggleActive(user.id, user.is_active)}
										disabled={isLoading}
										className="text-blue-500 hover:underline font-[family-name:var(--font-geist-mono)]"
									>
										{user.is_active ? 'Deactivate' : 'Activate'}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}