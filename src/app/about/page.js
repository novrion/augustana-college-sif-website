import { getAllAboutSections } from '../../lib/database';
import { AboutSection } from '../../components/AboutSection';
import DefaultFooter from '../../components/DefaultFooter';

export default async function About() {
	// Make the function async and directly await the result
	const aboutSections = await getAllAboutSections();

	return (
		<div className="flex flex-col min-h-screen p-8 sm:p-20">
			<div className="flex-grow max-w-4xl mx-auto w-full">
				<h1 className="text-3xl font-bold mb-12 font-[family-name:var(--font-geist-mono)]">
					About Us
				</h1>

				<div className="space-y-16">
					{aboutSections && aboutSections.length > 0 ? (
						aboutSections.map((section, index) => (
							<AboutSection
								key={index}
								title={section.title}
								text={section.content} // Change 'text' to 'content' to match your database field
							/>
						))
					) : (
						<p className="text-center font-[family-name:var(--font-geist-mono)]">
							No about sections found.
						</p>
					)}
				</div>
			</div>
			<div className="mt-20">
				<DefaultFooter />
			</div>
		</div>
	);
}