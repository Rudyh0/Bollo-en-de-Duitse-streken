"""De Beren-restaurant: het pand (in elk dorp hetzelfde), de binnenkant, het eten en de iconen."""
from PIL import Image
from pixel import hexkleur, omlijn
from art_buiten import Doek
from art_dorp import schaduw
import art_font

K = hexkleur
ZWART = '#24201c'

ROOD, ROOD_D, ROOD_L = '#b8322a', '#86221c', '#d8584a'
BRUIN, BRUIN_D, BRUIN_L = '#7a4a2a', '#5a341c', '#9a643a'
CREME = '#f4ecd8'
GOUD = '#e8b440'


def tekstbreedte(s):
    g = art_font.alle_glyphs()
    return sum((len(g[c][0]) + 1) if c != ' ' else 4 for c in s) - 1


def berenkop(d, cx, cy, r=6.0, vacht='#8a5a30', snuit='#e0b888'):
    """Een rond berenkopje (ons eigen logo): oren, snuitje, oogjes en een neusje."""
    oor = r * 0.42
    for sx in (-1, 1):
        d.ellips(cx + sx * r * 0.72, cy - r * 0.72, oor, oor, vacht)
        d.ellips(cx + sx * r * 0.72, cy - r * 0.72, oor * 0.5, oor * 0.5, snuit)
    d.ellips(cx, cy, r, r * 0.92, vacht)
    d.ellips(cx, cy + r * 0.35, r * 0.48, r * 0.36, snuit)
    d.p(int(cx - r * 0.4), int(cy - r * 0.15), '#141414')
    d.p(int(cx + r * 0.4), int(cy - r * 0.15), '#141414')
    d.rect(int(cx) - 1, int(cy + r * 0.2), 2, 1, '#141414')


# ================================================================== het pand

