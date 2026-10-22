import Link from 'next/link';
import PostCard from '@/components/PostCard';
import Icon from '@/components/Icons';
import { getPosts } from '@/lib/posts';
import { site, telHref, isJob } from '@/data/site';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Tuyển dụng', description: `Vị trí đang tuyển tại ${site.name}.` };

export default async function JobsPage() {
  const jobs = (await getPosts()).filter(isJob);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link> / Tuyển dụng</nav>
          <h1>Tuyển dụng</h1>
          <p>Các vị trí TCT365 đang tuyển. Gửi CV qua email hoặc gọi hotline để được trao đổi.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          {jobs.length
            ? <div className="post-grid">{jobs.map(p => <PostCard key={p.slug} post={p} />)}</div>
            : <p className="empty">Hiện chưa có vị trí đang tuyển. Bạn vẫn có thể gửi CV để chúng tôi liên hệ khi có nhu cầu.</p>}
          <div className="hero-cta" style={{ marginTop: 32 }}>
            <a className="btn btn-primary" href={`mailto:${site.email}?subject=${encodeURIComponent('Ứng tuyển')}`}>Gửi CV qua {site.email}</a>
            <a className="btn btn-ghost" href={telHref}><Icon name="phone" size={18} /> {site.hotline} ({site.hotlineContact})</a>
          </div>
        </div>
      </section>
    </>
  );
}
