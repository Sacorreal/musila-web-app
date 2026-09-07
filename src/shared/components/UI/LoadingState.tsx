import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/shared/libs/cn";

interface LoadingStateProps {
  message?: string;
  className?: string;
  iconClassName?: string;
}

export function LoadingState({
  message,
  className,
  iconClassName,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-24",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={cn("h-8 w-8 animate-spin text-primary", iconClassName)}
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
