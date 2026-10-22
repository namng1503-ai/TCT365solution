# Tự đăng bài mới lên fanpage Facebook (RSS + Zapier)

Website có nguồn RSS tại **https://tct365.vercel.app/rss.xml** (30 bài mới nhất: tiêu đề, link, sapo, ảnh bìa, giờ đăng).
Zapier kiểm tra nguồn này khoảng 15 phút một lần và đăng mỗi bài mới lên fanpage. Chỉ bài đã được duyệt và đẩy lên GitHub mới có trong RSS.

## Thiết lập (một lần, khoảng 10 phút)

1. Đăng ký tài khoản miễn phí tại https://zapier.com.
2. Bấm **Create → Zaps**.
3. **Trigger:** chọn app **RSS by Zapier**, sự kiện **New Item in Feed** → Continue.
   - Feed URL: `https://tct365.vercel.app/rss.xml`
   - What Triggers a New Feed Item?: chọn **Different Guid/URL** (mỗi link bài mới là một bài mới).
   - Bấm **Test trigger**: Zapier lấy bài mới nhất làm mẫu.
4. **Action:** chọn app **Facebook Pages**, sự kiện **Create Page Post** → đăng nhập bằng tài khoản quản trị fanpage, cho phép Zapier quản lý và đăng bài lên Trang.
   - Page: chọn fanpage TCT365.
   - Message: chèn trường **Title**, xuống dòng, chèn **Description**, xuống dòng, gõ `Xem chi tiết:`
   - Link Url: chèn trường **Link** (Facebook tự lấy ảnh bìa từ link).
   - Photo: để trống (điền vào sẽ đăng thành bài ảnh, mất khung link).
5. **Test step** → bước này **đăng thật** bài mẫu lên fanpage. Mở fanpage kiểm tra.
6. Bấm **Publish** để bật Zap. Khi bật, Zapier ghi nhận các bài đang có trong RSS và chỉ đăng bài xuất hiện sau đó.

## Hạn mức gói miễn phí

Gói Free: khoảng 100 tasks/tháng, Zap 2 bước, kiểm tra dữ liệu mới 15 phút một lần (kiểm tra lại trên zapier.com/pricing).
Mỗi bài đăng lên fanpage tính 1 task; lần kiểm tra RSS không tính. 2 bài/ngày ≈ 60 tasks/tháng, nằm trong hạn mức.

## Khi bài trên fanpage không có ảnh

Dán link bài vào https://developers.facebook.com/tools/debug/ → **Scrape Again** để Facebook đọc lại ảnh xem trước.
Ảnh bìa là WebP; Facebook hiển thị được trong thực tế dù tài liệu chính thức chỉ liệt kê JPEG, PNG, GIF.

## Khi Zap ngừng đăng

Vào zapier.com → **Zaps** → mở Zap → **History** để xem lỗi. Lỗi hay gặp: kết nối Facebook hết hạn → vào **Apps** (My Apps) → Facebook Pages → **Reconnect**.
