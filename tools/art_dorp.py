"""Orvelte: dorpstegels, gebouwen (molen, plaggenhut, coffeeshop, boerderij), hunebedden,
interieurs, de jongens met de fatbikes en alles wat erbij hoort."""
import math
import random
from PIL import Image
from pixel import hexkleur, omlijn
from art_buiten import Doek, ruis_tegel

K = hexkleur
ZWART = '#24201c'


# ================================================================== buitentegels (achter de bostegels)

def klinkers(zaad=41):
    """Rode klinkers in keperverband."""
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#7a4a3a')
    kleuren = ['#a85a44', '#b4644c', '#9a5040', '#ac6a50']
    for by in range(0, 16, 4):
        for bx in range(-8, 16, 8):
            ox = bx + (4 if (by // 4) % 2 else 0)
            c = random.choice(kleuren)
            d.rect(ox + 1, by + 1, 7, 3, c)
            d.rect(ox + 1, by + 1, 7, 1, '#c07a5e')
    for _ in range(6):
        d.p(random.randrange(16), random.randrange(16), '#8a4a3a')
    return d.img


def bloemperk():
    d = Doek(16, 16)
    d.rect(1, 3, 14, 12, '#5a3e28')
    d.rect(1, 3, 14, 1, '#7a5a3a')
    for (x, y, c) in ((3, 5, '#e84848'), (7, 6, '#f8d040'), (11, 5, '#e84848'), (4, 10, '#f8d040'),
                      (9, 11, '#e870b0'), (12, 9, '#f8f0f0'), (6, 8, '#e870b0')):
        d.rect(x - 1, y + 1, 1, 2, '#3e8a3a')
        d.rect(x + 1, y + 1, 1, 2, '#3e8a3a')
        d.rect(x, y, 2, 2, c)
    return omlijn(d.img, K('#3a2414'))


HEK, HEK_L, HEK_D = '#e8e2d2', '#ffffff', '#a8a294'


def hekje_h():
    d = Doek(16, 16)
    d.rect(0, 7, 16, 2, HEK)
    d.rect(0, 11, 16, 2, HEK)
    for x in (2, 9):
        d.rect(x, 4, 3, 12, HEK)
        d.rect(x, 4, 1, 12, HEK_L)
        d.p(x + 1, 3, HEK)
    d.rect(0, 15, 16, 1, HEK_D)
    return omlijn(d.img, K('#6a6458'))


def hekje_v():
    d = Doek(16, 16)
    d.rect(6, 0, 3, 16, HEK)
    d.rect(6, 0, 1, 16, HEK_L)
    d.rect(9, 0, 1, 16, HEK_D)
    return omlijn(d.img, K('#6a6458'))


def hekje_paal():
    d = Doek(16, 16)
    d.rect(6, 3, 4, 13, HEK)
    d.rect(6, 3, 1, 13, HEK_L)
    d.rect(5, 2, 6, 2, HEK_D)
    d.rect(10, 7, 6, 2, HEK)
    d.rect(10, 11, 6, 2, HEK)
    return omlijn(d.img, K('#6a6458'))


def stoep(zaad=43):
    """Grijze stoeptegels."""
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#b8b4ac')
    d.rect(0, 7, 16, 1, '#8c8880')
    d.rect(7, 0, 1, 16, '#8c8880')
    d.rect(0, 0, 16, 1, '#d0ccc4')
    d.rect(0, 8, 16, 1, '#d0ccc4')
    for _ in range(10):
        d.p(random.randrange(16), random.randrange(16), random.choice(['#a8a49c', '#c4c0b8']))
    return d.img


def tegelset_extra():
    """Dorpstegels, achter de bostegels geplakt (index 23 en verder)."""
    return [
        klinkers(41),   # 23
        klinkers(42),   # 24
        bloemperk(),    # 25 (boven, vast)
        hekje_h(),      # 26 (boven, vast)
        hekje_v(),      # 27 (boven, vast)
        hekje_paal(),   # 28 (boven, vast)
        stoep(43),      # 29
    ]


# ================================================================== binnentegels (plaggenhut en coffeeshop)

def leem(zaad):
    def strootjes(d):
        random.seed(zaad + 7)
        for _ in range(3):
            x, y = random.randrange(1, 13), random.randrange(1, 15)
            d.rect(x, y, 3, 1, '#d8c070')
    return ruis_tegel('#a07a52', [('#8a6644', 20), ('#b48a5e', 18)], zaad, strootjes)


def schaduw(img, n=4):
    out = img.copy()
    d = out.load()
    for y in range(n):
        for x in range(16):
            r, g, b, a = d[x, y]
            f = 0.6 + 0.1 * y
            d[x, y] = (int(r * f), int(g * f), int(b * f), a)
    return out


def plaggen(onder=False):
    """Muur van gestapelde heideplaggen."""
    random.seed(51 if onder else 52)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#4a3420')
    for by in range(0, 16, 5):
        ox = 0 if (by // 5) % 2 else -4
        for bx in range(ox, 16, 8):
            d.rect(bx + 1, by + 1, 7, 4, random.choice(['#6a4a2c', '#5e4228', '#72522e']))
            d.rect(bx + 1, by + 1, 7, 1, '#4e7a3a')
            if random.random() < 0.5:
                d.p(bx + 3, by, '#8a5a8a')
    if onder:
        d.rect(0, 14, 16, 2, '#2e2014')
    return d.img


def plag_raam():
    d = Doek(16, 16)
    d.img = plaggen(True)
    d.px = d.img.load()
    d.rect(3, 3, 10, 8, '#3a2414')
    d.rect(4, 4, 8, 6, '#9cc8dc')
    d.rect(4, 4, 8, 2, '#c8e4f0')
    d.rect(7, 4, 2, 6, '#5a3a20')
    d.rect(4, 6, 8, 1, '#5a3a20')
    d.rect(2, 11, 12, 1, '#7a5a3a')
    return d.img


def rand(kant):
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#1e1610')
    if kant == 'links':
        d.rect(13, 0, 3, 16, '#3a2a1c')
        d.rect(15, 0, 1, 16, '#5a4430')
    elif kant == 'rechts':
        d.rect(0, 0, 3, 16, '#3a2a1c')
        d.rect(0, 0, 1, 16, '#5a4430')
    elif kant == 'onder':
        d.rect(0, 0, 16, 3, '#3a2a1c')
        d.rect(0, 0, 16, 1, '#5a4430')
    return d.img


def doorgang(mat):
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#1e1610')
    d.rect(1, 0, 14, 16, '#e8d8a0' if not mat else '#d8c890')
    d.rect(1, 0, 14, 4, '#c8b880')
    d.rect(2, 2, 12, 10, mat or '#7a5a3a')
    for y in range(3, 12, 2):
        d.rect(3, y, 10, 1, '#5a3e28' if not mat else '#2a1a12')
    return d.img


def planken(zaad):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#b07a48')
    for y in range(0, 16, 4):
        d.rect(0, y + 3, 16, 1, '#8a5a34')
        naad = (y * 5 + zaad) % 16
        d.rect(naad, y, 1, 3, '#8a5a34')
        d.rect(0, y, 16, 1, '#c08a58')
    for _ in range(5):
        d.p(random.randrange(16), random.randrange(16), '#9a6a40')
    return d.img


def shop_muur(onder=False):
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#2e6a4a')
    d.rect(0, 0, 16, 1, '#3e8a5e')
    if onder:
        d.rect(0, 6, 16, 10, '#7a5030')
        d.rect(0, 6, 16, 1, '#9a6a44')
        for x in range(0, 16, 4):
            d.rect(x, 7, 1, 9, '#5a3a20')
        d.rect(0, 14, 16, 2, '#4a2e18')
    else:
        for (x, y) in ((3, 4), (11, 9), (6, 13)):
            d.p(x, y, '#3e8a5e')
    return d.img


def shop_poster():
    """Poster in rood-geel-groen met een blaadje."""
    d = Doek(16, 16)
    d.img = shop_muur(True)
    d.px = d.img.load()
    d.rect(2, 0, 12, 12, '#f0e8d0')
    d.rect(3, 1, 10, 3, '#d83a30')
    d.rect(3, 4, 10, 3, '#f0c830')
    d.rect(3, 7, 10, 4, '#3a9a4a')
    # blaadje
    for (x0, y0, x1, y1) in ((8, 10, 8, 3), (8, 10, 5, 5), (8, 10, 11, 5), (8, 10, 4, 8), (8, 10, 12, 8)):
        d.lijn(x0, y0, x1, y1, '#1e5a2a')
    return d.img


def shop_menubord():
    d = Doek(16, 16)
    d.img = shop_muur(True)
    d.px = d.img.load()
    d.rect(1, 0, 14, 12, '#5a3a20')
    d.rect(2, 1, 12, 10, '#26302a')
    for (y, b) in ((2, 8), (4, 10), (6, 7), (8, 9)):
        d.rect(3, y, b, 1, '#d8e0d8')
        d.rect(12, y, 1, 1, '#f0c830')
    return d.img


def kleed():
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#d83a30')
    d.rect(0, 5, 16, 5, '#f0c830')
    d.rect(0, 10, 16, 6, '#3a9a4a')
    for x in range(0, 16, 2):
        d.p(x, 0, '#f0e8d0')
        d.p(x + 1, 15, '#f0e8d0')
    return d.img


def binnen_tegelset():
    la, lb = leem(61), leem(62)
    pa, pb = planken(3), planken(9)
    return [
        la,                         # 0 leemvloer
        lb,                         # 1 leemvloer variant
        schaduw(la),                # 2 leemvloer onder de muur
        plaggen(False),             # 3 plaggenmuur boven
        plaggen(True),              # 4 plaggenmuur onder
        plag_raam(),                # 5 raampje
        rand('links'),              # 6 zijkant links
        rand('rechts'),             # 7 zijkant rechts
        rand('onder'),              # 8 onderrand
        rand('hoek'),               # 9 hoek
        doorgang(None),             # 10 deuropening (plaggenhut)
        pa,                         # 11 planken
        pb,                         # 12 planken variant
        schaduw(pa),                # 13 planken onder de muur
        shop_muur(False),           # 14 muur boven
        shop_muur(True),            # 15 muur onder
        shop_poster(),              # 16 poster
        shop_menubord(),            # 17 menubord
        kleed(),                    # 18 kleed
        doorgang('#5a3a2a'),        # 19 deurmat (coffeeshop)
    ]


# ================================================================== buitenobjecten

def molen():
    """Grondzeiler: rieten romp op een stenen voet, met kap. 48x72. De wieken zijn een apart plaatje."""
    w, h = 48, 72
    d = Doek(w, h)
    riet, rietL, rietD = '#a08a5a', '#bca474', '#7a6640'
    # romp: achtkant, smaller naar boven
    top, bodem = 16, 62
    for y in range(top, bodem):
        t = (y - top) / (bodem - top)
        half = int(9 + t * 12)
        d.rect(24 - half, y, 2 * half, 1, riet)
        d.rect(24 - half, y, max(2, half // 3), 1, rietL)
        d.rect(24 + half - max(2, half // 3), y, max(2, half // 3), 1, rietD)
        for x in range(24 - half, 24 + half, 5):
            if (y + x) % 3 == 0:
                d.p(x, y, rietD)
    # stenen voet
    d.rect(1, 60, 46, 11, '#9a4a3a')
    for y in range(61, 71, 3):
        for x in range(1 + (y % 2) * 3, 47, 6):
            d.rect(x, y, 5, 2, '#b45a46')
    d.rect(1, 60, 46, 1, '#c87a62')
    # deur en raampje
    d.rect(19, 55, 10, 16, '#3a2414')
    d.rect(20, 56, 8, 15, '#6e4628')
    d.rect(20, 62, 8, 1, '#4c2f1a')
    d.rect(26, 63, 1, 2, '#e0bc48')
    d.rect(21, 36, 6, 7, '#3a2414')
    d.rect(22, 37, 4, 5, '#f0e0a0')
    # kap
    d.ellips(24, 13, 12, 6, '#5a4a3a')
    d.rect(12, 13, 24, 4, '#4a3a2c')
    d.ellips(24, 11, 9, 4, '#6a5a48')
    d.rect(22, 9, 4, 3, '#3a2c20')     # as
    return omlijn(d.img, K(ZWART))


def wieken(hoek):
    """Vier wieken rond het midden (96x96), gedraaid over `hoek` graden."""
    n = 96
    d = Doek(n, n)
    c = n / 2
    stok, hek, doek_ = '#5a4030', '#7a6a58', '#efe6d4'
    for y in range(n):
        for x in range(n):
            px, py = x + 0.5 - c, y + 0.5 - c
            for k in range(4):
                a = math.radians(hoek + k * 90)
                u = px * math.cos(a) + py * math.sin(a)
                v = -px * math.sin(a) + py * math.cos(a)
                if 0 <= u <= 45 and -1.1 <= v <= 1.1:
                    d.p(x, y, stok)
                elif 9 <= u <= 44 and 1.1 < v <= 8:
                    rasterlijn = (int(u) % 5 == 0) or v > 7 or int(v) == 4
                    d.p(x, y, hek if rasterlijn else doek_)
    d.ellips(c, c, 3, 3, '#3a2c20')
    return omlijn(d.img, K('#2a2018'))


def hunebed():
    """Hunebed: draagstenen met twee dekstenen erop. 64x40."""
    w, h = 64, 40
    d = Doek(w, h)
    grijs, licht, donker, mos = '#8a8a8c', '#a8a8aa', '#626266', '#6a8a4a'
    # gat tussen de stenen
    d.rect(8, 22, 48, 14, '#2a2a2c')
    # draagstenen
    for (cx, cy, rx, ry) in ((7, 30, 7, 9), (21, 32, 6, 7), (35, 31, 6, 8), (49, 32, 6, 7), (59, 29, 5, 9)):
        d.ellips(cx, cy, rx, ry, grijs)
        d.ellips(cx - 2, cy - 3, rx * 0.5, ry * 0.4, licht)
        d.ellips(cx + 2, cy + 3, rx * 0.5, ry * 0.4, donker)
    # dekstenen
    for (cx, cy, rx, ry) in ((19, 15, 17, 10), (46, 14, 16, 11)):
        d.ellips(cx, cy, rx, ry, grijs)
        d.ellips(cx - 4, cy - 4, rx * 0.6, ry * 0.45, licht)
        d.ellips(cx + 4, cy + 5, rx * 0.6, ry * 0.35, donker)
        for (dx, dy) in ((-6, -6), (3, -7), (8, -3)):
            d.rect(cx + dx, cy + dy, 3, 1, mos)
    random.seed(71)
    for _ in range(40):
        x, y = random.randrange(w), random.randrange(h)
        if d.px[x, y][3]:
            d.p(x, y, random.choice([donker, licht]))
    return omlijn(d.img, K('#2a2a2e'))


def plaggenhut():
    """Plaggenhut: dak van heideplaggen tot op de grond, voorgevel met deur. 48x44."""
    w, h = 48, 44
    d = Doek(w, h)
    plag, plagL, plagD, heide = '#5e5a34', '#76703e', '#46422a', '#8a5a8a'
    # dak (A-vorm)
    for y in range(4, 44):
        t = (y - 4) / 40
        half = int(3 + t * 21)
        d.rect(24 - half, y, 2 * half, 1, plag)
        d.rect(24 - half, y, 3, 1, plagL)
        d.rect(24 + half - 3, y, 3, 1, plagD)
    random.seed(73)
    for y in range(6, 44, 4):
        t = (y - 4) / 40
        half = int(3 + t * 21)
        for x in range(24 - half + 1, 24 + half - 1, 3):
            if random.random() < 0.45:
                d.p(x, y, heide)
            elif random.random() < 0.3:
                d.p(x, y, plagD)
    # voorgevel van planken
    for y in range(16, 44):
        t = (y - 16) / 28
        half = int(2 + t * 13)
        d.rect(24 - half, y, 2 * half, 1, '#7a5634')
        for x in range(24 - half, 24 + half, 4):
            d.p(x, y, '#5c3e24')
    # deur
    d.rect(19, 29, 10, 15, '#2a1a10')
    d.rect(20, 30, 8, 14, '#6e4628')
    d.rect(23, 30, 1, 14, '#4c2f1a')
    d.rect(26, 37, 1, 2, '#e0bc48')
    # raampje boven de deur
    d.rect(22, 21, 4, 4, '#3a2414')
    d.rect(23, 22, 2, 2, '#f0e0a0')
    # schoorsteenpijpje
    d.rect(31, 6, 3, 8, '#5a5a62')
    d.rect(30, 5, 5, 2, '#3a3a42')
    return omlijn(d.img, K(ZWART))


def coffeeshop():
    """Bakstenen winkeltje met een groen-geel-rood bord. 80x64."""
    w, h = 80, 64
    d = Doek(w, h)
    steen, voeg = '#a0503a', '#7a3a2a'
    # dak (pannen)
    d.rect(2, 2, w - 4, 18, '#3a3a46')
    for y in range(4, 20, 3):
        for x in range(3 + (y % 2) * 3, w - 3, 6):
            d.rect(x, y, 5, 2, '#4a4a58')
    d.rect(0, 18, w, 3, '#26262e')
    # muur
    d.rect(3, 21, w - 6, 41, steen)
    for y in range(22, 62, 3):
        d.rect(3, y, w - 6, 1, voeg)
        for x in range(3 + (y // 3 % 2) * 4, w - 3, 8):
            d.p(x, y + 1, voeg)
            d.p(x, y + 2, voeg)
    # bord met strepen
    d.rect(8, 22, 64, 12, '#1e1e22')
    d.rect(9, 23, 62, 3, '#d83a30')
    d.rect(9, 26, 62, 3, '#f0c830')
    d.rect(9, 29, 62, 4, '#3a9a4a')
    d.tekst(13, 22, 'COFFEESHOP', '#ffffff')
    # etalage
    d.rect(7, 38, 30, 18, '#f0f0e8')
    d.rect(8, 39, 28, 16, '#2a4a3a')
    d.rect(8, 39, 28, 4, '#3e6a52')
    for (x, y) in ((12, 50), (20, 48), (28, 51)):   # plantjes achter het raam
        d.lijn(x, y + 4, x - 3, y, '#5ac85a')
        d.lijn(x, y + 4, x + 3, y, '#5ac85a')
        d.lijn(x, y + 4, x, y - 1, '#5ac85a')
    d.rect(6, 56, 32, 2, '#d8d0c0')
    # deur
    d.rect(46, 36, 16, 26, '#f0f0e8')
    d.rect(48, 38, 12, 24, '#2e6a4a')
    d.rect(49, 40, 10, 9, '#9cc8dc')
    d.rect(57, 51, 2, 2, '#e0bc48')
    # luidsprekertje met noot
    d.rect(66, 40, 8, 10, '#2a2a30')
    d.ellips(70, 45, 2.5, 2.5, '#5a5a66')
    return omlijn(d.img, K(ZWART))


def boerderij():
    """Drentse (Saksische) boerderij met een groot rieten dak. 96x72."""
    w, h = 96, 72
    d = Doek(w, h)
    riet, rietL, rietD = '#a8925a', '#c4ac72', '#806c40'
    # dak
    for y in range(4, 46):
        inspring = max(0, 14 - y // 3)
        d.rect(2 + inspring, y, w - 4 - 2 * inspring, 1, riet)
        if y % 3 == 0:
            for x in range(4 + inspring, w - 4 - inspring, 7):
                d.rect(x, y, 3, 1, rietD)
    d.rect(16, 4, w - 32, 3, rietL)
    d.rect(2, 44, w - 4, 3, rietD)
    # nok
    d.rect(14, 2, w - 28, 3, '#5a5a3a')
    # muren
    d.rect(4, 47, w - 8, 23, '#8a4030')
    for y in range(48, 70, 3):
        d.rect(4, y, w - 8, 1, '#6e3226')
    # ramen met luiken (groen-wit)
    for x in (10, 30):
        d.rect(x, 52, 12, 11, '#f0f0e8')
        d.rect(x + 1, 53, 10, 9, '#9cc8dc')
        d.rect(x + 5, 53, 2, 9, '#f0f0e8')
        d.rect(x - 4, 52, 4, 11, '#2e7a4a')
        d.rect(x + 12, 52, 4, 11, '#2e7a4a')
        d.lijn(x - 4, 52, x - 1, 62, '#f0f0e8')
        d.lijn(x + 12, 52, x + 15, 62, '#f0f0e8')
    # grote deeldeur
    d.rect(58, 49, 30, 21, '#f0f0e8')
    d.rect(60, 51, 12, 19, '#2e7a4a')
    d.rect(74, 51, 12, 19, '#2e7a4a')
    for x in (62, 66, 70, 76, 80, 84):
        d.rect(x, 51, 1, 19, '#245e3a')
    d.lijn(60, 51, 71, 69, '#f0f0e8')
    d.lijn(74, 69, 85, 51, '#f0f0e8')
    # uilenbord op de nok
    d.rect(44, 0, 8, 4, '#f0f0e8')
    d.rect(46, 0, 4, 2, '#2e7a4a')
    return omlijn(d.img, K(ZWART))


# Het hakenkruis voor de vlag (7x7, vier armen met de klok mee).
HAKENKRUIS = [
    "#..####",
    "#..#...",
    "#..#...",
    "#######",
    "...#..#",
    "...#..#",
    "####..#",
]


def vlag(fase=0):
    """Vlaggenmast met de rode vlag van de bezetter. 32x48, twee standen (wapperen)."""
    w, h = 32, 48
    d = Doek(w, h)
    # mast
    d.rect(3, 3, 2, 45, '#c8c8d0')
    d.rect(4, 3, 1, 45, '#8a8a94')
    d.ellips(4, 2.5, 2, 2, '#e0c048')
    d.rect(1, 45, 6, 3, '#5a5a62')
    # doek: golvend
    for x in range(20):
        golf = round(math.sin((x + fase * 3) / 3.2) * 1.2) if x > 2 else 0
        for y in range(15):
            d.p(5 + x, 5 + y + golf, '#c8202a' if (x + y + fase) % 9 else '#a81820')
    # witte cirkel met hakenkruis
    cx, cy = 15, 12
    golf = round(math.sin((10 + fase * 3) / 3.2) * 1.2)
    d.ellips(cx + 0.5, cy + golf + 0.5, 5.2, 5.2, '#f4f4f4')
    for ry, rij in enumerate(HAKENKRUIS):
        for rx, t in enumerate(rij):
            if t == '#':
                d.p(cx - 3 + rx, cy + golf - 3 + ry, '#141414')
    return omlijn(d.img, K('#2a1a1a'))


def slagboom(open_=False):
    """Rood-witte slagboom. 48x40; de paal staat links onderin."""
    w, h = 48, 40
    d = Doek(w, h)
    d.rect(2, 22, 6, 18, '#e8e8e8')
    for y in range(22, 40, 6):
        d.rect(2, y, 6, 3, '#c83030')
    d.rect(0, 36, 10, 4, '#4a4a52')
    if open_:
        for y in range(0, 24):
            d.rect(4, y, 3, 1, '#c83030' if (y // 4) % 2 else '#f4f4f4')
    else:
        for x in range(6, 47):
            d.rect(x, 24, 1, 3, '#c83030' if (x // 5) % 2 else '#f4f4f4')
        d.rect(44, 27, 2, 9, '#4a4a52')
    return omlijn(d.img, K(ZWART))


def fatbike():
    """Fatbike van opzij (naar rechts), met dikke banden. 32x20."""
    w, h = 32, 20
    d = Doek(w, h)
    for cx in (7, 25):
        d.ellips(cx, 13, 6.5, 6.5, '#1a1a1e')
        d.ellips(cx, 13, 3.5, 3.5, '#5a5a62')
        d.ellips(cx, 13, 1.5, 1.5, '#c8c8d0')
    oranje = '#f08020'
    d.lijn(7, 13, 14, 7, oranje)
    d.lijn(14, 7, 23, 7, oranje)
    d.lijn(14, 7, 16, 13, oranje)
    d.lijn(16, 13, 7, 13, oranje)
    d.lijn(23, 7, 25, 13, oranje)
    d.lijn(16, 13, 23, 7, oranje)
    d.rect(11, 4, 6, 2, '#1a1a1e')    # zadel
    d.rect(13, 6, 1, 2, '#1a1a1e')
    d.lijn(23, 7, 22, 2, '#1a1a1e')    # stuur
    d.rect(20, 2, 5, 1, '#1a1a1e')
    d.rect(17, 9, 5, 3, '#3a3a44')    # accu
    return omlijn(d.img, K('#0a0a0c'))


def eik():
    """Brede eik op de brink. 48x56."""
    w, h = 48, 56
    d = Doek(w, h)
    d.rect(20, 34, 8, 22, '#5a3e28')
    d.rect(20, 34, 3, 22, '#7a5634')
    d.lijn(24, 40, 14, 30, '#5a3e28')
    d.lijn(24, 38, 34, 28, '#5a3e28')
    for (cx, cy, r, c) in ((24, 20, 20, '#2e6a32'), (14, 24, 11, '#2e6a32'), (34, 24, 11, '#2e6a32'),
                           (20, 15, 11, '#3e8a3e'), (31, 17, 9, '#3e8a3e'), (16, 11, 5, '#5aa852'),
                           (28, 9, 4, '#5aa852')):
        d.ellips(cx, cy, r, r * 0.8, c)
    random.seed(77)
    for _ in range(30):
        x, y = random.randrange(6, 42), random.randrange(4, 34)
        if d.px[x, y][3]:
            d.p(x, y, random.choice(['#245a28', '#4a9a48']))
    return omlijn(d.img, K('#16301c'))


def meelzakken():
    d = Doek(16, 18)
    for (x, y) in ((0, 7), (8, 8), (4, 0)):
        d.ellips(x + 4, y + 5, 4, 5, '#e8e0cc')
        d.ellips(x + 3, y + 3, 2, 2, '#f8f4ea')
        d.rect(x + 2, y, 4, 1, '#a8987a')
    return omlijn(d.img, K('#5a4a3a'))


# ================================================================== binnenobjecten

def bedstee():
    """Bedstee: bed in een kast, met geblokte gordijnen. 32x34."""
    w, h = 32, 34
    d = Doek(w, h)
    d.rect(0, 0, 32, 34, '#6e4628')
    d.rect(1, 1, 30, 2, '#8a5a34')
    d.rect(3, 4, 26, 22, '#2a1a10')
    d.rect(4, 14, 24, 8, '#eeeade')     # kussen en laken
    d.rect(4, 18, 24, 4, '#8a92aa')
    d.rect(6, 14, 8, 4, '#f8f8f0')
    for (x0, x1) in ((3, 9), (23, 29)):   # gordijnen
        for x in range(x0, x1):
            for y in range(4, 26):
                d.p(x, y, '#c83a3a' if ((x // 2) + (y // 2)) % 2 else '#f0e0e0')
    d.rect(0, 26, 32, 8, '#5a3820')
    d.rect(2, 28, 28, 4, '#7a5030')
    return omlijn(d.img, K(ZWART))


def haard():
    """Open haard met een ketel boven het vuur. 32x34."""
    w, h = 32, 34
    d = Doek(w, h)
    d.rect(0, 0, 32, 34, '#7a7470')
    for y in range(1, 34, 4):
        for x in range((y // 4 % 2) * 4, 32, 8):
            d.rect(x, y, 7, 3, '#8a8480')
    d.rect(5, 12, 22, 22, '#1e1612')
    d.rect(3, 9, 26, 4, '#5a3a24')
    # vuur
    for (x, y, c) in ((10, 27, '#f05020'), (16, 25, '#f8a020'), (21, 27, '#f05020'), (13, 29, '#f8e060'), (19, 29, '#f8e060')):
        d.ellips(x, y, 3, 4, c)
    d.rect(8, 31, 16, 2, '#4a2e1c')
    # ketel
    d.rect(15, 13, 1, 6, '#2a2a30')
    d.ellips(15.5, 21, 5, 3.5, '#2a2a30')
    d.ellips(14, 20, 2, 1.2, '#5a5a62')
    return omlijn(d.img, K(ZWART))


def tafeltje():
    w, h = 32, 22
    d = Doek(w, h)
    d.rect(1, 3, 30, 9, '#8c6a44')
    d.rect(1, 3, 30, 2, '#a8845a')
    for x in (3, 26):
        d.rect(x, 12, 3, 9, '#5a4028')
    d.rect(8, 0, 6, 4, '#e8e0d0')    # kopje en kaars
    d.rect(20, 0, 2, 4, '#f0e8c8')
    d.p(20, 0, '#f8c040')
    return omlijn(d.img, K(ZWART))


def luik(open_=False):
    d = Doek(16, 16)
    if open_:
        d.rect(1, 1, 14, 14, '#1a120c')
        d.rect(2, 2, 12, 3, '#3a2a1c')
    else:
        d.rect(1, 1, 14, 14, '#7a5030')
        for x in (5, 10):
            d.rect(x, 1, 1, 14, '#5a3820')
        d.ellips(8, 8, 2.5, 2.5, '#3a3a42')
        d.ellips(8, 8, 1.2, 1.2, '#7a5030')
    return omlijn(d.img, K(ZWART))


def spinnewiel():
    w, h = 24, 28
    d = Doek(w, h)
    d.ellips(12, 10, 9, 9, '#8a5a34')
    d.ellips(12, 10, 7, 7, (0, 0, 0, 0))
    for a in range(0, 180, 30):
        r = math.radians(a)
        d.lijn(12 - round(7 * math.cos(r)), 10 - round(7 * math.sin(r)), 12 + round(7 * math.cos(r)), 10 + round(7 * math.sin(r)), '#a8784a')
    d.rect(4, 20, 16, 3, '#6a4428')
    d.lijn(6, 23, 3, 27, '#6a4428')
    d.lijn(18, 23, 21, 27, '#6a4428')
    d.rect(18, 14, 4, 2, '#e8e0cc')
    return omlijn(d.img, K(ZWART))


def toonbank():
    """Toonbank van de coffeeshop met potten, weegschaal en kassa. 64x24 (lager, zodat je de verkoper ziet)."""
    w, h = 64, 24
    d = Doek(w, h)
    d.rect(0, 8, 64, 16, '#7a5030')
    d.rect(0, 8, 64, 3, '#a8784a')
    for x in range(4, 64, 8):
        d.rect(x, 12, 1, 12, '#5a3820')
    # kassa links, potten met groen rechts
    d.rect(2, 1, 11, 8, '#3a3a44')
    d.rect(3, 2, 9, 3, '#7ac8a0')
    for x in (36, 45, 54):
        d.rect(x, 1, 7, 8, '#cfe8f0')
        d.rect(x + 1, 4, 5, 4, '#5aa852')
        d.rect(x, 0, 7, 2, '#3a3a42')
    # weegschaal
    d.rect(16, 5, 9, 3, '#c8c8d0')
    d.rect(18, 4, 5, 1, '#8a8a94')
    return omlijn(d.img, K(ZWART))


def bank():
    """Oude bruine bank. 48x26."""
    w, h = 48, 26
    d = Doek(w, h)
    d.rect(2, 2, 44, 12, '#a0562e')
    d.rect(2, 2, 44, 2, '#c07040')
    d.rect(0, 10, 48, 12, '#8a4626')
    d.rect(4, 12, 19, 7, '#a85e34')
    d.rect(25, 12, 19, 7, '#a85e34')
    d.rect(0, 8, 5, 14, '#7a3c20')
    d.rect(43, 8, 5, 14, '#7a3c20')
    for x in (3, 42):
        d.rect(x, 22, 3, 4, '#3a2416')
    d.rect(30, 12, 8, 6, '#f0c830')   # kussen
    return omlijn(d.img, K(ZWART))


def plant():
    """Plant in een pot (met getande bladeren). 16x30."""
    w, h = 16, 30
    d = Doek(w, h)
    d.rect(3, 22, 10, 8, '#a8603a')
    d.rect(2, 21, 12, 2, '#c07a4a')
    d.lijn(8, 22, 8, 4, '#3e7a3a')
    for (y, s) in ((6, 3), (11, 5), (16, 6)):
        for dx in (-1, 1):
            for k in range(1, s + 1):
                d.p(8 + dx * k, y - k // 2, '#4aa84a')
                d.p(8 + dx * k, y - k // 2 + 1, '#3e8a3e')
        d.lijn(8, y, 8 - s + 1, y - s, '#5ac85a')
        d.lijn(8, y, 8 + s - 1, y - s, '#5ac85a')
    return omlijn(d.img, K('#1e3a1e'))


def boxen():
    """Speaker met wat muziek. 16x26."""
    w, h = 16, 26
    d = Doek(w, h)
    d.rect(1, 2, 14, 24, '#2a2a30')
    d.ellips(8, 9, 4, 4, '#5a5a66')
    d.ellips(8, 9, 1.5, 1.5, '#1a1a1e')
    d.ellips(8, 19, 5, 5, '#5a5a66')
    d.ellips(8, 19, 2, 2, '#1a1a1e')
    d.rect(3, 3, 2, 1, '#7ac8a0')
    return omlijn(d.img, K(ZWART))


def asbak_tafel():
    w, h = 16, 18
    d = Doek(w, h)
    d.ellips(8, 5, 7, 4, '#8c6a44')
    d.ellips(8, 4, 7, 3, '#a8845a')
    d.rect(7, 8, 2, 9, '#5a4028')
    d.rect(4, 16, 8, 2, '#5a4028')
    d.ellips(8, 3.5, 3, 1.6, '#8a8a94')
    d.rect(9, 1, 4, 1, '#f0e8d8')
    d.p(13, 1, '#f05020')
    return omlijn(d.img, K(ZWART))


def objecten():
    uit = {
        'molen': molen(),
        'hunebed': hunebed(),
        'plaggenhut': plaggenhut(),
        'coffeeshop': coffeeshop(),
        'boerderij': boerderij(),
        'slagboom': slagboom(False),
        'slagboom_open': slagboom(True),
        'fatbike': fatbike(),
        'eik': eik(),
        'meelzakken': meelzakken(),
        'bedstee': bedstee(),
        'haard': haard(),
        'tafeltje': tafeltje(),
        'luik': luik(False),
        'luik_open': luik(True),
        'spinnewiel': spinnewiel(),
        'toonbank': toonbank(),
        'bank': bank(),
        'plant': plant(),
        'boxen': boxen(),
        'asbak': asbak_tafel(),
    }
    return uit


def animaties():
    """Spritesheets: wieken (4 standen) en vlag (2 standen)."""
    return {
        'wieken': [wieken(a) for a in (0, 22.5, 45, 67.5)],
        'vlag': [vlag(0), vlag(1)],
    }


# ================================================================== iconen en effecten

def icoon_wiet():
    d = Doek(16, 16)
    d.rect(2, 3, 12, 12, '#e8f0f0')
    d.rect(2, 3, 12, 2, '#c8d8d8')
    d.rect(2, 5, 12, 1, '#3a8ac8')
    d.ellips(8, 10, 4, 3.5, '#5aa852')
    d.ellips(7, 9, 2, 1.5, '#8ad070')
    for (x, y) in ((6, 11), (9, 9), (10, 11)):
        d.p(x, y, '#c87a3a')
    return omlijn(d.img, K('#3a4a4a'))


def icoon_hasj():
    d = Doek(16, 16)
    d.rect(2, 4, 12, 9, '#c8c8d0')
    d.rect(2, 4, 12, 2, '#e8e8f0')
    d.rect(4, 6, 8, 5, '#6a4a2c')
    d.rect(4, 6, 8, 1, '#8a6440')
    d.p(6, 8, '#4a321e')
    d.p(9, 9, '#4a321e')
    return omlijn(d.img, K('#3a3a42'))


def icoon_handboeien():
    d = Doek(16, 16)
    for cx in (4.5, 11.5):
        d.ellips(cx, 9, 4, 4, '#a8b0c0')
        d.ellips(cx, 9, 2.4, 2.4, (0, 0, 0, 0))
    d.rect(7, 8, 2, 1, '#6a7080')
    d.p(6, 7, '#6a7080')
    d.p(9, 7, '#6a7080')
    return omlijn(d.img, K('#2a2a30'))


def effect_vape():
    """Roze vapewolk. 40x28."""
    d = Doek(40, 28)
    for (cx, cy, r) in ((10, 16, 8), (20, 12, 10), (30, 16, 8), (16, 20, 7), (26, 20, 7)):
        d.ellips(cx, cy, r, r * 0.8, (248, 214, 236, 220))
    for (cx, cy, r) in ((17, 10, 4), (27, 13, 3), (9, 14, 3)):
        d.ellips(cx, cy, r, r * 0.8, (255, 244, 250, 240))
    return d.img


def iconen():
    return {
        'icoon_wiet': icoon_wiet(),
        'icoon_hasj': icoon_hasj(),
        'icoon_handboeien': icoon_handboeien(),
    }


# ================================================================== gevecht: de jongens met de fatbikes

def jongere(variant):
    """Jongen in trainingspak met een vape in de ene en een broodmes in de andere hand. 48x56."""
    d = Doek(48, 56)
    if variant == 'djelano':
        pak, pakS, streep = '#26262c', '#16161a', '#f4f4f4'
        huid, huidS = '#b07a52', '#8c5e3c'
        haar = '#1a1412'
    else:
        pak, pakS, streep = '#8a8e98', '#6a6e78', '#2a2a30'
        huid, huidS = '#d8a478', '#b4825a'
        haar = '#1e1814'
    # benen en sneakers
    d.rect(16, 40, 7, 11, pak)
    d.rect(26, 40, 7, 11, pakS)
    d.rect(16, 40, 1, 11, streep)
    d.rect(32, 40, 1, 11, streep)
    d.rect(14, 50, 10, 5, '#f4f4f4')
    d.rect(25, 50, 10, 5, '#e0e0e6')
    d.rect(14, 54, 10, 1, '#b0b0b8')
    d.rect(25, 54, 10, 1, '#b0b0b8')
    # jas
    d.ellips(24, 32, 12, 11, pak)
    d.rect(13, 28, 23, 13, pak)
    d.ellips(30, 33, 6, 9, pakS, alleen=lambda x, y: x > 30)
    d.rect(24, 23, 1, 18, '#b0b0b8')      # rits
    d.rect(13, 25, 1, 15, streep)
    d.rect(35, 25, 1, 15, streep)
    if variant == 'mustafah':
        # heuptasje schuin over de borst
        d.lijn(14, 24, 33, 37, '#1a1a1e')
        d.lijn(14, 25, 33, 38, '#1a1a1e')
        d.rect(26, 32, 9, 6, '#1a1a1e')
        d.rect(27, 33, 7, 1, '#e0c048')
    # linkerarm met vape
    d.ellips(11, 33, 3.5, 8, pakS)
    d.ellips(11, 41, 3, 2.5, huid)
    d.rect(9, 37, 3, 6, '#7a4ac8')
    d.rect(9, 36, 3, 1, '#2a2a30')
    # rechterarm met broodmes
    d.ellips(37, 31, 4, 6, pak)
    d.ellips(33, 37, 3, 2.5, huid)
    d.rect(31, 34, 4, 3, '#3a2a1e')        # heft
    for i in range(12):
        d.p(30 - i, 35 - i // 2, '#d0d4dc')  # lemmet
        d.p(30 - i, 36 - i // 2, '#a0a4ac' if i % 2 else '#d0d4dc')
    # hals en hoofd
    d.rect(21, 18, 6, 5, huidS)
    d.rect(18, 21, 12, 3, pak)
    d.ellips(24, 14, 8, 8, huid)
    d.ellips(28, 15, 4, 7, huidS, alleen=lambda x, y: x > 28)
    # gezicht: stoer kijken
    d.rect(19, 11, 4, 1, haar)
    d.rect(26, 10, 4, 1, haar)
    d.rect(20, 13, 2, 1, '#202028')
    d.rect(27, 13, 2, 1, '#202028')
    d.rect(23, 15, 2, 2, huidS)
    d.rect(22, 19, 5, 1, '#7a3a30')
    d.p(27, 18, '#7a3a30')
    if variant == 'djelano':
        # pet met platte klep
        d.ellips(24, 7, 10, 5, '#1a1a1e', alleen=lambda x, y: y <= 8)
        d.rect(14, 7, 20, 2, '#1a1a1e')
        d.rect(12, 9, 22, 2, '#0e0e12')
        d.rect(22, 3, 4, 2, '#e0c048')
    else:
        # strak opgeschoren kapsel met kuif
        d.ellips(24, 8, 8.5, 5, haar, alleen=lambda x, y: y <= 9)
        d.rect(16, 8, 2, 5, '#4a3a30')
        d.rect(30, 8, 2, 5, '#4a3a30')
        d.ellips(25, 4, 6, 2.5, haar)
    return omlijn(d.img, K('#141418'))


def gevecht_dorp():
    """Gevechtsachtergrond in het dorp: klinkers, boerderijen met rieten daken, lucht."""
    random.seed(13)
    w, h = 240, 112
    img = Image.new('RGBA', (w, h), K('#000000'))
    d = Doek(w, h)
    d.img = img
    d.px = img.load()
    for i, c in enumerate(['#78b8e8', '#88c4ec', '#98ccee', '#a8d6f0', '#b8def2']):
        d.rect(0, i * 8, w, 8, c)
    for (cx, cy, r) in ((60, 10, 8), (72, 8, 6), (200, 14, 9)):
        d.ellips(cx, cy, r, r * 0.6, '#f4f8fc')
    # weiland en heggen achter de huizen
    d.rect(0, 34, w, 20, '#6aa858')
    for x in range(0, w, 9):
        d.ellips(x + 4, 38, 6, 5, '#3e7a3e')
    # boerderijen op de achtergrond
    for (x0, b) in ((-10, 70), (70, 60), (150, 80)):
        for y in range(18, 44):
            inspring = max(0, (30 - y) // 2)
            d.rect(x0 + inspring, y, b - 2 * inspring, 1, '#a8925a' if y % 3 else '#8a7448')
        d.rect(x0 + 4, 44, b - 8, 10, '#8a4030')
        for x in range(x0 + 10, x0 + b - 10, 14):
            d.rect(x, 46, 6, 5, '#f0f0e8')
            d.rect(x + 1, 47, 4, 3, '#9cc8dc')
    # bomen ertussen
    for x in (58, 140, 232):
        d.ellips(x, 32, 10, 14, '#2e6a32')
        d.ellips(x - 2, 28, 6, 8, '#3e8a3e')
    d.rect(0, 52, w, 2, '#5a8a4a')
    # klinkers
    for i, c in enumerate(['#9a5a44', '#a4624a', '#ac6a50', '#b47256']):
        d.rect(0, 54 + i * 15, w, 15, c)
    for y in range(55, h, 4):
        for x in range((y // 4 % 2) * 4, w, 8):
            d.rect(x, y, 1, 3, '#7a4636')
        d.rect(0, y + 3, w, 1, '#8a503e')
    # podia
    d.ellips(176, 80, 46, 11, '#6a6a6e')
    d.ellips(176, 78, 44, 10, '#b4b0a8')
    d.ellips(170, 77, 30, 5, '#c8c4bc')
    d.ellips(62, 112, 60, 14, '#6a6a6e')
    d.ellips(62, 110, 58, 13, '#b4b0a8')
    d.ellips(56, 108, 38, 6, '#c8c4bc')
    return img


if __name__ == '__main__':
    from pixel import vel, voorbeeld
    obj = {**objecten(), **{f'wieken{i}': f for i, f in enumerate(animaties()['wieken'])}}
    W = sum(o.size[0] + 4 for o in obj.values())
    H = max(o.size[1] for o in obj.values())
    sheet = Image.new('RGBA', (W, H))
    x = 0
    for o in obj.values():
        sheet.paste(o, (x, H - o.size[1]), o)
        x += o.size[0] + 4
    voorbeeld(sheet, 2, (90, 168, 80, 255)).save('voorbeeld_dorp.png')
