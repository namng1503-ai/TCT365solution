# Hướng dẫn biên tập mục Tin tức (chạy tự động hằng ngày)

Tài liệu này là "luật" cho mỗi lần Claude tự viết bài lúc sáng. Mỗi lượt chạy phải đọc và làm đúng các bước dưới đây.

## 1. Nhiệm vụ mỗi ngày

1. Tìm tin trong **7 ngày gần nhất** (tính từ ngày chạy) thuộc các lĩnh vực: kinh doanh, tài chính, thuế, kế toán, tội phạm kinh tế, phân tích sự kiện. Ưu tiên tin có tác động trực tiếp tới doanh nghiệp, hộ kinh doanh.
2. Chọn **2 tin khác chủ đề** và **khác chuyên mục**, không trùng tin đã đăng (xem mục 4).
3. Viết lại thành 2 bài hoàn chỉnh, tạo ảnh bìa cho từng bài.
4. Gửi 2 bài nháp + bảng tóm tắt cho anh Nam duyệt.
5. **Chỉ khi anh Nam trả lời "đồng ý"** mới commit và push lên nhánh `main`. Trả lời khác (sửa, đổi tin, bỏ bài) → làm theo, gửi lại nháp, chờ "đồng ý" lần nữa.

## 2. Nơi đặt tệp

| Thứ | Đường dẫn |
|---|---|
| Bài viết | `content/posts/<slug>.md` |
| Ảnh bìa | `public/images/tin-tuc/<slug>.webp` |
| Giá trị `cover` | `/images/tin-tuc/<slug>.webp` |

`slug`: chữ thường không dấu, nối bằng gạch ngang, 5–10 từ, nêu đúng sự kiện. Không trùng slug đã có.

## 3. Khung bài (frontmatter bắt buộc, giá trị là chuỗi JSON trong ngoặc kép)

```
---
title: "Tiêu đề ngắn gọn, nêu đúng sự kiện (≤ 100 ký tự)"
date: "YYYY-MM-DD"            ← ngày đăng = ngày commit
time: "HH:MM"                 ← giờ đăng (giờ Việt Nam) = lúc commit; mỗi bài một giờ khác nhau
category: "Thuế"              ← chỉ dùng: Thuế | Kế toán | Tài chính | Doanh nghiệp | Bảo hiểm
excerpt: "Sapo 2–3 câu tóm tắt ý chính."
cover: "/images/tin-tuc/<slug>.webp"
---
Đoạn mở đầu: sự kiện gì, ai, khi nào, ở đâu.

## Diễn biến / nội dung chính
## Phân tích (vì sao quan trọng, ý kiến chuyên gia có nguồn)
## Tác động tới doanh nghiệp / Doanh nghiệp nên làm gì

> Một câu dẫn về dịch vụ TCT365 liên quan (không hứa hẹn, không báo giá).

---

*Ảnh bìa: <mô tả ngắn> (tệp `<slug>.webp`). Nguồn ảnh: TCT365 tự thiết kế.*

**Nguồn tin:**

- <Tên báo> – [<Tiêu đề bài gốc>](<link>) (dd/mm/yyyy)
```

Ánh xạ lĩnh vực → chuyên mục: chính sách thuế, hóa đơn, tội phạm thuế → **Thuế**; chuẩn mực, chế độ kế toán, BCTC → **Kế toán**; ngân hàng, chứng khoán, lãi suất, vĩ mô → **Tài chính**; luật doanh nghiệp, hộ kinh doanh, đăng ký kinh doanh, sự kiện kinh doanh → **Doanh nghiệp**; BHXH, BHYT → **Bảo hiểm**.

Độ dài: 500–900 chữ. Câu ngắn, chủ động. Không dùng emoji.

## 4. Chống trùng tin

Trước khi chọn tin, đọc tất cả `content/posts/*.md`: tiêu đề và các link trong "Nguồn tin". Không chọn tin có cùng sự kiện hoặc cùng link gốc, trừ khi có diễn biến mới thực sự (khi đó nêu rõ "diễn biến mới" trong tiêu đề hoặc sapo).

## 5. Quy tắc nội dung (bắt buộc)

