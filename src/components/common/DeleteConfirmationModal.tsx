import Modal from '@/components/common/Modal';
import { EmptyButton, FilledButton } from "@/components/Buttons";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	isLoading?: boolean;
	itemName?: string;
	children?: React.ReactNode;
}

export default function DeleteConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Deletion",
	message = "Are you sure you want to delete this item?",
	isLoading = false,
	itemName = "",
	children
}: DeleteConfirmationModalProps) {
	const displayMessage = itemName ? `${message.replace('this item', `"${itemName}"`)}` : message;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} isLoading={isLoading}>
			<p className="text-gray-300 mb-5">{displayMessage}</p>

			{children}

			<div className="flex justify-end gap-3 mt-6">
				<EmptyButton
					onClick={onClose}
					text="Cancel"
					isLoading={false}
					type="button"
				/>
				<FilledButton
					onClick={onConfirm}
					text="Delete"
					loadingText="Deleting..."
					isLoading={isLoading}
					type="button"
				/>
			</div>
		</Modal>
	);
}