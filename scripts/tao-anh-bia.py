#!/usr/bin/env python3
"""Tạo ảnh bìa minh họa 16:9 (.webp) cho bài Tin tức — đồ họa tự vẽ, không dùng ảnh của bên thứ ba.

Cách dùng:
  python3 scripts/tao-anh-bia.py --slug <slug-bai> --category "Thuế" [--motif hoa-don] [--label "Dòng chữ ngắn"]

Kết quả: public/images/tin-tuc/<slug>.webp  (đường dẫn dùng trong frontmatter: /images/tin-tuc/<slug>.webp)
Motif: hoa-don, cua-hang, bieu-do, so-sach, khien, can-can, kinh-lup, doanh-thu, giai-the, dat-dai, no-bao-hiem. Mặc định theo chuyên mục.
Mỗi slug cho một biến thể bố cục/màu riêng (seed theo slug) nên các bài không trùng ảnh.
Cần Pillow: pip install pillow --break-system-packages
"""
import argparse, hashlib, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, S = 1600, 900, 2  # vẽ ở 2x rồi thu nhỏ cho mịn
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BRAND = {
    'navy': (23, 37, 84), 'blue': (30, 64, 175), 'blue2': (59, 130, 246),
    'sky': (219, 234, 254), 'soft': (240, 246, 255), 'amber': (245, 158, 11),
    'amber2': (252, 211, 77), 'white': (255, 255, 255), 'ink': (15, 23, 42),
}
DEFAULT_MOTIF = {'Thuế': 'hoa-don', 'Kế toán': 'so-sach', 'Tài chính': 'bieu-do',
                 'Doanh nghiệp': 'cua-hang', 'Bảo hiểm': 'khien'}

FONT_DIRS = ['/usr/share/fonts/opentype/inter', '/usr/share/fonts/truetype/dejavu']
def font(size, bold=True):
    names = ['Inter-Bold.otf', 'Inter-SemiBold.otf', 'DejaVuSans-Bold.ttf'] if bold else ['Inter-Medium.otf', 'Inter-Regular.otf', 'DejaVuSans.ttf']
    for d in FONT_DIRS:
        for n in names:
            p = os.path.join(d, n)
            if os.path.exists(p):
                return ImageFont.truetype(p, size * S)
    return ImageFont.load_default()

def s(v): return int(v * S)
def box(x, y, w, h): return [s(x), s(y), s(x + w), s(y + h)]

def rrect(d, x, y, w, h, r, fill, outline=None, width=0):
    d.rounded_rectangle(box(x, y, w, h), radius=s(r), fill=fill, outline=outline, width=s(width) if width else 0)

def shadow(img, x, y, w, h, r, blur=28, alpha=60, dy=18):
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle(box(x, y + dy, w, h), radius=s(r), fill=(15, 23, 42, alpha))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(s(blur))))

def background(rng):
    img = Image.new('RGBA', (W * S, H * S))
    top, bot = BRAND['blue'], BRAND['navy']
    px = img.load()
    # nền gradient chéo bằng các dải ngang (đủ mịn, nhanh)
    d = ImageDraw.Draw(img)
    for yy in range(0, H * S, 2):
        t = yy / (H * S)
        c = tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3))
        d.line([(0, yy), (W * S, yy)], fill=c + (255,), width=2)
    # quầng sáng
    glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    gx, gy = rng.randint(950, 1250), rng.randint(250, 450)
    g.ellipse(box(gx - 420, gy - 420, 840, 840), fill=BRAND['blue2'] + (110,))
    g.ellipse(box(rng.randint(-200, 200), rng.randint(500, 800), 600, 600), fill=BRAND['amber'] + (40,))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(s(120))))
    # lưới chấm nhẹ
    dots = ImageDraw.Draw(img)
    for gx2 in range(40, W, 48):
        for gy2 in range(40, H, 48):
            dots.ellipse(box(gx2 - 1.6, gy2 - 1.6, 3.2, 3.2), fill=(255, 255, 255, 12 if gx2 < 760 else 20))
    return img

