import { site } from '@/data/site';
import { getPosts } from '@/lib/posts';
import { buildRss } from '@/lib/rss';

// /rss.xml — nguồn tin cho Zapier tự đăng bài mới lên fanpage (xem docs/tin-tuc/DANG-FANPAGE.md).
export const revalidate = 300;

export async function GET() {
  const posts = await getPosts().catch(() => []);
  const xml = buildRss({
    posts,
    siteUrl: site.url,
    title: `${site.shortName} – Tin tức thuế, kế toán, doanh nghiệp`,
    description: site.description,
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' } });
}
