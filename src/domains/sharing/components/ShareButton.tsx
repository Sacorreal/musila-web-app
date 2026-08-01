"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { ShareModal } from "./ShareModal";
import { ShareResourceType } from "../types/sharing.types";

interface ShareButtonProps {
  resourceType: ShareResourceType;
  resourceId: string;
  resourceTitle: string;
  variant?: "default" | "outline" | "ghost";
}

export function ShareButton({ resourceType, resourceId, resourceTitle, variant = "outline" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant={variant}
        className="gap-2 rounded-full font-bold px-4 sm:px-6 h-10 sm:h-12 transition-all duration-300 shadow-sm hover:shadow-md"
        onClick={() => setOpen(true)}
      >
        <Share2 className="w-5 h-5" />
        Compartir
      </Button>
      <ShareModal
        open={open}
        onOpenChange={setOpen}
        resourceType={resourceType}
        resourceId={resourceId}
        resourceTitle={resourceTitle}
      />
    </>
  );
}
