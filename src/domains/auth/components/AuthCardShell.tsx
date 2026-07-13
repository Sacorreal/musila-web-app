import React from "react";
import Link from "next/link";
import { MusilaLogo } from "@/src/shared/components/Icons/icons";
import { cn } from "@/src/shared/libs/cn";

interface AuthCardShellProps {
  children: React.ReactNode;
  title: React.ReactNode;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  logoHref?: string;
  maxWidth?: "md" | "lg";
  align?: "center" | "start";
  centerHeading?: boolean;
}

export function AuthCardShell({
  children,
  title,
  badge,
  description,
  footer,
  logoHref = "/",
  maxWidth = "md",
  align = "center",
  centerHeading = false,
}: AuthCardShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/4 rounded-full blur-3xl" />
      </div>

      <header className="p-6 border-b border-border/50 backdrop-blur-sm">
        <Link href={logoHref} className="inline-flex items-center gap-2">
          <MusilaLogo className="h-auto w-auto text-primary" />
        </Link>
      </header>

      <main
        className={cn(
          "flex-1 flex justify-center p-4 sm:p-6",
          align === "center" ? "items-center" : "items-start py-8 sm:py-10",
        )}
      >
        <div
          className={cn(
            "w-full space-y-6 sm:space-y-8",
            maxWidth === "md" ? "max-w-md" : "max-w-lg",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-2",
              centerHeading && "text-center",
            )}
          >
            {badge && (
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold uppercase tracking-widest w-fit",
                  centerHeading && "mx-auto",
                )}
              >
                {badge}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-xl shadow-black/5">
            {children}
          </div>

          {footer}
        </div>
      </main>
    </div>
  );
}
