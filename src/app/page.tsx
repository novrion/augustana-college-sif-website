import { getAllHomeSections } from '@/lib/api/db';
import { HomeSection } from '@/lib/types';
import Image from 'next/image';

export default async function Home() {
	const homeSections: HomeSection[] = await getAllHomeSections();
	const sortedSections = [...homeSections].sort((a, b) => a.order_index - b.order_index);

	return (
		<div className="font-[family-name:var(--font-geist-mono)] overflow-x-hidden">
			{/* Black background for everything except landing section */}
			<div className="fixed inset-0 bg-black -z-20 pointer-events-none" />

			{/* Gradient overlay for landing section only - transitions to pure black */}
			<div className="fixed inset-0 w-full h-screen bg-gradient-to-b from-transparent via-transparent via-[20%] via-[rgba(0,0,0,0.4)] via-[60%] via-[rgba(0,0,0,0.8)] via-[80%] to-[#000000] -z-10 pointer-events-none" />

			{/* Smooth scrolling container */}
			<main id="home-main" className="h-screen overflow-y-auto">
				{/* Landing section with padding for navbar */}
				<section id="landing" className="min-h-screen w-full flex flex-col justify-center items-center pt-24 relative" data-section-id="landing">
					<div className="text-center">
						<Image
							src="/logo.svg"
							alt="LOGO"
							width={350}
							height={350}
							className="mx-auto mb-12"
							quality={100}
							priority
						/>
						<h1 className="text-7xl font-bold mb-4 shadow-lg font-[family-name:var(--font-geist-mono)]">
							Augustana College
						</h1>
						<h2 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
							Student Investment Fund
						</h2>
					</div>
				</section>

				{/* Content sections */}
				{sortedSections.length > 0 ? (
					sortedSections.map((section, index) => (
						<section
							key={section.id}
							id={`section-${index}`}
							className="min-h-screen w-full flex items-center justify-center px-8 sm:px-20 py-12 bg-black"
							data-section-id={`section-${index}`}
						>
							<div className="max-w-7xl w-full">
								<div
									className={`flex flex-col md:flex-row gap-16 items-center p-12 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'
										}`}
								>
									{/* Image side */}
									<div className="w-full md:w-3/5">
										<div className="relative aspect-square w-full overflow-hidden shadow-2xl border border-white/10">
											<Image
												src={section.image_url}
												alt={section.title}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, 60vw"
												quality={100}
												priority={index < 2}
											/>
										</div>
									</div>

									{/* Text side */}
									<div className="w-full md:w-2/5 flex flex-col items-center justify-center text-center px-4">
										<div className="max-w-sm">
											<h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-geist-mono)]">{section.title}</h2>
											<div className="prose prose-sm max-w-none font-[family-name:var(--font-geist-mono)] text-sm">
												{section.content.split('\n').map((paragraph, i) => (
													<p key={i} className="mb-4">{paragraph}</p>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					))
				) : (
					<section className="min-h-screen w-full flex items-center justify-center bg-black" data-section-id="empty">
						<div className="text-center py-12 text-gray-400 font-[family-name:var(--font-geist-mono)]">
							No content available. Please add sections in the admin panel.
						</div>
					</section>
				)}
			</main>

			{/* Add client-side JavaScript for premium scrolling and navbar/ticker/footer management */}
			<script dangerouslySetInnerHTML={{
				__html: `
        document.addEventListener('DOMContentLoaded', () => {
          let scrollTimeout;
          let isAnimating = false;
          const main = document.querySelector('#home-main');
          const navbar = document.querySelector('nav');
          const footer = document.querySelector('footer');
          const landingSection = document.querySelector('#landing');
          
          // Set initial visibility for UI elements
          updateVisibility();
          
          // Premium easing function for silky smooth animation
          function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
          }
          
          // Custom smooth scroll animation
          function smoothScrollTo(targetY, duration) {
            if (isAnimating) return;
            isAnimating = true;
            
            const startY = main.scrollTop;
            const distance = targetY - startY;
            let startTime = null;
            
            function animation(currentTime) {
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
          function getCenteredScrollPosition(section) {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            
            // Calculate how much we need to scroll to center this section
            return main.scrollTop + (sectionCenter - viewportCenter);
          }
          
          // Function to check if we're on the landing section
          function isOnLandingSection() {
            // Check if landing section is mostly visible
            const landingRect = landingSection.getBoundingClientRect();
            // If more than half of the landing section is visible, we consider it as "on landing"
            return landingRect.top > -landingRect.height / 2;
          }
          
          // Function to check if we're at the bottom of the page
          function isAtBottom() {
            // Get the total scrollable height
            const scrollHeight = main.scrollHeight;
            // Get the current scroll position plus the viewport height
            const scrollPosition = main.scrollTop + main.clientHeight;
            // Consider as "at bottom" if we're within 100px of the bottom
            return scrollHeight - scrollPosition < 100;
          }
          
          // Function to update navbar, ticker and footer visibility based on scroll position
          function updateVisibility() {
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
            const tickerWrapper = document.querySelector('.ticker-wrapper');
            if (tickerWrapper) {
              tickerWrapper.style.display = isLanding ? 'flex' : 'none';
            }
            
            // As a fallback, try to find the ticker by role or any other identifiers
            const allTickers = document.querySelectorAll('.ticker-wrapper, .ticker, [role="ticker"]');
            allTickers.forEach(ticker => {
              if (ticker) {
                ticker.style.opacity = isLanding ? '1' : '0';
                ticker.style.visibility = isLanding ? 'visible' : 'hidden';
                ticker.style.display = isLanding ? '' : 'none';
              }
            });
          }
          
          main.addEventListener('scroll', () => {
            if (isAnimating) return;
            
            // Update visibility on scroll
            updateVisibility();
            
            // Clear any existing timeout
            clearTimeout(scrollTimeout);
            
            // Set a new timeout
            scrollTimeout = setTimeout(() => {
              // Find the nearest section
              const sections = document.querySelectorAll('section');
              let closestSection = null;
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
          });
        });
      `}} />
		</div>
	);
}