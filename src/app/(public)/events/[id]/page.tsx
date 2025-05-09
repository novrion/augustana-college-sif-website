import { redirect } from 'next/navigation';
import { getEventById } from '@/lib/api/db';
import { EmptyLinkButton } from '@/components/Buttons';
import { formatDateForDisplay, isPastDate } from '@/lib/utils';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		if (!id) redirect('/events');

		const event = await getEventById(id);
		if (!event) redirect('/events');

		const isPast = isPastDate(event.date);

		return (
			<div className="min-h-screen p-8 sm:p-20">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6 font-[family-name:var(--font-geist-mono)]">
						<h1 className="text-3xl font-bold">
							Event Details
						</h1>

						<EmptyLinkButton
							href="/events"
							text="Back to All Speakers"
						/>
					</div>

					<div className="rounded-lg border border-solid border-white/[.145] p-6">
						<h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
							{event.title || event.speaker_name}
						</h2>

						<div className="flex flex-col mb-6 text-sm text-gray-400 font-[family-name:var(--font-geist-mono)]">
							<span className="mb-1">{formatDateForDisplay(event.date, { includeWeekday: true })}</span>
							<span>
								{event.title ? event.speaker_name : ''}
								{(event.title && (event.role || event.company)) && <span>, </span>}
								{event.role && event.company && <span>{event.role} at {event.company}</span>}
								{event.role && !event.company && <span>{event.role}</span>}
								{!event.role && event.company && <span>{event.company}</span>}
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