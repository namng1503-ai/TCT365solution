// Logo khách hàng quay liên tục trên quỹ đạo 3D, luôn quay mặt về người xem.
// Logo lấy tự động từ thư mục public/clients/ — thêm file ảnh vào đó là logo tự vào vòng quay.
export default function ClientRing({ logos }) {
  const n = logos.length;
  if (!n) return null;
  return (
    <div className="orbit">
      <div className="orbit-stage">
        <div className="orbit-ring">
          {logos.map((l, i) => (
            <figure key={l.src} className="orbit-item" style={{ '--a': `${(360 / n) * i}deg` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={`Logo khách hàng ${l.name}`} />
            </figure>
          ))}
        </div>
        <div className="orbit-core" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" />
        </div>
      </div>
    </div>
  );
}
