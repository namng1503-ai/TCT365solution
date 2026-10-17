import { createHmac, timingSafeEqual } from 'node:crypto';

const TTL = 7 * 86400_000;
const sign = (exp, password) => createHmac('sha256', password).update(String(exp)).digest('hex');

export function signToken(password, now = Date.now()) {
  const exp = now + TTL;
  return `${exp}.${sign(exp, password)}`;
}

export function verifyToken(token, password, now = Date.now()) {
  if (!token || !password) return false;
  const [exp, mac] = String(token).split('.');
  if (!mac || !(Number(exp) > now)) return false;
  const a = Buffer.from(mac);
  const b = Buffer.from(sign(exp, password));
  return a.length === b.length && timingSafeEqual(a, b);
}
