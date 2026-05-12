'use client'

import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/src/shared/components/UI/alert-dialog';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeleteCollaboratorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  collaboratorName?: string;
}

export function DeleteCollaboratorDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  collaboratorName
}: DeleteCollaboratorDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] rounded-[2.5rem] p-8 border-border max-w-md w-[calc(100%-2rem)] bg-background shadow-2xl overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <AlertDialogHeader className="space-y-4">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-2 mx-auto sm:mx-0"
          >
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </motion.div>
          
          <div className="space-y-2">
            <AlertDialogTitle className="text-2xl font-black tracking-tight leading-tight">
              ¿Eliminar colaborador?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed">
              Estás a punto de remover a <strong className="text-foreground">{collaboratorName || 'este colaborador'}</strong> de la playlist. 
              Ya no tendrá acceso para colaborar ni ver el contenido privado de esta lista.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 gap-3 sm:gap-3">
          <AlertDialogCancel className="h-12 rounded-2xl font-bold px-6 border-border hover:bg-muted transition-all duration-300">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="h-12 rounded-2xl font-bold px-6 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 border-none transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar colaborador
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
