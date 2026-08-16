import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://shivshiv.in', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://shivshiv.in/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shivshiv.in/jyotirlingas', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shivshiv.in/mantras', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shivshiv.in/stories', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shivshiv.in/maps', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shivshiv.in/live', lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: 'https://shivshiv.in/scriptures', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shivshiv.in/contact', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]
}
