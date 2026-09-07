import React from "react";
import { cn } from "@/src/shared/libs/cn";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  stack?: "responsive" | "always";
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  titleClassName,
  descriptionClassName,
  stack = "responsive",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex justify-between gap-3 sm:gap-4",
        stack === "responsive"
          ? "flex-col sm:flex-row sm:items-center"
          : "flex-col",
        className,
      )}
    >
      <div>
        <h2
          className={cn(
            "text-xl font-black tracking-tight text-foreground",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
