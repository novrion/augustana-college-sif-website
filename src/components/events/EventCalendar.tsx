'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/types/event';

interface EventCalendarProps {
	upcomingEvents: Event[];
	pastEvents: Event[];
}

export default function EventCalendar({ upcomingEvents, pastEvents }: EventCalendarProps) {
	const router = useRouter();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		setEvents([...upcomingEvents, ...pastEvents]);
	}, [upcomingEvents, pastEvents]);

	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const monthName = currentDate.toLocaleString('default', { month: 'long' });

	const handlePrevMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
	};

	const handleDayClick = (day: number) => {
		const eventsOnDay = getEventsForDay(day);
		if (eventsOnDay.length === 1) {
			router.push(`/events/${eventsOnDay[0].id}`);
		} else if (eventsOnDay.length > 1) {
			router.push('/events');
		}
	};

	const isEventUpcoming = (event: Event): boolean => {
		const eventDate = new Date(`${event.date}T12:00:00Z`);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return eventDate >= today;
	};

	const getEventsForDay = (day: number): Event[] => {
		return events.filter(event => {
			const eventDate = new Date(`${event.date}T12:00:00Z`);
			return (
				eventDate.getUTCFullYear() === currentYear &&
				eventDate.getUTCMonth() === currentMonth &&
				eventDate.getUTCDate() === day
			);
		});
	};

	const renderCalendarDays = () => {
		const days = [];

		// Empty cells for days before the first of the month
		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(<div key={`empty-${i}`} className="p-2"></div>);
		}

		// Cells for each day of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const eventsOnDay = getEventsForDay(day);
			const hasEvents = eventsOnDay.length > 0;

			days.push(
				<div
					key={day}
					onClick={() => hasEvents && handleDayClick(day)}
					className={`p-2 border border-white/[.145] min-h-[80px] ${hasEvents ? 'cursor-pointer hover:bg-[#1a1a1a]' : ''
						}`}
				>
					<div className="text-sm font-semibold mb-1">{day}</div>
					{eventsOnDay.map(event => (
						<div
							key={event.id}
							className={`text-xs p-1 rounded-md mb-1 truncate ${isEventUpcoming(event)
								? 'bg-blue-900 text-blue-200'
								: 'bg-gray-700 text-gray-200'
								}`}
						>
							{event.speaker_name || event.title}
						</div>
					))}
				</div>
			);
		}

		return days;
	};

	return (
		<div className="rounded-lg border border-solid border-white/[.145] p-6">
			<div className="flex justify-between items-center mb-4">
				<button
					onClick={handlePrevMonth}
					className="rounded-full border border-solid p-2 border-white/[.145] hover:bg-[#1a1a1a]"
					aria-label="Previous month"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>

				<h2 className="text-xl font-semibold font-[family-name:var(--font-geist-sans)]">
					{monthName} {currentYear}
				</h2>

				<button
					onClick={handleNextMonth}
					className="rounded-full border border-solid p-2 border-white/[.145] hover:bg-[#1a1a1a]"
					aria-label="Next month"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1 mb-2">
				{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
					<div key={day} className="text-center text-sm font-semibold font-[family-name:var(--font-geist-sans)]">
						{day}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1 font-[family-name:var(--font-geist-sans)]">
				{renderCalendarDays()}
			</div>

			<div className="mt-4 flex gap-4 font-[family-name:var(--font-geist-sans)]">
				<div className="flex items-center">
					<div className="w-3 h-3 rounded-full bg-blue-900 mr-2"></div>
					<span className="text-sm">Upcoming Events</span>
				</div>
				<div className="flex items-center">
					<div className="w-3 h-3 rounded-full bg-gray-700 mr-2"></div>
					<span className="text-sm">Past Events</span>
				</div>
			</div>
		</div>
	);
}