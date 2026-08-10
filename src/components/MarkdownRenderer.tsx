'use client';

import ReactMarkdown from 'react-markdown';
import TypewriterText from './TypewriterText';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        blockquote: ({ node, ...props }) => {
          const { children, ...rest } = props;
          return (
            <blockquote
              {...rest}
              className="border-l-2 border-white/30 pl-6 my-8 italic text-white/80 font-serif text-xl md:text-2xl leading-relaxed"
            >
              <TypewriterText>{children}</TypewriterText>
            </blockquote>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
