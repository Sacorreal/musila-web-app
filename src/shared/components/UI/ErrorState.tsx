import React from "react";
import { cn } from "@/src/shared/libs/cn";

interface ErrorStateProps {
  message: string;
  className?: string;
}

export function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "text-center py-24 text-sm text-muted-foreground",
        className,
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
