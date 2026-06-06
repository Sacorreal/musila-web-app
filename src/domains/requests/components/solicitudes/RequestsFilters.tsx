import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/src/shared/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/UI/select";
import { STATUS_CONFIG } from "../../constants/request-status.config";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  placeholder: string;
  resultsCount: number;
}

export function RequestsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  placeholder,
  resultsCount,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-card/60 backdrop-blur-sm border border-border rounded-2xl shadow-sm">
      <div className="relative flex-1 w-full">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-background border-border focus-visible:ring-primary/30 w-full"
        />
      </div>
      <div className="flex items-center gap-2 flex-1 sm:flex-none">
        <Filter size={16} className="text-muted-foreground hidden sm:block" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl bg-background border-border font-semibold focus:ring-primary/30">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todos los estados</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
        {resultsCount} {resultsCount === 1 ? "resultado" : "resultados"}
      </span>
    </div>
  );
}
