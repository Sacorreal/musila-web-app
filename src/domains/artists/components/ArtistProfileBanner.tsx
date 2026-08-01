import React from 'react';
import { AuthorResponse } from '@/src/domains/artists/types/artist.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/UI/avatar';
import { VerifiedBadge } from '@/src/shared/components/UI/verified-badge';
import { FollowButton } from '@/src/domains/artists/components/FollowButton';
import { ProfileShareButton } from '@/src/domains/sharing/components/ProfileShareButton';
import { Repeat2 } from 'lucide-react';

interface ArtistProfileBannerProps {
  artist: AuthorResponse;
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
                <AvatarImage src={artist.avatar ?? undefined} alt={`${artist.name} ${artist.lastName}`} className="object-cover" />
                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-foreground dark:text-white font-bold text-2xl">
                  {artist.name?.charAt(0)}{artist.lastName?.charAt(0)}
                </AvatarFallback>
             </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black drop-shadow-md tracking-tight">
              {artist.name} {artist.lastName}
            </h1>
            {artist.plan === 'pro' && <VerifiedBadge size={32} className="text-white drop-shadow-md" />}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-2 px-2">
        <FollowButton artist={artist} />
        <ProfileShareButton artist={artist} />
      </div>
    </div>
  );
}
