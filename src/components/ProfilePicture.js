'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ProfilePicture({ src, alt, size = 'medium', className = '', editable = false, onImageChange }) {
	const [preview, setPreview] = useState(null);
	const [imageError, setImageError] = useState(false);
	const fileInputRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Default image src
	const defaultSrc = '/default-avatar.svg';

	// Initialize preview with src value or default, and update it when src changes
	useEffect(() => {
		setPreview(src || defaultSrc);
		setImageError(false); // Reset error state when src changes
	}, [src]);

	// Determine dimensions based on size prop
	const getDimensions = () => {
		switch (size) {
			case 'small':
				return { width: 40, height: 40 };
			case 'large':
				return { width: 120, height: 120 };
			case 'xlarge':
				return { width: 180, height: 180 };
			case 'medium':
			default:
				return { width: 80, height: 80 };
		}
	};

	const { width, height } = getDimensions();

	const handleImageClick = () => {
		if (editable && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageError = () => {
		console.log("Image failed to load, using default avatar");
		setImageError(true);
		setPreview(defaultSrc);
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
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
			setPreview(reader.result);
			setImageError(false);
		};
		reader.readAsDataURL(file);

		// Call the parent handler if provided
		if (onImageChange) {
			try {
				await onImageChange(file);
				// We don't update preview here as the parent component will update the src prop
			} catch (error) {
				setError('Failed to upload image');
				setPreview(src || defaultSrc); // Revert to original on error
			}
		}

		setIsLoading(false);
	};

	// Always use a square container with equal width and height to ensure a circle
	return (
		<div className={`relative ${className} flex items-center justify-center`}>
			<div
				className={`relative rounded-full overflow-hidden ${editable ? 'cursor-pointer hover:opacity-90' : ''}`}
				style={{ width: `${width}px`, height: `${height}px` }} // Force equal dimensions
				onClick={handleImageClick}
			>
				{/* Use key to force re-render when src changes */}
				<Image
					key={imageError ? 'default' : preview}
					src={imageError ? defaultSrc : (preview || defaultSrc)}
					alt={alt || 'Profile picture'}
					width={width}
					height={height}
					className="object-cover w-full h-full" // Ensure image covers the container completely
					onError={handleImageError}
					priority // Add priority to ensure faster loading
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
				<div className="mt-2 text-sm text-red-600 absolute -bottom-6 left-0 right-0 text-center">
					{error}
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