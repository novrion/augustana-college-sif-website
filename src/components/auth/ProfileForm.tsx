'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import ProfilePicture from '@/components/ProfilePicture';
import Form from "@/components/Form";
import { useAuth } from "@/hooks/useAuth";
import { FilledButton } from '@/components/Buttons';
import { User } from '@/lib/types/user';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

interface ProfileFormProps {
	initialUserData: User;
	session: Session;
}

export default function ProfileForm({ initialUserData, session }: ProfileFormProps) {
	const { updateSession } = useAuth();
	const router = useRouter();

	const isGoogleAccount = !!initialUserData.google_id;

	const [profileData, setProfileData] = useState({
		name: initialUserData.name || '',
		email: initialUserData.email || '',
		description: initialUserData.description || '',
		phone: initialUserData.phone || '',
		profile_picture: initialUserData.profile_picture || null,
	});
	const [isUpdating, setIsUpdating] = useState(false);
	const [profileError, setProfileError] = useState('');
	const [profileSuccess, setProfileSuccess] = useState('');

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordError, setPasswordError] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState('');

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deletePassword, setDeletePassword] = useState('');
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState('');

	const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setProfileData(prev => ({ ...prev, [name]: value }));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordData(prev => ({ ...prev, [name]: value }));
	};

	const handleProfilePictureChange = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/auth/upload-profile-picture', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload profile picture');
			}

			const data = await response.json();
			setProfileData(prev => ({ ...prev, profile_picture: data.profilePicture }));

			return data.profilePicture;
		} catch (error) {
			console.error('Error uploading profile picture:', error);
			throw error;
		}
	};

	const handleProfileUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUpdating(true);
		setProfileError('');
		setProfileSuccess('');

		try {
			const response = await fetch('/api/auth/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(profileData),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update profile');
			}

			await updateSession({
				...session,
				user: {
					...session.user,
					name: profileData.name,
					description: profileData.description,
					phone: profileData.phone,
					profile_picture: profileData.profile_picture,
				},
			});

			setProfileSuccess('Profile updated successfully');
			router.refresh();
		} catch (error) {
			setProfileError(error instanceof Error ? error.message : 'Update failed');
		} finally {
			setIsUpdating(false);
		}
	};

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordError('New passwords do not match');
			return;
		}

		setIsChangingPassword(true);
		setPasswordError('');
		setPasswordSuccess('');

		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					currentPassword: passwordData.currentPassword,
					newPassword: passwordData.newPassword,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to change password');
			}

			setPasswordSuccess('Password changed successfully');
			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error) {
			setPasswordError(error instanceof Error ? error.message : 'Password change failed');
		} finally {
			setIsChangingPassword(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (!deletePassword) {
			setDeleteError('Please enter your password');
			return;
		}

		setIsDeleting(true);
		setDeleteError('');

		try {
			const response = await fetch('/api/auth/delete-account', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					password: deletePassword,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete account');
			}

			// Sign out and redirect to home
			await signOut({ callbackUrl: '/' });
		} catch (error) {
			setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
		} finally {
			setIsDeleting(false);
		}
	};

	const openDeleteModal = () => {
		setDeletePassword('');
		setDeleteError('');
		setIsDeleteModalOpen(true);
	};

	return (
		<div className="space-y-8">
			<Form
				onSubmit={handleProfileUpdate}
				title="Profile Information"
				error={profileError}
				success={profileSuccess}
			>
				<div className="flex flex-col items-center mb-6">
					<ProfilePicture
						user={session.user as User}
						size={120}
						className="cursor-pointer"
						editable={true}
						onImageChange={handleProfilePictureChange}
					/>
					<p className="mt-4 text-sm text-gray-500">Click the image to upload a profile picture</p>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="name">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						value={profileData.name}
						onChange={handleProfileChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						value={profileData.email}
						onChange={handleProfileChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
						disabled={isGoogleAccount}
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="phone">
						Phone
					</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						value={profileData.phone}
						onChange={handleProfileChange}
						placeholder="(Optional)"
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="description">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows={4}
						value={profileData.description}
						onChange={handleProfileChange}
						placeholder="Tell us about yourself..."
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex justify-end">
					<FilledButton
						type="submit"
						text="Update Profile"
						loadingText="Updating..."
						isLoading={isUpdating}
					/>
				</div>
			</Form>

			{!isGoogleAccount && (
				<Form
					onSubmit={handlePasswordUpdate}
					title="Change Password"
					error={passwordError}
					success={passwordSuccess}
				>
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
							Current Password
						</label>
						<input
							id="currentPassword"
							name="currentPassword"
							type="password"
							value={passwordData.currentPassword}
							onChange={handlePasswordChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1" htmlFor="newPassword">
							New Password
						</label>
						<input
							id="newPassword"
							name="newPassword"
							type="password"
							value={passwordData.newPassword}
							onChange={handlePasswordChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
							Confirm New Password
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							value={passwordData.confirmPassword}
							onChange={handlePasswordChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="flex justify-end">
						<FilledButton
							type="submit"
							text="Change Password"
							loadingText="Changing..."
							isLoading={isChangingPassword}
						/>
					</div>
				</Form>
			)}

			{/* Danger Zone - Delete Account */}
			<div className="mt-12">
				<div className="rounded-lg border border-red-800 p-6">
					<h2 className="text-xl font-semibold text-red-500 mb-2">
						Danger Zone
					</h2>
					<p className="text-sm text-gray-400 mb-4">
						Once you delete your account, there is no going back. Please be certain.
					</p>
					<div className="flex justify-start">
						<button
							onClick={openDeleteModal}
							className="px-3 py-1 text-sm bg-red-600 hover:bg-red-800 text-white rounded-md transition-colors"
						>
							Delete My Account
						</button>
					</div>
				</div>
			</div>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteAccount}
				isLoading={isDeleting}
				title="Delete Account"
				message="This action cannot be undone. All your data will be permanently deleted."
			>
				<div className="my-4">
					<label className="block text-sm font-medium mb-1">
						Enter your password to confirm:
					</label>
					<input
						type="password"
						value={deletePassword}
						onChange={(e) => setDeletePassword(e.target.value)}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Password"
					/>
					{deleteError && (
						<p className="mt-2 text-sm text-red-500">{deleteError}</p>
					)}
				</div>
			</DeleteConfirmationModal>
		</div>
	);
}