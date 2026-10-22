import fs from 'node:fs/promises';
import path from 'node:path';
import { put, list, del } from '@vercel/blob';
import { parsePost, serializePost } from './frontmatter.js';

// Hai nguồn bài viết:
//  - repo:  content/posts/*.md (bài mẫu, đi kèm mã nguồn)
//  - store: bài đăng từ /admin → Vercel Blob nếu có BLOB_READ_WRITE_TOKEN, ngược lại ghi vào content/ (chạy local)
// Bài trong store trùng slug sẽ thay thế bài repo. Xoá bài repo trên Vercel = đặt "dấu xoá" deleted/<slug>.
const REPO_DIR = path.join(process.cwd(), 'content', 'posts');
const UPLOAD_DIR = path.join(process.cwd(), 'content', 'uploads');
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export class StorageError extends Error {}

function assertWritable() {
  if (!useBlob() && process.env.VERCEL) {
    throw new StorageError('Chưa kết nối Vercel Blob. Vào Vercel → Storage → Create Blob → Connect với dự án, rồi Redeploy.');
  }
}

async function readRepoPosts() {
  let files = [];
  try { files = await fs.readdir(REPO_DIR); } catch { return []; }
  return Promise.all(files.filter(f => f.endsWith('.md')).map(async f => {
    const slug = f.slice(0, -3);
    return { ...parsePost(await fs.readFile(path.join(REPO_DIR, f), 'utf8'), slug), source: 'repo' };
  }));
}

// Blob: posts/<slug>/<random>.md — mỗi lần lưu là một URL mới nên không bị CDN trả bản cũ.
async function listAllBlobs(prefix) {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function readBlobState() {
  const [postBlobs, deletedBlobs] = await Promise.all([listAllBlobs('posts/'), listAllBlobs('deleted/')]);
  const latest = new Map();
  for (const b of postBlobs) {
    const slug = b.pathname.split('/')[1];
    const cur = latest.get(slug);
    if (!cur || new Date(b.uploadedAt) > new Date(cur.uploadedAt)) latest.set(slug, b);
  }
  // ponytail: tải từng bài khi liệt kê; đủ cho blog vài trăm bài, cần thì thêm file chỉ mục.
  const posts = await Promise.all([...latest].map(async ([slug, b]) => {
    const res = await fetch(b.url, { cache: 'no-store' });
    return { ...parsePost(await res.text(), slug), source: 'store' };
  }));
  return { posts, deleted: new Set(deletedBlobs.map(b => b.pathname.split('/')[1])), postBlobs, deletedBlobs };
}

export async function getPosts() {
  const repo = await readRepoPosts();
  const bySlug = new Map(repo.map(p => [p.slug, p]));
  if (useBlob()) {
    const { posts, deleted } = await readBlobState();
    for (const p of posts) bySlug.set(p.slug, p);
    for (const s of deleted) bySlug.delete(s);
  }
  const key = p => `${p.date || ''} ${p.time || '00:00'}`;
  return [...bySlug.values()].sort((a, b) => key(b).localeCompare(key(a)));
}

export async function getPost(slug) {
  return (await getPosts()).find(p => p.slug === slug) ?? null;
}

export async function savePost(post) {
  assertWritable();
  const md = serializePost(post);
  if (!useBlob()) {
    await fs.mkdir(REPO_DIR, { recursive: true });
    await fs.writeFile(path.join(REPO_DIR, `${post.slug}.md`), md, 'utf8');
    return;
  }
  const { postBlobs, deletedBlobs } = await readBlobState();
  await put(`posts/${post.slug}/post.md`, md, { access: 'public', addRandomSuffix: true, contentType: 'text/markdown; charset=utf-8' });
  const stale = [...postBlobs, ...deletedBlobs].filter(b => b.pathname.split('/')[1] === post.slug).map(b => b.url);
  if (stale.length) await del(stale);
}

export async function deletePost(slug) {
  assertWritable();
  if (!useBlob()) {
    await fs.rm(path.join(REPO_DIR, `${slug}.md`), { force: true });
    return;
  }
  const { postBlobs } = await readBlobState();
  const mine = postBlobs.filter(b => b.pathname.split('/')[1] === slug).map(b => b.url);
  if (mine.length) await del(mine);
  const inRepo = (await readRepoPosts()).some(p => p.slug === slug);
  if (inRepo) await put(`deleted/${slug}`, '1', { access: 'public', addRandomSuffix: false, allowOverwrite: true });
}

export async function saveUpload(file) {
  assertWritable();
  const ext = (file.name.match(/\.[a-z0-9]+$/i)?.[0] || '').toLowerCase();
  const base = file.name.replace(/\.[^.]+$/, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 40) || 'anh';
  if (useBlob()) {
    const blob = await put(`uploads/${base}${ext}`, file, { access: 'public', addRandomSuffix: true, contentType: file.type });
    return blob.url;
  }
  const name = `${Date.now()}-${base}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function readLocalUpload(name) {
  return fs.readFile(path.join(UPLOAD_DIR, path.basename(name)));
}