- **Viết lại bằng lời văn riêng.** Không chép nguyên câu; trích dẫn trực tiếp tối đa 1 câu ngắn (dưới 15 chữ) mỗi nguồn, có ngoặc kép. Không bám theo bố cục bài gốc.
- **Không bịa.** Mọi con số, tên người, chức danh, ngày tháng, số hiệu văn bản phải lấy từ nguồn đã đọc (mở bài gốc bằng WebFetch, không chỉ dựa vào đoạn trích kết quả tìm kiếm). Thông tin không kiểm chứng được → bỏ.
- Nguồn mâu thuẫn nhau → kiểm tra thêm nguồn thứ ba; vẫn không rõ → bỏ chi tiết đó.
- Phân biệt rõ **dự thảo / đề xuất** với **quy định đã có hiệu lực**.
- Tin hình sự: chỉ dùng thông tin cơ quan chức năng đã công bố, gọi là "bị can", không kết luận có tội trước khi có bản án.
- Không dùng tên cơ quan đã sáp nhập (Sở KH&ĐT, UBND cấp huyện) — dùng "cơ quan đăng ký kinh doanh".
- Phần "Nguồn tin" ghi tên báo + link bài gốc cho mọi nguồn đã dùng.

## 6. Ảnh

Chỉ dùng ảnh **tự tạo** bằng script trong kho (không tải ảnh báo, không dùng ảnh có bản quyền):

```
pip install pillow --break-system-packages   # nếu thiếu
python3 scripts/tao-anh-bia.py --slug <slug> --category "<Chuyên mục>" --motif <motif> --label "<dòng chữ ngắn ≤ 50 ký tự>"
```

Motif: `hoa-don` (hóa đơn), `kinh-lup` (điều tra, rà soát), `cua-hang` (hộ kinh doanh, DN nhỏ), `bieu-do` (tài chính, tăng trưởng), `so-sach` (kế toán), `khien` (bảo hiểm, an toàn), `can-can` (pháp luật, xét xử), `doanh-thu` (rà soát doanh thu, kê khai thiếu), `giai-the` (thủ tục hành chính, hồ sơ, giải thể). Mở ảnh ra xem trước khi gửi duyệt.

Yêu cầu của anh Nam về ảnh bìa:
- **Tông sáng, nền trắng chủ đạo, trông chuyên nghiệp.** Script mặc định `--theme sang`. Không dùng `--theme toi` (nền xanh đậm cũ).
- **Không trùng hình với các bài trước.** Trước khi chọn motif, xem motif của các bài gần nhất (dòng "Ảnh bìa" cuối bài). Motif đã dùng gần đây thì chọn motif khác. Nếu chưa có motif nào hợp với nội dung, thêm motif mới vào script, vẽ chi tiết và bám nội dung bài (ví dụ `doanh-thu`, `giai-the`).
- Dòng chữ `--label` nêu đúng ý chính của bài, không chép lại tên chuyên mục. Khi đăng, thêm một dòng ghi nguồn ảnh vào `public/images/NGUON-ANH.txt`.

## 7. Kiểm tra trước khi gửi duyệt

- `npm test` chạy qua (kiểm frontmatter).
- Đọc lại từng con số, đối chiếu với bài gốc.
- Ảnh tồn tại đúng đường dẫn `cover`.

## 8. Gửi duyệt

Gửi qua tin nhắn: toàn văn 2 bài, 2 ảnh bìa, và bảng:

| Tiêu đề | Chuyên mục | Nguồn | Ảnh |
|---|---|---|---|

Kết thúc bằng: *Anh trả lời "đồng ý" để đăng cả 2 bài, hoặc cho biết bài nào cần sửa.*

## 9. Sau khi được "đồng ý"

Anh Nam có thể duyệt một phần (ví dụ "chỉ đăng bài 1"): chỉ commit bài được duyệt, bỏ bài còn lại.

```
git add content/posts/<slug1>.md content/posts/<slug2>.md public/images/tin-tuc/<slug1>.webp public/images/tin-tuc/<slug2>.webp public/images/NGUON-ANH.txt
git commit -m "Tin tức dd/mm/yyyy: <tiêu đề ngắn 1>; <tiêu đề ngắn 2>"
git push origin main
```

Trước khi commit: sửa `date` thành ngày duyệt và `time` thành giờ hiện tại (giờ Việt Nam). Hai bài cùng lượt đặt cách nhau 1 phút (ví dụ 08:30 và 08:31) để nguồn RSS phân biệt được. Zapier đọc https://tct365.vercel.app/rss.xml và tự đăng bài mới lên fanpage (xem DANG-FANPAGE.md), nên không cần đăng tay. Vercel tự triển khai sau khi push; báo lại anh Nam link 2 bài: `https://tct365.vercel.app/bai-viet/<slug>`.
