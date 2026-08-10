import fs from 'fs';
import path from 'path';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export const metadata = {
  title: 'About | Shiva Verse',
  description: 'Learn about the vision and purpose behind Shiva Verse.',
};

export default function AboutPage() {
  // Read the markdown file from the content directory
  const filePath = path.join(process.cwd(), 'content', 'about.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-6 flex justify-center">
      <div className="prose prose-invert prose-lg max-w-4xl w-full
                      prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-wide
                      prose-headings:relative prose-headings:inline-block prose-headings:after:content-[''] prose-headings:after:absolute prose-headings:after:w-full prose-headings:after:scale-x-0 prose-headings:after:h-[2px] prose-headings:after:bottom-0 prose-headings:after:left-0 prose-headings:after:bg-white prose-headings:after:origin-bottom-right prose-headings:after:transition-transform prose-headings:after:duration-300 hover:prose-headings:after:scale-x-100 hover:prose-headings:after:origin-bottom-left hover:prose-headings:cursor-pointer
                      prose-h1:text-white prose-h2:text-white/90 
                      prose-p:text-white/70 prose-p:leading-relaxed 
                      prose-a:text-white prose-a:underline-offset-4 
                      prose-ul:text-white/70 prose-li:marker:text-white/40">
        <MarkdownRenderer content={markdownContent} />
      </div>
    </main>
  );
}
