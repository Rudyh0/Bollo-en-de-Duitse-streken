"""Het bos: tegels (bomen, bosgrond, water, riet...), objecten, Kikker en iconen."""
import random
from PIL import Image
from pixel import maak_palet, sprite, spiegel, hexkleur, omlijn
from art_buiten import Doek, gras, zandpad

K = hexkleur


# ------------------------------------------------------------------ tegels

def boom_32():
    """Ronde dennenboom van 32x32; wordt in vier tegels geknipt zodat bomen naadloos tegen elkaar staan."""
    d = Doek(32, 32)
    donker, mid, licht, rand = '#1e4a2c', '#2e6a3a', '#4a8c4a', '#14301c'
    # stam
    d.rect(13, 24, 6, 8, '#5a3a24')
    d.rect(13, 24, 2, 8, '#7a5234')
    # kroon in drie lagen
    d.ellips(16, 20, 15, 8, donker)
    d.ellips(16, 13, 13, 8, mid)
    d.ellips(16, 7, 9, 6.5, mid)
    d.ellips(11, 11, 5, 3, licht)
    d.ellips(13, 5, 3, 2, licht)
    d.ellips(10, 18, 4, 2, '#3e7c44')
    for (x, y) in ((22, 15), (19, 22), (8, 21), (24, 9)):
        d.p(x, y, donker)
    img = omlijn(d.img, K(rand))
    # schaduw onder de boom op de grond (in de onderste tegels)
    onder = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    sch = Doek(32, 32)
    sch.ellips(16, 30, 13, 3, (0, 0, 0, 70))
    onder.alpha_composite(sch.img)
    onder.alpha_composite(img)
    return onder


def bosgrond(zaad=21):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#3e6a34')
    for _ in range(30):
        d.p(random.randrange(16), random.randrange(16), random.choice(['#4a7a3e', '#34592c', '#5a4a30']))
    for _ in range(5):  # dennennaalden
        x, y = random.randrange(14), random.randrange(15)
        d.rect(x, y, 2, 1, '#7a5a34')
    return d.img


