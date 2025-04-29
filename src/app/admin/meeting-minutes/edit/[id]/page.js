// src/app/admin/meeting-minutes/edit/[id]/page.js

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../../../lib/auth';
import { getMeetingMinuteById } from '../../../../../lib/database';
import MeetingMinuteForm from '../../../../../components/admin/MeetingMinuteForm';

export default async function EditMeetingMinutePage(props) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	try {
		// Properly await params
		const params = await props.params;
		const id = params.id;

		// Fetch meeting minute
		const meeting = await getMeetingMinuteById(id);

		if (!meeting) {
			redirect('/admin/meeting-minutes');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit Meeting Minutes: {meeting.title}
						</h1>

						<Link
							href="/admin/meeting-minutes"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Minutes
						</Link>
					</div>

					<MeetingMinuteForm initialData={meeting} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading meeting minute:', error);
		redirect('/admin/meeting-minutes');
	}
}