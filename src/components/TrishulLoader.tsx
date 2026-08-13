import React from 'react';
import Image from 'next/image';

interface TrishulLoaderProps {
  className?: string;
  size?: number;
}

export function TrishulLoader({ className = '', size = 32 }: TrishulLoaderProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
    >
      <Image 
        src="/logos/trishul-logo.png" 
        alt="Loading..." 
        width={size} 
        height={size} 
        className="object-contain w-full h-full animate-spin drop-shadow-md"
      />
    </div>
  );
}
