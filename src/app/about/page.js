import React from 'react';

export default function About() {
	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-12 font-[family-name:var(--font-geist-mono)]">
					About Us
				</h1>

				<div className="space-y-16">
					{/* Mission Section */}
					<section>
						<h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)] border-b border-black/[.08] dark:border-white/[.145] pb-2">
							Our Mission
						</h2>
						<div className="space-y-4">
							<p>
								The Augustana College Student Investment Fund (SIF) is dedicated to providing students
								with hands-on investment experience while managing a portion of the college&apos;s endowment.
								Our goal is to consistently outperform market benchmarks while adhering to responsible
								investment principles.
							</p>
							<p>
								We strive to develop the next generation of investment professionals through
								practical experience, mentorship, and a commitment to continuous learning.
							</p>
						</div>
					</section>

					{/* History Section */}
					<section>
						<h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)] border-b border-black/[.08] dark:border-white/[.145] pb-2">
							Our History
						</h2>
						<div className="space-y-4">
							<p>
								Established in 2007, the fund began with an initial allocation of $100,000 from the college&apos;s
								endowment. Since then, our portfolio has grown significantly through both additional allocations
								and investment returns.
							</p>
							<p>
								Over the years, we&apos;ve expanded our investment strategy from primarily large-cap U.S. equities
								to include international stocks, fixed income securities, and ESG-focused investments.
							</p>
						</div>
					</section>

					{/* Structure Section */}
					<section>
						<h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)] border-b border-black/[.08] dark:border-white/[.145] pb-2">
							Fund Structure
						</h2>
						<div className="space-y-4">
							<p>
								The fund is entirely student-managed, with oversight from faculty advisors and the college&apos;s
								investment committee. Our team consists of:
							</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>Executive Committee (President, Vice President, Treasurer, Secretary)</li>
								<li>Sector Analysts (covering all major market sectors)</li>
								<li>Portfolio Managers</li>
								<li>Risk and Compliance Team</li>
								<li>ESG Research Analysts</li>
							</ul>
						</div>
					</section>

					{/* Get Involved Section */}
					<section>
						<h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)] border-b border-black/[.08] dark:border-white/[.145] pb-2">
							Get Involved
						</h2>
						<div className="space-y-4">
							<p>
								We welcome students from all majors and class years to join the Student Investment Fund.
								No prior investment experience is required – just a willingness to learn and contribute.
							</p>
							<p>
								New members typically start as analysts, researching companies and presenting investment ideas
								to the group. As students gain experience, they can take on leadership roles within the fund.
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}