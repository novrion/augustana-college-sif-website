'use client';

import { useEffect, useRef, useState } from 'react';
import { UserRole } from '@/lib/types/user';
import { EmptyButton, FilledButton } from "@/components/Buttons";

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
	const modalRef = useRef<HTMLDivElement>(null);
	const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

	// Reset selected role when modal opens or current role changes
	useEffect(() => {
		setSelectedRole(currentRole);
	}, [isOpen, currentRole]);

	// Close when Escape is pressed
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen && !isLoading) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEsc);
		}

		return () => {
			document.removeEventListener('keydown', handleEsc);
		};
	}, [isOpen, onClose, isLoading]);

	// Close when clicking outside the modal
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose, isLoading]);

	// Get available roles based on current user's role
	const getAvailableRoles = (): UserRole[] => {
		// Role hierarchy (higher number = higher rank)
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

		// Filter roles that are below the current user's rank
		return Object.keys(roleRanks)
			.filter(role => roleRanks[role as UserRole] < currentUserRank)
			.map(role => role as UserRole);
	};

	// Format role for display
	const formatRoleName = (role: string): string => {
		return role
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const handleConfirm = () => {
		onConfirm(selectedRole);
	};

	if (!isOpen) return null;

	const availableRoles = getAvailableRoles();

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-[family-name:var(--font-geist-mono)]">
			<div
				ref={modalRef}
				className="bg-gray-900 rounded-lg border border-white/[.145] shadow-xl w-full max-w-md overflow-hidden"
			>
				<div className="p-6">
					<h3 className="text-lg font-semibold mb-3">{title}</h3>
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
											{formatRoleName(role)}
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
							onClick={handleConfirm}
							text="Update Role"
							loadingText="Updating..."
							isLoading={isLoading}
							type="button"
							className={availableRoles.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}