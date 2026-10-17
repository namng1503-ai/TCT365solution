import Link from 'next/link';
import Icon from './Icons';

const icons = { 'Thuế': 'form', 'Kế toán': 'ledger', 'Tài chính': 'chart', 'Doanh nghiệp': 'building', 'Bảo hiểm': 'umbrella' };

export const formatDate = d => {
  const t = new Date(d);
  return isNaN(t) ? '' : t.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link href={`/bai-viet/${post.slug}`} className="post-card-link">
        <div className="post-cover">
          {post.cover
            ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={post.cover} alt="" loading="lazy" />
            : <div className="post-cover-ph"><Icon name={icons[post.category] || 'ledger'} size={44} /></div>}
        </div>
        <div className="post-body">
          <p className="post-meta">
            {post.category && <span className="tag">{post.category}</span>}
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          <h3>{post.title}</h3>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        </div>
      </Link>
    </article>
  );
}
