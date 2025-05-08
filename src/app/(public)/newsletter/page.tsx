import ClientNewsletter from '@/components/newsletter/ClientNewsletter';

export default async function NewsletterPage({ searchParams }: { searchParams: Promise<{ page?: string, year?: string }> }) {
	const { page, year } = await searchParams;
	const currentPage = page ? parseInt(page) : 1;
	const currentYear = year || null;

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					Newsletter
				</h1>

				<ClientNewsletter initialPage={currentPage} initialYear={currentYear} />
			</div>
		</div>
	);
}