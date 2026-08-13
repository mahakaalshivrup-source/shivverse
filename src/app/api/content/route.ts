import { NextResponse } from 'next/server';
import { getMetadata } from '@/lib/r2';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const metadata = await getMetadata();

    const cdn = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.shivshiv.in';

    // Transform Stories to match existing interface
    const stories = metadata.stories.map((story: any) => {
      const imageUrl = `${cdn}/${story.thumbnail_filename}`;
      return {
        id: story.id,
        title: story.title,
        source: story.source,
        sloka: story.subheading,
        english: story.content_en,
        hindi: story.content_hi,
        image: imageUrl,
      };
    });

    // Transform Mantras to match existing interface
    const mantras = metadata.mantras.map((mantra: any) => {
      const audioUrl = `${cdn}/${mantra.audio_filename}`;
      const coverUrl = `${cdn}/${mantra.cover_filename}`;
      
      let lyrics = [];
      let lyricsEn = [];
      try { lyrics = JSON.parse(mantra.caption_hi || "[]"); } catch { lyrics = [mantra.caption_hi]; }
      try { lyricsEn = JSON.parse(mantra.caption_en || "[]"); } catch { lyricsEn = [mantra.caption_en]; }

      return {
        id: mantra.id,
        title: mantra.title,
        subtitle: mantra.subtitle,
        audioSrc: audioUrl,
        thumbnail: coverUrl,
        lyrics: lyrics,
        lyricsEn: lyricsEn,
      };
    });

    // Transform Scriptures to match existing interface
    const scriptures = metadata.scriptures.map((book: any) => {
      const pdfUrl = `${cdn}/${book.pdf_filename}`;
      const thumbUrl = book.thumbnail_filename ? `${cdn}/${book.thumbnail_filename}` : "";
      return {
        id: book.id,
        title: book.title,
        pdfUrl: pdfUrl,
        thumbnailUrl: thumbUrl,
      };
    });

    return NextResponse.json(
      { stories, mantras, scriptures },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
