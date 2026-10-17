'use client';

// Thẻ nghiêng nhẹ theo con trỏ chuột (chỉ trên thiết bị có chuột).
export default function TiltCard({ children, className = '', ...rest }) {
  function move(e) {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -6}deg`);
    e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
  }
  function leave(e) {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  }
  return <div className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>{children}</div>;
}
