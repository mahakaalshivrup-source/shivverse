import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (!channelId) {
    return NextResponse.json({ success: false, error: 'No channelId provided' }, { status: 400 });
  }

  try {
    // Fetch the public RSS feed for the channel (Vercel caches this for 60 seconds)
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(rssUrl, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch RSS feed' }, { status: res.status });
    }

    const xml = await res.text();

    // Extract the very first videoId and title (which is always the most recent or active live stream)
    const videoIdMatch = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = xml.match(/<title>(.*?)<\/title>/); // The first title is the channel title, so we need the second one (the video title).

    // Better regex for the first entry's title:
    const entryMatch = xml.match(/<entry>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<yt:videoId>(.*?)<\/yt:videoId>/);

    if (entryMatch && entryMatch[2]) {
      const title = entryMatch[1] || 'Live Stream';
      const videoId = entryMatch[2];
      
      return NextResponse.json({
        success: true,
        videoId: videoId,
        title: title
      });
    }

    return NextResponse.json({ success: false, error: 'No videos found in feed' });

  } catch (error) {
    console.error('Error fetching RSS:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
