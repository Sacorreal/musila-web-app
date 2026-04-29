'use client'

import React, { useState } from 'react';
import { useCreatePlaylist } from '../hooks/use-playlist.hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/components/UI/dialog';
import { Button } from '@/src/shared/components/UI/button';
import { PlusIcon } from '@/src/shared/components/Icons/icons';

export function CreatePlaylistDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const createPlaylist = useCreatePlaylist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createPlaylist.mutate(
      { title: title.trim() },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <PlusIcon className="w-5 h-5" />
          <span>Crear Playlist</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Playlist</DialogTitle>
          <DialogDescription>
            Dale un nombre a tu nueva lista de reproducción. Podrás añadir pistas más tarde.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Favoritos 2025"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createPlaylist.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || createPlaylist.isPending}>
              {createPlaylist.isPending ? 'Creando...' : 'Crear Playlist'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
