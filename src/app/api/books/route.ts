import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// CRITICAL: Completely disable Next.js caching for this route so it detects new files instantly
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Resolve absolute path to the books directory
    const booksDirectory = path.join(process.cwd(), 'public', 'books');

    if (!fs.existsSync(booksDirectory)) {
      console.warn('Books directory not found at:', booksDirectory);
      return NextResponse.json({ books: [] });
    }

    // Read files synchronously
    const filenames = fs.readdirSync(booksDirectory);

    const books = filenames
      .filter((file) => file.toLowerCase().endsWith('.pdf'))
      .map((file, index) => {
        // Create a clean title from the filename
        const title = file
          .replace(/\.pdf$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        return {
          id: `book-${index}-${Date.now()}`, // Force unique ID
          title: title,
          pdfUrl: `/books/${file}`, // Path relative to public folder
        };
      });

    // Return the response with headers that strictly prevent browser caching
    // Wrapped in { books: [...] } to match the frontend's data.books accessor
    return NextResponse.json(
      { books },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error reading books directory:', error);
    return NextResponse.json(
      { error: 'Failed to load books' },
      { status: 500 }
    );
  }
}