def background_sang(rng):
    """Nền sáng: trắng chủ đạo, quầng xanh nhạt phía phải, lưới mảnh — tông chuyên nghiệp."""
    img = Image.new('RGBA', (W * S, H * S), (255, 255, 255, 255))
    d = ImageDraw.Draw(img)
    # chuyển rất nhẹ từ trắng (trái) sang #F4F8FF (phải)
    for xx in range(0, W * S, 4):
        t = (xx / (W * S)) ** 1.6
        c = tuple(int(255 * (1 - t) + v * t) for v in (240, 246, 255))
        d.line([(xx, 0), (xx, H * S)], fill=c + (255,), width=4)
    # quầng màu: lớp nền mang sẵn màu (alpha 0) để khi làm mờ không bị ám xám
    for (col, a, ex, ey, er) in [((219, 234, 254), 230, rng.randint(1060, 1180), rng.randint(380, 480), 430),
                                 ((254, 243, 199), 170, rng.randint(1320, 1420), rng.randint(120, 220), 200)]:
        glow = Image.new('RGBA', img.size, col + (0,))
        ImageDraw.Draw(glow).ellipse(box(ex - er, ey - er, 2 * er, 2 * er), fill=col + (a,))
        img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(s(90))))
    # lưới mảnh phía phải, mờ dần về bên trái (vẽ trên lớp riêng để pha trong suốt)
    grid = Image.new('RGBA', img.size, (30, 64, 175, 0))
    gd = ImageDraw.Draw(grid)
    for xx in range(700, W, 56):
        gd.line([s(xx), 0, s(xx), s(H)], fill=(30, 64, 175, 255), width=s(1))
    for yy in range(28, H, 56):
        gd.line([s(640), s(yy), s(W), s(yy)], fill=(30, 64, 175, 255), width=s(1))
    fade = Image.new('L', (W, 1))
    for xx in range(W):
        fade.putpixel((xx, 0), int(16 * min(1, max(0, (xx - 640) / 360))))
    a = grid.split()[3]
    grid.putalpha(Image.composite(fade.resize(img.size), Image.new('L', img.size, 0), a))
    img.alpha_composite(grid)
    d = ImageDraw.Draw(img)
    # vạch nhấn hổ phách bên trái
    rrect(d, 0, 0, 10, H, 0, BRAND['amber'])
    return img

def card(img, x, y, w, h, r=20, fill=None, blur=26, alpha=38, dy=16):
    """Thẻ trắng có bóng mềm + viền mảnh, dùng cho nền sáng."""
    shadow(img, x, y, w, h, r, blur=blur, alpha=alpha, dy=dy)
    d = ImageDraw.Draw(img)
    rrect(d, x, y, w, h, r, fill or BRAND['white'], outline=(226, 232, 240), width=2)
    return d

def lines(d, x, y, w, n, gap, color, rng, thick=10):
    for i in range(n):
        ww = w * rng.uniform(0.55, 1.0)
        rrect(d, x, y + i * gap, ww, thick, thick / 2, color)

# ---------- motif ----------
def m_hoa_don(img, rng, cx, cy):
    for k, (ox, oy, rot) in enumerate([(-70, 30, -8), (40, -10, 6), (0, 0, 0)]):
        layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        x, y, w, h = cx - 210 + ox, cy - 270 + oy, 420, 540
        fill = BRAND['white'] if k == 2 else BRAND['sky']
        rrect(d, x, y, w, h, 22, fill)
        if k == 2:
            rrect(d, x + 36, y + 40, 150, 22, 11, BRAND['blue'])
            rrect(d, x + 36, y + 76, 230, 12, 6, (148, 163, 184))
            d.line([s(x + 36), s(y + 120), s(x + w - 36), s(y + 120)], fill=(226, 232, 240), width=s(3))
            lines(d, x + 36, y + 150, w - 72, 6, 38, (203, 213, 225), rng, 12)
            d.line([s(x + 36), s(y + 400), s(x + w - 36), s(y + 400)], fill=(226, 232, 240), width=s(3))
            rrect(d, x + 36, y + 428, 120, 16, 8, (148, 163, 184))
            rrect(d, x + w - 196, y + 420, 160, 30, 15, BRAND['amber'])
            # dấu "VAT"
            d.ellipse(box(x + w - 130, y + 30, 92, 92), outline=BRAND['amber'], width=s(6))
            d.text((s(x + w - 84), s(y + 76)), 'VAT', font=font(24), fill=BRAND['amber'], anchor='mm')
        layer = layer.rotate(rot, center=(s(cx), s(cy)), resample=Image.BICUBIC)
        shadow_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        shadow_layer.paste((15, 23, 42, 70), mask=layer.split()[3])
        img.alpha_composite(shadow_layer.filter(ImageFilter.GaussianBlur(s(22))), (0, s(16)))
        img.alpha_composite(layer)

