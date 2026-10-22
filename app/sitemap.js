import { site } from '@/data/site';
import { services } from '@/data/services';
import { getPosts } from '@/lib/posts';

export const revalidate = 3600;

export default async function sitemap() {
  const posts = await getPosts().catch(() => []);
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/bai-viet` },
    { url: `${site.url}/tuyen-dung` },
    ...services.map(s => ({ url: `${site.url}/dich-vu/${s.slug}` })),
    ...posts.map(p => ({ url: `${site.url}/bai-viet/${p.slug}`, lastModified: p.date || undefined })),
  ];
}
