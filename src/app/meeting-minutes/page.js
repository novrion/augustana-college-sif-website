import { getPaginatedMeetingMinutes, getMeetingMinutesYears } from '../../lib/database';
import { MeetingBox } from '../../components/Boxes';
import Link from 'next/link';
import { hasAdminAccess } from '../../lib/auth';
import PaginationControls from '../../components/PaginationControls';
import YearFilter from '../../components/YearFilter';

export const metadata = {
	title: 'Meeting Minutes | Augustana College SIF',
	description: 'Access notes and summaries from our weekly meetings.',
};

// Function to create an excerpt from the content
function createExcerpt(content, maxLength = 150) {
	if (!content) return '';

	// If content is shorter than maxLength, return it as is
	if (content.length <= maxLength) return content;

	// Find the last space before maxLength to avoid cutting words
	const lastSpace = content.substring(0, maxLength).lastIndexOf(' ');
	const excerpt = content.substring(0, lastSpace > 0 ? lastSpace : maxLength);

	return `${excerpt}...`;
}

export default async function MeetingMinutesPage(props) {
	// Properly await searchParams
	const searchParams = await props.searchParams;

	// Parse pagination parameters with defaults
	const page = parseInt(searchParams?.page) || 1;
	const pageSize = parseInt(searchParams?.pageSize) || 10;
	const year = searchParams?.year || null;
	const search = searchParams?.search || null;

	// Fetch meeting minutes with pagination
	const { data: meetingMinutes, total, totalPages } = await getPaginatedMeetingMinutes({
		page,
		pageSize,
		year,
		search
	});

	// Fetch available years for filtering
	const years = await getMeetingMinutesYears();

	// Check if user is admin
	const hasAccess = await hasAdminAccess();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">
						Meeting Minutes
					</h1>

					{/* Only show Add button if user is admin */}
					{hasAccess && (
						<Link
							href="/admin/meeting-minutes/add"
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
						>
							Add Meeting Minutes
						</Link>
					)}
				</div>

				{/* Filters - Client Component */}
				<div className="mb-6">
					<YearFilter
						years={Array.isArray(years) ? years : []}
						currentYear={year}
					/>
				</div>

				{/* Meeting minutes list */}
				<div className="flex flex-col gap-4">
					{meetingMinutes && meetingMinutes.length > 0 ? (
						meetingMinutes.map((meeting) => (
							<MeetingBox
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
								excerpt={createExcerpt(meeting.content)}
							/>
						))
					) : (
						<div className="text-center py-8 text-gray-500 dark:text-gray-400">
							No meeting minutes available for the selected criteria.
						</div>
					)}
				</div>

				{/* Pagination controls - Client Component */}
				{totalPages > 1 && (
					<div className="mt-8">
						<PaginationControls
							currentPage={page}
							totalPages={totalPages}
						/>
					</div>
				)}

				{/* Display total count */}
				<div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
					Showing {meetingMinutes ? meetingMinutes.length : 0} of {total || 0} meeting minutes
				</div>
			</div>
		</div>
	);
}