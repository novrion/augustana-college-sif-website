// app/services/galleryService.js

/**
 * This service handles gallery images data management
 * In a production environment, this would connect to a database or API
 */

// In-memory store for gallery images
let galleryImages = [
	{
		id: "img1",
		src: "/images/1.jpg",
		alt: "Stock pitch presentation",
		title: "Fall 2024 Stock Pitch",
		description: "Students presenting their analysis of Nvidia stock to the fund committee"
	},
	{
		id: "img2",
		src: "/images/2.jpg",
		alt: "Guest speaker event",
		title: "Industry Expert Talk",
		description: "Jane Doe from Morgan Stanley discussing market trends"
	},
	{
		id: "img3",
		src: "/images/3.jpg",
		alt: "Fund meeting",
		title: "Weekly Meeting",
		description: "SIF members analyzing portfolio performance"
	},
	{
		id: "img4",
		src: "/images/4.jpg",
		alt: "Market analysis",
		title: "Sector Analysis",
		description: "Deep dive into the technology sector outlook"
	},
	{
		id: "img5",
		src: "/images/5.jpg",
		alt: "Team photo",
		title: "SIF Team 2024-2025",
		description: "Current members of the Student Investment Fund"
	},
	{
		id: "img6",
		src: "/images/6.jpg",
		alt: "Investment competition",
		title: "Regional Competition",
		description: "SIF team at the Midwest Investment Challenge"
	},
	{
		id: "img7",
		src: "/images/8.png",
		alt: "Stock pitch presentation",
		title: "Spring 2025 Stock Pitch",
		description: "Students presenting their analysis of Tesla stock to the fund committee"
	},
	{
		id: "img8",
		src: "/images/9.jpg",
		alt: "Award ceremony",
		title: "Annual Awards Dinner",
		description: "Recognition of outstanding fund contributors"
	},
	{
		id: "img9",
		src: "/images/10.jpg",
		alt: "Alumni panel",
		title: "Alumni Career Panel",
		description: "Former SIF members sharing career insights"
	},
	{
		id: "img10",
		src: "/images/11.jpg",
		alt: "Executive meeting",
		title: "Executive Board Meeting",
		description: "SIF leadership planning session"
	},
];

/**
 * Get all gallery images
 * @returns {Array} Array of gallery image objects
 */
export const getAllGalleryImages = () => {
	return [...galleryImages]; // Return a copy to prevent direct modification
};

/**
 * Get a gallery image by ID
 * @param {string} id - The ID of the image to retrieve
 * @returns {Object|null} The gallery image object or null if not found
 */
export const getGalleryImageById = (id) => {
	return galleryImages.find(image => image.id === id) || null;
};

/**
 * Add a new gallery image
 * @param {Object} imageData - The image data to add
 * @returns {Object} The added gallery image
 */
export const addGalleryImage = (imageData) => {
	// Generate a unique ID if not provided
	const newImage = {
		id: imageData.id || `img${Date.now()}`,
		...imageData
	};

	galleryImages = [...galleryImages, newImage];
	return newImage;
};

/**
 * Update an existing gallery image
 * @param {string} id - The ID of the image to update
 * @param {Object} updatedData - The updated image data
 * @returns {Object|null} The updated gallery image or null if not found
 */
export const updateGalleryImage = (id, updatedData) => {
	galleryImages = galleryImages.map(image =>
		image.id === id ? { ...image, ...updatedData } : image
	);

	return getGalleryImageById(id);
};

/**
 * Delete a gallery image by ID
 * @param {string} id - The ID of the image to delete
 * @returns {Object|null} The deleted gallery image or null if not found
 */
export const deleteGalleryImage = (id) => {
	const image = getGalleryImageById(id);

	if (image) {
		galleryImages = galleryImages.filter(img => img.id !== id);
	}

	return image;
};

/**
 * Update the order of gallery images
 * @param {Array} newOrder - Array of image IDs in the new order
 * @returns {Array} The updated gallery images array
 */
export const updateGalleryOrder = (newOrder) => {
	// Create a map of images by ID for quick lookup
	const imagesMap = galleryImages.reduce((map, image) => {
		map[image.id] = image;
		return map;
	}, {});

	// Reorder the images based on the provided order
	galleryImages = newOrder.map(id => imagesMap[id]).filter(Boolean);

	return [...galleryImages];
};

/**
 * Helper function to create a new image (for the admin interface)
 * @param {Object} imageData - The image data
 * @returns {Object} The created gallery image
 */
export const createGalleryImage = (imageData) => {
	// In a real application, this would handle image uploads to a storage service
	// and generate URLs for the images

	const newImage = {
		id: `img${Date.now()}`,
		date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
		...imageData
	};

	return addGalleryImage(newImage);
};