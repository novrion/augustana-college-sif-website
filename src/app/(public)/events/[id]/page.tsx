import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getEventById } from '@/lib/api/db';

export default async function EventDetail({ params }: { params: { id: string } }) {
	try {
		const id = params?.id;
		if (!id) redirect('/events');

		const event = await getEventById(id);
		if (!event) redirect('/events');

		const formatDate = (dateString: string): string => {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		};

		const isPastEvent = (dateString: string): boolean => {
			const eventDate = new Date(dateString);
			eventDate.setHours(23, 59, 59);
			return eventDate < new Date();
		};

		const isPast = isPastEvent(event.date);

		return (
			<div className="min-h-screen p-8 sm:p-20">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6 font-[family-name:var(--font-geist-mono)]">
						<h1 className="text-3xl font-bold">
							Event Details
						</h1>

						<Link
							href="/events"
							className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to All Events
						</Link>
					</div>

					<div className="rounded-lg border border-solid border-white/[.145] p-6">
						<h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
							{event.title || `Speaker: ${event.speaker_name}`}
						</h2>

						<div className="flex flex-col mb-6 text-sm text-gray-400 font-[family-name:var(--font-geist-mono)]">
							<span className="mb-1">{formatDate(event.date)}</span>
							<span>
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
							</span>
							{!isPast && (
								<span className="inline-block mt-2 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs font-semibold w-fit">
									Upcoming
								</span>
							)}
						</div>

						<div className="prose prose-sm max-w-none mb-8 font-[family-name:var(--font-geist-sans)]">
							<p className="mb-4">{event.description}</p>
							<div className="space-y-2">
								<div><strong>Location:</strong> {event.location}</div>
								<div><strong>Time:</strong> {event.time}</div>
								{event.contact && <div><strong>Contact:</strong> {event.contact}</div>}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading event:', error);
		redirect('/events');
	}
}