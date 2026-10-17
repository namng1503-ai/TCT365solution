# Thiết kế website TCT365 mới

Ngày: 2026-10-17 · Trạng thái: chờ duyệt

## Mục tiêu
Landing page mới cho Công ty TNHH TCT365 (thay https://tct365-tax.com/): hiện đại, bố cục rõ, dễ dùng, có hiệu ứng 3D; chủ web tự đăng bài kế toán – tài chính qua trang quản trị có đăng nhập. Push GitHub → Vercel deploy chạy ngay, không sửa code.

## Ràng buộc
- Chỉ Node.js / JavaScript. Next.js 15 App Router, JS (không TS), CSS thuần.
- Dependency: `next`, `react`, `react-dom`, `@vercel/blob`, `marked`; dev: `@playwright/test`.
- Bỏ toàn bộ Ban lãnh đạo. Địa chỉ: 432 Phạm Văn Đồng, Phường Đông Ngạc, TP Hà Nội (Google Maps embed không cần API key).
- Không bịa số liệu. Thiếu → `[CẦN BỔ SUNG]` (MST, năm thành lập, số khách hàng).
- Giữ liên hệ có trên web cũ: hotline 0942 125 266, email support@tct365-tax.com, Zalo, Facebook.
- Màu thương hiệu lấy từ logo: teal `#036B68`, vàng đồng `#D99A2B`.

## Trang
| Route | Nội dung |
|---|---|
| `/` | Hero 3D → Giới thiệu (phương châm, tầm nhìn, sứ mệnh, giá trị cốt lõi) → Dịch vụ (4 nhóm) → Quy trình → Khách hàng tiêu biểu → Bài viết mới → Liên hệ + bản đồ |
| `/dich-vu/[slug]` | Chi tiết dịch vụ (SSG từ `data/services.js`) |
| `/bai-viet`, `/bai-viet/[slug]` | Danh sách (lọc chuyên mục) + chi tiết bài |
| `/admin`, `/admin/login`, `/admin/editor` | Đăng nhập, danh sách bài, soạn/sửa/xoá |

## Hiệu ứng 3D (CSS, không thư viện)
- Hero: cảnh `perspective` gồm đồng xu xoay, tờ khai thuế nổi, biểu đồ cột khối, máy tính bỏ túi.
- Thẻ dịch vụ nghiêng theo chuột (JS nhỏ, chỉ khi pointer: fine).
- Khách hàng tiêu biểu: vòng tròn 3D logo **xoay liên tục**, dừng khi hover; mobile/reduced-motion → dải marquee chạy ngang (reduced-motion: đứng yên).
- Tôn trọng `prefers-reduced-motion`.

## Logo khách hàng
- 8 logo lấy từ web cũ lưu ở `public/clients/`.
- Server component đọc `fs.readdirSync('public/clients')` lúc build (lọc png/jpg/jpeg/webp/svg) → thêm khách = chép file vào thư mục, push.

## Bài viết
- Định dạng: Markdown + frontmatter tối giản (title, date, category, excerpt, cover).
- Nguồn: bài mẫu `content/posts/*.md` (trong repo, chỉ đọc) + bài đăng từ admin.
- Lưu bài admin: có `BLOB_READ_WRITE_TOKEN` → Vercel Blob (`posts/<slug>.md`, ảnh `uploads/…`); không có → ghi `content/posts/` + `public/uploads/` (máy local).
- Trang bài viết render động (`dynamic = 'force-dynamic'`) để bài mới hiện ngay.
- Markdown render bằng `marked`; chỉ admin viết nên không sanitize (ghi chú trong CLAUDE.md).

## Xác thực
- `ADMIN_PASSWORD` (env). Login → cookie httpOnly, secure, sameSite=lax, giá trị = `exp.HMAC-SHA256(exp, ADMIN_PASSWORD)`, hạn 7 ngày. So sánh bằng `timingSafeEqual`.
- Mọi API ghi (`/api/posts`, `/api/upload`) kiểm tra cookie phía server.
- Thiếu `ADMIN_PASSWORD` → web vẫn chạy, `/admin` hiện hướng dẫn cấu hình.

## Kiểm thử
- Playwright (`tests/e2e.spec.js`, webServer = `next start` sau build): trang chủ có địa chỉ mới, không có "Ban lãnh đạo"/"Kim Mã", có ≥8 logo, bản đồ; trang dịch vụ mở được; admin sai mật khẩu bị từ chối; đăng nhập đúng → tạo bài → bài hiện ở `/bai-viet` → xoá. Chạy desktop + mobile.
- Ảnh chụp giao diện bằng Playwright MCP để rà soát thị giác.

## Tài liệu
`CLAUDE.md`, `README.md` (chạy local, đăng bài, thêm logo, GitHub + Vercel), `.env.example`.
