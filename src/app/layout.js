// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import StockTicker from "../components/StockTicker"; // Import StockTicker
import { AuthProvider } from "../components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Augie SIF",
  description: "Augustana College Student Investment Fund Website",
  icons: {
    icon: './logo.svg',
    apple: './logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <StockTicker /> {/* Add StockTicker right after Navbar */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}