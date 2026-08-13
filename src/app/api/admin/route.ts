import { NextResponse } from 'next/server';
import { uploadToR2, getMetadata, saveMetadata, deleteFromR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

const CACHE_CONTROL_IMMUTABLE = 'public, max-age=31536000, immutable';

export async function GET() {
  const metadata = await getMetadata();
  const cdn = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.shivshiv.in';
  
  if (metadata.stories) {
    for (let s of metadata.stories) {
      if (s.thumbnail_filename) s.image_url = `${cdn}/${s.thumbnail_filename}`;
    }
  }
  if (metadata.mantras) {
    for (let m of metadata.mantras) {
      if (m.cover_filename) m.image_url = `${cdn}/${m.cover_filename}`;
    }
  }
  if (metadata.scriptures) {
    for (let b of metadata.scriptures) {
      if (b.thumbnail_filename) b.image_url = `${cdn}/${b.thumbnail_filename}`;
      if (b.pdf_filename) b.pdfUrl = `${cdn}/${b.pdf_filename}`;
    }
  }

  return NextResponse.json(metadata);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const metadata = await getMetadata();

    const timestamp = Date.now();
    const newId = timestamp;

    if (type === 'story') {
      const title = formData.get('title') as string;
      const source = formData.get('source') as string;
      const subheading = formData.get('subheading') as string;
      const content_en = formData.get('content_en') as string;
      const content_hi = formData.get('content_hi') as string;
      
      const thumbnailFile = formData.get('thumbnail') as File;
      const thumbnail_filename = `stories/${timestamp}-${thumbnailFile.name}`;
      
      await uploadToR2(Buffer.from(await thumbnailFile.arrayBuffer()), thumbnail_filename, thumbnailFile.type, CACHE_CONTROL_IMMUTABLE);
      
      metadata.stories.push({
        id: newId,
        title,
        source,
        subheading,
        content_en,
        content_hi,
        thumbnail_filename,
        created_at: new Date().toISOString(),
        updated_at: timestamp
      });
    } else if (type === 'mantra') {
      const title = formData.get('title') as string;
      const subtitle = formData.get('subtitle') as string;
      const caption_en = formData.get('caption_en') as string;
      const caption_hi = formData.get('caption_hi') as string;
      
      const audioFile = formData.get('audio') as File;
      const audio_filename = `audio/${timestamp}-${audioFile.name}`;
      await uploadToR2(Buffer.from(await audioFile.arrayBuffer()), audio_filename, audioFile.type, CACHE_CONTROL_IMMUTABLE);
      
      const coverFile = formData.get('cover') as File;
      const cover_filename = `mantras/${timestamp}-${coverFile.name}`;
      await uploadToR2(Buffer.from(await coverFile.arrayBuffer()), cover_filename, coverFile.type, CACHE_CONTROL_IMMUTABLE);
      
      metadata.mantras.push({
        id: newId,
        title,
        subtitle,
        audio_filename,
        cover_filename,
        caption_en,
        caption_hi,
        created_at: new Date().toISOString(),
        updated_at: timestamp
      });
    } else if (type === 'scripture') {
      const title = formData.get('title') as string;
      const category = formData.get('category') as string;
      
      const pdfFile = formData.get('pdf') as File;
      const pdf_filename = `books/${timestamp}-${pdfFile.name}`;
      await uploadToR2(Buffer.from(await pdfFile.arrayBuffer()), pdf_filename, pdfFile.type, CACHE_CONTROL_IMMUTABLE);
      
      const thumbnailFile = formData.get('thumbnail') as File;
      const thumbnail_filename = `books/${timestamp}-thumb.webp`;
      await uploadToR2(Buffer.from(await thumbnailFile.arrayBuffer()), thumbnail_filename, thumbnailFile.type, CACHE_CONTROL_IMMUTABLE);
      
      metadata.scriptures.push({
        id: newId,
        title,
        category,
        pdf_filename,
        thumbnail_filename,
        created_at: new Date().toISOString(),
        updated_at: timestamp
      });
    }

    await saveMetadata(metadata);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, type } = await request.json();
    const metadata = await getMetadata();
    
    if (type === 'story') {
      const item = metadata.stories.find((x: any) => x.id === id);
      if (item?.thumbnail_filename) await deleteFromR2(item.thumbnail_filename).catch(() => {});
      metadata.stories = metadata.stories.filter((x: any) => x.id !== id);
    } else if (type === 'mantra') {
      const item = metadata.mantras.find((x: any) => x.id === id);
      if (item?.audio_filename) await deleteFromR2(item.audio_filename).catch(() => {});
      if (item?.cover_filename) await deleteFromR2(item.cover_filename).catch(() => {});
      metadata.mantras = metadata.mantras.filter((x: any) => x.id !== id);
    } else if (type === 'scripture') {
      const item = metadata.scriptures.find((x: any) => x.id === id);
      if (item?.pdf_filename) await deleteFromR2(item.pdf_filename).catch(() => {});
      if (item?.thumbnail_filename) await deleteFromR2(item.thumbnail_filename).catch(() => {});
      metadata.scriptures = metadata.scriptures.filter((x: any) => x.id !== id);
    }

    await saveMetadata(metadata);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const id = Number(formData.get('id'));
    const metadata = await getMetadata();

    if (type === 'story') {
      const itemIndex = metadata.stories.findIndex((x: any) => x.id === id);
      if (itemIndex === -1) throw new Error("Story not found");
      const item = metadata.stories[itemIndex];

      item.title = formData.get('title') as string;
      item.source = formData.get('source') as string;
      item.subheading = formData.get('subheading') as string;
      item.content_en = formData.get('content_en') as string;
      item.content_hi = formData.get('content_hi') as string;
      
      const thumbnailFile = formData.get('thumbnail') as File | null;
      if (thumbnailFile && thumbnailFile.size > 0) {
        if (item.thumbnail_filename) await deleteFromR2(item.thumbnail_filename).catch(() => {});
        const thumbnail_filename = `stories/${Date.now()}-${thumbnailFile.name}`;
        await uploadToR2(Buffer.from(await thumbnailFile.arrayBuffer()), thumbnail_filename, thumbnailFile.type, CACHE_CONTROL_IMMUTABLE);
        item.thumbnail_filename = thumbnail_filename;
      }
      item.updated_at = Date.now();
    } else if (type === 'mantra') {
      const itemIndex = metadata.mantras.findIndex((x: any) => x.id === id);
      if (itemIndex === -1) throw new Error("Mantra not found");
      const item = metadata.mantras[itemIndex];

      item.title = formData.get('title') as string;
      item.subtitle = formData.get('subtitle') as string;
      item.caption_en = formData.get('caption_en') as string;
      item.caption_hi = formData.get('caption_hi') as string;
      
      const audioFile = formData.get('audio') as File | null;
      if (audioFile && audioFile.size > 0) {
        if (item.audio_filename) await deleteFromR2(item.audio_filename).catch(() => {});
        const audio_filename = `audio/${Date.now()}-${audioFile.name}`;
        await uploadToR2(Buffer.from(await audioFile.arrayBuffer()), audio_filename, audioFile.type, CACHE_CONTROL_IMMUTABLE);
        item.audio_filename = audio_filename;
      }
      
      const coverFile = formData.get('cover') as File | null;
      if (coverFile && coverFile.size > 0) {
        if (item.cover_filename) await deleteFromR2(item.cover_filename).catch(() => {});
        const cover_filename = `mantras/${Date.now()}-${coverFile.name}`;
        await uploadToR2(Buffer.from(await coverFile.arrayBuffer()), cover_filename, coverFile.type, CACHE_CONTROL_IMMUTABLE);
        item.cover_filename = cover_filename;
      }
      item.updated_at = Date.now();
    } else if (type === 'scripture') {
      const itemIndex = metadata.scriptures.findIndex((x: any) => x.id === id);
      if (itemIndex === -1) throw new Error("Scripture not found");
      const item = metadata.scriptures[itemIndex];

      item.title = formData.get('title') as string;
      item.category = formData.get('category') as string;
      
      const pdfFile = formData.get('pdf') as File | null;
      if (pdfFile && pdfFile.size > 0) {
        if (item.pdf_filename) await deleteFromR2(item.pdf_filename).catch(() => {});
        const pdf_filename = `books/${Date.now()}-${pdfFile.name}`;
        await uploadToR2(Buffer.from(await pdfFile.arrayBuffer()), pdf_filename, pdfFile.type, CACHE_CONTROL_IMMUTABLE);
        item.pdf_filename = pdf_filename;
        
        const thumbnailFile = formData.get('thumbnail') as File | null;
        if (thumbnailFile && thumbnailFile.size > 0) {
          if (item.thumbnail_filename) await deleteFromR2(item.thumbnail_filename).catch(() => {});
          const thumbnail_filename = `books/${Date.now()}-thumb.webp`;
          await uploadToR2(Buffer.from(await thumbnailFile.arrayBuffer()), thumbnail_filename, thumbnailFile.type, CACHE_CONTROL_IMMUTABLE);
          item.thumbnail_filename = thumbnail_filename;
        }
      }
      item.updated_at = Date.now();
    }

    await saveMetadata(metadata);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
