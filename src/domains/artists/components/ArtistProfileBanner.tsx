import React from 'react';
import { UserDto } from '@/src/domains/users/types/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/UI/avatar';
import { Button } from '@/src/shared/components/UI/button';
import { Repeat2 } from 'lucide-react'; // Simulating share/retweet icon

interface ArtistProfileBannerProps {
  artist: UserDto;
}

export function ArtistProfileBanner({ artist }: ArtistProfileBannerProps) {
  // Use a provided banner url or a fallback elegant gradient
  const bannerUrl = (artist as any).bannerUrl;
  const backgroundStyle = bannerUrl
    ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundImage: 'linear-gradient(to right, #8CA496, #C8C5B9)' }; // Colors similar to the example mockup background

  return (
    <div className="flex flex-col gap-4">
      {/* Banner Image */}
      <div 
        className="w-full h-48 sm:h-64 rounded-xl relative overflow-hidden" 
        style={backgroundStyle}
      >
        {/* We place the avatar overlapping the bottom left if desired, or inside */}
        <div className="absolute inset-0 bg-black/10" /> {/* Subtle overlay */}
        <div className="absolute bottom-6 left-6 flex items-center gap-6">
           <div className="p-1 rounded-full bg-background/10 backdrop-blur-sm relative shadow-xl">
             <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-background">
                <AvatarImage src={artist.avatar} alt={`${artist.name} ${artist.lastName}`} className="object-cover" />
                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-foreground dark:text-white font-bold text-2xl">
                  {artist.name?.charAt(0)}{artist.lastName?.charAt(0)}
                </AvatarFallback>
             </Avatar>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black drop-shadow-md tracking-tight">
            {artist.name} {artist.lastName}
          </h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-2 px-2">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-semibold shadow-md transition-all">
          Seguir
        </Button>
        <Button variant="secondary" className="rounded-full px-5 font-semibold gap-2">
          <Repeat2 className="w-4 h-4" />
          Compartir
        </Button>
        <Button variant="secondary" className="rounded-full px-5 font-semibold">
          Enviar Mensaje
        </Button>
      </div>
    </div>
  );
}
