"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/src/shared/components/UI/dialog";
import { TrackRequestDetails } from "./TrackRequestDetails";
import { TrackRequest } from "../types/request.types";

interface Props {
  request: TrackRequest | null;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

export function TrackRequestDetailsDialog({ request, isOpen, onClose, isOwner }: Props) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-background shadow-2xl rounded-[2.5rem]">
        <DialogHeader className="sr-only">
          <DialogTitle>Detalles de la solicitud</DialogTitle>
        </DialogHeader>
        <div className="max-h-[90vh] overflow-y-auto p-6 md:p-10">
          <TrackRequestDetails 
            request={request} 
            isOwner={isOwner} 
            onClose={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
