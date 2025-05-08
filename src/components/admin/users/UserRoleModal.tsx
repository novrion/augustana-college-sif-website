import { useState, useEffect } from 'react';
import { UserRole } from '@/lib/types/user';
import { EmptyButton, FilledButton } from "@/components/Buttons";
import Modal from '@/components/common/Modal';
import { formatRole } from '@/lib/utils';

interface UserRoleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (role: UserRole) => void;
	title?: string;
	isLoading?: boolean;
	currentRole?: UserRole;
	currentUserRole?: UserRole;
	userName?: string;
}

export default function UserRoleModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Change User Role",
	isLoading = false,
	currentRole = 'user',
	currentUserRole = 'admin',
	userName = "this user"
}: UserRoleModalProps) {
	const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

	useEffect(() => {
		setSelectedRole(currentRole);
	}, [isOpen, currentRole]);

	const getAvailableRoles = (): UserRole[] => {
		const roleRanks: { [key in UserRole]: number } = {
			'admin': 4,
			'president': 3,
			'vice_president': 2,
			'secretary': 1,
			'holdings_write': 1,
			'holdings_read': 1,
			'user': 0
		};

		const currentUserRank = currentUserRole ? roleRanks[currentUserRole] : 0;

		return Object.keys(roleRanks)
			.filter(role => roleRanks[role as UserRole] < currentUserRank)
			.map(role => role as UserRole);
	};

	const availableRoles = getAvailableRoles();

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} isLoading={isLoading}>
			<p className="text-gray-300 mb-5">
				Change role for {userName}
			</p>

			<div className="space-y-4">
				{availableRoles.length > 0 ? (
					<div className="space-y-2">
						{availableRoles.map((role) => (
							<div key={role} className="flex items-center">
								<input
									type="radio"
									id={role}
									name="role"
									value={role}
									checked={selectedRole === role}
									onChange={() => setSelectedRole(role)}
									className="mr-2"
								/>
								<label htmlFor={role} className="cursor-pointer">
									{formatRole(role)}
								</label>
							</div>
						))}
					</div>
				) : (
					<p className="text-center p-2 rounded-md text-yellow-500 font-[family-name:var(--font-geist-mono)]">
						You don&apos;t have permission to assign any roles to this user.
					</p>
				)}
			</div>

			<div className="flex justify-end gap-3 mt-6">
				<EmptyButton
					onClick={onClose}
					text="Cancel"
					isLoading={false}
					type="button"
				/>
				<FilledButton
					onClick={() => onConfirm(selectedRole)}
					text="Update Role"
					loadingText="Updating..."
					isLoading={isLoading}
					type="button"
					className={availableRoles.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
				/>
			</div>
		</Modal>
	);
}