import React from "react";

export function LoginTestimonialPanel() {
  return (
    <div className="max-w-md">
      <div className="aspect-square rounded-3xl overflow-hidden mb-8">
        <img
          src="/musician-composing-music-in-studio-with-guitar.jpg"
          alt="Músico en estudio"
          className="w-full h-full object-cover"
        />
      </div>
      <blockquote className="text-lg text-muted-foreground italic">
        {`"Músila me ayudó a encontrar el intérprete perfecto para mi canción. Ahora suena en todas las radios."`}
      </blockquote>
      <p className="mt-4 font-semibold text-foreground">
        Carlos Mendoza, Compositor
      </p>
    </div>
  );
}
