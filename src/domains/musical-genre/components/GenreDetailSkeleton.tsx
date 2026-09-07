import React from "react";

export function GenreDetailSkeleton() {
  return (
    <div className="container mx-auto p-8 animate-pulse">
      <div className="h-12 w-48 bg-slate-800 rounded mb-8" />
      <div className="h-10 w-full bg-slate-800 rounded mb-12" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 w-full bg-slate-800 rounded" />
        ))}
      </div>
    </div>
  );
}
