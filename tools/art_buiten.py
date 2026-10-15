"""Buitenterrein van het kamp: tegels (grond + hekken) en objecten (barakken, poort, torens, bomen...)."""
import random
from PIL import Image
from pixel import maak_palet, sprite, hexkleur, omlijn
import art_font

K = hexkleur
ZWART = '#24201c'


def nieuw(w, h):
    return Image.new('RGBA', (w, h), (0, 0, 0, 0))


class Doek:
    def __init__(self, w, h):
        self.img = nieuw(w, h)
        self.px = self.img.load()
        self.w, self.h = w, h

    def p(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px[x, y] = K(c) if isinstance(c, str) else c

    def rect(self, x, y, w, h, c):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.p(xx, yy, c)

    def ellips(self, cx, cy, rx, ry, c, alleen=None):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                dx = (x + 0.5 - cx) / rx
                dy = (y + 0.5 - cy) / ry
                if dx * dx + dy * dy <= 1 and (alleen is None or alleen(x, y)):
                    self.p(x, y, c)

    def lijn(self, x0, y0, x1, y1, c):
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx + dy
        while True:
            self.p(x0, y0, c)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    def tekst(self, x, y, inhoud, kleur):
        glyphs = art_font.alle_glyphs()
        for t in inhoud:
            if t == ' ':
                x += 4
                continue
            g = glyphs[t]
            for ry, r in enumerate(g):
                for rx, v in enumerate(r):
                    if v == '#':
                        self.p(x + rx, y + ry, kleur)
            x += len(g[0]) + 1


# ------------------------------------------------------------------ grondtegels

def ruis_tegel(basis, spikkels, zaad, extra=None):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, basis)
    for kleur, aantal in spikkels:
        for _ in range(aantal):
            d.p(random.randrange(16), random.randrange(16), kleur)
    if extra:
        extra(d)
    return d.img


def gras(zaad=1, bloemen=False):
    def plukjes(d):
        random.seed(zaad + 100)
        for _ in range(4):
            x, y = random.randrange(1, 15), random.randrange(2, 15)
            d.p(x, y, '#3e8a3a')
            d.p(x - 1, y - 1, '#3e8a3a')
            d.p(x + 1, y - 1, '#3e8a3a')
        if bloemen:
            for (x, y, c) in ((3, 4, '#f8f0f0'), (11, 10, '#f8e060'), (7, 13, '#f8f0f0')):
                d.p(x, y, c)
                d.p(x + 1, y, '#e8a040')
    return ruis_tegel('#5aa850', [('#68b85a', 18), ('#4c9444', 10)], zaad, plukjes)


def grind(zaad=3, stenen=True):
    def steentjes(d):
        if not stenen:
            return
        random.seed(zaad + 50)
        for _ in range(5):
            x, y = random.randrange(1, 14), random.randrange(1, 14)
            d.rect(x, y, 2, 1, '#e8dcc4')
            d.rect(x, y + 1, 2, 1, '#a89878')
    return ruis_tegel('#cbbb98', [('#d8caa8', 22), ('#b6a682', 22), ('#a49470', 6)], zaad, steentjes)


def zandpad(zaad=5):
    return ruis_tegel('#d2b080', [('#dcbe90', 18), ('#bc9a6a', 14)], zaad)


def heide(zaad=7):
    def toefjes(d):
        random.seed(zaad + 9)
        for _ in range(7):
            x, y = random.randrange(1, 15), random.randrange(1, 15)
            d.p(x, y, '#b07ab0')
            d.p(x, y + 1, '#5a3a5a')
    return ruis_tegel('#7a5a7a', [('#8c6a8c', 18), ('#5e8a4a', 14), ('#644864', 10)], zaad, toefjes)


def struik():
    d = Doek(16, 16)
    d.ellips(8, 9, 7.5, 6.5, '#2e6a32')
    d.ellips(7, 8, 6, 5, '#3e8a3e')
    d.ellips(6, 6, 3, 2, '#5aa852')
    for (x, y) in ((4, 10), (10, 7), (11, 11), (7, 12)):
        d.p(x, y, '#2e6a32')
    img = omlijn(d.img, K('#1c3a1e'))
    return img


# ------------------------------------------------------------------ hekken (overlay, transparant)

PAAL, PAAL_L, DRAAD, PRIK = '#6a5440', '#8c7458', '#585e66', '#8a9098'