def water(zaad=31):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#3a7ab8')
    for y in range(0, 16, 4):
        for x in range(16):
            if (x + y // 2) % 7 == 0:
                d.rect(x, y + 1, 3, 1, '#6aa8dc')
    for _ in range(6):
        d.p(random.randrange(16), random.randrange(16), '#2c629c')
    return d.img


def riet():
    d = Doek(16, 16)
    for x0 in (1, 4, 7, 10, 13):
        h = 9 + (x0 * 3) % 5
        d.rect(x0, 16 - h, 1, h, '#4a8a3a')
        d.rect(x0 + 1, 16 - h + 2, 1, h - 2, '#2e6a2a')
        d.rect(x0, 16 - h - 3, 2, 3, '#8a5a30')
    return d.img


def waterlelie():
    d = Doek(16, 16)
    d.ellips(8, 9, 6, 4, '#3e8a3e')
    d.ellips(7, 8, 4, 2.5, '#5aa852')
    d.lijn(8, 9, 13, 7, '#3a7ab8')
    d.ellips(10, 6, 2, 1.5, '#f0a8c8')
    d.p(10, 6, '#f8e060')
    return d.img


def varen():
    d = Doek(16, 16)
    for (x0, y0, x1, y1) in ((8, 15, 2, 6), (8, 15, 14, 5), (8, 15, 8, 3), (8, 15, 4, 10), (8, 15, 12, 10)):
        d.lijn(x0, y0, x1, y1, '#3e8a3e')
        d.lijn(x0 + 1, y0, x1 + 1, y1, '#5aa852')
    return d.img


def paddenstoel():
    d = Doek(16, 16)
    for (cx, cy, s) in ((5, 11, 1.0), (11, 13, 0.7)):
        d.rect(int(cx - 1), int(cy), 3, int(4 * s), '#f0e8d8')
        d.ellips(cx, cy, 4 * s, 3 * s, '#d83a30')
        d.p(int(cx - 1), int(cy - 1), '#ffffff')
        d.p(int(cx + 1), int(cy), '#ffffff')
    return omlijn(d.img, K('#3a1a14'))


def tegelset_extra():
    """Bostegels, worden achter de buitentegels geplakt (index 12 en verder)."""
    boom = boom_32()
    return [
        boom.crop((0, 0, 16, 16)),     # 12 boom linksboven
        boom.crop((16, 0, 32, 16)),    # 13 boom rechtsboven
        boom.crop((0, 16, 16, 32)),    # 14 boom linksonder
        boom.crop((16, 16, 32, 32)),   # 15 boom rechtsonder
        bosgrond(21),                  # 16
        bosgrond(22),                  # 17
        water(31),                     # 18
        riet(),                        # 19 (boven)
        waterlelie(),                  # 20 (boven)
        varen(),                       # 21 (boven, loopbaar)
        paddenstoel(),                 # 22 (boven, loopbaar)
    ]


# ------------------------------------------------------------------ objecten

def schatkist(open_=False):
    d = Doek(16, 16)
    hout, houtD, houtL, metaal, goud = '#9a6a3a', '#6e4824', '#c08a52', '#8a8a98', '#e8c040'
    if open_:
        d.rect(1, 2, 14, 5, houtD)
        d.rect(2, 3, 12, 3, '#3a2414')
        d.rect(1, 7, 14, 8, hout)
        d.rect(2, 7, 12, 2, '#2a1a10')
    else:
        d.rect(1, 3, 14, 5, houtL)
        d.rect(1, 3, 14, 1, '#d8a868')
        d.rect(1, 8, 14, 7, hout)
        d.rect(7, 7, 2, 3, goud)
    for x in (3, 12):
        d.rect(x, 3 if not open_ else 7, 1, 12 if not open_ else 8, metaal)
    d.rect(1, 14, 14, 1, houtD)
    return omlijn(d.img, K('#24160c'))


def bron():
    d = Doek(32, 24)
    d.ellips(16, 14, 15, 9, '#8a8a92')
    d.ellips(16, 13, 13, 7.5, '#a8a8b0')
    d.ellips(16, 13, 10, 5.5, '#3a7ab8')
    d.ellips(13, 12, 5, 2, '#6aa8dc')
    for (x, y) in ((4, 12), (28, 13), (16, 20), (9, 18), (23, 18)):
        d.ellips(x, y, 2.5, 2, '#9a9aa2')
    return omlijn(d.img, K('#3a3a42'))


def boomstronk():
    d = Doek(16, 16)
    d.rect(3, 6, 10, 9, '#7a5234')
    d.rect(3, 6, 3, 9, '#9a6a44')
    d.ellips(8, 6, 5, 2.5, '#c8a070')
    d.ellips(8, 6, 3, 1.5, '#a07a50')
    d.p(8, 6, '#7a5234')
    return omlijn(d.img, K('#3a2414'))


def objecten():
    return {
        'schatkist': schatkist(False),
        'schatkist_open': schatkist(True),
        'bron': bron(),
        'boomstronk': boomstronk(),
    }


# ------------------------------------------------------------------ Kikker

KIKKER_PALET = maak_palet({
    'k': '#1c2a18', 'g': '#5ab04a', 'G': '#3e8434', 'l': '#8ad070', 'w': '#f8f8f8', 'e': '#202028',
    'b': '#f4f4f4', 'B': '#c8ccd8', 's': '#3a5ab8', 'y': '#f0c838', 'Y': '#b89020', 'm': '#c04848',
})
KIKKER = {
    'omlaag': [
        "................",
        "...kkk....kkk...",
        "..kwwek..kewwk..",
        "..kwwek..kewwk..",
        ".kgkkkggggkkkgk.",
        "kglggggggggggggk",
        "kgggggggggggggGk",
        "kGgmmmmmmmmmmgGk",
        ".kGGggggggggGGk.",
        "..kkyyyyyyyykk..",
        "..kbbbYyyYbbbk..",
        ".kbsbbbyybbbsbk.",
        ".kbsbbbbbbbbsbk.",
        ".kgsbbbbbbbbsgk.",
        "..kkbbbbbbbbkk..",
        "...kbbbBBbbbk...",
        "...kbsBkkBsbk...",
        "...kbsBkkBsbk...",
        "..kgggk..kgggk..",
        "..kkkkk..kkkkk..",
    ],
    'omhoog': [
        "................",
        "...kkk....kkk...",
        "..kwwgk..kgwwk..",
        "..kgggk..kgggk..",
        ".kgkkkggggkkkgk.",
        "kglggggggggggggk",
        "kgggggggggggggGk",
        "kGgggggggggggGGk",
        ".kGGggggggggGGk.",
        "..kkyyyyyyyykk..",
        "..kbbbbbbbbbbk..",
        ".kbsbbbbbbbbsbk.",
        ".kbsbbbbbbbbsbk.",
        ".kgsbbbbbbbbsgk.",
        "..kkbbbbbbbbkk..",
        "...kbbbBBbbbk...",
        "...kbsBkkBsbk...",
        "...kbsBkkBsbk...",
        "..kgggk..kgggk..",
        "..kkkkk..kkkkk..",
    ],
    'links': [
        "................",
        "....kkk.........",
        "...kewwk.kkk....",
        "...kewwk.kwgk...",
        "..kgkkkggkkgk...",
        ".kglggggggggGk..",
        "kgggggggggggGk..",
        "kmmmmmgggggGGk..",
        ".kgggggggGGGk...",
        "..kkyyyyyyykk...",
        "...kbbbbyybbk...",
        "...kbbbbbsbbk...",
        "...kbgggbsbbk...",
        "...kbgggbsbbk...",
        "...kkbbbbbbkk...",
        "....kbbbBBbk....",
        "....kbbBkkBk....",
        "....kbsBk.kk....",
        "...kgggk........",
        "...kkkkk........",
    ],
}


def kikker():
    pal = KIKKER_PALET
    omlaag = sprite(KIKKER['omlaag'], pal, 16, 20, 'kikker-omlaag')
    omhoog = sprite(KIKKER['omhoog'], pal, 16, 20, 'kikker-omhoog')
    links = sprite(KIKKER['links'], pal, 16, 20, 'kikker-links')
    return [omlaag, omhoog, links, spiegel(links)]


# ------------------------------------------------------------------ iconen

def icoon_ritalin():
    d = Doek(16, 16)
    d.rect(2, 3, 12, 10, '#c8ccd8')
    d.rect(2, 3, 12, 1, '#e8ecf4')
    for x in (4, 8, 12):
        for y in (5, 9):
            d.ellips(x - 0.5 + 0.5, y + 0.5, 1.6, 1.4, '#ffffff')
            d.p(x - 1, y, '#a8acb8')
    d.rect(2, 12, 12, 1, '#8a8e9a')
    return omlijn(d.img, K('#3a3e48'))


def icoon_xtc():
    d = Doek(16, 16)
    d.ellips(8, 8, 6, 6, '#f080c0')
    d.ellips(7, 7, 4, 4, '#f8a0d0')
    d.p(6, 6, '#3a1a2a')
    d.p(10, 6, '#3a1a2a')
    d.lijn(5, 9, 6, 10, '#3a1a2a')
    d.lijn(7, 11, 9, 11, '#3a1a2a')
    d.lijn(10, 10, 11, 9, '#3a1a2a')
    return omlijn(d.img, K('#6a2048'))


def icoon_3mmc():
    d = Doek(16, 16)
    d.rect(3, 2, 10, 13, (220, 232, 240, 150))
    d.rect(3, 2, 10, 2, '#d04040')
    d.rect(4, 8, 8, 6, '#f4f4f4')
    d.rect(4, 8, 8, 1, '#ffffff')
    d.p(6, 10, '#d8d8e0')
    d.p(9, 12, '#d8d8e0')
    return omlijn(d.img, K('#4a4e58'))


def frikandel_effect():
    d = Doek(24, 24)
    # schuine bevroren frikandel
    for i in range(16):
        x, y = 4 + i, 19 - i
        d.ellips(x, y, 2.6, 2.6, '#8a5030')
    for i in range(14):
        x, y = 5 + i, 18 - i
        d.p(x, y - 1, '#b07048')
    for (x, y) in ((6, 15), (10, 12), (14, 8), (17, 6), (9, 16), (13, 11)):
        d.p(x, y, '#e8f4ff')
        d.p(x + 1, y, '#bfe0ff')
    img = omlijn(d.img, K('#9ad0ff'))
    return omlijn(img, K('#2a3a5a'))


def iconen():
    return {
        'icoon_ritalin': icoon_ritalin(),
        'icoon_xtc': icoon_xtc(),
        'icoon_3mmc': icoon_3mmc(),
        'effect_frikandel': frikandel_effect(),
    }


if __name__ == '__main__':
    from pixel import vel, voorbeeld
    t = vel(tegelset_extra(), 6)
    voorbeeld(t, 5).save('voorbeeld_bostegels.png')
    rest = [*kikker(), *objecten().values(), *iconen().values()]
    W = sum(i.size[0] + 4 for i in rest)
    H = max(i.size[1] for i in rest)
    sheet = Image.new('RGBA', (W, H))
    x = 0
    for i in rest:
        sheet.paste(i, (x, H - i.size[1]), i)
        x += i.size[0] + 4
    voorbeeld(sheet, 5, (60, 106, 52, 255)).save('voorbeeld_bosrest.png')
    # stukje bos om te zien of de bomen aansluiten
    boom = boom_32()
    proef = Image.new('RGBA', (96, 64))
    for y in range(0, 64, 16):
        for x in range(0, 96, 16):
            proef.paste(bosgrond(), (x, y))
    for y in (0, 32):
        for x in (0, 32, 64):
            proef.alpha_composite(boom, (x, y))
    voorbeeld(proef, 5).save('voorbeeld_bosproef.png')
