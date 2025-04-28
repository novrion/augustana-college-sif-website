'use client';

export default function DefaultFooter() {
	return (
		<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="/contact"
			>
				Contact
			</a>
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="/signup"
			>
				Sign Up
			</a>
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="https://www.augustana.edu/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Augustana College
			</a>
		</footer>
	);
}