import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getNewsletterById } from '@/lib/api/db';
import NewsletterForm from '@/components/admin/newsletter/NewsletterForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function EditNewsletterPage({ params }: { params: Promise<{ id: string }> }) {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	try {
		const { id } = await params;
		const newsletter = await getNewsletterById(id);
		if (!newsletter) redirect('/admin/newsletter');

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Edit: {newsletter.title}</h1>
						<EmptyLinkButton href="/admin/newsletter" text="Back to Newsletter Management" />
					</div>
					<NewsletterForm initialData={newsletter} isEditing />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading newsletter:', error);
		redirect('/admin/newsletter');
	}
}