import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getMeetingMinuteById } from '../../../lib/database';
import { BoxBase } from '../../../components/Boxes';

export async function generateMetadata(props) {
	// Properly await params
	const params = await props.params;
	const id = params.id;

	const meeting = await getMeetingMinuteById(id);

	if (!meeting) {
		return {
			title: 'Meeting Minutes Not Found | Augustana College SIF',
		};
	}

	return {
		title: `${meeting.title} | Meeting Minutes | Augustana College SIF`,
		description: `Meeting minutes from ${meeting.date}: ${meeting.title}`,
	};
}

export default async function MeetingMinuteDetail(props) {
	// Properly await params
	const params = await props.params;
	const id = params.id;

	try {
		// Fetch meeting minute by ID
		const meeting = await getMeetingMinuteById(id);

		if (!meeting) {
			redirect('/meeting-minutes');
		}

		// Format date
		const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Meeting Minutes
						</h1>

						<Link
							href="/meeting-minutes"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to All Minutes
						</Link>
					</div>

					<BoxBase className="mb-6" hoverEffect={false}>
						<h2 className="text-2xl font-semibold mb-4">
							{meeting.title}
						</h2>

						{/* Changed from flex row to flex column layout */}
						<div className="flex flex-col mb-6 text-sm text-gray-500 dark:text-gray-400">
							<span className="mb-1">{formattedDate}</span>
							<span>Published by: {meeting.author}</span>
						</div>

						<div className="prose prose-sm max-w-none dark:prose-invert">
							{meeting.content.split('\n').map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>
					</BoxBase>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading meeting minute:', error);
		redirect('/meeting-minutes');
	}
}