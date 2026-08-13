'use client';
import React, { useState } from 'react';
import { TrishulLoader } from './TrishulLoader';

export function CloudflareImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <TrishulLoader size={32} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
