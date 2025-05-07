'use client';

import { useEffect, useRef, useState } from 'react';
import { User, UserRole } from '@/lib/types/user';
import { useAuth } from '@/hooks/useAuth';
import { EmptyButton, FilledButton } from "@/components/Buttons";
import ProfilePicture from '@/components/ProfilePicture';

interface TransferRoleModalProps {
	isOpen: boolean;
	onClose: () => void;
	role: UserRole;
}

export default function TransferRoleModal({
	isOpen,
	onClose,
	role
}: TransferRoleModalProps) {
	const { session } = useAuth();
	const modalRef = useRef<HTMLDivElement>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUserId, setSelectedUserId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isTransferring, setIsTransferring] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (isOpen) {
			const fetchUsers = async () => {
				setIsLoading(true);
				try {
					const response = await fetch('/api/admin/users');
					if (!response.ok) { throw new Error('Failed to fetch users'); }

					const allUsers = await response.json();
					const eligibleUsers = allUsers.filter((user: User) => {
						if (user.id === session?.user?.id) return false;
						if (!user.is_active) return false;
						return !['president', 'vice_president', 'admin'].includes(user.role);
					});

					setUsers(eligibleUsers);
					setError('');
				} catch (err) {
					console.error('Error fetching users:', err);
					setError('Failed to load users');
				} finally {
					setIsLoading(false);
				}
			};

			fetchUsers();
		} else {
			setSelectedUserId('');
			setError('');
			setSuccess('');
		}
	}, [isOpen, session?.user?.id]);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen && !isTransferring) {
				onClose();
			}
		};

		if (isOpen) { document.addEventListener('keydown', handleEsc); }
		return () => { document.removeEventListener('keydown', handleEsc); };
	}, [isOpen, onClose, isTransferring]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isTransferring) {
				onClose();
			}
		};

		if (isOpen) { document.addEventListener('mousedown', handleClickOutside); }
		return () => { document.removeEventListener('mousedown', handleClickOutside); };
	}, [isOpen, onClose, isTransferring]);

	const handleTransfer = async () => {
		if (!selectedUserId) {
			setError('Please select a user first');
			return;
		}

		setError('');
		setSuccess('');
		setIsTransferring(true);

		try {
			const response = await fetch('/api/admin/users/transfer-role', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					newUserId: selectedUserId,
					role: role
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to transfer role');
			}

			setSuccess(`Role transferred successfully!`);

			// Refresh page after a delay to show updated roles
			setTimeout(() => { window.location.reload(); }, 2000);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsTransferring(false);
		}
	};

	const formatRole = (userRole: string): string => {
		return userRole
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-[family-name:var(--font-geist-mono)]">
			<div
				ref={modalRef}
				className="bg-gray-900 rounded-lg border border-white/[.145] shadow-xl w-full max-w-md overflow-hidden"
			>
				<div className="p-6">
					<h3 className="text-lg font-semibold mb-3">Transfer {formatRole(role)}</h3>

					{error && (
						<div className="text-center p-4 rounded-md text-red-700 mb-4 font-[family-name:var(--font-geist-mono)]">
							{error}
						</div>
					)}

					{success && (
						<div className="text-center p-4 rounded-md text-green-500 mb-4 font-[family-name:var(--font-geist-mono)]">
							{success}
						</div>
					)}

					<p className="text-gray-300 mb-5">
						Select a user to transfer your role to. This action cannot be undone.
					</p>

					{isLoading ? (
						<div className="flex justify-center py-4">
							<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
						</div>
					) : (
						<>
							{users.length === 0 ? (
								<div className="text-center p-4 bg-gray-800 rounded-md text-gray-400 mb-4">
									No eligible users found. Please ensure there are active users who can receive this role.
								</div>
							) : (
								<div className="space-y-4">
									<label className="block text-sm font-medium mb-1">
										Select User
									</label>
									<select
										value={selectedUserId}
										onChange={(e) => setSelectedUserId(e.target.value)}
										className="w-full px-3 py-2 border border-white/[.145] bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="">-- Select a user --</option>
										{users.map((user) => (
											<option key={user.id} value={user.id}>
												{user.name} ({user.email})
											</option>
										))}
									</select>

									{selectedUserId && (
										<div className="flex items-center mt-4 p-4 bg-gray-800 rounded-md">
											<ProfilePicture
												user={users.find(u => u.id === selectedUserId)}
												size={40}
											/>
											<div className="ml-4">
												<p className="font-medium">
													{users.find(u => u.id === selectedUserId)?.name}
												</p>
												<p className="text-sm text-gray-400">
													Current role: {formatRole(users.find(u => u.id === selectedUserId)?.role || 'user')}
												</p>
											</div>
										</div>
									)}
								</div>
							)}
						</>
					)}

					<div className="flex justify-end gap-3 mt-6">
						<EmptyButton
							onClick={onClose}
							text="Cancel"
							isLoading={false}
							type="button"
						/>
						<FilledButton
							onClick={handleTransfer}
							text="Transfer Role"
							loadingText="Transferring..."
							isLoading={isTransferring}
							type="button"
							className={(!selectedUserId || users.length === 0) ? "opacity-50 cursor-not-allowed" : ""}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}