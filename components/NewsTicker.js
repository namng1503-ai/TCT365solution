import Link from 'next/link';
import Icon from './Icons';
import { formatDate } from './PostCard';

const icons = { 'Thuế': 'form', 'Kế toán': 'ledger', 'Tài chính': 'chart', 'Doanh nghiệp': 'building', 'Bảo hiểm': 'umbrella' };

// Dải tin chạy liên tục từ phải sang trái. Nhận tối đa 20 bài mới nhất (trang chủ cắt sẵn).
// Danh sách được nhân đôi để vòng lặp liền mạch; bản sao ẩn với trình đọc màn hình.
export default function NewsTicker({ posts }) {
  if (!posts.length) return <p className="empty">Chưa có tin tức nào.</p>;
  let base = posts;
  while (base.length < 6) base = [...base, ...posts]; // ít bài vẫn phủ kín 5 ô
  const items = [...base, ...base];

  return (
    <div className="ticker" style={{ '--count': base.length }}>
      <ul className="ticker-track">
        {items.map((p, i) => {
          const copy = i >= posts.length;
          return (
            <li key={i} aria-hidden={copy || undefined}>
              <Link href={`/bai-viet/${p.slug}`} className="news-card" tabIndex={copy ? -1 : undefined}>
                <div className="news-thumb">
                  {p.cover
                    ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.cover} alt="" loading="lazy" />
                    : <Icon name={icons[p.category] || 'news'} size={34} />}
                </div>
                <p className="news-meta">
                  {p.category && <span className="tag">{p.category}</span>}
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </p>
                <h3>{p.title}</h3>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
