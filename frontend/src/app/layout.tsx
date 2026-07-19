import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import SimulatorControls from "@/components/dashboard/SimulatorControls";
import TimeRangePicker from "@/components/dashboard/TimeRangePicker";
import ExportMenu from "@/components/dashboard/ExportMenu";

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
      <body className={`${inter.className} bg-slate-950 text-slate-50 h-screen overflow-hidden flex`}>
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur shrink-0 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Branding (hidden on desktop since sidebar has it) */}
              <div className="lg:hidden font-bold text-emerald-400 mr-4">ARGUS</div>
              <SimulatorControls />
            </div>
            
            <div className="flex items-center gap-4">
              <TimeRangePicker />
              <div className="h-6 w-px bg-slate-800 mx-1"></div>
              <ExportMenu />
              <div className="flex items-center text-sm font-medium text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE
              </div>
            </div>
          </header>
          
          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
