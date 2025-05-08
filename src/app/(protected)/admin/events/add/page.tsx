import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import EventForm from '@/components/admin/events/EventForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function AddEventPage() {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Add Guest Speaker</h1>
					<EmptyLinkButton href="/admin/events" text="Back to Guest Speaker Management" />
				</div>
				<EventForm />
			</div>
		</div>
	);
}