def m_kinh_lup(img, rng, cx, cy):
    m_hoa_don(img, rng, cx - 40, cy)
    d = ImageDraw.Draw(img)
    lx, ly, r = cx + 150, cy + 60, 120
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.ellipse(box(lx - r, ly - r + 14, 2 * r, 2 * r), fill=(15, 23, 42, 80))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(s(18))))
    d.ellipse(box(lx - r, ly - r, 2 * r, 2 * r), fill=(255, 255, 255, 70), outline=BRAND['amber'], width=s(18))
    d.line([s(lx + r * 0.68), s(ly + r * 0.68), s(lx + r * 1.55), s(ly + r * 1.55)], fill=BRAND['amber'], width=s(30))
    d.line([s(lx - r * 0.45), s(ly - r * 0.15), s(lx - r * 0.1), s(ly - r * 0.55)], fill=(255, 255, 255, 180), width=s(10))

def m_cua_hang(img, rng, cx, cy):
    d = ImageDraw.Draw(img)
    cx -= 110  # chừa chỗ cho cột tăng trưởng
    x, y, w, h = cx - 260, cy - 150, 520, 360
    shadow(img, x, y, w, h + 10, 20)
    rrect(d, x, y + 60, w, h - 60, 18, BRAND['white'])
    # mái hiên sọc
    n = 6
    for i in range(n):
        c = BRAND['amber'] if i % 2 == 0 else BRAND['amber2']
        d.rounded_rectangle(box(x - 20 + i * (w + 40) / n, y, (w + 40) / n, 90), radius=s(14), fill=c)
    rrect(d, x + 40, y + 140, 170, 210, 10, BRAND['sky'])
    rrect(d, x + 250, y + 140, 230, 120, 10, BRAND['sky'])
    d.ellipse(box(x + 180, y + 240, 14, 14), fill=BRAND['blue'])
    # cột tăng trưởng bên cạnh
    bx = x + w + 50
    for i, hh in enumerate(sorted(rng.sample(range(90, 300), 3))):
        rrect(d, bx + i * 70, y + h - hh, 48, hh, 10, BRAND['white'] if i < 2 else BRAND['amber'])
    d.line([s(bx - 10), s(y + h + 2), s(bx + 220), s(y + h + 2)], fill=(255, 255, 255, 160), width=s(4))

def m_bieu_do(img, rng, cx, cy):
    d = ImageDraw.Draw(img)
    x, y, w, h = cx - 300, cy - 210, 600, 420
    shadow(img, x, y, w, h, 24)
    rrect(d, x, y, w, h, 24, BRAND['white'])
    for i in range(1, 5):
        d.line([s(x + 50), s(y + 60 + i * 70), s(x + w - 40), s(y + 60 + i * 70)], fill=(226, 232, 240), width=s(2))
    vals = [rng.randint(80, 260) for _ in range(6)]
    for i, v in enumerate(vals):
        rrect(d, x + 70 + i * 85, y + h - 50 - v, 46, v, 8, BRAND['sky'] if i < 5 else BRAND['blue'])
    pts = [(x + 93 + i * 85, y + h - 70 - v) for i, v in enumerate(sorted(vals))]
    d.line([(s(a), s(b)) for a, b in pts], fill=BRAND['amber'], width=s(8), joint='curve')
    for a, b in pts:
        d.ellipse(box(a - 10, b - 10, 20, 20), fill=BRAND['white'], outline=BRAND['amber'], width=s(5))

def m_so_sach(img, rng, cx, cy):
    d = ImageDraw.Draw(img)
    x, y, w, h = cx - 280, cy - 220, 380, 460
    shadow(img, x, y, w, h, 18)
    rrect(d, x, y, w, h, 18, BRAND['white'])
    rrect(d, x, y, 28, h, 10, BRAND['blue'])
    for r in range(8):
        yy = y + 50 + r * 48
        d.line([s(x + 60), s(yy), s(x + w - 30), s(yy)], fill=(226, 232, 240), width=s(2))
        rrect(d, x + 64, yy - 30, rng.randint(90, 150), 12, 6, (203, 213, 225))
        rrect(d, x + w - 120, yy - 30, rng.randint(50, 80), 12, 6, BRAND['blue2'] if r % 3 else BRAND['amber'])
    # máy tính
    kx, ky = x + w + 30, cy - 60
    shadow(img, kx, ky, 220, 300, 22)
    rrect(d, kx, ky, 220, 300, 22, BRAND['amber'])
    rrect(d, kx + 22, ky + 22, 176, 60, 10, BRAND['navy'])
    for r in range(3):
        for c in range(3):
            rrect(d, kx + 24 + c * 60, ky + 104 + r * 62, 48, 48, 10, BRAND['white'])

def m_khien(img, rng, cx, cy):
    d = ImageDraw.Draw(img)
    pts = [(cx, cy - 250), (cx + 220, cy - 170), (cx + 200, cy + 60), (cx, cy + 250), (cx - 200, cy + 60), (cx - 220, cy - 170)]
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).polygon([(s(a), s(b + 18)) for a, b in pts], fill=(15, 23, 42, 80))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(s(24))))
    d.polygon([(s(a), s(b)) for a, b in pts], fill=BRAND['white'])
    d.line([s(cx - 80), s(cy), s(cx - 15), s(cy + 70), s(cx + 100), s(cy - 70)], fill=BRAND['amber'], width=s(34), joint='curve')

