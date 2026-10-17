// Cảnh 3D thuần CSS: tờ khai thuế nổi, đồng xu ₫ xoay, biểu đồ cột dạng khối. Trang trí — ẩn với trình đọc màn hình.
const bars = [38, 62, 50, 88];

export default function Hero3D() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-grid" />

      <div className="chart3d">
        {bars.map((h, i) => (
          <div key={i} className="cube" style={{ '--h': `${h * 1.6}px`, '--i': i }}>
            <span className="cube-front" />
            <span className="cube-side" />
            <span className="cube-top" />
          </div>
        ))}
      </div>

      <div className="taxform">
        <div className="taxform-head">
          <strong>TỜ KHAI THUẾ GTGT</strong>
          <span>Mẫu 01/GTGT · Kỳ: Quý III</span>
        </div>
        {['Hàng hóa, dịch vụ mua vào', 'Thuế GTGT được khấu trừ', 'Hàng hóa, dịch vụ bán ra', 'Thuế GTGT phải nộp'].map((t, i) => (
          <div className="taxform-row" key={t}>
            <span>[{20 + i * 4}] {t}</span>
            <i style={{ '--w': `${40 + ((i * 23) % 40)}%` }} />
          </div>
        ))}
        <div className="stamp">ĐÃ NỘP</div>
      </div>

      <div className="coin">
        {Array.from({ length: 9 }, (_, i) => <span key={i} className="coin-edge" style={{ '--z': `${i - 4}px` }} />)}
        <span className="coin-face coin-front">₫</span>
        <span className="coin-face coin-back">365</span>
      </div>

      <div className="calc">
        <div className="calc-screen">1.250.000.000</div>
        <div className="calc-keys">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
      </div>
    </div>
  );
}
