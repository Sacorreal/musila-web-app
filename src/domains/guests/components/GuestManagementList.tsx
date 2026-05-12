'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreHorizontal, 
  User, 
  Mail, 
  Trash2, 
  Edit, 
  Shield, 
  Clock, 
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Users
} from 'lucide-react';
import { useGuests, useUpdateGuest, useDeleteGuest } from '../hooks/use-guests.hooks';
import { Button } from '@/src/shared/components/UI/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/src/shared/components/UI/dropdown-menu';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { GuestResponse } from '../types/guests.types';

export function GuestManagementList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGuests(page);
  const deleteMutation = useDeleteGuest();
  
  const guests = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este invitado? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-muted/20 animate-pulse rounded-2xl border border-border" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-red-500/5 rounded-3xl border border-red-500/10">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-bold">Error al cargar los invitados</h3>
        <p className="text-sm text-muted-foreground">Por favor, intenta de nuevo más tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Mis Invitados</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los colaboradores que ya se han unido a tu equipo.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold">
          <UserCheck className="w-3.5 h-3.5" />
          {total} Total
        </div>
      </div>

      {guests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-card border border-border rounded-[2.5rem] border-dashed">
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold">Sin invitados registrados</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Aún no hay usuarios que hayan completado su registro con tus invitaciones.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {guests.map((guest, i) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex items-center justify-between p-5 bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 rounded-[2rem] transition-all duration-300"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                      {guest.avatar ? (
                        <img src={guest.avatar} alt={guest.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    {guest.isVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h4 className="font-bold text-foreground text-base truncate">
                      {guest.name} {guest.lastName}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{guest.email}</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Unido el {format(new Date(guest.createdAt), 'dd MMM, yyyy', { locale: es })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                      <DropdownMenuItem className="rounded-xl p-3 cursor-not-allowed opacity-50">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="rounded-xl p-3 text-red-500 focus:text-red-500 focus:bg-red-500/10"
                        onClick={() => handleDelete(guest.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar acceso
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-bold tracking-widest uppercase">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
