import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";

export function GenrePagination() {
  return (
    <div className="p-8 flex items-center justify-center gap-3 border-t border-white/5">
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full text-slate-500 hover:text-white hover:bg-white/10"
      >
        <ChevronLeft size={20} />
      </Button>
      <Button className="w-10 h-10 rounded-full bg-blue-500 text-white font-black text-xs p-0 shadow-lg shadow-blue-500/20">
        1
      </Button>
      <Button
        variant="ghost"
        className="w-10 h-10 rounded-full text-slate-500 font-black text-xs p-0 hover:text-white hover:bg-white/10"
      >
        2
      </Button>
      <Button
        variant="ghost"
        className="w-10 h-10 rounded-full text-slate-500 font-black text-xs p-0 hover:text-white hover:bg-white/10"
      >
        3
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full text-slate-500 hover:text-white hover:bg-white/10"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}
