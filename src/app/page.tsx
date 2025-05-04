'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { EmptyButton, FilledButton, EmptyLinkButton, FilledLinkButton } from '@/components/Buttons';

const boxesData = [
	{
		title: "Our Portfolio",
		description: "View our current holdings and performance metrics.",
		link: "/portfolio",
		linkText: "Portfolio Tracker"
	},
	{
		title: "Guest Speakers",
		description: "Access our upcoming and past industry experts sharing valuable insights.",
		link: "/calendar",
		linkText: "Calendar"
	},
	{
		title: "Our Newsletter",
		description: "Stay informed with our market analyses, investment insights, and fund updates.",
		link: "/newsletter",
		linkText: "Newsletter"
	},

	{
		title: "Gallery",
		description: "Browse photos from stock pitches, events, fund meetings, guest speakers, and more.",
		link: "/gallery",
		linkText: "Gallery"
	},
	{
		title: "Meeting Minutes",
		description: "Access notes and summaries from our weekly meetings.",
		link: "/meeting-minutes",
		linkText: "Meeting Minutes"
	},
	{
		title: "About SIF",
		description: "Learn about our mission, history, and the students who manage the fund.",
		link: "/about",
		linkText: "About us"
	},
];

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)]">
			<main className="mt-30 flex flex-col gap-8 items-center max-w-5xl">
				<Image
					src="/logo.svg"
					alt="LOGO"
					width={250}
					height={250}
					className="mb-4"
				/>
				<div className="text-center">
					<h1 className="text-7xl font-bold mb-2 shadow-lg">
						Augustana College
					</h1>
					<h2 className="text-3xl font-semibold mb-12">
						Student Investment Fund
					</h2>
				</div>
			</main>
		</div>

	);
}