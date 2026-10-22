import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../lib/slugify.js';
import { signToken, verifyToken } from '../lib/token.js';
import { parsePost, serializePost } from '../lib/frontmatter.js';
import { isLogoFile } from '../lib/clients.js';
import { buildRss, absoluteUrl, rfc822 } from '../lib/rss.js';

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
    title: 'Hạn nộp: tờ khai "quý" 3', date: '2026-10-17', time: '09:30', category: 'Thuế',
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

test('rss: link tuyệt đối, ảnh bìa, thoát ký tự XML, ngày giờ VN', () => {
  const xml = buildRss({
    siteUrl: 'https://tct365.vercel.app/', title: 'Tin <TCT365>', description: 'Mô tả & thử',
    posts: [
      { slug: 'bai-a', title: 'Thuế "GTGT" & hóa đơn', date: '2026-10-22', category: 'Thuế', excerpt: 'Sapo <ngắn>', cover: '/images/tin-tuc/bai-a.webp' },
      { slug: 'bai-b', title: 'Bài B', date: '2026-10-21', time: '14:35', category: '', excerpt: '', cover: 'https://blob.example.com/x.png' },
      { slug: 'bai-c', title: 'Bài C', date: '', category: '', excerpt: '', cover: '' },
    ],
  });
  assert.match(xml, /<link>https:\/\/tct365\.vercel\.app\/bai-viet\/bai-a<\/link>/);
  assert.match(xml, /<title>Thuế &quot;GTGT&quot; &amp; hóa đơn<\/title>/);
  assert.match(xml, /<description>Sapo &lt;ngắn&gt;<\/description>/);
  assert.match(xml, /url="https:\/\/tct365\.vercel\.app\/images\/tin-tuc\/bai-a\.webp" length="0" type="image\/webp"/);
  assert.match(xml, /url="https:\/\/blob\.example\.com\/x\.png" length="0" type="image\/png"/);
  assert.match(xml, /<pubDate>Thu, 22 Oct 2026 01:00:00 GMT<\/pubDate>/);
  assert.match(xml, /<pubDate>Wed, 21 Oct 2026 07:35:00 GMT<\/pubDate>/);
  assert.equal((xml.match(/<item>/g) || []).length, 3);
  assert.equal((xml.match(/<enclosure /g) || []).length, 2);
  assert.ok(!xml.includes('<category></category>'));
  assert.equal(absoluteUrl('', 'https://a.b'), '');
  assert.equal(rfc822('rác'), '');
});
