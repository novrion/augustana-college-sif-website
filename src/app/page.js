import React from 'react';
import { FeatureBox, BoxGrid } from './components/Boxes';

const boxesData = [
  {
    title: "Our Portfolio",
    description: "View our current holdings, performance metrics, and investment strategy.",
    link: "/portfolio",
    linkText: "Portfolio Tracker"
  },
  {
    title: "Our Newsletter",
    description: "Stay informed with our market analyses, investment insights, and fund updates.",
    link: "/newsletter",
    linkText: "Newsletter"
  },
  {
    title: "Guest Speakers",
    description: "Access our upcoming and past industry experts and financial professionals sharing valuable insights.",
    link: "/calendar",
    linkText: "Calendar"
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">
      <main className="flex flex-col gap-8 row-start-2 items-center max-w-5xl">
        <div className="text-center sm:text-center">
          <h1 className="text-7xl font-bold mb-2 shadow-lg">
            Augustana College
          </h1>
          <h2 className="text-3xl font-semibold mb-12">
            Student Investment Fund
          </h2>
          <p className="text-base mb-24 ">
            Consistently <span className="font-semibold text-green-500">outperforming</span> the market
          </p>
        </div>

        {/* Grid of feature boxes */}
        <BoxGrid>
          {boxesData.map((box, index) => (
            <FeatureBox
              key={index}
              title={box.title}
              description={box.description}
              link={box.link}
              linkText={box.linkText}
            />
          ))}
        </BoxGrid>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/research"
          >
            View Research Reports
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/join"
          >
            Join the Fund
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contact"
        >
          Contact
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.augustana.edu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Augustana College →
        </a>
      </footer>
    </div>
  );
}