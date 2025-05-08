import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getNewsletterById } from '@/lib/api/db';
import { Attachment } from '@/lib/types';
import { EmptyLinkButton } from '@/components/Buttons';
import { formatDateForDisplay, formatFileSize } from '@/lib/utils';

export default async function NewsletterDetail({ params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		if (!id) redirect('/newsletter');

		const newsletter = await getNewsletterById(id);
		if (!newsletter) redirect('/newsletter');

		return (
			<div className="min-h-screen p-8 sm:p-20">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6 font-[family-name:var(--font-geist-mono)]">
						<h1 className="text-3xl font-bold">
							Newsletter
						</h1>

						<EmptyLinkButton
							text={"Back to All Newsletters"}
							href={"/newsletter"}
						/>
					</div>

					<div className="rounded-lg border border-solid border-white/[.145] p-6">
						<h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
							{newsletter.title}
						</h2>

						<div className="flex flex-col mb-6 text-sm text-gray-400 font-[family-name:var(--font-geist-mono)]">
							<span className="mb-1">{formatDateForDisplay(newsletter.date, { includeWeekday: true })}</span>
							<span>{newsletter.author}</span>
						</div>

						<div className="prose prose-sm max-w-none mb-8 font-[family-name:var(--font-geist-sans)]">
							{newsletter.content.split('\n').map((paragraph, index) => (
								<p key={index} className="mb-4">{paragraph}</p>
							))}
						</div>

						{newsletter.attachments && renderAttachments(newsletter.attachments)}
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading newsletter:', error);
		redirect('/newsletter');
	}
}

function renderAttachments(attachments: Attachment[]) {
	const imageAttachments = attachments.filter(isImageAttachment);
	const fileAttachments = attachments.filter(a => !isImageAttachment(a));

	return (
		<>
			{imageAttachments.length > 0 && renderImageAttachments(imageAttachments)}
			{fileAttachments.length > 0 && renderFileAttachments(fileAttachments)}
		</>
	);
}

function renderImageAttachments(attachments: Attachment[]) {
	return (
		<div className="mb-8 font-[family-name:var(--font-geist-mono)]">
			<h3 className="text-lg font-semibold mb-4">Images</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{attachments.map((attachment, index) => (
					<div key={index} className="rounded-lg overflow-hidden border border-white/[.145]">
						<a
							href={attachment.url}
							target="_blank"
							rel="noopener noreferrer"
							className="block"
						>
							<div className="relative aspect-[4/3] w-full">
								<Image
									src={attachment.url}
									alt={attachment.originalName || attachment.name}
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-2 text-sm truncate">
								{attachment.originalName || attachment.name}
							</div>
						</a>
					</div>
				))}
			</div>
		</div>
	);
}

function renderFileAttachments(attachments: Attachment[]) {
	return (
		<div className="font-[family-name:var(--font-geist-mono)]">
			<h3 className="text-lg font-semibold mb-4">Attachments</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{attachments.map((attachment, index) => (
					<a
						key={index}
						href={attachment.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 p-3 border border-white/[.145] rounded-md hover:bg-[#1a1a1a]"
					>
						<div className="h-10 w-10 flex items-center justify-center bg-gray-800 rounded">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
						</div>
						<div className="flex-1 min-w-0">
							<div className="font-medium truncate">
								{attachment.originalName || attachment.name}
							</div>
							<div className="text-xs text-gray-500">
								{formatFileSize(attachment.size)}
							</div>
						</div>
						<div className="text-blue-500">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
							</svg>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}

function isImageAttachment(attachment: Attachment): boolean {
	const type = attachment?.type || '';
	return type.startsWith('image/');
}