def hek_h():
    d = Doek(16, 16)
    # paal in het midden
    d.rect(7, 0, 3, 15, PAAL)
    d.rect(7, 0, 1, 15, PAAL_L)
    d.rect(7, 15, 3, 1, '#00000040')
    d.rect(6, 0, 5, 1, ZWART)
    for y in (3, 7, 11):
        for x in range(16):
            d.p(x, y + (1 if x % 4 == 2 else 0), DRAAD)
        for x in range(1, 16, 4):
            d.p(x, y - 1, PRIK)
            d.p(x + 1, y + 1, PRIK)
    return d.img


def hek_v():
    d = Doek(16, 16)
    for x in (5, 8, 11):
        for y in range(16):
            d.p(x + (1 if y % 4 == 2 else 0), y, DRAAD)
        for y in range(1, 16, 4):
            d.p(x - 1, y, PRIK)
            d.p(x + 1, y + 1, PRIK)
    d.rect(7, 4, 3, 10, PAAL)
    d.rect(7, 4, 1, 10, PAAL_L)
    d.rect(6, 3, 5, 1, ZWART)
    return d.img


def hek_paal():
    d = Doek(16, 16)
    d.rect(6, 0, 4, 15, PAAL)
    d.rect(6, 0, 1, 15, PAAL_L)
    d.rect(5, 0, 6, 1, ZWART)
    for y in (3, 7, 11):
        d.rect(0, y, 16, 1, DRAAD)
    return d.img


def tegelset():
    """Volgorde moet overeenkomen met js/maps/plein.js."""
    return [
        gras(1),                # 0
        gras(2, bloemen=True),  # 1
        grind(3),               # 2
        grind(4, stenen=False), # 3
        zandpad(5),             # 4
        heide(7),               # 5
        hek_h(),                # 6  (overlay)
        hek_v(),                # 7  (overlay)
        hek_paal(),             # 8  (overlay)
        struik(),               # 9  (overlay)
        heide(8),               # 10
        zandpad(6),             # 11
    ]


# ------------------------------------------------------------------ objecten

