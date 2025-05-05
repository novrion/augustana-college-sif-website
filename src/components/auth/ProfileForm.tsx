'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfilePicture from '@/components/ProfilePicture';
import Form from "@/components/Form";
import { useAuth } from "@/hooks/auth/useAuth";
import { FilledButton } from '../Buttons';

interface ProfileFormProps {
	initialUserData;
	session;
}

export default function ProfileForm({ initialUserData, session }: ProfileFormProps) {
	const { updateSession } = useAuth();
	const router = useRouter();

	const [isUpdating, setIsUpdating] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	const [profileError, setProfileError] = useState('');
	const [profileSuccess, setProfileSuccess] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState('');

	const [formData, setFormData] = useState({
		name: initialUserData.name || '',
		email: initialUserData.email || '',
		description: initialUserData.description || '',
		phone: initialUserData.phone || '',
		profile_picture: initialUserData.profile_picture || null,
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prev) => ({ ...prev, [name]: value }));
	};

	const handleProfilePictureChange = async (file: File) => {
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
			if (!response.ok) { throw new Error(data.error || 'Failed to update profile'); }

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
			if (!response.ok) { throw new Error(data.error || 'Failed to change password'); }

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
			<Form
				onSubmit={handleProfileUpdate}
				title={"Profile Information"}
				error={profileError}
				success={profileSuccess}
				className="space-y-6"
			>
				<div className="flex flex-col items-center mb-6">
					<ProfilePicture
						user={session.user}
						size={120}
						className="cursor-pointer"
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
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="description">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows={4}
						value={formData.description}
						onChange={handleChange}
						placeholder="Tell us about yourself..."
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex justify-end">
					<FilledButton
						type={"submit"}
						text={"Update Profile"}
						loadingText={"Updating..."}
						isLoading={isUpdating}
					/>
				</div>
			</Form>

			<Form
				onSubmit={handlePasswordUpdate}
				title={"Change Password"}
				error={passwordError}
				success={passwordSuccess}
				className="space-y-6"
			>
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
					<FilledButton
						type={"submit"}
						text={"Change Password"}
						loadingText={"Changing..."}
						isLoading={isChangingPassword}
					/>
				</div>
			</Form>
		</div >
	);
}