import { guard } from '@/lib/auth';
import { getPosts, savePost, StorageError } from '@/lib/posts';
import { slugify } from '@/lib/slugify';
import { cleanPost, revalidateAll } from '@/lib/postInput';

export async function POST(req) {
  const denied = await guard();
  if (denied) return denied;
  const input = await req.json().catch(() => ({}));
  const { post, error } = cleanPost(input, slugify(input.slug || input.title || ''));
  if (error) return Response.json({ error }, { status: 400 });
  if ((await getPosts()).some(p => p.slug === post.slug)) {
    return Response.json({ error: `Đã có bài viết với đường dẫn "${post.slug}". Hãy đổi tiêu đề hoặc đường dẫn.` }, { status: 409 });
  }
  try {
    await savePost(post);
  } catch (e) {
    return Response.json({ error: e instanceof StorageError ? e.message : 'Không lưu được bài viết. Vui lòng thử lại.' }, { status: 500 });
  }
  revalidateAll(post.slug);
  return Response.json({ ok: true, slug: post.slug });
}
