'use client';

export function AboutSection({ title, text }) {
	return (
		<div className="space-y-16">
			<section>
				<h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)] border-b border-black/[.08] dark:border-white/[.145] pb-2">
					{title}
				</h2>
				<div className="space-y-4">
					<p>
						{text}
					</p>
				</div>
			</section>
		</div>
	);
}