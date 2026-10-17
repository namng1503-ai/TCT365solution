import { timingSafeEqual } from 'node:crypto';
import { signToken } from '@/lib/token';
import { COOKIE, adminConfigured } from '@/lib/auth';

const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export async function POST(req) {
  if (!adminConfigured()) return Response.json({ error: 'Chưa cấu hình ADMIN_PASSWORD trên máy chủ.' }, { status: 503 });
  const { password } = await req.json().catch(() => ({}));
  if (!password || !same(password, process.env.ADMIN_PASSWORD)) {
    // ponytail: làm chậm thử mật khẩu bằng độ trễ cố định; cần chặn mạnh hơn thì thêm rate limit theo IP.
    await new Promise(r => setTimeout(r, 800));
    return Response.json({ error: 'Mật khẩu không đúng.' }, { status: 401 });
  }
  const res = Response.json({ ok: true });
  res.headers.append('Set-Cookie', [
    `${COOKIE}=${signToken(process.env.ADMIN_PASSWORD)}`,
    'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${7 * 86400}`,
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ].filter(Boolean).join('; '));
  return res;
}
