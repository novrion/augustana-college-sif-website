'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ProfileForm({ initialUserData }) {
	const { data: session, update: updateSession } = useSession();
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: initialUserData?.name || '',
		email: initialUserData?.email || '',
		description: initialUserData?.description || '',
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [isUpdating, setIsUpdating] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [profileError, setProfileError] = useState('');
	const [profileSuccess, setProfileSuccess] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prev) => ({ ...prev, [name]: value }));
	};

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		setIsUpdating(true);
		setProfileError('');
		setProfileSuccess('');

		try {
			const response = await fetch('/api/auth/update-profile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update profile');
			}

			// Update the session with new user data
			await updateSession({
				...session,
				user: {
					...session.user,
					name: formData.name,
					description: formData.description,
				},
			});

			setProfileSuccess('Profile updated successfully');
			router.refresh();
		} catch (error) {
			setProfileError(error.message);
		} finally {
			setIsUpdating(false);
		}
	};

	const handlePasswordUpdate = async (e) => {
		e.preventDefault();
		setIsChangingPassword(true);
		setPasswordError('');
		setPasswordSuccess('');

		// Validation
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordError('New passwords do not match');
			setIsChangingPassword(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					currentPassword: passwordData.currentPassword,
					newPassword: passwordData.newPassword,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to change password');
			}

			setPasswordSuccess('Password changed successfully');
			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error) {
			setPasswordError(error.message);
		} finally {
			setIsChangingPassword(false);
		}
	};

	return (
		<div className="space-y-8">

			{/* Profile Information Form */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
				<h2 className="text-xl font-semibold mb-2">Profile Information</h2>

				{profileError && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
						{profileError}
					</div>
				)}

				{profileSuccess && (
					<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
						{profileSuccess}
					</div>
				)}

				<form onSubmit={handleProfileUpdate} className="space-y-6">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="name">
							Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="description">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows="4"
							value={formData.description}
							onChange={handleChange}
							placeholder="Tell us about yourself..."
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={isUpdating}
							className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
						>
							{isUpdating ? 'Updating...' : 'Update Profile'}
						</button>
					</div>
				</form>
			</div>

			{/* Change Password Form */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
				<h2 className="text-xl font-semibold mb-2">Change Password</h2>

				{passwordError && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
						{passwordError}
					</div>
				)}

				{passwordSuccess && (
					<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
						{passwordSuccess}
					</div>
				)}

				<form onSubmit={handlePasswordUpdate} className="space-y-6">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
							Current Password
						</label>
						<input
							id="currentPassword"
							name="currentPassword"
							type="password"
							value={passwordData.currentPassword}
							onChange={handlePasswordChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="newPassword">
							New Password
						</label>
						<input
							id="newPassword"
							name="newPassword"
							type="password"
							value={passwordData.newPassword}
							onChange={handlePasswordChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
							Confirm New Password
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							value={passwordData.confirmPassword}
							onChange={handlePasswordChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={isChangingPassword}
							className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
						>
							{isChangingPassword ? 'Changing...' : 'Change Password'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}