def barak(open_deur=False, nummer=None):
    """Houten barak van buiten, 112x64 (7x4 tegels). Deur in het midden (tegel 3, onderste rij)."""
    w, h = 112, 64
    d = Doek(w, h)
    dak, dakL, dakD = '#4a4652', '#625e6c', '#34313c'
    muur, muurL, muurD = '#7c5634', '#94683e', '#5c3e24'
    # dak (schuin aflopend naar voren)
    d.rect(2, 2, w - 4, 34, dak)
    for y in range(4, 34, 4):
        d.rect(3, y, w - 6, 1, dakD)
    d.rect(2, 2, w - 4, 3, dakL)
    d.rect(0, 34, w, 4, dakD)
    d.rect(0, 34, w, 1, '#7a7686')
    # schoorsteen
    d.rect(80, 0, 8, 12, '#7a4a3a')
    d.rect(80, 0, 8, 2, '#9a6a5a')
    d.rect(79, 0, 10, 1, ZWART)
    # muur
    d.rect(4, 38, w - 8, 24, muur)
    for x in range(4, w - 4, 5):
        d.rect(x, 38, 1, 24, muurD)
        d.rect(x + 1, 38, 1, 24, muurL)
    d.rect(4, 60, w - 8, 2, muurD)
    # ramen
    for x in (12, 30, 66, 84):
        d.rect(x, 42, 14, 11, '#3a2a1a')
        d.rect(x + 1, 43, 12, 9, '#9cc8dc')
        d.rect(x + 1, 43, 12, 3, '#c8e4f0')
        d.rect(x + 6, 43, 2, 9, '#d8d0c0')
        d.rect(x + 1, 47, 12, 1, '#d8d0c0')
        d.rect(x - 1, 53, 16, 2, '#a88a62')
    # deur
    dx = 48
    d.rect(dx, 40, 16, 22, '#2a1c10')
    if open_deur:
        d.rect(dx + 2, 42, 12, 20, '#1a1410')
        d.rect(dx + 2, 42, 12, 4, '#3a3028')
        d.rect(dx + 11, 42, 3, 20, '#5e4028')
    else:
        d.rect(dx + 2, 42, 12, 20, '#6e4628')
        for x in (dx + 5, dx + 9):
            d.rect(x, 42, 1, 20, '#4c2f1a')
        d.rect(dx + 11, 52, 2, 2, '#e0bc48')
    d.rect(dx - 2, 38, 20, 2, '#a88a62')
    # nummerbordje
    if nummer is not None:
        d.rect(dx + 3, 30, 10, 7, '#f0ead8')
        d.rect(dx + 3, 30, 10, 1, ZWART)
        d.rect(dx + 3, 36, 10, 1, ZWART)
        d.tekst(dx + 6, 30, str(nummer), '#303038')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def keuken():
    w, h = 80, 64
    d = Doek(w, h)
    dak, dakL, dakD = '#7a3a32', '#9a5248', '#5a2822'
    d.rect(2, 4, w - 4, 30, dak)
    for y in range(6, 32, 4):
        d.rect(3, y, w - 6, 1, dakD)
    d.rect(2, 4, w - 4, 3, dakL)
    d.rect(0, 32, w, 4, dakD)
    d.rect(56, 0, 8, 14, '#8a8a8a')
    d.rect(55, 0, 10, 2, '#b0b0b0')
    d.rect(4, 36, w - 8, 26, '#d8d0bc')
    for y in range(38, 62, 4):
        d.rect(4, y, w - 8, 1, '#c0b8a2')
    # luik met toonbank
    d.rect(10, 40, 30, 14, '#3a2a1a')
    d.rect(11, 41, 28, 12, '#2a2018')
    d.rect(8, 53, 34, 3, '#a88a62')
    # pan op de toonbank
    d.rect(16, 50, 10, 3, '#7a7a88')
    d.rect(15, 49, 12, 1, '#a0a0b0')
    # deur
    d.rect(52, 40, 16, 22, '#2a1c10')
    d.rect(54, 42, 12, 20, '#7a5a3a')
    d.rect(63, 52, 2, 2, '#e0bc48')
    # bord KEUKEN
    d.rect(14, 26, 44, 10, '#f0ead8')
    d.rect(14, 26, 44, 1, ZWART)
    d.rect(14, 35, 44, 1, ZWART)
    d.tekst(18, 28, 'KEUKEN', '#a03030')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def wachttoren():
    w, h = 40, 72
    d = Doek(w, h)
    hout, houtL, houtD = '#6a5440', '#8c7458', '#4a3a2a'
    # poten
    for x in (6, 31):
        d.rect(x, 30, 3, 42, hout)
        d.rect(x, 30, 1, 42, houtL)
    for i in range(0, 40, 10):
        d.lijn(8, 32 + i, 31, 40 + i, houtD)
        d.lijn(31, 32 + i, 8, 40 + i, houtD)
    # hut
    d.rect(3, 14, 34, 18, hout)
    d.rect(3, 14, 34, 2, houtL)
    d.rect(6, 18, 28, 8, '#2a2420')
    d.rect(7, 19, 26, 6, '#f8d880')
    d.rect(3, 30, 34, 2, houtD)
    # dak
    for i in range(10):
        d.rect(2 + i * 2 - 2, 14 - i, 40 - i * 4 + 0, 1, '#4a4652')
    d.rect(0, 13, 40, 2, '#34313c')
    # zoeklicht
    d.rect(30, 8, 6, 5, '#5a5a62')
    d.rect(35, 9, 2, 3, '#fff0b0')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def poort(open_=False):
    """Kamppoort tussen twee palen, 64x48 (4 tegels breed)."""
    w, h = 64, 48
    d = Doek(w, h)
    paal, paalL = '#5a4a3a', '#7a6650'
    for x in (0, 58):
        d.rect(x, 2, 6, 44, paal)
        d.rect(x, 2, 2, 44, paalL)
        d.rect(x - 1 if x else 0, 0, 7, 3, '#3a3028')
    # bord boven de poort
    d.rect(6, 4, 52, 9, '#3a3028')
    d.rect(7, 5, 50, 7, '#c8b890')
    d.tekst(13, 5, 'UITGANG', '#5a2a20')
    if not open_:
        for x0 in (6, 32):
            d.rect(x0, 16, 26, 2, '#4a4a52')
            d.rect(x0, 30, 26, 2, '#4a4a52')
            d.rect(x0, 44, 26, 2, '#4a4a52')
            for x in range(x0, x0 + 26, 4):
                d.rect(x, 16, 1, 30, '#62626c')
            d.lijn(x0, 46, x0 + 25, 16, '#4a4a52')
        d.rect(31, 28, 2, 6, '#c8a838')
    else:
        for x0, richting in ((6, 1), (52, -1)):
            for i in range(6):
                d.rect(x0 + i * richting, 16, 1, 30, '#62626c')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def wachthuisje():
    w, h = 32, 44
    d = Doek(w, h)
    d.rect(2, 4, 28, 10, '#4a5242')
    d.rect(2, 4, 28, 2, '#68705c')
    d.rect(0, 12, 32, 3, '#34392e')
    d.rect(3, 15, 26, 27, '#7a8068')
    for y in range(17, 42, 4):
        d.rect(3, y, 26, 1, '#68705c')
    d.rect(7, 18, 18, 9, '#2a2a2a')
    d.rect(8, 19, 16, 7, '#9cc8dc')
    d.rect(8, 19, 16, 2, '#c8e4f0')
    d.rect(3, 40, 26, 2, '#5a604c')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def den():
    w, h = 32, 48
    d = Doek(w, h)
    d.rect(14, 38, 4, 10, '#5a3a24')
    d.rect(14, 38, 1, 10, '#7a5234')
    lagen = [(16, 4, 5), (16, 12, 9), (16, 21, 12), (16, 31, 15)]
    for cx, top, half in lagen:
        for i in range(half + 2):
            y = top + i
            b = int(i * half / (half + 1)) + 1
            d.rect(cx - b, y, 2 * b, 1, '#2e6a3a')
            d.rect(cx - b, y, max(1, b // 2), 1, '#3e8a48')
    d.img = omlijn(d.img, K('#16301c'))
    return d.img


def waterpomp():
    w, h = 16, 26
    d = Doek(w, h)
    d.rect(5, 6, 6, 18, '#3e4e6a')
    d.rect(5, 6, 2, 18, '#5a6e92')
    d.rect(4, 4, 8, 3, '#2e3a50')
    d.rect(11, 9, 4, 2, '#3e4e6a')
    d.rect(14, 11, 1, 2, '#3e4e6a')
    d.lijn(6, 4, 1, 0, '#2e3a50')
    d.rect(2, 22, 12, 3, '#8a8a92')
    d.rect(3, 23, 10, 1, '#78a8d0')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def lantaarn():
    w, h = 16, 40
    d = Doek(w, h)
    d.rect(7, 8, 2, 30, '#3a3a42')
    d.rect(5, 36, 6, 3, '#3a3a42')
    d.rect(4, 2, 8, 7, '#3a3a42')
    d.rect(5, 3, 6, 5, '#fff0a0')
    d.rect(3, 1, 10, 2, '#2a2a30')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def bankje():
    w, h = 32, 18
    d = Doek(w, h)
    d.rect(1, 2, 30, 4, '#8c6a44')
    d.rect(1, 2, 30, 1, '#a8845a')
    d.rect(1, 8, 30, 4, '#8c6a44')
    d.rect(1, 8, 30, 1, '#a8845a')
    for x in (3, 26):
        d.rect(x, 12, 3, 5, '#5a4028')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def kisten():
    w, h = 16, 20
    d = Doek(w, h)
    for (x, y, b, hh) in ((0, 8, 16, 12), (3, 0, 11, 9)):
        d.rect(x, y, b, hh, '#a0784a')
        d.rect(x, y, b, 2, '#c09060')
        d.rect(x, y + hh - 2, b, 2, '#7a5634')
        d.lijn(x, y, x + b - 1, y + hh - 1, '#7a5634')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def bord():
    w, h = 24, 24
    d = Doek(w, h)
    d.rect(11, 12, 2, 12, '#5a4028')
    d.rect(1, 1, 22, 13, '#c8a870')
    d.rect(1, 1, 22, 2, '#e0c890')
    for y in (5, 8, 11):
        d.rect(4, y, 16, 1, '#7a5a3a')
    d.img = omlijn(d.img, K(ZWART))
    return d.img


def objecten():
    return {
        'barak': barak(False),
        'barak_7': barak(False, 7),
        'barak_7_open': barak(True, 7),
        'barak_5': barak(False, 5),
        'barak_6': barak(False, 6),
        'keuken': keuken(),
        'wachttoren': wachttoren(),
        'poort': poort(False),
        'poort_open': poort(True),
        'wachthuisje': wachthuisje(),
        'den': den(),
        'waterpomp': waterpomp(),
        'lantaarn': lantaarn(),
        'bankje': bankje(),
        'kisten': kisten(),
        'bord': bord(),
    }


if __name__ == '__main__':
    from pixel import vel, voorbeeld
    t = vel(tegelset(), 6)
    voorbeeld(t, 5).save('voorbeeld_buitentegels.png')
    obj = objecten()
    W = sum(o.size[0] + 4 for o in obj.values())
    H = max(o.size[1] for o in obj.values())
    sheet = Image.new('RGBA', (W, H))
    x = 0
    for o in obj.values():
        sheet.paste(o, (x, H - o.size[1]), o)
        x += o.size[0] + 4
    voorbeeld(sheet, 3, (90, 168, 80, 255)).save('voorbeeld_buitenobjecten.png')
