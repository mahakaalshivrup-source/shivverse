'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { TrishulLoader } from './TrishulLoader';

export function CloudflareImage({ src, alt, className, priority = false }: { src: string, alt: string, className?: string, priority?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <TrishulLoader size={32} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
