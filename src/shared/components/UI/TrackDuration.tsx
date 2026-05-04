'use client';

import React, { useEffect, useState } from 'react';
import { calculateAudioDuration } from '@/src/shared/libs/audioUtils';

interface TrackDurationProps {
  audioUrl?: string | null;
  fallback?: string;
  className?: string;
}

export function TrackDuration({ audioUrl, fallback = "3:12", className }: TrackDurationProps) {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    if (audioUrl) {
      calculateAudioDuration(audioUrl).then((time) => {
        if (mounted && time > 0) {
          setDuration(time);
        }
      });
    }
    return () => { mounted = false; };
  }, [audioUrl]);

  if (!duration) {
    return <span className={className}>{fallback}</span>;
  }

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
  
  return <span className={className}>{minutes}:{seconds}</span>;
}
