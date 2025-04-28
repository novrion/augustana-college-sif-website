'use client';

export function AboutSection({ title, text }) {
	return (
		<div className="space-y-16">
			<section>
				<h2 className="text-2xl font-semibold mb-6 border-b border-black/[.08] dark:border-white/[.145] pb-2 font-[family-name:var(--font-geist-mono)]">
					{title}
				</h2>
				<div className="space-y-4 font-[family-name:var(--font-geist-sans)]">
					{text.split('\n').map((paragraph, index) => (
						<p key={index} className="mb-4">{paragraph}</p>
					))}
				</div>
			</section>
		</div>
	);
}