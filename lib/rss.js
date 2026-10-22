// Nguồn RSS 2.0 cho mục Tin tức — Make.com/Zapier đọc nguồn này để tự đăng bài mới lên fanpage.
// Hàm thuần (không đọc file, không gọi mạng) để kiểm thử được bằng node:test.

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

// Ảnh bìa có thể là đường dẫn trong web (/images/...) hoặc URL đầy đủ (ảnh upload lên Blob).
export const absoluteUrl = (u, base) => (!u ? '' : /^https?:\/\//i.test(u) ? u : `${base.replace(/\/$/, '')}/${u.replace(/^\//, '')}`);

// Ngày YYYY-MM-DD + giờ HH:MM (giờ Việt Nam); thiếu giờ → 08:00.
export const rfc822 = (d, time) => {
  const hm = /^\d{2}:\d{2}$/.test(time || '') ? time : '08:00';
  const t = new Date(/^\d{4}-\d{2}-\d{2}$/.test(d || '') ? `${d}T${hm}:00+07:00` : d);
  return isNaN(t) ? '' : t.toUTCString();
};

const imageType = u => (/\.png(\?|$)/i.test(u) ? 'image/png' : /\.jpe?g(\?|$)/i.test(u) ? 'image/jpeg' : /\.gif(\?|$)/i.test(u) ? 'image/gif' : 'image/webp');

export function buildRss({ posts, siteUrl, title, description, limit = 30 }) {
  const base = siteUrl.replace(/\/$/, '');
  const items = posts.slice(0, limit).map(p => {
    const link = `${base}/bai-viet/${p.slug}`;
    const img = absoluteUrl(p.cover, base);
    return [
      '    <item>',
      `      <title>${esc(p.title)}</title>`,
      `      <link>${esc(link)}</link>`,
      `      <guid isPermaLink="true">${esc(link)}</guid>`,
      p.date && `      <pubDate>${rfc822(p.date, p.time)}</pubDate>`,
      p.category && `      <category>${esc(p.category)}</category>`,
      `      <description>${esc(p.excerpt)}</description>`,
      img && `      <enclosure url="${esc(img)}" length="0" type="${imageType(img)}"/>`,
      img && `      <media:content url="${esc(img)}" medium="image"/>`,
      '    </item>',
    ].filter(Boolean).join('\n');
  });
  const newest = posts[0]?.date ? rfc822(posts[0].date, posts[0].time) : '';
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    `    <title>${esc(title)}</title>`,
    `    <link>${esc(`${base}/bai-viet`)}</link>`,
    `    <description>${esc(description)}</description>`,
    '    <language>vi</language>',
    `    <atom:link href="${esc(`${base}/rss.xml`)}" rel="self" type="application/rss+xml"/>`,
    newest && `    <lastBuildDate>${newest}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].filter(Boolean).join('\n');
}
