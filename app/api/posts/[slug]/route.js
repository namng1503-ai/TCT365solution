import { guard } from '@/lib/auth';
import { savePost, deletePost, StorageError } from '@/lib/posts';
import { cleanPost, revalidateAll } from '@/lib/postInput';

const fail = e => Response.json({ error: e instanceof StorageError ? e.message : 'Thao tác không thành công. Vui lòng thử lại.' }, { status: 500 });

export async function PUT(req, { params }) {
  const denied = await guard();
  if (denied) return denied;
  const { slug } = await params;
  const { post, error } = cleanPost(await req.json().catch(() => ({})), slug);
  if (error) return Response.json({ error }, { status: 400 });
  try { await savePost(post); } catch (e) { return fail(e); }
  revalidateAll(slug);
  return Response.json({ ok: true, slug });
}

export async function DELETE(_req, { params }) {
  const denied = await guard();
  if (denied) return denied;
  const { slug } = await params;
  try { await deletePost(slug); } catch (e) { return fail(e); }
  revalidateAll(slug);
  return Response.json({ ok: true });
}
