// Ổ exFAT/FAT trên Windows: fs.readlink trả EISDIR thay vì EINVAL → Next.js build lỗi. Đổi về EINVAL.
const fs = require('node:fs');
if (process.platform === 'win32' && !fs.__exfatFix) {
  const fix = e => (e && e.code === 'EISDIR' ? Object.assign(e, { code: 'EINVAL', errno: -22 }) : e);
  const { readlink, readlinkSync } = fs;
  const pReadlink = fs.promises.readlink;
  fs.readlink = (p, ...args) => { const cb = args.pop(); return readlink(p, ...args, (err, res) => cb(fix(err), res)); };
  fs.readlinkSync = (...a) => { try { return readlinkSync(...a); } catch (e) { throw fix(e); } };
  fs.promises.readlink = (...a) => pReadlink(...a).catch(e => { throw fix(e); });
  fs.__exfatFix = true;
}
// Truyền cho các tiến trình con (worker build) của Next.js.
if (!String(process.env.NODE_OPTIONS || '').includes('exfat-fix')) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --require "${__filename.split('\\').join('/')}"`.trim();
}