def m_can_can(img, rng, cx, cy):
    d = ImageDraw.Draw(img)
    c = BRAND['white']
    rrect(d, cx - 12, cy - 220, 24, 420, 12, c)
    rrect(d, cx - 130, cy + 190, 260, 30, 15, c)
    d.line([s(cx - 260), s(cy - 170), s(cx + 260), s(cy - 210)], fill=c, width=s(18))
    for px_, py_ in [(cx - 250, cy - 170), (cx + 250, cy - 208)]:
        d.line([s(px_), s(py_), s(px_ - 80), s(py_ + 170)], fill=c, width=s(5))
        d.line([s(px_), s(py_), s(px_ + 80), s(py_ + 170)], fill=c, width=s(5))
        d.pieslice(box(px_ - 100, py_ + 100, 200, 140), 0, 180, fill=BRAND['amber'])
    d.ellipse(box(cx - 30, cy - 250, 60, 60), fill=BRAND['amber'])

SLATE, LINE, GREEN = (100, 116, 139), (226, 232, 240), (22, 163, 74)

def m_doanh_thu(img, rng, cx, cy):
    """Rà soát doanh thu: hóa đơn bán lẻ + thẻ biểu đồ doanh thu + kính lúp soi chênh lệch + chồng xu."""
    # thẻ biểu đồ doanh thu (phía sau)
    x, y, w, h = cx - 250, cy - 250, 470, 330
    d = card(img, x, y, w, h, 22)
    d.text((s(x + 32), s(y + 40)), 'Doanh thu', font=font(24), fill=BRAND['ink'], anchor='lm')
    d.text((s(x + 32), s(y + 72)), 'Thực tế  vs  Kê khai', font=font(17, bold=False), fill=SLATE, anchor='lm')
    rrect(d, x + w - 120, y + 28, 88, 30, 15, (254, 243, 199))
    d.text((s(x + w - 76), s(y + 43)), '2025–26', font=font(15), fill=(180, 83, 9), anchor='mm')
    base = y + h - 40
    for i in range(1, 4):
        d.line([s(x + 32), s(base - i * 55), s(x + w - 32), s(base - i * 55)], fill=LINE, width=s(2))
    for i in range(6):
        real = rng.randint(120, 175)
        dec = int(real * rng.uniform(0.25, 0.45))
        bx = x + 48 + i * 68
        rrect(d, bx, base - real, 22, real, 6, BRAND['blue'])
        rrect(d, bx + 26, base - dec, 22, dec, 6, (191, 219, 254))
    d.line([s(x + 32), s(base), s(x + w - 32), s(base)], fill=(203, 213, 225), width=s(2))
    # hóa đơn bán lẻ (phía trước, trái)
    rx, ry, rw, rh = cx - 340, cy - 40, 230, 330
    shadow(img, rx, ry, rw, rh, 6, alpha=45)
    d = ImageDraw.Draw(img)
    zig = [(s(rx), s(ry + rh - 14))]
    for k in range(12):
        zig.append((s(rx + (k + 0.5) * rw / 12), s(ry + rh)))
        zig.append((s(rx + (k + 1) * rw / 12), s(ry + rh - 14)))
    d.polygon([(s(rx), s(ry)), (s(rx + rw), s(ry))] + zig[::-1][:-1] + [zig[0]], fill=BRAND['white'])
    d.rectangle(box(rx, ry, rw, rh - 14), fill=BRAND['white'], outline=LINE, width=s(2))
    d.text((s(rx + rw / 2), s(ry + 34)), 'HÓA ĐƠN', font=font(20), fill=BRAND['blue'], anchor='mm')
    d.line([s(rx + 22), s(ry + 60), s(rx + rw - 22), s(ry + 60)], fill=LINE, width=s(2))
    for k in range(6):
        yy = ry + 86 + k * 30
        rrect(d, rx + 22, yy, rng.randint(70, 110), 9, 4, (203, 213, 225))
        rrect(d, rx + rw - 72, yy, 50, 9, 4, (148, 163, 184))
    d.line([s(rx + 22), s(ry + 270), s(rx + rw - 22), s(ry + 270)], fill=LINE, width=s(2))
    rrect(d, rx + 22, ry + 286, 60, 12, 6, BRAND['ink'])
    rrect(d, rx + rw - 102, ry + 282, 80, 18, 9, BRAND['amber'])
    # chồng xu
    for k in range(5):
        ex, ey = cx + 170, cy + 250 - k * 22
        d.ellipse(box(ex - 62, ey - 16, 124, 40), fill=(217, 119, 6))
        d.ellipse(box(ex - 62, ey - 22, 124, 40), fill=BRAND['amber2'] if k % 2 else BRAND['amber'])
    # kính lúp soi phần chênh lệch
    lx, ly, r = cx + 90, cy + 20, 96
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse(box(lx - r, ly - r + 16, 2 * r, 2 * r), fill=(15, 23, 42, 60))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(s(20))))
    d = ImageDraw.Draw(img)
    d.line([s(lx + r * 0.7), s(ly + r * 0.7), s(lx + r * 1.6), s(ly + r * 1.6)], fill=BRAND['navy'], width=s(26))
    d.ellipse(box(lx - r, ly - r, 2 * r, 2 * r), fill=(239, 246, 255), outline=BRAND['navy'], width=s(14))
    d.text((s(lx), s(ly - 12)), '!', font=font(56), fill=BRAND['amber'], anchor='mm')
    d.text((s(lx), s(ly + 40)), 'chênh lệch', font=font(17), fill=BRAND['blue'], anchor='mm')

