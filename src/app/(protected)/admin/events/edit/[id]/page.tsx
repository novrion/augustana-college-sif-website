import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getEventById } from '@/lib/api/db';
import EventForm from '@/components/admin/events/EventForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	try {
		const { id } = await params;
		const event = await getEventById(id);
		if (!event) redirect('/admin/events');

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit: {event.title || event.speaker_name}
						</h1>
						<EmptyLinkButton href="/admin/events" text="Back to Guest Speaker Management" />
					</div>
					<EventForm initialData={event} isEditing={true} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading event:', error);
		redirect('/admin/events');
	}
}