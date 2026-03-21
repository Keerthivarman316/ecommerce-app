import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import ChatBot from "@/components/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LootBay | Level Up Your Setup 🎮",
  description: "The ultimate premium gaming marketplace for your setup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-neon-purple selection:text-white`}>
        <Providers>
          <div className="ambient-light top-[-200px] left-[-200px]"></div>
          <div className="ambient-light bottom-[-200px] right-[-200px]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)' }}></div>

          <Navbar />

          <main className="flex-grow w-full relative z-10 pt-20">
            {children}
          </main>

          <Footer />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
