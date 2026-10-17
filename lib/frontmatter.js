// Frontmatter tối giản: mỗi dòng "key: value", giá trị là JSON string để an toàn với dấu ":" và ngoặc kép.
const KEYS = ['title', 'date', 'category', 'excerpt', 'cover'];

export function serializePost(post) {
  const head = KEYS.map(k => `${k}: ${JSON.stringify(post[k] ?? '')}`).join('\n');
  return `---\n${head}\n---\n${post.body ?? ''}`;
}

export function parsePost(md, slug) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(md);
  const post = { slug, title: slug, date: '', category: '', excerpt: '', cover: '', body: m ? m[2] : md };
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i < 0) continue;
      const key = line.slice(0, i).trim();
      const raw = line.slice(i + 1).trim();
      if (!KEYS.includes(key)) continue;
      try { post[key] = JSON.parse(raw); } catch { post[key] = raw.replace(/^["']|["']$/g, ''); }
    }
  }
  return post;
}