def restaurant():
    """Het restaurant: 80x84, voet 5x2, de deur op tegel 2."""
    w, h = 80, 84
    d = Doek(w, h)
    # dak (donker, met een overstek)
    for i in range(18):
        y = 12 + i
        inspring = max(0, 9 - i // 2)
        d.rect(inspring, y, w - 2 * inspring, 1, '#4a3a34' if i % 3 else '#3a2c28')
    d.rect(0, 30, w, 3, '#2a201c')
    # schoorsteen met een rookpluimpje (er wordt gegrild)
    d.rect(62, 4, 7, 12, '#8a4a36')
    d.rect(61, 3, 9, 2, '#5a2e22')
    # gevel: houten planken
    d.rect(2, 33, 76, 51, BRUIN)
    for y in range(34, 84, 4):
        d.rect(2, y, 76, 1, BRUIN_D)
        d.rect(2, y + 1, 76, 1, BRUIN_L)
    # stenen plint
    d.rect(2, 78, 76, 6, '#8a4a36')
    for x in range(2, 78, 6):
        d.rect(x, 80, 1, 2, '#6a3426')
    d.rect(2, 78, 76, 1, '#a85e46')
    # grote ramen met warm licht en tafeltjes erachter
    for x0 in (6, 52):
        d.rect(x0, 46, 22, 26, '#3a2418')
        d.rect(x0 + 2, 48, 18, 22, '#f0c868')
        d.rect(x0 + 2, 48, 18, 6, '#f8e0a0')
        d.rect(x0 + 10, 48, 2, 22, '#3a2418')
        # lampje en een tafel met een gast
        d.rect(x0 + 5, 48, 1, 4, '#3a2418')
        d.ellips(x0 + 5.5, 53, 2, 1.5, ROOD)
        d.rect(x0 + 13, 60, 7, 2, '#7a4a2a')
        d.rect(x0 + 16, 62, 1, 6, '#7a4a2a')
        d.ellips(x0 + 6, 59, 2.5, 2.5, '#b07a50')
        d.rect(x0 + 4, 61, 5, 7, '#a8484a' if x0 < 40 else '#4a6aa8')
        # bloembak
        d.rect(x0 - 1, 72, 24, 4, '#5a341c')
        for bx in range(x0, x0 + 22, 3):
            d.rect(bx, 70, 2, 2, '#4a8a3a')
            d.p(bx + 1, 69, ROOD_L if bx % 2 else GOUD)
    # luifel boven de deur
    for x in range(30, 50):
        d.rect(x, 40, 1, 6, ROOD if (x // 3) % 2 else CREME)
    d.rect(29, 39, 22, 1, ROOD_D)
    # deur (dubbele glazen deuren)
    d.rect(32, 50, 16, 34, '#2a1a12')
    for x0 in (33, 41):
        d.rect(x0, 51, 6, 33, '#e8c070')
        d.rect(x0 + 1, 52, 4, 20, '#9cc8dc')
        d.rect(x0 + 1, 52, 4, 5, '#c8e4ee')
    d.rect(38, 64, 1, 3, GOUD)
    d.rect(41, 64, 1, 3, GOUD)
    # lampjes naast de deur
    for x in (28, 51):
        d.rect(x, 50, 1, 4, '#2a2a2a')
        d.rect(x - 1, 46, 3, 4, '#f8e080')
    # uithangbord op het dak: rood bord met het berenkopje en DE BEREN
    d.rect(4, 15, 73, 15, '#2a1410')
    d.rect(5, 16, 71, 13, ROOD)
    d.rect(5, 16, 71, 1, ROOD_L)
    d.rect(5, 28, 71, 1, ROOD_D)
    d.ellips(12, 22.5, 8.5, 8.5, '#2a1410')
    d.ellips(12, 22.5, 7.5, 7.5, CREME)
    berenkop(d, 12, 23.5, 5.2)
    tb = tekstbreedte('DE BEREN')
    d.tekst(22 + (53 - tb) // 2, 17, 'DE BEREN', CREME)
    # paaltjes van het bord
    d.rect(14, 30, 2, 3, '#2a1410')
    d.rect(64, 30, 2, 3, '#2a1410')
    return omlijn(d.img, K(ZWART))


# ================================================================== binnentegels (dorp_binnen, index 31+)

def muur(onder=False):
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#9a3a2e')
    d.rect(0, 0, 16, 2, '#5a2018')
    d.rect(0, 2, 16, 1, '#b8584a')
    for (x, y) in ((3, 6), (11, 10), (7, 13)):
        d.p(x, y, '#aa4a3c')
    if onder:
        # houten lambrisering
        d.rect(0, 0, 16, 16, '#9a3a2e')
        d.rect(0, 6, 16, 10, BRUIN)
        d.rect(0, 6, 16, 1, BRUIN_L)
        d.rect(0, 7, 16, 1, '#c08850')
        for x in range(0, 16, 8):
            d.rect(x + 1, 9, 6, 4, BRUIN_D)
            d.rect(x + 2, 10, 4, 2, BRUIN)
        d.rect(0, 14, 16, 2, '#3a2214')
    return d.img


def muur_lijst():
    """Een ingelijst berenkopje aan de muur."""
    d = Doek(16, 16)
    d.img = muur(True)
    d.px = d.img.load()
    d.rect(2, 0, 12, 11, GOUD)
    d.rect(3, 1, 10, 9, CREME)
    berenkop(d, 8, 5.8, 3.4)
    d.rect(2, 10, 12, 1, '#a07820')
    return d.img


def muur_menu():
    """Een menubord met de gerechten (en hun prijsjes)."""
    d = Doek(16, 16)
    d.img = muur(True)
    d.px = d.img.load()
    d.rect(1, 0, 14, 12, '#3a2214')
    d.rect(2, 1, 12, 10, '#262624')
    d.rect(3, 2, 10, 1, GOUD)
    for (y, b) in ((4, 8), (6, 6), (8, 7)):
        d.rect(3, y, b, 1, '#e8e4dc')
        d.rect(12, y, 1, 1, GOUD)
    return d.img


def muur_luik():
    """Het keukenluik: hier komen de borden vandaan."""
    d = Doek(16, 16)
    d.img = muur(True)
    d.px = d.img.load()
    d.rect(0, 1, 16, 11, '#c8c8cc')
    d.rect(1, 2, 14, 9, '#4a3a30')
    d.rect(1, 2, 14, 2, '#f0c060')
    d.rect(4, 6, 3, 2, '#e0e0e0')
    d.rect(9, 5, 3, 3, '#a8a8b0')
    d.rect(0, 11, 16, 2, '#9a9aa0')
    return d.img


def vloer(variant=0):
    """Visgraat-parket."""
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#b8844e')
    for y in range(0, 16, 4):
        for x in range(0, 16, 8):
            o = (x + y + variant * 4) % 8
            d.lijn(x + o - 4, y, x + o, y + 4, '#9a6a3c')
            d.lijn(x + o, y + 4, x + o + 4, y, '#9a6a3c')
    for (x, y) in ((3, 2), (12, 9), (6, 13)):
        d.p((x + variant * 5) % 16, y, '#c89660')
    return d.img


def binnen_extra():
    a = vloer(0)
    return [
        muur(False),     # 31 muur boven
        muur(True),      # 32 muur onder (lambrisering)
        muur_lijst(),    # 33 ingelijst berenkopje
        muur_menu(),     # 34 menubord
        muur_luik(),     # 35 keukenluik
        a,               # 36 parket
        vloer(1),        # 37 parket variant
        schaduw(a),      # 38 parket onder de muur
    ]


# ================================================================== objecten binnen

def bord_eten(soort):
    """Een bordje met eten, voor op de balie (12x9)."""
    d = Doek(12, 9)
    if soort == 'broodplankje':
        d.rect(0, 3, 12, 5, '#a8743c')
        d.rect(0, 3, 12, 1, '#c8945a')
        d.rect(10, 4, 2, 2, '#7a4a2a')
        d.ellips(3, 4, 2.5, 1.6, '#e8c070')
        d.ellips(6.5, 4, 2.5, 1.6, '#e0b060')
        d.ellips(9, 3.5, 1.5, 1.2, '#f4f0c8')
        d.p(2, 3, '#4a8a3a')
    else:
        d.ellips(6, 5, 6, 3.4, '#f4f4f0')
        d.ellips(6, 5, 4.4, 2.2, '#dcdcd8')
        if soort == 'spareribs':
            for x in (3, 6, 9):
                d.rect(x - 1, 3, 3, 4, '#8a3a1e')
                d.rect(x - 1, 3, 3, 1, '#b85a2e')
                d.p(x, 2, '#f0e8d8')
        elif soort == 'sate':
            d.rect(1, 4, 10, 1, '#c8a060')
            for x in (3, 5, 7):
                d.rect(x, 3, 2, 2, '#c87a3a')
            d.ellips(7, 6, 3, 1.4, '#a8582a')
    return omlijn(d.img, K('#2a2018'))


def balie():
    """De balie met de kassa, een belletje en een stapel menukaarten. 64x24, voet 4x1.
    Laag gehouden, zodat je de gastvrouw en de kok erachter goed ziet."""
    w, h = 64, 24
    d = Doek(w, h)
    d.rect(0, 8, w, 16, BRUIN)
    d.rect(0, 8, w, 3, '#e8dcc4')
    d.rect(0, 8, w, 1, '#fff8e8')
    d.rect(0, 11, w, 1, '#a89878')
    for x in range(4, w, 12):
        d.rect(x, 13, 8, 8, BRUIN_D)
        d.rect(x + 1, 14, 6, 6, BRUIN_L)
    d.rect(0, 22, w, 2, '#3a2214')
    # kassa (links, zodat de kok vrij staat)
    d.rect(2, 1, 12, 8, '#3a3a42')
    d.rect(3, 2, 10, 3, '#7ac87a')
    d.rect(4, 6, 8, 2, '#a8a8b0')
    # belletje
    d.ellips(22, 6, 3, 2.4, GOUD, alleen=lambda x, y: y <= 7)
    d.rect(19, 7, 7, 1, '#a07820')
    d.p(22, 3, '#a07820')
    # menukaarten
    d.rect(52, 4, 8, 5, ROOD)
    d.rect(53, 3, 8, 5, ROOD_L)
    d.p(56, 5, CREME)
    return omlijn(d.img, K(ZWART))


def tafel(kleed=ROOD):
    """Tafeltje met twee stoelen en een geruit kleedje. 40x26, voet 2x1 (stoelen steken uit)."""
    w, h = 40, 26
    d = Doek(w, h)
    # stoelen links en rechts
    for x in (0, 33):
        d.rect(x, 4, 7, 14, BRUIN_D)
        d.rect(x + 1, 5, 5, 4, BRUIN_L)
        d.rect(x, 14, 7, 3, BRUIN)
        d.rect(x, 17, 2, 8, BRUIN_D)
        d.rect(x + 5, 17, 2, 8, BRUIN_D)
    # tafel
    d.rect(7, 8, 26, 10, CREME)
    for y in range(8, 18, 3):
        for x in range(7, 33, 3):
            if (x // 3 + y // 3) % 2:
                d.rect(x, y, 3, 3, kleed)
    d.rect(7, 18, 26, 2, '#a89878')
    d.rect(10, 20, 3, 6, BRUIN_D)
    d.rect(27, 20, 3, 6, BRUIN_D)
    # borden en een kaarsje
    d.ellips(13, 12, 3.5, 2.2, '#f8f8f4')
    d.ellips(27, 12, 3.5, 2.2, '#f8f8f4')
    d.rect(12, 11, 3, 2, '#8a3a1e')
    d.rect(26, 11, 3, 1, '#c87a3a')
    d.rect(19, 7, 2, 5, '#f4f0e0')
    d.p(19, 5, '#f8d040')
    d.p(20, 6, '#e87020')
    return omlijn(d.img, K(ZWART))


def houten_beer():
    """Een levensgrote houten beer met een menukaart. 22x34."""
    w, h = 22, 34
    d = Doek(w, h)
    hout, hout_d, hout_l = '#9a6236', '#6e4220', '#b87a46'
    d.rect(4, 30, 14, 4, '#5a3a24')
    d.ellips(11, 22, 8, 9, hout)
    d.ellips(11, 23, 4.5, 6, hout_l)
    for x in (5, 15):
        d.ellips(x, 28, 3, 2.4, hout_d)
    d.ellips(11, 9, 7, 6.4, hout)
    for x in (5, 17):
        d.ellips(x, 3.6, 2.6, 2.6, hout)
        d.ellips(x, 3.6, 1.2, 1.2, hout_d)
    d.ellips(11, 11, 3.4, 2.4, hout_l)
    d.rect(10, 10, 2, 1, '#2a1a10')
    d.p(8, 8, '#2a1a10')
    d.p(14, 8, '#2a1a10')
    # menukaart in de poten
    d.rect(7, 17, 8, 7, CREME)
    d.rect(8, 18, 6, 1, ROOD)
    d.rect(8, 20, 5, 1, '#8a8a8a')
    d.rect(8, 22, 4, 1, '#8a8a8a')
    for y in range(14, 30, 3):
        d.p(3 + (y % 2), y, hout_d)
    return omlijn(d.img, K(ZWART))


def plant():
    """Plant in een pot. 16x26."""
    d = Doek(16, 26)
    d.rect(4, 17, 8, 8, '#c86a3a')
    d.rect(3, 16, 10, 2, '#a85428')
    for (x, y, rx, ry) in ((8, 8, 5, 6), (4, 11, 3, 4), (12, 11, 3, 4), (8, 3, 3, 3)):
        d.ellips(x, y, rx, ry, '#3a8a3a')
    for (x, y) in ((6, 6), (10, 9), (5, 12), (11, 4)):
        d.p(x, y, '#5aaa4a')
    return omlijn(d.img, K(ZWART))


def objecten():
    return {
        'restaurant_beren': restaurant(),
        'beren_balie': balie(),
        'beren_tafel': tafel(ROOD),
        'beren_tafel_groen': tafel('#3a8a4a'),
        'houten_beer': houten_beer(),
        'beren_plant': plant(),
        'bord_spareribs': bord_eten('spareribs'),
        'bord_sate': bord_eten('sate'),
        'bord_broodplankje': bord_eten('broodplankje'),
    }


# ================================================================== iconen (16x16)

def icoon_kipsate():
    """Twee stokjes kipsaté met een plens pindasaus."""
    d = Doek(16, 16)
    for dy in (0, 5):
        d.lijn(0, 9 + dy, 15, 2 + dy, '#d8b070')
        for (x, y) in ((3, 6), (7, 4), (11, 2)):
            d.rect(x, y + dy, 3, 3, '#c87a3a')
            d.rect(x, y + dy, 3, 1, '#e8a860')
            d.p(x + 2, y + dy + 2, '#9a5426')
    d.ellips(8, 10, 4.5, 2.2, '#8a4a1e')
    d.ellips(7, 9.5, 2, 1, '#b06a2e')
    return omlijn(d.img, K('#2a2018'))


def icoon_broodplankje():
    d = Doek(16, 16)
    d.rect(1, 6, 14, 7, '#a8743c')
    d.rect(1, 6, 14, 1, '#c8945a')
    d.rect(13, 8, 2, 2, '#6a3e1e')
    d.ellips(4.5, 7.5, 3, 2.2, '#e8c070')
    d.ellips(4.5, 7, 2, 1, '#f4dc98')
    d.ellips(9, 8, 2.6, 2, '#e0b060')
    d.ellips(11.5, 5.5, 2, 1.6, '#f4f0c8')
    d.ellips(8, 4.5, 1.8, 1.4, '#e8e4d0')
    d.p(11, 4, '#4a8a3a')
    d.p(7, 4, '#c83a2a')
    return omlijn(d.img, K('#2a2018'))


def icoon_spareribs():
    """Een rekje spareribs, met de botjes die eruit steken."""
    d = Doek(16, 16)
    for x in (2, 5, 8, 11):
        d.rect(x + 1, 1, 2, 14, '#f0e8d8')
        d.p(x + 1, 0, '#ffffff')
    d.rect(1, 3, 14, 10, '#8a3a1e')
    d.rect(1, 3, 14, 2, '#b85a2e')
    for x in (3, 6, 9, 12):
        d.rect(x, 5, 1, 7, '#6a2a14')
    d.p(4, 4, '#e88a4a')
    d.p(10, 4, '#e88a4a')
    d.rect(1, 12, 14, 1, '#5a2010')
    return omlijn(d.img, K('#2a2018'))


def iconen():
    return {
        'icoon_kipsate': icoon_kipsate(),
        'icoon_broodplankje': icoon_broodplankje(),
        'icoon_spareribs': icoon_spareribs(),
    }
