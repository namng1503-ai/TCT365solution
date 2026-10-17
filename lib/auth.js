import { cookies } from 'next/headers';
import { verifyToken } from './token.js';

export const COOKIE = 'tct_admin';
export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  return verifyToken(token, process.env.ADMIN_PASSWORD);
}

// Dùng trong API route: trả Response lỗi nếu không được phép, ngược lại null.
export async function guard() {
  if (!adminConfigured()) return Response.json({ error: 'Chưa cấu hình ADMIN_PASSWORD.' }, { status: 503 });
  if (!(await isAdmin())) return Response.json({ error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }, { status: 401 });
  return null;
}
