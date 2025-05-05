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
		const eventDate = new Date(dateString);
		eventDate.setHours(23, 59, 59, 999);
		return eventDate < new Date();
	};

	const formatDate = (dateString: string): string => {
		if (!dateString) return 'Date not available';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
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