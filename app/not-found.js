import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap center">
        <h1 className="section-title">Không tìm thấy trang</h1>
        <p>Trang bạn tìm có thể đã đổi địa chỉ hoặc không còn tồn tại.</p>
        <Link className="btn btn-primary" href="/">Về trang chủ</Link>
      </div>
    </section>
  );
}
