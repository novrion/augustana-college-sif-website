import { useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types/user';
import { useAuth } from '@/hooks/useAuth';
import { EmptyButton, FilledButton } from "@/components/Buttons";
import StatusMessage from '@/components/common/StatusMessage';
import ProfilePicture from '@/components/ProfilePicture';
import Modal from '@/components/common/Modal';
import { formatRole } from '@/lib/utils';

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

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={`Transfer ${formatRole(role)}`} isLoading={isTransferring}>
			{error && <StatusMessage type="error" message={error} />}
			{success && <StatusMessage type="success" message={success} />}

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
		</Modal>
	);
}