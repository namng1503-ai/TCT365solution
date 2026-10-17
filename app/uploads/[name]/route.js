import { readLocalUpload } from '@/lib/posts';

// Phục vụ ảnh tải lên khi chạy local (không có Vercel Blob).
const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };

export async function GET(_req, { params }) {
  const { name } = await params;
  try {
    const buf = await readLocalUpload(name);
    const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
    return new Response(buf, { headers: { 'Content-Type': types[ext] || 'application/octet-stream' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
