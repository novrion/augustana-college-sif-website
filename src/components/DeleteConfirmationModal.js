'use client';

import { useEffect, useRef } from 'react';

/**
 * Reusable delete confirmation modal
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Function} props.onConfirm - Function to call when confirming the deletion
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {boolean} props.isLoading - Whether the deletion is in progress
 * @param {string} props.itemName - Optional name of the item being deleted
 */
export default function DeleteConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Deletion",
	message = "Are you sure you want to delete this item?",
	isLoading = false,
	itemName = ""
}) {
	const modalRef = useRef(null);

	// Close when Escape is pressed
	useEffect(() => {
		const handleEsc = (e) => {
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
		const handleClickOutside = (e) => {
			if (modalRef.current && !modalRef.current.contains(e.target) && !isLoading) {
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

	// Return null if not open
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-[family-name:var(--font-geist-mono)]">
			<div
				ref={modalRef}
				className="bg-white dark:bg-gray-900 rounded-lg border border-black/[.08] dark:border-white/[.145] shadow-xl w-full max-w-md overflow-hidden"
			>
				<div className="p-6">
					<h3 className="text-lg font-semibold mb-3">{title}</h3>
					<p className="text-gray-600 dark:text-gray-300 mb-5">
						{itemName ? `${message.replace('this item', `"${itemName}"`)}` : message}
					</p>

					<div className="flex justify-end gap-3 mt-6">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4 disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={onConfirm}
							disabled={isLoading}
							className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
						>
							{isLoading ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Deleting...
								</>
							) : 'Delete'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}