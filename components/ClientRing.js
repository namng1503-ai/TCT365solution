'use client';
import { useState } from 'react';
import Icon from './Icons';

// Logo khách hàng bay trên quỹ đạo 3D, luôn quay mặt về người xem. Logo lấy tự động từ public/clients/.
export default function ClientRing({ logos }) {
  const [paused, setPaused] = useState(false);
  const n = logos.length;
  if (!n) return null;
  return (
    <div className={`orbit${paused ? ' is-paused' : ''}`}>
      <div className="orbit-stage">
        <div className="orbit-ring" style={{ '--n': n }}>
          {logos.map((l, i) => (
            <figure key={l.src} className="orbit-item" style={{ '--a': `${(360 / n) * i}deg` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={`Logo khách hàng ${l.name}`} loading="lazy" />
            </figure>
          ))}
        </div>
        <div className="orbit-core" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" />
        </div>
      </div>
      <button type="button" className="orbit-toggle" onClick={() => setPaused(p => !p)} aria-pressed={paused}>
        <Icon name={paused ? 'arrow' : 'x'} size={16} /> {paused ? 'Chạy tiếp' : 'Tạm dừng'}
      </button>
    </div>
  );
}
