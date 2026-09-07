import React from "react";
import Link from "next/link";
import { MusilaLogo } from "@/src/shared/components/Icons/icons";
import { cn } from "@/src/shared/libs/cn";

interface CenteredAuthShellProps {
  children: React.ReactNode;
  logoHref?: string;
  logoClassName?: string;
  maxWidth?: "sm" | "md";
}

export function CenteredAuthShell({
  children,
  logoHref = "/",
  logoClassName = "mb-8",
  maxWidth = "md",
}: CenteredAuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Link href={logoHref} className={cn(logoClassName)}>
        <MusilaLogo className="h-10 w-auto text-primary" />
      </Link>
      <div className={cn("w-full", maxWidth === "sm" ? "max-w-sm" : "max-w-md")}>
        {children}
      </div>
    </div>
  );
}
