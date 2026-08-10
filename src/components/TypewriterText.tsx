'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import React from 'react';

// Extract text content from React children, preserving <br /> as newlines
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (React.isValidElement(children)) {
    if (children.type === 'br') {
      return '\n';
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractText((children.props as any).children);
  }
  return '';
}

export default function TypewriterText({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Convert children to string to animate letter by letter
  const text = extractText(children);
  
  return (
    <span ref={ref}>
      {text.split("").map((char, index) => {
        if (char === '\n') {
          return <br key={index} />;
        }
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.05, delay: index * 0.03 }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}
