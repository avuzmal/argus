"use client";

import { LayoutDashboard, Server, BarChart3, BellRing, Map, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/", active: true },
    { icon: <Server size={20} />, label: "Sensors", href: "/sensors" },
    { icon: <BarChart3 size={20} />, label: "Analytics", href: "/analytics" },
    { icon: <BellRing size={20} />, label: "Alerts", href: "/alerts" },
    { icon: <Map size={20} />, label: "Geospatial", href: "/map" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="w-64 h-full bg-slate-900/50 border-r border-slate-800 backdrop-blur flex flex-col hidden lg:flex">
      <div className="p-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
            <LayoutDashboard size={18} />
          </div>
          ARGUS
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-mono tracking-wider uppercase">Nexus Intelligence</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 mb-4 px-2 uppercase tracking-wider">Main Menu</div>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              item.active 
                ? 'bg-blue-500/10 text-blue-400 font-medium' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link href="/docs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
          <HelpCircle size={20} />
          Documentation
        </Link>
      </div>
    </div>
  );
}
