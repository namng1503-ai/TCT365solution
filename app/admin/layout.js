export const metadata = { title: 'Quản trị', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }) {
  return <div className="admin"><div className="wrap">{children}</div></div>;
}
