import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (!channelId) {
    return NextResponse.json({ success: false, error: 'No channelId provided' }, { status: 400 });
  }

  try {
    // 1. Fetch the public RSS feed (unblockable)
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssRes = await fetch(rssUrl, { next: { revalidate: 60 } });
    
    if (!rssRes.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch RSS feed' });
    }

    const xml = await rssRes.text();

    // 2. Extract the very first entry (most recent video / live stream)
    const entryMatch = xml.match(/<entry>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<yt:videoId>(.*?)<\/yt:videoId>/);

    if (!entryMatch || !entryMatch[2]) {
      return NextResponse.json({ success: false, error: 'No videos found in feed' });
    }

    const title = entryMatch[1];
    const videoId = entryMatch[2];

    // 3. The Live Check (CDN HEAD request trick)
    // Live streams have a special hqdefault_live.jpg thumbnail. VODs do not (it returns 404).
    let isLive = false;
    try {
      const cdnRes = await fetch(`https://i.ytimg.com/vi/${videoId}/hqdefault_live.jpg`, { method: 'HEAD' });
      if (cdnRes.status === 200) {
        isLive = true;
      }
    } catch (e) {
      console.error('CDN HEAD request failed:', e);
    }

    return NextResponse.json({
      success: true,
      videoId,
      title,
      isLive
    });

  } catch (error) {
    console.error('Error fetching stream:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
