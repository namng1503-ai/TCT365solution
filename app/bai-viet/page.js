import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getPosts } from '@/lib/posts';
import { postCategories } from '@/data/site';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Bài viết kế toán – tài chính', description: 'Hướng dẫn, cập nhật chính sách thuế, kế toán và tài chính doanh nghiệp từ TCT365.' };

export default async function PostsPage({ searchParams }) {
  const cat = (await searchParams).chuyen_muc;
  const all = await getPosts();
  const posts = cat ? all.filter(p => p.category === cat) : all;
  const cats = [...new Set([...postCategories, ...all.map(p => p.category).filter(Boolean)])];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link> / Bài viết</nav>
          <h1>Kiến thức kế toán – tài chính</h1>
          <p>Hướng dẫn thủ tục, cập nhật chính sách thuế và kinh nghiệm thực tế cho doanh nghiệp.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <nav className="filters" aria-label="Lọc theo chuyên mục">
            <Link href="/bai-viet" aria-current={!cat ? 'page' : undefined}>Tất cả</Link>
            {cats.map(c => (
              <Link key={c} href={`/bai-viet?chuyen_muc=${encodeURIComponent(c)}`} aria-current={c === cat ? 'page' : undefined}>{c}</Link>
            ))}
          </nav>
          {posts.length
            ? <div className="post-grid">{posts.map(p => <PostCard key={p.slug} post={p} />)}</div>
            : <p className="empty">Chuyên mục này chưa có bài viết. <Link href="/bai-viet">Xem tất cả bài viết</Link></p>}
        </div>
      </section>
    </>
  );
}
