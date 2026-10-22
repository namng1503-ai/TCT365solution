import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { getPost } from '@/lib/posts';
import { postCategories, jobCategory } from '@/data/site';
import Editor from '@/components/admin/Editor';

export default async function EditorPage({ searchParams }) {
  if (!(await isAdmin())) redirect('/admin/login');
  const { slug, saved, loai } = await searchParams;
  // Editor chọn sẵn chuyên mục đầu tiên cho bài mới
  const categories = loai === 'tuyen-dung' ? [jobCategory, ...postCategories.filter(c => c !== jobCategory)] : postCategories;
  const post = slug ? await getPost(slug) : null;
  if (slug && !post) {
    return <p className="empty">Không tìm thấy bài viết “{slug}”. <Link href="/admin">Quay lại danh sách</Link></p>;
  }
  return <Editor key={post?.slug ?? "new"} initial={post} categories={categories} justSaved={Boolean(saved)} />;
}
