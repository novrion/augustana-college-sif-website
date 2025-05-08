import { useEffect, useRef } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	isLoading?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, isLoading = false }: ModalProps) {
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
					{children}
				</div>
			</div>
		</div>
	);
}