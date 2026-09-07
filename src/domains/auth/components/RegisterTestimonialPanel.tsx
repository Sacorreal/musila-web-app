import React from "react";

export function RegisterTestimonialPanel() {
  return (
    <div className="max-w-md">
      <div className="aspect-square rounded-3xl overflow-hidden mb-8">
        <img
          src="/two-musicians-collaborating-shaking-hands.jpg"
          alt="Músicos colaborando"
          className="w-full h-full object-cover"
        />
      </div>
      <blockquote className="text-lg text-muted-foreground italic">
        {`"Gracias a Músila pude grabar canciones de compositores increíbles que nunca hubiera conocido."`}
      </blockquote>
      <p className="mt-4 font-semibold text-foreground">
        María González, Intérprete
      </p>
    </div>
  );
}
