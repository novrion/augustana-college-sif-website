// app/admin/speakers/edit/[id]/page.js
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../../../lib/auth';
import { getSpeakerById } from '../../../../../lib/database';
import SpeakerForm from '../../../../../components/admin/SpeakerForm';

export default async function EditSpeakerPage({ params }) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	try {
		// Get the speaker ID from the URL
		const id = params.id;

		// Fetch the speaker
		const speaker = await getSpeakerById(id);

		if (!speaker) {
			redirect('/admin/speakers');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit Guest Speaker: {speaker.speaker_name}
						</h1>

						<Link
							href="/admin/speakers"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Speakers
						</Link>
					</div>

					<SpeakerForm initialData={speaker} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading speaker:', error);
		redirect('/admin/speakers');
	}
}