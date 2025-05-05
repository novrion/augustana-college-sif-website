import { getAllAboutSections } from '@/lib/api/db';
import { AboutSection } from '@/lib/types/about';

export default async function AboutPage() {
	const aboutSections: AboutSection[] = await getAllAboutSections();
	const sortedSections = [...aboutSections].sort((a, b) => a.order_index - b.order_index);

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-10 font-[family-name:var(--font-geist-mono)]">
					About Us
				</h1>

				<div className="space-y-16">
					{sortedSections && sortedSections.length > 0 ? (
						sortedSections.map((section) => (
							<div key={section.id} className="mb-10">
								<h2 className="text-2xl font-semibold mb-4 border-b border-white/[.145] pb-2 font-[family-name:var(--font-geist-mono)]">{section.title}</h2>
								<div className="prose font-[family-name:var(--font-geist-sans)]" dangerouslySetInnerHTML={{ __html: section.content }} />
							</div>
						))
					) : (
						<p className="text-center font-[family-name:var(--font-geist-mono)]">
							No about sections found.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}