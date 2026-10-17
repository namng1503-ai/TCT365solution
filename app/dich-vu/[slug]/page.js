import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icons';
import { services, groups, getService, servicesByGroup } from '@/data/services';
import { site, telHref } from '@/data/site';

export const dynamicParams = false;
export const generateStaticParams = () => services.map(s => ({ slug: s.slug }));

export async function generateMetadata({ params }) {
  const s = getService((await params).slug);
  return s ? { title: s.title, description: s.summary } : {};
}

function List({ items }) {
  return (
    <ul className="checklist">
      {items.map(t => <li key={t}><Icon name="check" size={18} /><span>{t}</span></li>)}
    </ul>
  );
}

export default async function ServicePage({ params }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const group = groups.find(g => g.id === s.group);
  const related = servicesByGroup(s.group).filter(x => x.slug !== s.slug);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Đường dẫn">
            <Link href="/">Trang chủ</Link> / <Link href="/#dich-vu">{group.title}</Link>
          </nav>
          <h1>{s.title}</h1>
          <p>{s.summary}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap service-detail">
          <div>
            {s.forWhom && <div className="block"><h2>Phù hợp với</h2><List items={s.forWhom} /></div>}
            <div className="block"><h2>TCT365 thực hiện</h2><List items={s.includes} /></div>
            {s.documents && <div className="block"><h2>Hồ sơ khách hàng chuẩn bị</h2><List items={s.documents} /></div>}
            {s.steps && (
              <div className="block">
                <h2>Các bước triển khai</h2>
                <ol className="numbered">{s.steps.map(t => <li key={t}>{t}</li>)}</ol>
              </div>
            )}
            {s.deliverables && <div className="block"><h2>Kết quả bàn giao</h2><List items={s.deliverables} /></div>}
            {s.commitments && <div className="block"><h2>Cam kết của TCT365</h2><List items={s.commitments} /></div>}
          </div>
          <aside>
            <div className="aside-card">
              <h2>Nhận báo giá cho hồ sơ của bạn</h2>
              <p>Chi phí phụ thuộc quy mô và tình trạng hồ sơ thực tế. Liên hệ để được tư vấn cụ thể.</p>
              <a className="btn btn-gold" href={telHref}><Icon name="phone" size={18} /> {site.hotline}</a>
              <a className="btn btn-ghost" href={site.zalo} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> Nhắn Zalo</a>
              <p className="aside-note">Email: {site.email}</p>
            </div>
            {related.length > 0 && (
              <div className="block related-block">
                <h2>Cùng nhóm {group.title}</h2>
                <ul className="related">{related.map(r => <li key={r.slug}><Link href={`/dich-vu/${r.slug}`}>{r.title}</Link></li>)}</ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
