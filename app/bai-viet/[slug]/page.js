import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Icon from '@/components/Icons';
import { formatDate } from '@/components/PostCard';
import { getPost } from '@/lib/posts';
import { site, telHref } from '@/data/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const p = await getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt, openGraph: { images: p.cover ? [p.cover] : ['/logo.png'] } } : {};
}

export default async function PostPage({ params }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  // Nội dung chỉ do quản trị viên viết nên render Markdown trực tiếp (xem CLAUDE.md).
  const html = marked.parse(post.body || '');

  return (
    <>
      <section className="page-hero">
        <div className="wrap article">
          <nav className="crumbs" aria-label="Đường dẫn">
            <Link href="/">Trang chủ</Link> / <Link href="/bai-viet">Tin tức</Link>
            {post.category && <> / <Link href={`/bai-viet?chuyen_muc=${encodeURIComponent(post.category)}`}>{post.category}</Link></>}
          </nav>
          <h1>{post.title}</h1>
          <p><time dateTime={post.date}>{formatDate(post.date)}</time></p>
        </div>
      </section>
      <section className="section">
        <article className="wrap article">
          {post.cover && (
            <div className="article-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover} alt="" />
            </div>
          )}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="article-foot">
            <p>Cần hỗ trợ về thuế – kế toán cho doanh nghiệp?</p>
            <a className="btn btn-accent" href={telHref}><Icon name="phone" size={18} /> Gọi {site.hotline}</a>
          </div>
        </article>
      </section>
    </>
  );
}
