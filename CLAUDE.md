# CLAUDE.md — Website TCT365

Landing page + blog cho Công ty TNHH TCT365 (đại lý thuế, kế toán). Next.js 15 App Router, **JavaScript thuần** (không TypeScript, không Tailwind, không thư viện UI/3D). Deploy: GitHub → Vercel.

## Lệnh
- `npm run dev` — chạy local (http://localhost:3000)
- `npm run build` / `npm start` — build & chạy production
- `npm test` — unit test (node:test): slugify, token, frontmatter, lọc logo
- `npm run test:e2e` — Playwright (desktop + mobile), tự build và chạy server cổng 3100 với `ADMIN_PASSWORD=e2e-password`. Lần đầu: `npx playwright install chromium`.

Mọi script đi qua `node -r ./scripts/exfat-fix.cjs …/next` — vá lỗi `EISDIR readlink` khi dự án nằm trên ổ exFAT/FAT (Windows). Không có tác dụng trên Linux/Vercel. Đừng đổi về `next build` trần nếu repo còn nằm trên ổ D: exFAT.

## Cấu trúc
```
app/                    Trang (App Router)
  page.js               Trang chủ: hero 3D, giới thiệu, dịch vụ, quy trình, khách hàng, bài viết, liên hệ (ISR 60s)
  dich-vu/[slug]/       Chi tiết dịch vụ (SSG từ data/services.js)
  bai-viet/             Danh sách + chi tiết bài (dynamic, đọc từ lib/posts)
  admin/                Đăng nhập, danh sách bài, trình soạn Markdown
  api/                  login, logout, posts (POST), posts/[slug] (PUT, DELETE), upload
  uploads/[name]/       Phục vụ ảnh upload khi chạy local
  globals.css           Toàn bộ CSS: tokens màu ở :root, cảnh 3D, quỹ đạo logo
components/             Header, Footer, Hero3D (CSS 3D), ClientRing (quỹ đạo logo), TiltCard, PostCard, Icons (SVG), admin/*
data/site.js            Thông tin công ty, giới thiệu, quy trình, chuyên mục bài viết
data/services.js        4 nhóm + 17 dịch vụ (nội dung trang dịch vụ)
lib/posts.js            Đọc/ghi bài viết + upload ảnh (Vercel Blob hoặc file local)
lib/auth.js, token.js   Xác thực admin: cookie `tct_admin` = `exp.HMAC(exp, ADMIN_PASSWORD)`, hạn 7 ngày
lib/frontmatter.js      Frontmatter tối giản, giá trị là JSON string
lib/clients.js          Đọc logo khách hàng từ public/clients/
content/posts/*.md      Bài mẫu đi kèm repo
public/clients/         Logo khách hàng — thêm file ảnh là tự hiện
```

## Quy tắc nội dung (bắt buộc)
- **Không bịa số liệu.** Thông tin chưa có ghi `[CẦN BỔ SUNG]` (MST, năm thành lập, số khách hàng, giờ làm việc trong `data/site.js`).
- Không có phần "Ban lãnh đạo". Địa chỉ duy nhất: **432 Phạm Văn Đồng, Phường Đông Ngạc, TP Hà Nội**.
- Không đưa bảng giá/thời hạn cũ; không dùng tên cơ quan đã sáp nhập (Sở KH&ĐT, UBND cấp huyện) — dùng "cơ quan đăng ký kinh doanh".
- Văn phong: câu ngắn, chủ động, nói lợi ích thật từ nội dung gốc, không cam kết mới.

## Thiết kế
- Màu thương hiệu (từ logo): teal `#036B68`, vàng đồng `#D99A2B`; token ở `:root` trong `globals.css`.
- Font: Be Vietnam Pro (next/font, subset vietnamese).
- Điểm nhấn duy nhất: cảnh 3D ở hero + quỹ đạo logo khách hàng. Phần còn lại giữ tĩnh — không thêm hiệu ứng fade-in rải rác.
- Quỹ đạo logo dùng `@property --t` + `cos()` CSS; dừng khi hover/focus/nút “Tạm dừng”; `prefers-reduced-motion` tắt mọi animation.
- Icon: SVG tự vẽ trong `components/Icons.js`, không dùng emoji.

## Lưu trữ bài viết
- `BLOB_READ_WRITE_TOKEN` có → Vercel Blob: `posts/<slug>/post-<random>.md` (mỗi lần lưu một URL mới, xoá bản cũ để tránh CDN cache), `deleted/<slug>` = dấu xoá bài mẫu repo, `uploads/…` = ảnh.
- Không có token → ghi `content/posts/` và `content/uploads/` (chỉ dùng local). Trên Vercel thiếu Blob → API trả lỗi hướng dẫn kết nối Blob.
- Bài trong Blob trùng slug ghi đè bài repo.
- Markdown render bằng `marked` **không sanitize** vì chỉ admin viết. Nếu mở cho nhiều người viết → thêm sanitize.

## Vercel
- `outputFileTracingIncludes` trong `next.config.mjs` đóng gói `public/clients` và `content/posts` vào serverless function — bắt buộc vì trang chủ ISR đọc chúng lúc runtime.
- Biến môi trường: `ADMIN_PASSWORD` (bắt buộc để dùng /admin), `BLOB_READ_WRITE_TOKEN` (tự có khi Connect Blob store). Build thành công kể cả khi không có biến nào.

## Ghi chú kỹ thuật đã biết
- `npm audit` báo lỗi PostCSS trong Next 15 (chỉ chạy lúc build trên CSS của chính dự án) — sửa triệt để cần nâng Next 16 (breaking).
- Tìm các chỗ đơn giản hoá có chủ đích: `grep -rn "ponytail:"`.
