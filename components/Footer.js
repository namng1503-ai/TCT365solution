import Link from 'next/link';
import { site, telHref } from '@/data/site';
import { groups, servicesByGroup } from '@/data/services';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">{site.name}</p>
          <p>{site.slogan}.</p>
          <p>Địa chỉ: {site.address}</p>
          <p>Hotline: <a href={telHref}>{site.hotline}</a> ({site.hotlineContact})</p>
          <p>Email: <a href={`mailto:${site.email}`}>{site.email}</a></p>
          <p>Mã số thuế: {site.taxCode}</p>
        </div>
        {groups.slice(0, 2).map(g => (
          <div key={g.id}>
            <p className="footer-head">{g.title}</p>
            <ul>
              {servicesByGroup(g.id).map(s => <li key={s.slug}><Link href={`/dich-vu/${s.slug}`}>{s.title}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <p className="footer-head">Kết nối</p>
          <ul>
            <li><a href={site.zalo} target="_blank" rel="noopener noreferrer">Zalo</a></li>
            <li><a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><Link href="/bai-viet">Bài viết chuyên môn</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">© {new Date().getFullYear()} {site.name}. Bảo lưu mọi quyền.</div>
    </footer>
  );
}
