import { guard } from '@/lib/auth';
import { saveUpload, StorageError } from '@/lib/posts';

const MAX = 4 * 1024 * 1024; // Vercel giới hạn body ~4.5MB

export async function POST(req) {
  const denied = await guard();
  if (denied) return denied;
  const file = (await req.formData().catch(() => null))?.get('file');
  if (!file || typeof file === 'string') return Response.json({ error: 'Chưa chọn ảnh.' }, { status: 400 });
  if (!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)) return Response.json({ error: 'Chỉ nhận ảnh PNG, JPG, WEBP, GIF hoặc AVIF.' }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: 'Ảnh lớn hơn 4MB. Hãy nén ảnh rồi tải lại.' }, { status: 400 });
  try {
    return Response.json({ url: await saveUpload(file) });
  } catch (e) {
    return Response.json({ error: e instanceof StorageError ? e.message : 'Tải ảnh không thành công.' }, { status: 500 });
  }
}
