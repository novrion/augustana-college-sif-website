'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfilePicture from '@/components/ProfilePicture';

export default function ProfileForm({ initialUserData }) {
	const { data: session, update: updateSession } = useSession();
	const router = useRouter();

	// Ensure profile picture uses the correct property name (profile_picture)
	const [formData, setFormData] = useState({
		name: initialUserData?.name || '',
		email: initialUserData?.email || '',
		description: initialUserData?.description || '',
		phone: initialUserData?.phone || '',
		profile_picture: initialUserData?.profile_picture || null,
	});

	// Log the initial user data to debug
	useEffect(() => {
		console.log("Initial user data:", initialUserData);
		console.log("Profile picture value:", initialUserData?.profile_picture || 'No profile picture');
	}, [initialUserData]);

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

	const handleProfilePictureChange = async (file) => {
		try {
			const formDataObj = new FormData();
			formDataObj.append('file', file);

			const response = await fetch('/api/auth/upload-profile-picture', {
				method: 'POST',
				body: formDataObj,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload profile picture');
			}

			const data = await response.json();
			console.log("Upload response:", data);

			// Use profile_picture property to match the database field name
			setFormData(prev => ({ ...prev, profile_picture: data.profilePicture }));
			console.log("Updated profile picture in state:", data.profilePicture);

			return data.profilePicture;
		} catch (error) {
			console.error('Error uploading profile picture:', error);
			throw error;
		}
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
					phone: formData.phone,
					profile_picture: formData.profile_picture,
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
				<h2 className="text-xl font-semibold mb-2 font-[family-name:var(--font-geist-mono)]">Profile Information</h2>
				<form onSubmit={handleProfileUpdate} className="space-y-6">
					{profileError && (
						<div className="mt-4 mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
							{profileError}
						</div>
					)}

					{profileSuccess && (
						<div className="mt-4 mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
							{profileSuccess}
						</div>
					)}

					<div className="flex flex-col items-center mb-6">
						{/* Fixed dimensions to match exactly, not contained in a parent div that could distort proportions */}
						<ProfilePicture
							src={formData.profile_picture}
							alt={`${formData.name}'s profile picture`}
							size="large"
							editable={true}
							onImageChange={handleProfilePictureChange}
						/>
						<p className="mt-4 text-sm text-gray-500">Click the image to upload a profile picture</p>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="name">
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
						<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="email">
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
						<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="phone">
							Phone
						</label>
						<input
							id="phone"
							name="phone"
							type="tel"
							value={formData.phone}
							onChange={handleChange}
							placeholder="(Optional)"
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="description">
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
				<h2 className="text-xl font-semibold mb-2 font-[family-name:var(--font-geist-mono)]">Change Password</h2>

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
						<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="currentPassword">
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
						<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="newPassword">
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
						<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="confirmPassword">
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