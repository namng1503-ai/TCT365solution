import { revalidatePath } from 'next/cache';

// Chuẩn hoá dữ liệu bài viết gửi lên từ trình soạn thảo. Trả { error } nếu không hợp lệ.
export function cleanPost(input, slug) {
  const s = v => String(v ?? '').trim();
  const post = {
    slug,
    title: s(input.title),
    date: s(input.date) || new Date().toISOString().slice(0, 10),
    time: /^\d{2}:\d{2}$/.test(s(input.time)) ? s(input.time) : '',
    category: s(input.category),
    excerpt: s(input.excerpt),
    cover: s(input.cover),
    body: String(input.body ?? ''),
  };
  if (!post.title) return { error: 'Vui lòng nhập tiêu đề bài viết.' };
  if (!post.slug) return { error: 'Đường dẫn bài viết không hợp lệ. Hãy dùng chữ cái hoặc số.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) return { error: 'Ngày đăng phải có dạng YYYY-MM-DD.' };
  return { post };
}

export function revalidateAll(slug) {
  revalidatePath('/');
  revalidatePath('/bai-viet');
  if (slug) revalidatePath(`/bai-viet/${slug}`);
}
