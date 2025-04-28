import { getAllMeetingMinutes } from '../../lib/database';
import { CollapsibleMeetingBox } from '../../components/Boxes';
import { isAdmin } from '../../lib/auth';
import Link from 'next/link';

export const metadata = {
	title: 'Meeting Minutes | Augustana College SIF',
	description: 'Access notes and summaries from our weekly meetings.',
};

export default async function MeetingMinutesPage() {
	// Fetch all meeting minutes
	const meetingMinutes = await getAllMeetingMinutes();
	const canManageMeetingMinutes = await isAdmin();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">
						Meeting Minutes
					</h1>

					{canManageMeetingMinutes && (
						<Link
							href="/admin/meeting-minutes/add"
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
						>
							Add Meeting Minutes
						</Link>
					)}
				</div>

				<div className="flex flex-col gap-4">
					{meetingMinutes.length > 0 ? (
						meetingMinutes.map((meeting) => (
							<CollapsibleMeetingBox
								key={meeting.id}
								id={meeting.id}
								title={meeting.title}
								date={new Date(meeting.date).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
								publisher={meeting.author}
								notes={meeting.content}
							/>
						))
					) : (
						<div className="text-center py-8 text-gray-500 dark:text-gray-400">
							No meeting minutes available yet.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}