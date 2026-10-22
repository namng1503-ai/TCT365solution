# Tự đăng bài mới lên fanpage Facebook (RSS + Make.com)

Website có nguồn RSS tại **https://tct365.vercel.app/rss.xml** (30 bài mới nhất: tiêu đề, link, sapo, ảnh bìa, giờ đăng).
Make.com kiểm tra nguồn này theo lịch và đăng mỗi bài mới lên fanpage. Chỉ bài đã được duyệt và đẩy lên GitHub mới có trong RSS.

## Thiết lập (một lần)

1. Đăng ký tài khoản miễn phí tại https://www.make.com.
2. **Create a new scenario** → thêm module **RSS → Watch RSS feed items**:
   - URL: `https://tct365.vercel.app/rss.xml`
   - Maximum number of returned items: `5`
   - Khi được hỏi bắt đầu từ đâu: chọn **From now on** (chỉ đăng bài mới từ bây giờ). Muốn đăng thử bài 22/10/2026 "Dự thảo Luật Phát triển DNNVV" thì chọn mốc **22/10/2026 22:00**.
3. Thêm module **Facebook Pages → Create a Post** (đăng bài kèm link):
   - Connection: đăng nhập Facebook bằng tài khoản quản trị fanpage, cho phép Make quản lý và đăng bài lên Trang.
   - Page: chọn fanpage TCT365.
   - Message: kéo trường **Title** của RSS, xuống dòng, kéo **Description**, xuống dòng, gõ `Xem chi tiết:`
   - Link: kéo trường **URL** của RSS (Facebook tự lấy ảnh bìa từ link).
4. Bấm **Run once** để chạy thử → mở fanpage kiểm tra bài.
5. Bật lịch: **Scheduling → At regular intervals → 120 phút**, rồi bật công tắc ON và **Save**.

## Hạn mức gói miễn phí

Gói Free của Make có khoảng 1.000 credits/tháng, tối đa 2 kịch bản đang chạy, chu kỳ ngắn nhất 15 phút (kiểm tra lại trên trang giá của Make).
Mỗi lần kiểm tra RSS và mỗi bài được đăng đều tính credit. Chu kỳ 120 phút ≈ 360 lần kiểm tra + khoảng 60 bài mỗi tháng, nằm trong hạn mức.
Đừng đặt 15 phút: khoảng 2.900 lần kiểm tra/tháng, vượt gói miễn phí.

## Khi bài trên fanpage không có ảnh

Dán link bài vào https://developers.facebook.com/tools/debug/ → **Scrape Again** để Facebook đọc lại ảnh xem trước.
Ảnh bìa là WebP; Facebook hiển thị được trong thực tế dù tài liệu chính thức chỉ liệt kê JPEG, PNG, GIF.
