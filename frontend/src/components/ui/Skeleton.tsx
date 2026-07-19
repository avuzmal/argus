"use client";

import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-800 rounded-md ${className}`}
    />
  );
}

export function KPISkeleton() {
  return (
    <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      </div>
      <Skeleton className="h-4 w-40 mt-4" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Skeleton className="h-full w-full opacity-50" />
    </div>
  );
}
