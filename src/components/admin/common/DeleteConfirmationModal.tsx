'use client';

import { useEffect, useRef } from 'react';
import { EmptyButton, FilledButton } from "@/components/Buttons";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	isLoading?: boolean;
	itemName?: string;
}

export default function DeleteConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Deletion",
	message = "Are you sure you want to delete this item?",
	isLoading = false,
	itemName = ""
}: DeleteConfirmationModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

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

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-[family-name:var(--font-geist-mono)]">
			<div
				ref={modalRef}
				className="bg-gray-900 rounded-lg border border-white/[.145] shadow-xl w-full max-w-md overflow-hidden"
			>
				<div className="p-6">
					<h3 className="text-lg font-semibold mb-3">{title}</h3>
					<p className="text-gray-300 mb-5">
						{itemName ? `${message.replace('this item', `"${itemName}"`)}` : message}
					</p>

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
				</div>
			</div>
		</div>
	);
}