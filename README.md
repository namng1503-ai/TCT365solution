# Website TCT365

Website giới thiệu dịch vụ kế toán – thuế của Công ty TNHH TCT365, kèm trang quản trị để tự đăng bài viết.
Viết bằng Next.js (Node.js). Đưa lên GitHub và deploy Vercel là chạy, không cần sửa code.

---

## 1. Chạy trên máy tính

Yêu cầu: Node.js 18.18 trở lên (máy hiện có Node 24 — dùng được).

```bash
npm install
```

Tạo file `.env.local` ở thư mục gốc (file này không bị đưa lên GitHub):

```
ADMIN_PASSWORD=mat-khau-cua-ban
```

```bash
npm run dev
```

Mở http://localhost:3000 — trang quản trị ở http://localhost:3000/admin

> Khi chạy trên máy, bài viết lưu vào thư mục `content/posts/`, ảnh lưu vào `content/uploads/`.

---

## 2. Đưa lên GitHub

1. Tạo repository mới trên https://github.com/new (ví dụ `tct365-website`, để **Private** nếu muốn). Không tích thêm README.
2. Trong thư mục dự án chạy:

```bash
git add -A
git commit -m "Website TCT365"
git remote add origin https://github.com/<tai-khoan>/tct365-website.git
git push -u origin main
```

> Nếu Git báo `dubious ownership` (ổ D: định dạng exFAT), chạy một lần:
> `git config --global --add safe.directory D:/TCT365solution`

---

## 3. Deploy lên Vercel

1. Đăng nhập https://vercel.com bằng tài khoản GitHub → **Add New… → Project** → chọn repo `tct365-website` → **Deploy**. Vercel tự nhận Next.js, không cần chỉnh gì.
2. Bật trang quản trị:
   - **Settings → Environment Variables** → thêm `ADMIN_PASSWORD` = mật khẩu mạnh (tối thiểu 12 ký tự).
   - **Storage → Create Database → Blob** → đặt tên → **Connect** với dự án (Vercel tự thêm biến `BLOB_READ_WRITE_TOKEN`).
   - **Deployments → … → Redeploy** để áp dụng.
3. Gắn tên miền: **Settings → Domains** → nhập `tct365-tax.com` → làm theo hướng dẫn cấu hình DNS tại nhà cung cấp tên miền.

Từ đó, mỗi lần `git push` lên nhánh `main`, Vercel tự deploy lại.

---

## 4. Đăng bài viết mới

1. Vào `https://<ten-mien>/admin` → nhập mật khẩu.
2. Bấm **Viết bài mới**.
3. Điền **Tiêu đề** (đường dẫn tự tạo), chọn **Chuyên mục**, **Ngày đăng**, viết **Tóm tắt**, chọn **Ảnh bìa** (không bắt buộc, tối đa 4MB).
4. Viết **Nội dung** bằng Markdown — khung bên phải hiển thị trước bài viết:

   | Gõ | Kết quả |
   |---|---|
   | `## Tiêu đề mục` | Tiêu đề mục lớn |
   | `### Tiêu đề nhỏ` | Tiêu đề mục nhỏ |
   | `**chữ đậm**` | **chữ đậm** |
   | `- ý một` | Gạch đầu dòng |
   | `1. bước một` | Danh sách đánh số |
   | `> lưu ý` | Khung trích dẫn |
   | `[TCT365](https://tct365-tax.com)` | Liên kết |

   Bấm **Chèn ảnh vào nội dung** để tải ảnh và chèn tại vị trí con trỏ.
5. Bấm **Đăng bài**. Bài hiện ngay ở trang **Bài viết** và mục bài viết mới trên trang chủ (tối đa sau 1 phút).
6. Sửa/xoá bài: vào `/admin` → **Sửa** hoặc **Xoá** (bấm **Xác nhận xoá**).

Chuyên mục mặc định: Thuế, Kế toán, Tài chính, Doanh nghiệp, Bảo hiểm — sửa trong `data/site.js` (`postCategories`).

---

## 5. Thêm logo khách hàng

1. Chép file logo (`.png`, `.jpg`, `.webp`, `.svg`) vào thư mục **`public/clients/`**.
   - Tên file nên là tên khách hàng, ví dụ `cong-ty-abc.png` (dùng làm mô tả ảnh).
   - Nên cắt sát viền logo, nền trắng hoặc trong suốt, rộng khoảng 300–600px.
2. Đẩy lên GitHub:

```bash
git add public/clients
git commit -m "Thêm logo khách hàng"
git push
```

Vercel tự deploy lại, logo mới xuất hiện trên vòng quỹ đạo. Xoá logo: xoá file rồi push.

---

## 6. Sửa thông tin công ty

Toàn bộ thông tin nằm trong `data/site.js` (hotline, email, địa chỉ, MST, giới thiệu, quy trình) và `data/services.js` (danh sách dịch vụ).
Các mục đang ghi **[CẦN BỔ SUNG]**: mã số thuế, năm thành lập, số khách hàng đang phục vụ, giờ làm việc — thay bằng thông tin thật rồi push.

---

## 7. Kiểm thử

```bash
npm test                      # unit test
npx playwright install chromium   # lần đầu
npm run test:e2e              # kiểm thử giao diện desktop + mobile
```
