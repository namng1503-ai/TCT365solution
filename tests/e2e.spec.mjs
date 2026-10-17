import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { slugify } from '../lib/slugify.js';

const shot = async (page, name, info) => {
  fs.mkdirSync('test-results/screens', { recursive: true });
  await page.screenshot({ path: `test-results/screens/${info.project.name}-${name}.png` });
};

test('trang chủ: nội dung chính, địa chỉ mới, không còn ban lãnh đạo', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Kế toán, thuế');
  for (const id of ['gioi-thieu', 'dich-vu', 'quy-trinh', 'khach-hang', 'lien-he']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  const text = await page.locator('body').innerText();
  expect(text).toContain('432 Phạm Văn Đồng, Phường Đông Ngạc, TP Hà Nội');
  expect(text).not.toMatch(/Ban lãnh đạo|Kim Mã|Thúy Vân|Nguyễn Thị Đào|Trần Thị Thủy/i);
  await expect(page.locator('.map iframe')).toHaveAttribute('src', /432%20Ph%E1%BA%A1m%20V%C4%83n%20%C4%90%E1%BB%93ng/);
  await expect(page.locator('#dich-vu a[href^="/dich-vu/"]')).toHaveCount(17);
  await shot(page, 'hero', info);
  expect(errors).toEqual([]);
});

test('khách hàng: logo quay 3D liên tục, kể cả khi rê chuột, không có nút dừng', async ({ page }, info) => {
  await page.goto('/');
  const logos = page.locator('.orbit-item img');
  expect(await logos.count()).toBeGreaterThanOrEqual(8);
  await page.locator('.orbit').scrollIntoViewIfNeeded();
  await expect(page.locator('.orbit button')).toHaveCount(0);
  const ring = page.locator('.orbit-ring');
  const angle = () => ring.evaluate(el => getComputedStyle(el).getPropertyValue('--t'));
  await page.locator('.orbit').hover();
  const a1 = await angle();
  await page.waitForTimeout(800);
  expect(await angle()).not.toBe(a1);
  await shot(page, 'clients', info);
});

test('tin tức: ngay sau hero, chạy liên tục, tối đa 20 bài', async ({ page }, info) => {
  await page.goto('/');
  const order = await page.locator('main > section').evaluateAll(els => els.map(e => e.id || e.className));
  expect(order[1]).toBe('tin-tuc');
  await expect(page.locator('#tin-tuc h2')).toHaveText('Tin tức');
  const real = page.locator('.ticker li:not([aria-hidden])');
  expect(await real.count()).toBeGreaterThan(0);
  expect(await real.count()).toBeLessThanOrEqual(20);
  const track = page.locator('.ticker-track');
  const x = () => track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
  const x1 = await x();
  await page.waitForTimeout(700);
  expect(await x()).toBeLessThan(x1); // chạy từ phải sang trái
  await shot(page, 'news', info);
});

test('trang dịch vụ và bài viết mở được', async ({ page }) => {
  await page.goto('/dich-vu/ke-toan-thue-tron-goi');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dịch vụ kế toán thuế trọn gói');
  await page.goto('/bai-viet');
  await expect(page.locator('.post-card')).not.toHaveCount(0);
  await page.locator('.post-card a').first().click();
  await expect(page.locator('.prose h2').first()).toBeVisible();
  const res = await page.goto('/dich-vu/khong-ton-tai');
  expect(res.status()).toBe(404);
});

test('admin: sai mật khẩu bị từ chối, API ghi cần đăng nhập', async ({ page, request }) => {
  const res = await request.post('/api/posts', { data: { title: 'x' } });
  expect(res.status()).toBe(401);
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel('Mật khẩu').fill('sai-mat-khau');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.locator('.form-error')).toHaveText('Mật khẩu không đúng.');
});

test('admin: đăng bài → hiện trên web → xoá', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'chạy một lần là đủ');
  const title = `Bài kiểm thử tự động ${Date.now()}`;
  try {
    await publishAndDelete(page, title, info);
  } finally {
    // Luôn dọn bài kiểm thử, kể cả khi test fail giữa chừng (bỏ qua nếu đã xoá).
    await page.request.delete(`/api/posts/${slugify(title)}`).catch(() => {});
  }
});

async function publishAndDelete(page, title, info) {
  await page.goto('/admin/login');
  await page.getByLabel('Mật khẩu').fill('e2e-password');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.getByRole('heading', { name: 'Bài viết' })).toBeVisible();

  await page.getByRole('link', { name: 'Viết bài mới' }).click();
  await page.getByLabel('Tiêu đề').fill(title);
  await page.getByLabel('Tóm tắt').fill('Tóm tắt kiểm thử.');
  await page.getByLabel('Nội dung (Markdown)').fill('## Mục một\n\nNội dung **in đậm**.');
  await expect(page.locator('.editor-preview h2')).toHaveText('Mục một');
  await shot(page, 'editor', info);
  await page.getByRole('button', { name: 'Đăng bài' }).click();
  await expect(page.getByRole('status')).toHaveText('Đã đăng bài viết.');

  // Đăng trùng tiêu đề → báo lỗi rõ ràng
  await page.goto('/admin/editor');
  await page.getByLabel('Tiêu đề').fill(title);
  await page.getByRole('button', { name: 'Đăng bài' }).click();
  await expect(page.locator('.form-error')).toContainText('Đã có bài viết');

  await page.goto('/bai-viet');
  await expect(page.getByText(title)).toBeVisible();
  await page.getByText(title).click();
  await expect(page.locator('.prose strong')).toHaveText('in đậm');

  await page.goto('/admin');
  await page.getByRole('button', { name: `Xoá bài ${title}` }).click();
  await page.getByRole('button', { name: `Xác nhận xoá bài ${title}` }).click();
  await expect(page.getByText(title)).toHaveCount(0);
  await page.goto('/bai-viet');
  await expect(page.getByText(title)).toHaveCount(0);
}
