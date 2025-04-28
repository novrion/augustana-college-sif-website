import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '../../../lib/auth';
import { getAllMeetingMinutes } from '../../../lib/database';
import MeetingMinutesList from '../../../components/admin/MeetingMinutesList';

export default async function AdminMeetingMinutesPage() {
	// Verify user is admin
	const isAdminUser = await isAdmin();

	if (!isAdminUser) {
		redirect('/unauthorized');
	}

	// Fetch all meeting minutes
	const meetingMinutes = await getAllMeetingMinutes();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Meeting Minutes Management
					</h1>

					<div className="flex gap-3">
						<Link
							href="/admin"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Admin
						</Link>

						<Link
							href="/admin/meeting-minutes/add"
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
						>
							Add New Meeting Minutes
						</Link>
					</div>
				</div>

				<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Meeting Minutes</h2>
					<MeetingMinutesList meetingMinutes={meetingMinutes} />
				</div>
			</div>
		</div>
	);
}