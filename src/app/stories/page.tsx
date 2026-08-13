import { getMetadata } from '@/lib/r2';
import StoriesClient from './StoriesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StoriesPage() {
  const metadata = await getMetadata();
  const cdn = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.shivshiv.in';

  let stories = [];
  if (metadata?.stories) {
    stories = metadata.stories.map((story: any) => {
      const imageUrl = story.thumbnail_filename ? `${cdn}/${story.thumbnail_filename}` : "";
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
  }
  
  // Reverse to show the latest added items first
  stories.reverse();

  return <StoriesClient initialStories={stories} />;
}
