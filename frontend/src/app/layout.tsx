import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Argus | The All-Seeing Eye of Real-Time Data Intelligence",
  description: "Enterprise-grade real-time data pipeline orchestrator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold sm:inline-block text-emerald-400">ARGUS</span>
              </a>
            </div>
            <div className="flex flex-1 items-center space-x-2 justify-end">
              <div className="flex items-center text-sm font-medium text-slate-400">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Live
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 container py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
