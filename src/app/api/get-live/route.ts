import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');

  if (!source) {
    return NextResponse.json({ isLive: false, error: 'No source provided' }, { status: 400 });
  }

  try {
    let cleanUrl = '';
    let title = '';

    // Handle @channel handles
    if (source.startsWith('@')) {
      const channelUrl = `https://www.youtube.com/${source}/live`;
      const res = await fetch(channelUrl, { cache: 'no-store' });
      const html = await res.text();

      // Scrape canonical URL
      const canonicalMatch = html.match(/<link rel="canonical" href="(https:\/\/www\.youtube\.com\/watch\?v=[^"]+)">/);
      // Scrape title
      const titleMatch = html.match(/<title>(.*?)<\/title>/);

      if (canonicalMatch && canonicalMatch[1]) {
        cleanUrl = canonicalMatch[1];
        title = titleMatch && titleMatch[1] ? titleMatch[1].replace(' - YouTube', '').trim() : 'Live Stream';
      } else {
        // If we can't find a watch?v canonical URL on the /live route, they probably aren't live right now.
        return NextResponse.json({ isLive: false });
      }
    } 
    // Handle direct URLs
    else {
      let videoId = '';
      
      if (source.includes('youtu.be/')) {
        videoId = source.split('youtu.be/')[1]?.split('?')[0];
      } else if (source.includes('youtube.com/live/')) {
        videoId = source.split('youtube.com/live/')[1]?.split('?')[0];
      } else if (source.includes('watch?v=')) {
        videoId = new URL(source).searchParams.get('v') || '';
      }

      if (!videoId) {
        return NextResponse.json({ isLive: false, error: 'Invalid URL format' });
      }

      cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Fetch title via oEmbed API
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        title = oembedData.title || 'Live Stream';
      } else {
        title = 'Live Stream'; // Fallback
      }
    }

    return NextResponse.json({
      isLive: true,
      url: cleanUrl,
      title: title
    });

  } catch (error) {
    console.error('Error fetching live status:', error);
    return NextResponse.json({ isLive: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
