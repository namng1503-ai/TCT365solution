// Bộ icon nét (stroke) 24×24, vẽ riêng cho chủ đề kế toán – thuế – tài chính.
const P = {
  ledger: 'M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3V3Zm0 15a3 3 0 0 1 3-3h11M9 7h6M9 10.5h6',
  stamp: 'M9 3h6v4l-1 3h5a2 2 0 0 1 2 2v3H3v-3a2 2 0 0 1 2-2h5L9 7V3ZM5 19h14',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5 5-2Z',
  invoice: 'M6 2h12v20l-3-2-3 2-3-2-3 2V2Zm3 5h6M9 10.5h6M9 14h3.5',
  form: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Zm0 0v5h5M8.5 13l2 2 4-4.5',
  shield: 'M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Zm-3.5 9 2.5 2.5 4.5-5',
  chart: 'M4 20h16M6.5 16v-5M11 16V7M15.5 16v-7M20 4l-4 3-4-2-4 3',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4M8.5 11h5M11 8.5v5',
  refund: 'M4 10a8 8 0 0 1 14.5-4.5M20 4v4h-4M20 14a8 8 0 0 1-14.5 4.5M4 20v-4h4M12 8v8m-2-2.2c.4.7 1.1 1.2 2 1.2 1.2 0 2-.7 2-1.6 0-2.2-4-1.2-4-3.4 0-.9.8-1.6 2-1.6.9 0 1.6.5 2 1.2',
  building: 'M4 21V5l8-2v18M12 7l8 3v11M2 21h20M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2',
  swap: 'M4 8h13l-3.5-3.5M20 16H7l3.5 3.5',
  shop: 'M3 9l2-5h14l2 5M3 9h18M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M5 12v9h14v-9M10 21v-5h4v5',
  branch: 'M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0c0 4-4 4-12 6',
  close: 'M5 4h14v16H5V4Zm4.5 5.5 5 5m0-5-5 5',
  cap: 'M2 9l10-5 10 5-10 5L2 9Zm4 2.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v6',
  book: 'M4 5c2.5-1.3 5.5-1.3 8 0v15c-2.5-1.3-5.5-1.3-8 0V5Zm8 0c2.5-1.3 5.5-1.3 8 0v15c-2.5-1.3-5.5-1.3-8 0',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7.4 3.9.1-.9-.1-.9 2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.6-.9L15 3h-4l-.4 2.2c-.6.2-1.1.5-1.6.9l-2.4-1-2 3.4 2 1.6-.1.9.1.9-2 1.6 2 3.4 2.4-1c.5.4 1 .7 1.6.9L11 21h4l.4-2.2c.6-.2 1.1-.5 1.6-.9l2.4 1 2-3.4-2-1.6Z',
  alert: 'M12 3 2 20h20L12 3Zm0 6v5m0 3v.5',
  umbrella: 'M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Zm0 9v6.5a2 2 0 0 1-4 0',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z',
  mail: 'M3 5h18v14H3V5Zm0 0 9 7 9-7',
  pin: 'M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12Zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  chat: 'M4 5h16v11H9l-5 4V5Zm4 5h.01M12 10h.01M16 10h.01',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  x: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5 10 17l9-10',
  calc: 'M6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm2 3h8v4H8V5Zm0 8h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01',
};

export default function Icon({ name, size = 24, className, title }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={P[name] || P.ledger} />
    </svg>
  );
}
