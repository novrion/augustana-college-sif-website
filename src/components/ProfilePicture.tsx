'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { User } from "@/lib/types/user";
import StatusMessage from "@/components/common/StatusMessage";

interface ProfilePictureProps {
	user: User | undefined;
	size: number;
	className?: string;
	editable?: boolean;
	onImageChange?: (file: File) => Promise<string | void>;
}

export default function ProfilePicture({
	user,
	size,
	className = '',
	editable = false,
	onImageChange
}: ProfilePictureProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [imageError, setImageError] = useState<boolean>(false);

	const defaultSrc = '/avatar.svg';
	const src = user?.profile_picture;
	const alt = user?.name || 'Profile picture';

	// Initialize preview and reset when src changes
	useEffect(() => {
		setPreview(src || defaultSrc);
		setImageError(false);
	}, [src]);

	const handleImageClick = (): void => {
		if (editable && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageError = (): void => {
		setImageError(true);
		setPreview(defaultSrc);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = e.target.files?.[0];
		if (!file) return;

		// File validation
		const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			setError('Please select a valid image file (JPEG, PNG, or GIF)');
			return;
		}

		const maxSize = 3 * 1024 * 1024; // 3MB
		if (file.size > maxSize) {
			setError('Image must be less than 3MB');
			return;
		}

		setIsLoading(true);
		setError('');

		// Create a local preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
			setImageError(false);
		};
		reader.readAsDataURL(file);

		// Call the parent handler if provided
		if (onImageChange) {
			try {
				await onImageChange(file);
			} catch (error) {
				setError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
				setPreview(src || defaultSrc); // Revert to original on error
			}
		}

		setIsLoading(false);
	};

	return (
		<div className={`relative ${className}`}>
			<div
				className={`relative rounded-full overflow-hidden ${editable ? 'cursor-pointer hover:opacity-90' : ''}`}
				style={{ width: `${size}px`, height: `${size}px` }}
				onClick={handleImageClick}
			>
				<Image
					key={imageError ? 'default' : preview || 'placeholder'}
					src={imageError ? defaultSrc : (preview || defaultSrc)}
					alt={alt}
					width={size}
					height={size}
					quality={100}
					className="object-cover w-full h-full"
					onError={handleImageError}
					priority
				/>

				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
						<div className="w-8 h-8 border-4 border-t-blue-500 border-white border-opacity-30 rounded-full animate-spin"></div>
					</div>
				)}

				{editable && (
					<div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0)] hover:bg-[rgba(0,0,0,0.4)] transition-colors duration-200 ease-in-out"></div>
				)}
			</div>

			{error && (
				<div className="absolute -bottom-6 left-0 right-0">
					<StatusMessage type="error" message={error} className="mt-2 text-sm" />
				</div>
			)}

			{editable && (
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/jpeg,image/png,image/gif"
					className="hidden"
				/>
			)}
		</div>
	);
}