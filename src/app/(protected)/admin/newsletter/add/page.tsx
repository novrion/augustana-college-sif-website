import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import NewsletterForm from '@/components/admin/newsletter/NewsletterForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function AddNewsletterPage() {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Add Newsletter</h1>
					<EmptyLinkButton href="/admin/newsletter" text="Back to Newsletter Management" />
				</div>
				<NewsletterForm />
			</div>
		</div>
	);
}