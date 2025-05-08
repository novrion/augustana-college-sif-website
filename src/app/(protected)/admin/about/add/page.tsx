import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import AboutSectionForm from '@/components/admin/about/AboutSectionForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function AddAboutSectionPage() {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Add About Section</h1>
					<EmptyLinkButton href="/admin/about" text="Back to About Management" />
				</div>

				<AboutSectionForm />
			</div>
		</div>
	);
}