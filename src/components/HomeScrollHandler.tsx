'use client';

import { useEffect } from 'react';

export default function HomeScrollHandler() {
	useEffect(() => {
		let scrollTimeout: ReturnType<typeof setTimeout>;
		let isAnimating = false;
		const mainElement = document.querySelector('#home-main') as HTMLElement | null;
		const navbar = document.querySelector('nav') as HTMLElement | null;
		const footer = document.querySelector('footer') as HTMLElement | null;
		const landingSectionElement = document.querySelector('#landing') as HTMLElement | null;

		if (!mainElement || !landingSectionElement) return;

		// Create non-null references after the null check
		const main = mainElement;
		const landingSection = landingSectionElement;

		// Set initial visibility for UI elements
		updateVisibility();

		// Premium easing function for silky smooth animation
		function easeOutCubic(t: number): number {
			return 1 - Math.pow(1 - t, 3);
		}

		// Custom smooth scroll animation
		function smoothScrollTo(targetY: number, duration: number): void {
			if (isAnimating) return;
			isAnimating = true;

			const startY = main.scrollTop;
			const distance = targetY - startY;
			let startTime: number | null = null;

			function animation(currentTime: number): void {
				if (startTime === null) startTime = currentTime;
				const timeElapsed = currentTime - startTime;
				const progress = Math.min(timeElapsed / duration, 1);
				const easeProgress = easeOutCubic(progress);

				main.scrollTo({
					top: startY + distance * easeProgress,
					behavior: 'auto' // We're handling the animation ourselves
				});

				updateVisibility();

				if (timeElapsed < duration) {
					requestAnimationFrame(animation);
				} else {
					isAnimating = false;
				}
			}

			requestAnimationFrame(animation);
		}

		// Function to find the best position to center a section
		function getCenteredScrollPosition(section: Element): number {
			const rect = section.getBoundingClientRect();
			const sectionCenter = rect.top + rect.height / 2;
			const viewportCenter = window.innerHeight / 2;

			// Calculate how much we need to scroll to center this section
			return main.scrollTop + (sectionCenter - viewportCenter);
		}

		// Function to check if we're on the landing section
		function isOnLandingSection(): boolean {
			// Check if landing section is mostly visible
			const landingRect = landingSection.getBoundingClientRect();
			// If more than half of the landing section is visible, we consider it as "on landing"
			return landingRect.top > -landingRect.height / 2;
		}

		// Function to check if we're at the bottom of the page
		function isAtBottom(): boolean {
			// Get the total scrollable height
			const scrollHeight = main.scrollHeight;
			// Get the current scroll position plus the viewport height
			const scrollPosition = main.scrollTop + main.clientHeight;
			// Consider as "at bottom" if we're within 100px of the bottom
			return scrollHeight - scrollPosition < 100;
		}

		// Function to update navbar, ticker and footer visibility based on scroll position
		function updateVisibility(): void {
			const isLanding = isOnLandingSection();
			const atBottom = isAtBottom();

			// Handle navbar visibility - show only on landing
			if (navbar) {
				navbar.style.display = isLanding ? 'flex' : 'none';
			}

			// Handle footer visibility - show only at bottom
			if (footer) {
				footer.style.display = atBottom ? 'flex' : 'none';
			}

			// Handle ticker visibility - try multiple selectors to ensure we find it
			const tickerWrapper = document.querySelector('.ticker-wrapper') as HTMLElement | null;
			if (tickerWrapper) {
				tickerWrapper.style.display = isLanding ? 'flex' : 'none';
			}

			// As a fallback, try to find the ticker by role or any other identifiers
			const allTickers = document.querySelectorAll('.ticker-wrapper, .ticker, [role="ticker"]');
			allTickers.forEach(ticker => {
				const tickerElement = ticker as HTMLElement;
				if (tickerElement) {
					tickerElement.style.opacity = isLanding ? '1' : '0';
					tickerElement.style.visibility = isLanding ? 'visible' : 'hidden';
					tickerElement.style.display = isLanding ? '' : 'none';
				}
			});
		}

		const handleScroll = (): void => {
			if (isAnimating) return;

			// Update visibility on scroll
			updateVisibility();

			// Clear any existing timeout
			clearTimeout(scrollTimeout);

			// Set a new timeout
			scrollTimeout = setTimeout(() => {
				// Find the nearest section
				const sections = document.querySelectorAll('section');
				let closestSection: Element | null = null;
				let closestDistance = Infinity;

				sections.forEach(section => {
					const rect = section.getBoundingClientRect();
					const sectionCenter = rect.top + rect.height / 2;
					const viewportCenter = window.innerHeight / 2;
					const distanceToCenter = Math.abs(sectionCenter - viewportCenter);

					if (distanceToCenter < closestDistance) {
						closestDistance = distanceToCenter;
						closestSection = section;
					}
				});

				// Get the position that would center this section
				if (closestSection) {
					const targetPosition = getCenteredScrollPosition(closestSection);
					smoothScrollTo(targetPosition, 1200); // 1.2 seconds duration
				}
			}, 1500); // 1.5 second delay
		};

		main.addEventListener('scroll', handleScroll);

		return () => {
			main.removeEventListener('scroll', handleScroll);
			clearTimeout(scrollTimeout);
		};
	}, []);

	return null;
}