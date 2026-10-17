import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../lib/slugify.js';
import { signToken, verifyToken } from '../lib/token.js';
import { parsePost, serializePost } from '../lib/frontmatter.js';
import { isLogoFile } from '../lib/clients.js';

test('slugify bỏ dấu tiếng Việt, đ → d, chỉ còn a-z0-9-', () => {
  assert.equal(slugify('Quyết toán thuế TNDN năm 2025!'), 'quyet-toan-thue-tndn-nam-2025');
  assert.equal(slugify('  Đăng ký   hộ kinh doanh / cá thể  '), 'dang-ky-ho-kinh-doanh-ca-the');
  assert.equal(slugify('***'), '');
});

test('token hợp lệ, sai mật khẩu, hết hạn, giả mạo, thiếu mật khẩu', () => {
  const now = 1_000_000;
  const t = signToken('secret', now);
  assert.equal(verifyToken(t, 'secret', now + 1000), true);
  assert.equal(verifyToken(t, 'other', now + 1000), false);
  assert.equal(verifyToken(t, 'secret', now + 8 * 86400_000), false);
  assert.equal(verifyToken(t.replace(/.$/, c => (c === 'a' ? 'b' : 'a')), 'secret', now), false);
  assert.equal(verifyToken('rác', 'secret', now), false);
  assert.equal(verifyToken(undefined, 'secret', now), false);
  assert.equal(verifyToken(t, '', now), false);
});

test('frontmatter: serialize rồi parse giữ nguyên dữ liệu', () => {
  const post = {
    title: 'Hạn nộp: tờ khai "quý" 3', date: '2026-10-17', category: 'Thuế',
    excerpt: 'Tóm tắt: ngắn', cover: '', body: '# Tiêu đề\n\nNội dung --- có gạch.',
  };
  const back = parsePost(serializePost(post), 'han-nop');
  assert.deepEqual(back, { slug: 'han-nop', ...post });
});

test('chỉ nhận file ảnh trong thư mục logo khách hàng', () => {
  assert.equal(isLogoFile('abc.PNG'), true);
  assert.equal(isLogoFile('x.svg'), true);
  assert.equal(isLogoFile('Thumbs.db'), false);
  assert.equal(isLogoFile('.DS_Store'), false);
  assert.equal(isLogoFile('.hidden.png'), false);
});
