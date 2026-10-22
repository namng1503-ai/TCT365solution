import Link from 'next/link';
import { site, telHref } from '@/data/site';
import { services } from '@/data/services';

const featured = ['ke-toan-thue-tron-goi', 'ke-khai-thue', 'quyet-toan-thue', 'lap-bao-cao-tai-chinh', 'thanh-lap-cong-ty', 'hoa-don-dien-tu-chu-ky-so'];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">{site.name}</p>
          <p>{site.address}</p>
          <p>Hotline: <a href={telHref}>{site.hotline}</a> · Email: <a href={`mailto:${site.email}`}>{site.email}</a></p>
          <p>Mã số thuế: {site.taxCode}</p>
        </div>
        <div>
          <p className="footer-head">Dịch vụ tiêu biểu</p>
          <ul className="footer-links">
            {services.filter(s => featured.includes(s.slug)).map(s => <li key={s.slug}><Link href={`/dich-vu/${s.slug}`}>{s.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="footer-head">Kết nối</p>
          <ul className="footer-links footer-links-1">
            <li><a href={site.zalo} target="_blank" rel="noopener noreferrer">Zalo</a></li>
            <li><a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><Link href="/bai-viet">Tin tức</Link></li>
            <li><Link href="/tuyen-dung">Tuyển dụng</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">© {new Date().getFullYear()} {site.name}. Bảo lưu mọi quyền.</div>
    </footer>
  );
}
