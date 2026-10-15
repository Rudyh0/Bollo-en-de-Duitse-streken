"""Achtergronden (240x160): titelscherm en intro."""
import math
import random
from PIL import Image
from pixel import hexkleur

K = hexkleur
W, H = 240, 160


class Doek:
    def __init__(self, w=W, h=H):
        self.img = Image.new('RGBA', (w, h), (0, 0, 0, 255))
        self.px = self.img.load()
        self.w, self.h = w, h

    def p(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px[x, y] = K(c) if isinstance(c, str) else c

    def rect(self, x, y, w, h, c):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.p(xx, yy, c)

    def ellips(self, cx, cy, rx, ry, c):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                dx = (x + 0.5 - cx) / rx
                dy = (y + 0.5 - cy) / ry
                if dx * dx + dy * dy <= 1:
                    self.p(x, y, c)


def banden(d, y0, y1, kleuren, dither=True):
    """Verticaal verloop in harde banden met een rij dithering ertussen (Gen 3-stijl)."""
    n = len(kleuren)
    hoogte = (y1 - y0) / n
    for i, kleur in enumerate(kleuren):
        ys = int(y0 + i * hoogte)
        ye = int(y0 + (i + 1) * hoogte)
        d.rect(0, ys, d.w, ye - ys, kleur)
        if dither and i > 0:
            vorige = kleuren[i - 1]
            for x in range(0, d.w, 2):
                d.p(x + (ys % 2), ys, vorige)
            for x in range(0, d.w, 4):
                d.p(x, ys + 1, vorige)


def den(d, x, voet, hoogte, kleur, licht=None):
    """Dennenboom-silhouet."""
    lagen = max(3, hoogte // 5)
    breedte_max = max(3, hoogte // 3)
    d.rect(x - 1, voet - 3, 2, 3, kleur)
    for i in range(hoogte - 2):
        y = voet - 3 - i
        rel = i / (hoogte - 2)
        laag = (i * lagen // (hoogte - 2))
        binnen = (i * lagen / (hoogte - 2)) - laag
        b = (1 - rel) * breedte_max * (1 - 0.45 * binnen)
        b = max(0.5, b)
        for xx in range(int(x - b), int(x + b) + 1):
            d.p(xx, y, kleur)
        if licht and int(x - b) < x - 1:
            d.p(int(x - b), y, licht)


def titel_achtergrond():
    random.seed(7)
    d = Doek()
    # lucht: schemering
    banden(d, 0, 104, ['#141c3c', '#1e2a54', '#2e3a6a', '#4a4878', '#76587e', '#a8667a', '#d87c6a', '#f0a060', '#f8c878'])
    # sterren
    for _ in range(40):
        x, y = random.randrange(W), random.randrange(0, 42)
        d.p(x, y, '#f8f0d0' if random.random() < 0.6 else '#a8b0d8')
    for (x, y) in ((30, 10), (200, 18), (150, 6)):
        d.p(x, y, '#ffffff')
        d.p(x - 1, y, '#8890c0')
        d.p(x + 1, y, '#8890c0')
        d.p(x, y - 1, '#8890c0')
        d.p(x, y + 1, '#8890c0')
    # ondergaande zon
    d.ellips(176, 98, 16, 16, '#f8e098')
    d.ellips(176, 98, 13, 13, '#fff0c0')
    # verre bosrand
    for x in range(-4, W + 4, 5):
        den(d, x + random.randint(-1, 1), 100, random.randint(12, 20), '#3a3458')
    d.rect(0, 98, W, 6, '#3a3458')
    # dichterbij bos
    for x in range(-6, W + 6, 7):
        den(d, x + random.randint(-2, 2), 108, random.randint(16, 26), '#24223c')
    d.rect(0, 105, W, 5, '#24223c')
    # lichtjes van het vakantiepark (rechts in het bos)
    for (x, y) in ((196, 103), (204, 101), (211, 104), (219, 102), (226, 105), (190, 106)):
        d.p(x, y, '#ffd860')
        d.p(x, y - 1, '#a08040')
    # heide
    banden(d, 108, 160, ['#4a2c52', '#5a3462', '#6a3c6e', '#78467a'], dither=True)
    for _ in range(420):
        x, y = random.randrange(W), random.randrange(110, 160)
        d.p(x, y, random.choice(['#8e5a8e', '#a46aa0', '#3e2648', '#5c7a3a']))
    # zandpad
    for y in range(112, 160):
        t = (y - 112) / 48
        midden = 130 - 60 * t + 8 * math.sin(t * 5)
        breedte = 3 + 26 * t
        for x in range(int(midden - breedte), int(midden + breedte)):
            d.p(x, y, '#c8a070' if (x + y) % 7 else '#b08858')
        d.p(int(midden - breedte) - 1, y, '#8a6a48')
        d.p(int(midden + breedte), y, '#8a6a48')
    # kamp links: hek met prikkeldraad en wachttoren (silhouet)
    zw = '#141420'
    for x in range(0, 92, 12):
        d.rect(x, 96, 2, 22, zw)
    for y in (100, 106, 112):
        for x in range(0, 92):
            if (x + y) % 3:
                d.p(x, y + (x % 4 == 0), zw)
    d.rect(16, 62, 3, 56, zw)
    d.rect(38, 62, 3, 56, zw)
    for i in range(0, 50, 10):
        for k in range(22):
            d.p(17 + k, 66 + i + k // 2, zw)
            d.p(39 - k, 66 + i + k // 2, zw)
    d.rect(10, 52, 38, 12, zw)
    d.rect(8, 46, 42, 4, zw)
    for k in range(10):
        d.rect(10 + k * 2, 36 + k, 38 - k * 4, 1, zw)
    d.rect(14, 54, 30, 5, '#f8d880')
    d.rect(14, 54, 30, 1, '#c8a050')
    # zoeklicht-bundel
    for i in range(70):
        y = 56 - i // 3
        x0 = 44 + i
        for k in range(1 + i // 10):
            px = d.px[min(W - 1, x0), max(0, y + k)]
            mix = tuple(min(255, int(px[c] * 0.75 + 255 * 0.25)) for c in range(3)) + (255,)
            d.p(x0, y + k, mix)
    return d.img


def intro_achtergrond():
    d = Doek()
    banden(d, 0, 96, ['#20384a', '#28465a', '#30546a', '#3a647a', '#467488', '#548696'])
    banden(d, 96, 160, ['#5c8e72', '#6a9c7e', '#78aa8a', '#86b896'])
    # podium
    d.ellips(120, 108, 54, 12, '#3e6e56')
    d.ellips(120, 106, 52, 11, '#9ccca8')
    d.ellips(120, 105, 48, 9, '#b8e0c0')
    d.ellips(112, 103, 26, 4, '#d4f0d8')
    # zachte lichtvlekjes
    random.seed(3)
    for _ in range(30):
        x, y = random.randrange(W), random.randrange(4, 100)
        d.p(x, y, '#7ab0c0')
    return d.img


if __name__ == '__main__':
    t = titel_achtergrond()
    i = intro_achtergrond()
    sheet = Image.new('RGBA', (W * 2 + 4, H))
    sheet.paste(t, (0, 0))
    sheet.paste(i, (W + 4, 0))
    sheet.resize((sheet.size[0] * 3, H * 3), Image.NEAREST).save('voorbeeld_achtergronden.png')
