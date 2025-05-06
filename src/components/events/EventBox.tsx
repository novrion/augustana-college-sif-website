'use client';

import { useState } from 'react';
import { Event } from '@/lib/types/event';
import { useRouter } from 'next/navigation';

interface EventBoxProps {
	event: Event;
}

export default function EventBox({ event }: EventBoxProps) {
	const router = useRouter();
	const [isExpanded, setIsExpanded] = useState(false);

	const isPastEvent = (dateString: string): boolean => {
		if (!dateString) return false;
		// Parse date with a fixed time component to avoid timezone issues
		const eventDate = new Date(`${dateString}T12:00:00Z`);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return eventDate < today;
	};

	const formatDate = (dateString: string): string => {
		if (!dateString) return 'Date not available';
		// Create date with noon UTC time to ensure consistent date representation
		const date = new Date(`${dateString}T12:00:00Z`);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC' // Ensure the date is interpreted in UTC
		});
	};

	const isPast = isPastEvent(event.date);

	const handleClick = () => {
		router.push(`/events/${event.id}`);
	};

	const handleExpandToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	return (
		<div
			onClick={handleClick}
			className={`rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] cursor-pointer ${isPast ? "border-l-4 border-l-gray-400" : "border-l-4 border-l-blue-500"}`}
		>
			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-xl font-semibold font-[family-name:var(--font-geist-mono)]">
						{event.title || `Speaker: ${event.speaker_name}`}
					</h2>
					<div className="mt-1 font-[family-name:var(--font-geist-sans)]">
						<p className="font-medium">
							{event.speaker_name}
							{event.role && event.company && (
								<span>, {event.role} at {event.company}</span>
							)}
							{event.role && !event.company && (
								<span>, {event.role}</span>
							)}
							{!event.role && event.company && (
								<span>, {event.company}</span>
							)}
						</p>
						<p className="text-sm text-gray-400 mt-1">
							{formatDate(event.date)}
						</p>
						{!isPast && (
							<span className="inline-block mt-2 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs font-semibold">
								Upcoming
							</span>
						)}
					</div>
				</div>
				<button
					onClick={handleExpandToggle}
					className="p-2 hover:bg-[#1a1a1a] rounded-full"
					aria-label={isExpanded ? "Collapse" : "Expand"}
				/>
			</div>

			{isExpanded && (
				<div
					className="mt-4 pt-4 border-t border-white/[.145] font-[family-name:var(--font-geist-sans)]"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="prose prose-sm max-w-none">
						<p className="mb-4">{event.description}</p>
						<div className="space-y-2">
							<div><strong>Location:</strong> {event.location}</div>
							<div><strong>Time:</strong> {event.time}</div>
							{event.contact && <div><strong>Contact:</strong> {event.contact}</div>}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}