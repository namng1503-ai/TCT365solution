#!/usr/bin/env python3
"""Tạo ảnh bìa minh họa 16:9 (.webp) cho bài Tin tức — đồ họa tự vẽ, không dùng ảnh của bên thứ ba.

Cách dùng:
  python3 scripts/tao-anh-bia.py --slug <slug-bai> --category "Thuế" [--motif hoa-don] [--label "Dòng chữ ngắn"]

Kết quả: public/images/tin-tuc/<slug>.webp  (đường dẫn dùng trong frontmatter: /images/tin-tuc/<slug>.webp)
Motif: hoa-don, cua-hang, bieu-do, so-sach, khien, can-can, kinh-lup. Mặc định theo chuyên mục.
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

MOTIFS = {'hoa-don': m_hoa_don, 'kinh-lup': m_kinh_lup, 'cua-hang': m_cua_hang, 'bieu-do': m_bieu_do,
          'so-sach': m_so_sach, 'khien': m_khien, 'can-can': m_can_can}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', required=True)
    ap.add_argument('--category', required=True)
    ap.add_argument('--motif', choices=sorted(MOTIFS))
    ap.add_argument('--label', default='', help='Dòng chữ ngắn (<= 40 ký tự) dưới chuyên mục, tùy chọn')
    a = ap.parse_args()
    rng = random.Random(int(hashlib.md5(a.slug.encode()).hexdigest(), 16))
    img = background(rng)
    motif = a.motif or DEFAULT_MOTIF.get(a.category, 'bieu-do')
    MOTIFS[motif](img, rng, 1080 + rng.randint(-40, 40), 450 + rng.randint(-20, 20))

    d = ImageDraw.Draw(img)
    # nhãn chuyên mục + dòng chữ ngắn + thương hiệu
    cat = a.category.upper()
    f_cat = font(30)
    tw = d.textlength(cat, font=f_cat) / S
    rrect(d, 96, 110, tw + 56, 62, 31, BRAND['amber'])
    d.text((s(124), s(141)), cat, font=f_cat, fill=BRAND['navy'], anchor='lm')
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
            d.text((s(96), s(220 + i * 70)), r, font=f_lab, fill=BRAND['white'])
    d.text((s(96), s(H - 96)), 'TCT365', font=font(34), fill=BRAND['white'], anchor='ls')
    d.text((s(244), s(H - 96)), '·  Ảnh minh họa', font=font(24, bold=False), fill=(219, 234, 254, 220), anchor='ls')

    out_dir = os.path.join(ROOT, 'public', 'images', 'tin-tuc')
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f'{a.slug}.webp')
    img.convert('RGB').resize((W, H), Image.LANCZOS).save(out, 'WEBP', quality=84, method=6)
    print(f'/images/tin-tuc/{a.slug}.webp')

if __name__ == '__main__':
    main()
