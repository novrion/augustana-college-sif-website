import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getAllEvents } from '@/lib/api/db';
import AdminEventsList from '@/components/admin/events/AdminEventsList';
import { Event } from '@/lib/types/event';
import { EmptyLinkButton, FilledLinkButton } from "@/components/Buttons";

export default async function AdminEventsPage() {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	const events: Event[] = await getAllEvents();
	const sortedEvents = [...events].sort((a, b) =>
		new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Event Management</h1>
					<div className="flex gap-3">
						<EmptyLinkButton href="/admin" text="Back to Admin" />
						<FilledLinkButton href="/admin/events/add" text="Add New Event" />
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Events</h2>
					<AdminEventsList events={sortedEvents} />
				</div>
			</div>
		</div>
	);
}