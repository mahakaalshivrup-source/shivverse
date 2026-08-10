'use client';

import ReactMarkdown from 'react-markdown';
import TypewriterText from './TypewriterText';

// Helper to generate a slug from text (e.g., "Our Purpose" -> "our-purpose")
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ node, ...props }) => {
          const { children, ...rest } = props;
          // generate ID from the text content of the heading
          const id = slugify(String(children));
          return <h2 id={id} {...rest}>{children}</h2>;
        },
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
