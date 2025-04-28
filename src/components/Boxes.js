'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Base Box component that provides common styling and structure
 * Can be used directly or extended by more specialized box components
 */
export function BoxBase({
	children,
	className = "",
	onClick = null,
	hoverEffect = true
}) {
	return (
		<div
			className={`rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 ${hoverEffect ? "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors" : ""
				} ${className}`}
			onClick={onClick}
		>
			{children}
		</div>
	);
}

/**
 * Feature Box component used for homepage feature listings
 * Extended from the base BoxBase component
 */
export function FeatureBox({ title, description, link, linkText }) {
	const router = useRouter();

	const handleClick = () => {
		router.push(link)
	};

	return (
		<BoxBase onClick={handleClick} className="cursor-pointer">
			<h3 className="text-xl font-semibold mb-3">
				{title}
			</h3>
			<p className="mb-4">
				{description}
			</p>
			<Link
				className="text-blue-500 hover:underline font-medium"
				href={link}
			>
				{linkText} →
			</Link>
		</BoxBase>
	);
}

export function MeetingBox({ id, title, date, publisher, excerpt }) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/meeting-minutes/${id}`);
	};

	return (
		<BoxBase onClick={handleClick} className="cursor-pointer">
			<div className="mb-4">
				<h2 className="text-xl font-semibold font-[family-name:var(--font-geist-mono)]">
					{title}
				</h2>

				<div className="flex flex-col mt-2 text-sm text-gray-500 dark:text-gray-400">
					<span className="mb-1">{date}</span>
					<span>{publisher}</span>
				</div>
			</div>

			<div className="prose prose-sm max-w-none dark:prose-invert">
				<p>{excerpt}</p>
			</div>
		</BoxBase>
	);
}



export function NewsletterBox({ id, title, date, author, excerpt }) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/newsletter/${id}`);
	};

	return (
		<BoxBase onClick={handleClick} className="cursor-pointer">
			<div className="mb-4">
				<h2 className="text-xl font-semibold font-[family-name:var(--font-geist-mono)]">
					{title}
				</h2>
				<div className="flex flex-col mt-2 text-sm text-gray-500 dark:text-gray-400">
					<span className="mb-1">{date}</span>
					<span>{author}</span>
				</div>
			</div>
		</BoxBase >
	);

	//	<div className="prose prose-sm max-w-none dark:prose-invert">
	//		<p>{excerpt}</p>
	//	</div>
}




/**
 * Speaker Event Box component for displaying guest speaker events
 * Includes collapsible details and styling based on past/upcoming status
 * Extended from the base BoxBase component
 */
export function SpeakerEventBox({ id, title, speaker, role, company, date, description, past, details }) {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	// Format the date
	const eventDate = new Date(date);
	const formattedDate = eventDate.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	// Determine if the event is upcoming or past
	const isPast = past || (new Date() > eventDate);

	return (
		<BoxBase className={isPast ? "border-l-4 border-l-gray-400" : "border-l-4 border-l-blue-500"}>
			<div
				className="flex justify-between items-start cursor-pointer"
				onClick={toggleExpand}
			>
				<div>
					<h2 className="text-xl font-semibold font-[family-name:var(--font-geist-mono)]">
						{title}
					</h2>
					<div className="mt-1">
						<p className="font-medium">
							{speaker}, {role} at {company}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
							{formattedDate}
						</p>
						{!isPast && (
							<span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
								Upcoming
							</span>
						)}
					</div>
				</div>
				<button
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
					aria-label={isExpanded ? "Collapse" : "Expand"}
				>
					{isExpanded ? (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="18 15 12 9 6 15"></polyline>
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					)}
				</button>
			</div>

			{isExpanded && (
				<div className="mt-4 pt-4 border-t border-black/[.08] dark:border-white/[.145]">
					<div className="prose prose-sm max-w-none dark:prose-invert">
						<p className="mb-4">{description}</p>
						{details && Object.entries(details).map(([key, value], index) => (
							<div key={index} className="mb-2">
								<strong>{key}:</strong> {value}
							</div>
						))}
					</div>

					{!isPast && (
						<div className="mt-4 pt-4 border-t border-black/[.08] dark:border-white/[.145]">
							<h3 className="text-md font-semibold mb-2">RSVP for this event</h3>
							<div className="flex gap-4">
								<button
									className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
								>
									RSVP Now
								</button>
								<button
									className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
								>
									Add to Calendar
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</BoxBase>
	);
}


/**
 * Generic BoxGrid component that accepts any type of box components as children
 * Can be used with any box component that follows the box design pattern
 */
export function BoxGrid({ children, className = "" }) {
	return (
		<div className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full ${className}`}>
			{children}
		</div>
	);
}