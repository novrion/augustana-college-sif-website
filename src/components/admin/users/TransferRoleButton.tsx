'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FilledButton } from "@/components/Buttons";
import TransferRoleModal from './TransferRoleModal';

export default function TransferRoleButton() {
	const { session } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const currentUserRole = session?.user?.role;

	if (currentUserRole !== 'president' && currentUserRole !== 'vice_president') {
		return null;
	}

	return (
		<>
			<FilledButton
				onClick={() => setIsModalOpen(true)}
				text={`Transfer ${currentUserRole === 'president' ? 'Presidency' : 'Vice Presidency'}`}
				isLoading={false}
				type="button"
			/>

			<TransferRoleModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				role={currentUserRole}
			/>
		</>
	);
}