'use client';

import { useRouter } from 'next/navigation';
import { Event } from '@/lib/types/event';
import { isPastDate, formatDateForDisplay } from '@/lib/utils';

interface EventBoxProps {
	event: Event;
}

export default function EventBox({ event }: EventBoxProps) {
	const router = useRouter();
	const handleClick = () => { router.push(`/events/${event.id}`); };
	const isPast = isPastDate(event.date);

	return (
		<div
			onClick={handleClick}
			className={`rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] cursor-pointer ${isPast ? "border-l-4 border-l-gray-400" : "border-l-4 border-l-blue-500"
				}`}
		>
			<h2 className="text-xl font-semibold font-[family-name:var(--font-geist-mono)]">
				{event.title || `Speaker: ${event.speaker_name}`}
			</h2>

			<div className="mt-1 font-[family-name:var(--font-geist-sans)]">
				<p className="font-medium">
					{event.speaker_name}
					{event.role && event.company && <span>, {event.role} at {event.company}</span>}
					{event.role && !event.company && <span>, {event.role}</span>}
					{!event.role && event.company && <span>, {event.company}</span>}
				</p>

				<div className="flex flex-wrap items-center gap-3 mt-2">
					<p className="text-sm text-gray-400">{formatDateForDisplay(event.date, { includeWeekday: true })}</p>
					<p className="text-sm text-gray-400">{event.time}</p>
					<p className="text-sm text-gray-400">{event.location}</p>

					{!isPast && (
						<span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs font-semibold">
							Upcoming
						</span>
					)}
				</div>
			</div>

			<p className="mt-3 line-clamp-2 text-sm font-[family-name:var(--font-geist-sans)]">
				{event.description}
			</p>
		</div>
	);
}