def m_giai_the(img, rng, cx, cy):
    """Thủ tục giải thể: hồ sơ có dấu 'Đã duyệt', danh mục tích xanh, thẻ mã QR, đồng hồ hạn 2 ngày."""
    # bìa hồ sơ phía sau
    fx, fy, fw, fh = cx - 300, cy - 230, 430, 470
    shadow(img, fx, fy, fw, fh, 20, alpha=40)
    d = ImageDraw.Draw(img)
    rrect(d, fx, fy, 170, 60, 16, (191, 219, 254))
    rrect(d, fx, fy + 30, fw, fh - 30, 20, (219, 234, 254), outline=(191, 219, 254), width=2)
    # giấy danh mục
    px_, py_, pw, ph = fx + 34, fy + 60, fw - 68, fh - 90
    d = card(img, px_, py_, pw, ph, 14, blur=16, alpha=30, dy=8)
    d.text((s(px_ + 28), s(py_ + 38)), 'Hồ sơ giải thể', font=font(24), fill=BRAND['ink'], anchor='lm')
    d.text((s(px_ + 28), s(py_ + 68)), 'Chấm dứt mã số thuế', font=font(16, bold=False), fill=SLATE, anchor='lm')
    d.line([s(px_ + 28), s(py_ + 92), s(px_ + pw - 28), s(py_ + 92)], fill=LINE, width=s(2))
    for k in range(5):
        yy = py_ + 122 + k * 50
        done = k < 4
        if done:
            d.ellipse(box(px_ + 28, yy - 13, 26, 26), fill=GREEN)
            d.line([s(px_ + 35), s(yy), s(px_ + 40), s(yy + 6), s(px_ + 48), s(yy - 6)], fill=BRAND['white'], width=s(4), joint='curve')
        else:
            d.ellipse(box(px_ + 28, yy - 13, 26, 26), outline=(203, 213, 225), width=s(3))
        rrect(d, px_ + 70, yy - 6, rng.randint(150, 230), 12, 6, (203, 213, 225) if done else LINE)
    # dấu đã duyệt (xoay)
    st = Image.new('RGBA', img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(st)
    sx, sy = px_ + pw - 120, py_ + ph - 70
    sd.rounded_rectangle(box(sx - 92, sy - 30, 184, 60), radius=s(10), outline=(220, 38, 38, 210), width=s(5))
    sd.text((s(sx), s(sy)), 'ĐÃ DUYỆT', font=font(24), fill=(220, 38, 38, 210), anchor='mm')
    img.alpha_composite(st.rotate(-12, center=(s(sx), s(sy)), resample=Image.BICUBIC))
    # thẻ mã QR
    qx, qy, qs = cx + 170, cy - 200, 210
    d = card(img, qx, qy, qs, qs + 56, 18)
    cell, n = 10, 15
    ox, oy = qx + (qs - cell * n) / 2, qy + 26
    grid = [[rng.random() < 0.5 for _ in range(n)] for _ in range(n)]
    for (a, b) in [(0, 0), (0, n - 7), (n - 7, 0)]:
        for i in range(7):
            for j in range(7):
                grid[a + i][b + j] = i in (0, 6) or j in (0, 6) or (2 <= i <= 4 and 2 <= j <= 4)
        for i in range(-1, 8):
            for j in range(-1, 8):
                if 0 <= a + i < n and 0 <= b + j < n and not (0 <= i <= 6 and 0 <= j <= 6):
                    grid[a + i][b + j] = False
    for i in range(n):
        for j in range(n):
            if grid[i][j]:
                d.rectangle(box(ox + j * cell, oy + i * cell, cell, cell), fill=BRAND['navy'])
    d.text((s(qx + qs / 2), s(qy + qs + 22)), 'Danh mục hồ sơ', font=font(16), fill=BRAND['blue'], anchor='mm')
    # đồng hồ hạn 2 ngày làm việc
    kx, ky, kr = cx + 260, cy + 190, 82
    shadow(img, kx - kr, ky - kr, 2 * kr, 2 * kr, kr, alpha=40)
    d = ImageDraw.Draw(img)
    d.ellipse(box(kx - kr, ky - kr, 2 * kr, 2 * kr), fill=BRAND['amber'])
    d.ellipse(box(kx - kr + 12, ky - kr + 12, 2 * kr - 24, 2 * kr - 24), fill=BRAND['white'])
    d.text((s(kx), s(ky - 8)), '2', font=font(50), fill=BRAND['navy'], anchor='mm')
    d.text((s(kx), s(ky + 30)), 'ngày', font=font(16), fill=SLATE, anchor='mm')

def m_dat_dai(img, rng, cx, cy):
    """Thuế đất: bản đồ thửa đất (một thửa bỏ hoang có cỏ dại, gạch chéo), thẻ thuế suất và tờ thông báo thuế."""
    # bản đồ thửa đất
    x, y, w, h = cx - 400, cy - 230, 510, 420
    d = card(img, x, y, w, h, 22)
    d.text((s(x + 30), s(y + 38)), 'Bản đồ thửa đất', font=font(22), fill=BRAND['ink'], anchor='lm')
    d.text((s(x + 30), s(y + 66)), 'Đất phi nông nghiệp', font=font(15, bold=False), fill=SLATE, anchor='lm')
    gx, gy, cw, ch, gap = x + 30, y + 92, 104, 94, 8
    idle = (1, 2)
    for r in range(3):
        for c in range(4):
            px_, py_ = gx + c * (cw + gap), gy + r * (ch + gap)
            if (r, c) == idle:
                rrect(d, px_, py_, cw, ch, 10, (254, 243, 199), outline=BRAND['amber'], width=4)
                hatch = Image.new('RGBA', (s(cw - 12), s(ch - 12)), (0, 0, 0, 0))
                hd = ImageDraw.Draw(hatch)
                for k in range(-ch, cw, 18):  # gạch chéo, cắt gọn trong thửa
                    hd.line([s(k), s(ch), s(k + ch), 0], fill=(253, 224, 140, 255), width=s(3))
                img.alpha_composite(hatch, (s(px_ + 6), s(py_ + 6)))
                d = ImageDraw.Draw(img)
                for k in range(5):  # cỏ dại
                    bx, by = px_ + 18 + k * 17, py_ + ch - 16
                    for dx in (-7, 0, 7):
                        d.line([s(bx), s(by), s(bx + dx), s(by - rng.randint(18, 30))], fill=GREEN, width=s(3))
            else:
                col = [BRAND['sky'], (226, 232, 240), (191, 219, 254)][(r + c) % 3]
                rrect(d, px_, py_, cw, ch, 10, col)
                if (r + c) % 2 == 0:  # mái nhà nhỏ = đất đang sử dụng
                    hx, hy = px_ + cw / 2, py_ + ch / 2 + 6
                    rrect(d, hx - 22, hy - 6, 44, 30, 4, BRAND['white'])
                    d.polygon([(s(hx - 30), s(hy - 4)), (s(hx), s(hy - 30)), (s(hx + 30), s(hy - 4))], fill=BRAND['blue'])
    # ghim vị trí trên thửa bỏ hoang
    pxc, pyc = gx + 2 * (cw + gap) + cw / 2, gy + 1 * (ch + gap) - 6
    d.ellipse(box(pxc - 22, pyc - 52, 44, 44), fill=BRAND['amber'])
    d.polygon([(s(pxc - 16), s(pyc - 22)), (s(pxc + 16), s(pyc - 22)), (s(pxc), s(pyc + 6))], fill=BRAND['amber'])
    d.ellipse(box(pxc - 9, pyc - 39, 18, 18), fill=BRAND['white'])
    # thẻ thuế suất
    tx, ty, tw, th = cx + 120, cy - 250, 230, 170
    d = card(img, tx, ty, tw, th, 20, fill=BRAND['navy'])
    d.text((s(tx + tw / 2), s(ty + 40)), 'Thuế suất đề xuất', font=font(17, bold=False), fill=(191, 219, 254), anchor='mm')
    d.text((s(tx + tw / 2), s(ty + 98)), '0,2%', font=font(62), fill=BRAND['amber2'], anchor='mm')
    d.text((s(tx + tw / 2), s(ty + 144)), 'đất bỏ hoang', font=font(17), fill=BRAND['white'], anchor='mm')
    # tờ thông báo thuế
    nx, ny, nw, nh = cx + 150, cy - 40, 220, 270
    d = card(img, nx, ny, nw, nh, 16)
    rrect(d, nx, ny, nw, 54, 16, BRAND['blue'])
    d.rectangle(box(nx, ny + 34, nw, 20), fill=BRAND['blue'])
    d.text((s(nx + nw / 2), s(ny + 28)), 'Dự thảo luật', font=font(19), fill=BRAND['white'], anchor='mm')
    for k in range(4):
        rrect(d, nx + 24, ny + 80 + k * 32, rng.randint(110, 170), 10, 5, (203, 213, 225))
    tagx = nx + 18
    for lab in ['TNDN', 'TNCN', 'Đất PNN']:
        tw_ = d.textlength(lab, font=font(12)) / S + 18
        rrect(d, tagx, ny + nh - 50, tw_, 28, 14, (254, 243, 199))
        d.text((s(tagx + tw_ / 2), s(ny + nh - 36)), lab, font=font(12), fill=(180, 83, 9), anchor='mm')
        tagx += tw_ + 6

def m_no_bao_hiem(img, rng, cx, cy):
    """Nợ BHXH: thẻ lịch sử đóng 12 tháng (tháng chậm đóng màu đỏ), sổ BHXH, nhãn cảnh báo và đồng hồ cát."""
    RED, RED_SOFT = (220, 38, 38), (254, 226, 226)
    # thẻ lịch sử đóng
    x, y, w, h = cx - 330, cy - 260, 500, 330
    d = card(img, x, y, w, h, 22)
    d.text((s(x + 30), s(y + 40)), 'Lịch sử đóng BHXH', font=font(23), fill=BRAND['ink'], anchor='lm')
    d.text((s(x + 30), s(y + 70)), 'BHXH · BHYT · BHTN', font=font(15, bold=False), fill=SLATE, anchor='lm')
    late = set(rng.sample(range(5, 12), 4))
    for i in range(12):
        r, c = divmod(i, 6)
        bx, by = x + 30 + c * 74, y + 104 + r * 104
        bad = i in late
        rrect(d, bx, by, 62, 86, 12, RED_SOFT if bad else (220, 252, 231), outline=RED if bad else GREEN, width=2)
        d.text((s(bx + 31), s(by + 24)), f'T{i + 1}', font=font(16), fill=BRAND['ink'], anchor='mm')
        if bad:
            d.line([s(bx + 20), s(by + 46), s(bx + 42), s(by + 68)], fill=RED, width=s(5))
            d.line([s(bx + 42), s(by + 46), s(bx + 20), s(by + 68)], fill=RED, width=s(5))
        else:
            d.line([s(bx + 18), s(by + 58), s(bx + 28), s(by + 68), s(bx + 45), s(by + 46)], fill=GREEN, width=s(5), joint='curve')
    # sổ BHXH (phía trước, dưới trái)
    bx, by, bw, bh = cx - 400, cy + 140, 250, 170
    shadow(img, bx, by, bw, bh, 16, alpha=50)
    d = ImageDraw.Draw(img)
    rrect(d, bx, by, bw, bh, 16, BRAND['blue'])
    rrect(d, bx + 14, by + 14, bw - 28, bh - 28, 10, None, outline=(147, 197, 253), width=2)
    d.ellipse(box(bx + bw / 2 - 26, by + 26, 52, 52), outline=BRAND['amber2'], width=s(5))
    d.text((s(bx + bw / 2), s(by + 52)), '+', font=font(32), fill=BRAND['amber2'], anchor='mm')
    d.text((s(bx + bw / 2), s(by + 106)), 'SỔ BẢO HIỂM', font=font(20), fill=BRAND['white'], anchor='mm')
    d.text((s(bx + bw / 2), s(by + 134)), 'XÃ HỘI', font=font(20), fill=BRAND['white'], anchor='mm')
    # nhãn cảnh báo chậm đóng
    wx, wy, ww, wh = cx - 110, cy + 150, 300, 92
    d = card(img, wx, wy, ww, wh, 18)
    d.polygon([(s(wx + 52), s(wy + 20)), (s(wx + 82), s(wy + 72)), (s(wx + 22), s(wy + 72))], fill=BRAND['amber'])
    d.text((s(wx + 52), s(wy + 54)), '!', font=font(28), fill=BRAND['white'], anchor='mm')
    d.text((s(wx + 104), s(wy + 34)), 'Chậm đóng', font=font(24), fill=RED, anchor='lm')
    d.text((s(wx + 104), s(wy + 64)), 'quyền lợi bị ảnh hưởng', font=font(15, bold=False), fill=SLATE, anchor='lm')
    # đồng hồ cát
    hx, hy = cx + 270, cy - 170
    d = card(img, hx - 70, hy - 90, 140, 200, 20)
    rrect(d, hx - 46, hy - 70, 92, 14, 7, BRAND['navy'])
    rrect(d, hx - 46, hy + 76, 92, 14, 7, BRAND['navy'])
    d.polygon([(s(hx - 36), s(hy - 56)), (s(hx + 36), s(hy - 56)), (s(hx + 4), s(hy + 6)), (s(hx - 4), s(hy + 6))], fill=BRAND['sky'], outline=BRAND['blue'])
    d.polygon([(s(hx - 4), s(hy + 6)), (s(hx + 4), s(hy + 6)), (s(hx + 36), s(hy + 76)), (s(hx - 36), s(hy + 76))], fill=BRAND['sky'], outline=BRAND['blue'])
    d.polygon([(s(hx - 18), s(hy - 26)), (s(hx + 18), s(hy - 26)), (s(hx), s(hy + 2))], fill=BRAND['amber'])
    d.polygon([(s(hx - 30), s(hy + 76)), (s(hx + 30), s(hy + 76)), (s(hx), s(hy + 44))], fill=BRAND['amber'])

MOTIFS = {'hoa-don': m_hoa_don, 'kinh-lup': m_kinh_lup, 'cua-hang': m_cua_hang, 'bieu-do': m_bieu_do,
          'so-sach': m_so_sach, 'khien': m_khien, 'can-can': m_can_can,
          'doanh-thu': m_doanh_thu, 'giai-the': m_giai_the,
          'dat-dai': m_dat_dai, 'no-bao-hiem': m_no_bao_hiem}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', required=True)
    ap.add_argument('--category', required=True)
    ap.add_argument('--motif', choices=sorted(MOTIFS))
    ap.add_argument('--label', default='', help='Dòng chữ ngắn (<= 40 ký tự) dưới chuyên mục, tùy chọn')
    ap.add_argument('--theme', choices=['sang', 'toi'], default='sang', help='sang = nền trắng (mặc định), toi = nền xanh đậm cũ')
    a = ap.parse_args()
    rng = random.Random(int(hashlib.md5(a.slug.encode()).hexdigest(), 16))
    light = a.theme == 'sang'
    img = background_sang(rng) if light else background(rng)
    motif = a.motif or DEFAULT_MOTIF.get(a.category, 'bieu-do')
    MOTIFS[motif](img, rng, 1080 + rng.randint(-40, 40), 450 + rng.randint(-20, 20))

    d = ImageDraw.Draw(img)
    # nhãn chuyên mục + dòng chữ ngắn + thương hiệu
    cat = a.category.upper()
    f_cat = font(30)
    tw = d.textlength(cat, font=f_cat) / S
    rrect(d, 96, 110, tw + 56, 62, 31, BRAND['blue'] if light else BRAND['amber'])
    d.text((s(124), s(141)), cat, font=f_cat, fill=BRAND['white'] if light else BRAND['navy'], anchor='lm')
    text_c = BRAND['navy'] if light else BRAND['white']
    if a.label:
        f_lab = font(54)
        words, cur, rows = a.label.split(), '', []
        for wd in words:
            t = (cur + ' ' + wd).strip()
            if d.textlength(t, font=f_lab) / S > 560 and cur:
                rows.append(cur); cur = wd
            else:
                cur = t
        rows.append(cur)
        for i, r in enumerate(rows[:3]):
            d.text((s(96), s(220 + i * 70)), r, font=f_lab, fill=text_c)
        if light:
            rrect(d, 96, 220 + len(rows[:3]) * 70 + 24, 88, 8, 4, BRAND['amber'])
    d.text((s(96), s(H - 96)), 'TCT365', font=font(34), fill=BRAND['blue'] if light else BRAND['white'], anchor='ls')
    d.text((s(244), s(H - 96)), '·  Ảnh minh họa', font=font(24, bold=False), fill=SLATE if light else (219, 234, 254, 220), anchor='ls')

    out_dir = os.path.join(ROOT, 'public', 'images', 'tin-tuc')
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f'{a.slug}.webp')
    img.convert('RGB').resize((W, H), Image.LANCZOS).save(out, 'WEBP', quality=84, method=6)
    print(f'/images/tin-tuc/{a.slug}.webp')

if __name__ == '__main__':
    main()
