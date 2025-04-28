import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '../../../../lib/auth';
import MeetingMinuteForm from '../../../../components/admin/MeetingMinuteForm';

export default async function AddMeetingMinutePage() {
	// Verify user is admin
	const isAdminUser = await isAdmin();

	if (!isAdminUser) {
		redirect('/unauthorized');
	}

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Add Meeting Minutes
					</h1>

					<Link
						href="/meeting-minutes"
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Back to Minutes
					</Link>
				</div>

				<MeetingMinuteForm />
			</div>
		</div>
	);
}