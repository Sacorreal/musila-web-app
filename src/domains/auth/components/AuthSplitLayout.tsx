import React from "react";
import Link from "next/link";
import { MusilaLogo } from "@/src/shared/components/Icons/icons";

interface AuthSplitLayoutProps {
  leftPanel: React.ReactNode;
  children: React.ReactNode;
  logoHref?: string;
  logoClassName?: string;
}

export function AuthSplitLayout({
  leftPanel,
  children,
  logoHref = "/",
  logoClassName = "flex items-center gap-2 mb-8",
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-card items-center justify-center p-12 relative overflow-hidden">
        {leftPanel}
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href={logoHref} className={logoClassName}>
            <MusilaLogo className="h-auto w-auto text-primary" />
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
