import Link from 'next/link';
import Image from 'next/image';
import Icon from './Icons';
import { site, telHref } from '@/data/site';

const nav = [
  ['/#gioi-thieu', 'Giới thiệu'],
  ['/#dich-vu', 'Dịch vụ'],
  ['/#quy-trinh', 'Quy trình'],
  ['/#khach-hang', 'Khách hàng'],
  ['/bai-viet', 'Bài viết'],
  ['/#lien-he', 'Liên hệ'],
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link href="/" className="brand" aria-label={`${site.shortName} – Trang chủ`}>
          <Image src="/logo.png" alt="" width={50} height={40} priority />
          <span className="brand-text">
            <strong>TCT365</strong>
            <small>Đại lý thuế · Kế toán</small>
          </span>
        </Link>
        <nav className="nav-desktop" aria-label="Điều hướng chính">
          {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <a className="btn btn-gold header-call" href={telHref}>
          <Icon name="phone" size={18} /> {site.hotline}
        </a>
        <details className="nav-mobile">
          <summary aria-label="Mở menu"><Icon name="menu" /></summary>
          <nav aria-label="Điều hướng di động">
            {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            <a className="btn btn-gold" href={telHref}><Icon name="phone" size={18} /> Gọi {site.hotline}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
