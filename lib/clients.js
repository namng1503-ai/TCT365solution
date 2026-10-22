import fs from 'node:fs';
import path from 'node:path';

// Logo khách hàng: chỉ cần chép file ảnh vào public/clients/ rồi deploy lại.
export const isLogoFile = f => !f.startsWith('.') && /\.(png|jpe?g|webp|svg|gif|avif)$/i.test(f);

export function getClientLogos() {
  const dir = path.join(process.cwd(), 'public', 'clients');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(isLogoFile).sort().map(f => ({
    src: `/clients/${encodeURIComponent(f)}`,
    name: f.replace(/\.[^.]+$/, '').replace(/^KH\d+[-_]/i, '').replace(/[-_]+/g, ' '),
  }));
}
