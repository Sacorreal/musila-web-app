'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  ShieldAlert, 
  User, 
  ChevronDown,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/src/shared/components/UI/dropdown-menu';
import { Button } from '@/src/shared/components/UI/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/components/UI/dialog';
import { useGuests } from '@/src/domains/guests/hooks/use-guests.hooks';
import { 
  usePlaylistCollaborators, 
  useAddMultiplePlaylistCollaborators, 
  useRemovePlaylistCollaborator 
} from '../hooks/use-playlist-collaborators.hooks';
import { CollaboratorPermission } from '../types/playlist-collaborator.types';

import { DeleteCollaboratorDialog } from './DeleteCollaboratorDialog';

interface PlaylistCollaboratorsManagerProps {
  playlistId: string;
}

export function PlaylistCollaboratorsManager({ playlistId }: PlaylistCollaboratorsManagerProps) {
  const { data: collaborators, isLoading: isCollabsLoading } = usePlaylistCollaborators(playlistId);
  const { data: guestsData, isLoading: isGuestsLoading } = useGuests(1, 100); // Fetch up to 100 guests for the dropdown
  
  const addMultipleMutation = useAddMultiplePlaylistCollaborators();
  const removeMutation = useRemovePlaylistCollaborator();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<Record<string, CollaboratorPermission>>({});

  // State for delete confirmation
  const [collaboratorToDelete, setCollaboratorToDelete] = useState<{ id: string, name: string } | null>(null);

  const guests = guestsData?.data || [];
  
  // Filter out guests who are already collaborators
  const availableGuests = guests.filter(
    (guest) => !collaborators?.some((collab) => collab.guest?.id === guest.id)
  );

  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev => {
      const next = { ...prev };
      if (next[guestId]) {
        delete next[guestId];
      } else {
        next[guestId] = CollaboratorPermission.READ;
      }
      return next;
    });
  };

  const changeGuestPermission = (guestId: string, permission: CollaboratorPermission) => {
    setSelectedGuests(prev => ({
      ...prev,
      [guestId]: permission
    }));
  };

  const handleBulkAddCollaborators = () => {
    const collabsArray = Object.entries(selectedGuests).map(([guestId, permission]) => ({
      guestId,
      permission
    }));

    if (collabsArray.length === 0) return;

    addMultipleMutation.mutate({
      playlistId,
      data: {
        collaborators: collabsArray
      }
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setSelectedGuests({});
      }
    });
  };

  const handleConfirmRemove = () => {
    if (!collaboratorToDelete) return;
    
    removeMutation.mutate(
      { playlistId, guestId: collaboratorToDelete.id },
      {
        onSuccess: () => {
          setCollaboratorToDelete(null);
        }
      }
    );
  };

  const getPermissionLabel = (permission: CollaboratorPermission) => {
    switch (permission) {
      case CollaboratorPermission.ADMIN: return 'Administrador';
      case CollaboratorPermission.WRITE: return 'Editor';
      case CollaboratorPermission.READ: return 'Lector';
      default: return permission;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground tracking-tight">Colaboradores</h3>
          <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {collaborators?.length || 0}
          </span>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-xl border-dashed">
              <UserPlus className="w-3.5 h-3.5" />
              <span className="text-xs">Invitar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[2rem] p-6 bg-card border-border">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-black">Agregar Colaboradores</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Guests List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Seleccionar Invitados</label>
                  <span className="text-xs font-bold text-primary">{Object.keys(selectedGuests).length} seleccionados</span>
                </div>
                
                {isGuestsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : availableGuests.length === 0 ? (
                  <div className="text-center p-6 bg-muted/30 rounded-2xl border border-dashed">
                    <p className="text-sm text-muted-foreground">No tienes más invitados disponibles para agregar.</p>
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {availableGuests.map((guest) => {
                      const isSelected = selectedGuests[guest.id] !== undefined;
                      return (
                        <div 
                          key={guest.id} 
                          className={`flex flex-col gap-2 p-3 rounded-2xl border transition-colors cursor-pointer ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
                          }`}
                          onClick={() => !isSelected && toggleGuestSelection(guest.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0" onClick={() => isSelected && toggleGuestSelection(guest.id)}>
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                {guest.avatar ? (
                                  <img src={guest.avatar} alt={guest.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  <span className="text-xs font-bold text-primary">{guest.name.charAt(0)}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold truncate">{guest.name} {guest.lastName}</p>
                                <p className="text-xs text-muted-foreground truncate">{guest.email}</p>
                              </div>
                            </div>
                            
                            <div className="shrink-0 flex items-center gap-2">
                              {isSelected ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" onClick={(e) => { e.stopPropagation(); toggleGuestSelection(guest.id); }} />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                              )}
                            </div>
                          </div>

                          {/* Permission Selector (only visible if selected) */}
                          {isSelected && (
                            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                              {Object.values(CollaboratorPermission).map((perm) => (
                                <button
                                  key={perm}
                                  onClick={() => changeGuestPermission(guest.id, perm as CollaboratorPermission)}
                                  className={`flex items-center justify-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                                    selectedGuests[guest.id] === perm 
                                      ? 'bg-primary border-primary text-primary-foreground shadow-sm' 
                                      : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted'
                                  }`}
                                >
                                  {perm === CollaboratorPermission.ADMIN && <ShieldAlert className="w-3.5 h-3.5" />}
                                  {perm === CollaboratorPermission.WRITE && <Shield className="w-3.5 h-3.5" />}
                                  {perm === CollaboratorPermission.READ && <User className="w-3.5 h-3.5" />}
                                  <span className="text-[10px] font-bold">{getPermissionLabel(perm as CollaboratorPermission)}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleBulkAddCollaborators} 
                disabled={addMultipleMutation.isPending || Object.keys(selectedGuests).length === 0}
                className="w-full rounded-2xl h-12 font-bold"
              >
                {addMultipleMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Agregar ${Object.keys(selectedGuests).length} Colaboradores`
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collaborators List */}
      <div className="bg-muted/20 border border-border rounded-2xl p-2">
        {isCollabsLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : !collaborators || collaborators.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-xs text-muted-foreground">No hay colaboradores en esta playlist.</p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {collaborators.map((collab) => (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {collab.guest?.avatar ? (
                        <img src={collab.guest.avatar} alt={collab.guest.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-primary">{collab.guest?.name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {collab.guest?.name} {collab.guest?.lastName}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          collab.permission === CollaboratorPermission.ADMIN ? 'bg-red-500' :
                          collab.permission === CollaboratorPermission.WRITE ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                          {getPermissionLabel(collab.permission)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 focus:bg-red-500/10 rounded-lg text-xs"
                        onClick={() => setCollaboratorToDelete({ 
                          id: collab.guest?.id!, 
                          name: `${collab.guest?.name} ${collab.guest?.lastName}` 
                        })}
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <DeleteCollaboratorDialog 
        isOpen={!!collaboratorToDelete}
        onOpenChange={(open) => !open && setCollaboratorToDelete(null)}
        onConfirm={handleConfirmRemove}
        isLoading={removeMutation.isPending}
        collaboratorName={collaboratorToDelete?.name}
      />
    </div>
  );
}
