import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin, adminConfigured } from '@/lib/auth';
import { getPosts } from '@/lib/posts';
import { formatDate } from '@/components/PostCard';
import { DeleteButton, LogoutButton } from '@/components/admin/AdminButtons';

export default async function AdminHome() {
  if (!adminConfigured()) {
    return (
      <div className="card-form">
        <h1>Chưa bật trang quản trị</h1>
        <p>Để đăng bài, hãy đặt mật khẩu quản trị:</p>
        <ol>
          <li>Vào Vercel → dự án → <strong>Settings → Environment Variables</strong>.</li>
          <li>Thêm biến <code>ADMIN_PASSWORD</code> với mật khẩu mạnh.</li>
          <li>Vào <strong>Storage → Create → Blob</strong>, kết nối với dự án để lưu bài viết.</li>
          <li>Redeploy dự án.</li>
        </ol>
        <p>Chạy trên máy: tạo file <code>.env.local</code> chứa <code>ADMIN_PASSWORD=...</code> rồi chạy lại <code>npm run dev</code>.</p>
      </div>
    );
  }
  if (!(await isAdmin())) redirect('/admin/login');

  const posts = await getPosts();
  const store = process.env.BLOB_READ_WRITE_TOKEN ? 'Vercel Blob' : 'thư mục content/posts (máy local)';

  return (
    <>
      <div className="admin-bar">
        <div>
          <h1>Bài viết</h1>
          <small>{posts.length} bài · Lưu tại: {store}</small>
        </div>
        <div className="actions">
          <Link className="btn btn-accent" href="/admin/editor">Viết bài mới</Link>
          <Link className="btn btn-primary" href="/admin/editor?loai=tuyen-dung">Đăng tin tuyển dụng</Link>
          <Link className="btn btn-ghost" href="/bai-viet" target="_blank">Xem trang tin tức</Link>
          <Link className="btn btn-ghost" href="/tuyen-dung" target="_blank">Xem trang tuyển dụng</Link>
          <LogoutButton />
        </div>
      </div>
      {posts.length === 0 ? (
        <p className="empty">Chưa có bài viết nào. Bấm “Viết bài mới” để đăng bài đầu tiên.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Tiêu đề</th><th>Chuyên mục</th><th>Ngày</th><th><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.slug}>
                <td><Link href={`/bai-viet/${p.slug}`} target="_blank">{p.title}</Link></td>
                <td>{p.category}</td>
                <td>{formatDate(p.date)}</td>
                <td>
                  <span className="actions">
                    <Link className="btn btn-ghost" href={`/admin/editor?slug=${p.slug}`}>Sửa</Link>
                    <DeleteButton slug={p.slug} title={p.title} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
