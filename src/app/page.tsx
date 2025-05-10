import { getAllHomeSections } from '@/lib/api/db';
import { HomeSection } from '@/lib/types';
import Image from 'next/image';
import HomeScrollHandler from '@/components/HomeScrollHandler';

export default async function Home() {
  const homeSections: HomeSection[] = await getAllHomeSections();
  const sortedSections = [...homeSections].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="font-[family-name:var(--font-geist-mono)] overflow-x-hidden">
      {/* Black background for everything except landing section */}
      <div className="fixed inset-0 bg-black -z-20 pointer-events-none" />

      {/* Gradient overlay for landing section only - transitions to pure black */}
      <div className="fixed inset-0 w-full h-screen bg-gradient-to-b from-transparent via-transparent via-[20%] via-[rgba(0,0,0,0.4)] via-[60%] via-[rgba(0,0,0,0.8)] via-[80%] to-[#000000] -z-10 pointer-events-none" />

      {/* Add the scroll handler component */}
      <HomeScrollHandler />

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
    </div>
  );
}