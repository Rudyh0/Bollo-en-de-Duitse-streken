"""Aalden: Drentse huisjes met luiken, tabakszaak Gerard, bejaardenhuis Huize Avondrood, het bord naar het vakantiepark,
de binnenkant van de tabakszaak en het bejaardenhuis, en de iconen voor de shag-quest."""
import random
from pixel import hexkleur, omlijn
from art_buiten import Doek
from art_dorp import schaduw
import art_font

K = hexkleur
ZWART = '#24201c'


def tekstbreedte(s):
    g = art_font.alle_glyphs()
    return sum((len(g[c][0]) + 1) if c != ' ' else 4 for c in s) - 1


def gecentreerd(d, x0, b, y, s, kleur):
    d.tekst(x0 + (b - tekstbreedte(s)) // 2, y, s, kleur)


def bakstenen(d, x0, y0, b, h, steen, voeg):
    d.rect(x0, y0, b, h, steen)
    for y in range(y0 + 2, y0 + h, 3):
        d.rect(x0, y, b, 1, voeg)
        for x in range(x0 + ((y - y0) // 3 % 2) * 3, x0 + b, 6):
            d.p(x, y - 1, voeg)


def raam_met_luiken(d, x, y, b=10, h=11, luik='#2e7a4a'):
    """Wit raam met groen-witte Drentse luiken."""
    d.rect(x, y, b, h, '#f0f0e8')
    d.rect(x + 1, y + 1, b - 2, h - 2, '#9cc8dc')
    d.rect(x + 1, y + 1, b - 2, 3, '#c8e4ee')
    d.rect(x + b // 2, y, 1, h, '#f0f0e8')
    d.rect(x + 1, y + h // 2, b - 2, 1, '#f0f0e8')
    for lx in (x - 4, x + b):
        d.rect(lx, y, 4, h, luik)
        d.lijn(lx, y, lx + 3, y + h - 1, '#f0f0e8')
        d.lijn(lx + 3, y, lx, y + h - 1, '#f0f0e8')


# ================================================================== huisjes

HUISJE = {
    #        muur       voeg       dak        dakdonker  daklicht
    'rood': ('#9a4a36', '#7a3a2a', '#3a3a44', '#2a2a32', '#50505c'),
    'geel': ('#c8a060', '#a07e48', '#a8442a', '#7a2e1e', '#c8603e'),
    'wit': ('#ece8e0', '#cfcac0', '#a8925a', '#806c40', '#c4ac72'),
}


def huisje(kleur='rood'):
    """Drents huisje met een groot dak en luiken. 48x58; voet 3x2, deur op tegel 1."""
    muur, voeg, dak, dakD, dakL = HUISJE[kleur]
    w, h = 48, 58
    d = Doek(w, h)
    # schoorsteen
    d.rect(34, 2, 6, 10, '#8a4a36')
    d.rect(33, 1, 8, 2, '#5a2e22')
    # dak (trapezium, nok bovenaan)
    for y in range(6, 32):
        t = (y - 6) / 26
        inspring = int(10 * (1 - t))
        d.rect(inspring, y, w - 2 * inspring, 1, dak)
        if kleur == 'wit':
            if y % 3 == 0:
                for x in range(inspring + 2, w - inspring - 2, 6):
                    d.rect(x, y, 3, 1, dakD)
        elif y % 4 == 0:
            d.rect(inspring, y, w - 2 * inspring, 1, dakD)
            for x in range(inspring + (y // 4 % 2) * 3, w - inspring, 6):
                d.p(x, y + 1, dakL)
    d.rect(10, 5, w - 20, 2, dakL)
    d.rect(0, 31, w, 2, dakD)
    # muur
    if kleur == 'wit':
        d.rect(2, 33, w - 4, 25, muur)
        d.rect(2, 54, w - 4, 4, '#4a4a52')
    else:
        bakstenen(d, 2, 33, w - 4, 25, muur, voeg)
        d.rect(2, 55, w - 4, 3, '#4a4a52')
    # ramen met luiken
    raam_met_luiken(d, 6, 38, 8, 11)
    raam_met_luiken(d, 36, 38, 8, 11)
    # dakkapelletje
    d.rect(19, 14, 10, 10, muur if kleur != 'wit' else '#f4f2ec')
    d.rect(18, 12, 12, 3, dakD)
    d.rect(21, 16, 6, 6, '#9cc8dc')
    d.rect(24, 16, 1, 6, '#f0f0e8')
    # deur (tegel 1: x 16..31)
    deur = {'rood': '#2e6a4a', 'geel': '#2e4a7a', 'wit': '#8a3a2a'}[kleur]
    d.rect(17, 36, 14, 22, '#f0f0e8')
    d.rect(18, 37, 12, 21, deur)
    d.rect(19, 38, 10, 5, '#9cc8dc')
    d.rect(27, 48, 2, 2, '#e0c048')
    # bloemetjes bij de deur
    for x in (14, 32):
        d.rect(x, 54, 3, 3, '#a85428')
        d.p(x + 1, 53, '#e84848')
        d.p(x, 52, '#4a8a3a')
    return omlijn(d.img, K(ZWART))


# ================================================================== tabakszaak

def tabakszaak():
    """Tabakszaak Gerard: bakstenen pandje met luifel, etalage en een pijpje op het bord. 64x60; voet 4x2, deur op tegel 2."""
    w, h = 64, 60
    d = Doek(w, h)
    # dak
    for y in range(4, 18):
        inspring = max(0, (18 - y) // 2)
        d.rect(inspring, y, w - 2 * inspring, 1, '#3a3a44' if y % 3 else '#2a2a32')
    d.rect(0, 17, w, 2, '#22222a')
    bakstenen(d, 2, 19, w - 4, 41, '#8a4a36', '#6a3426')
    # naambord met een pijpje
    d.rect(4, 21, 56, 13, '#1e1e22')
    d.rect(5, 22, 54, 11, '#2e4a3a')
    d.rect(5, 22, 54, 1, '#4a6a5a')
    gecentreerd(d, 18, 40, 23, 'TABAK', '#f0d890')
    # pijp: kop rechtop, steel schuin naar links
    d.rect(13, 25, 4, 6, '#a06a3c')
    d.rect(13, 25, 4, 1, '#3a2414')
    d.rect(16, 26, 1, 5, '#6a4224')
    d.lijn(12, 30, 7, 27, '#5a3a20')
    d.p(7, 26, '#1e1e1e')
    d.p(6, 27, '#1e1e1e')
    d.p(14, 23, '#d0d0d0')
    d.p(15, 22, '#d0d0d0')
    d.p(14, 21, '#b0b0b0')
    # luifel (bruin-crème)
    for x in range(2, 62):
        d.rect(x, 35, 1, 6, '#7a4a2a' if (x // 4) % 2 else '#f0e4c8')
    for x in range(2, 62, 4):
        d.rect(x, 41, 2, 1, '#7a4a2a' if (x // 4) % 2 else '#f0e4c8')
    # etalage met pakjes en sigarenkistjes
    d.rect(4, 44, 26, 15, '#f0f0e8')
    d.rect(5, 45, 24, 13, '#3a4a5a')
    d.rect(5, 45, 24, 3, '#5a6a7a')
    for i, c in enumerate(('#c83a3a', '#3a6ac8', '#e8c040', '#2a2a2a', '#3a8a4a')):
        d.rect(7 + i * 4, 51, 3, 5, c)
        d.rect(7 + i * 4, 51, 3, 1, '#f0f0f0')
    d.rect(6, 56, 22, 1, '#7a5030')
    # deur
    d.rect(34, 43, 14, 17, '#f0f0e8')
    d.rect(35, 44, 12, 16, '#5a341c')
    d.rect(36, 45, 10, 6, '#9cc8dc')
    d.rect(44, 53, 2, 2, '#e0c048')
    # krantenbord naast de deur
    d.rect(50, 45, 11, 13, '#f4f4f0')
    d.rect(51, 46, 9, 2, '#c83a3a')
    for y in (49, 51, 53, 55):
        d.rect(51, y, 8 if y != 53 else 6, 1, '#6a6a72')
    d.rect(50, 58, 2, 2, '#4a4a52')
    d.rect(59, 58, 2, 2, '#4a4a52')
    return omlijn(d.img, K(ZWART))


# ================================================================== bejaardenhuis

def bejaardenhuis():
    """Huize Avondrood: plat dak, oranje gordijnen, schuifdeuren onder een luifel. 96x64; voet 6x2, deur op tegel 3."""
    w, h = 96, 64
    d = Doek(w, h)
    d.rect(0, 4, w, 4, '#3a3a40')
    d.rect(0, 4, w, 1, '#5a5a62')
    bakstenen(d, 2, 8, w - 4, 56, '#b08a54', '#8e6c3e')
    # naambord
    d.rect(2, 10, 92, 11, '#2a2a30')
    d.rect(3, 11, 90, 9, '#f4ecd8')
    gecentreerd(d, 3, 90, 11, 'HUIZE AVONDROOD', '#8a3a2a')
    # twee rijen ramen met oranje gordijnen (en hier en daar een plantje)
    random.seed(17)
    for y in (24, 42):
        for x in range(6, 90, 14):
            if y == 42 and 40 <= x <= 54:
                continue
            d.rect(x, y, 11, 12, '#f0f0e8')
            d.rect(x + 1, y + 1, 9, 10, '#7aa8c8')
            d.rect(x + 1, y + 1, 3, 10, '#e88a3a')
            d.rect(x + 7, y + 1, 3, 10, '#e88a3a')
            d.rect(x + 1, y + 1, 9, 2, '#c86a2a')
            if random.random() < 0.4:
                d.rect(x + 4, y + 8, 3, 3, '#3a8a3a')
    # luifel en schuifdeuren (tegel 3: x 48..63)
    d.rect(40, 36, 32, 4, '#d8d8d8')
    d.rect(40, 39, 32, 1, '#a8a8b0')
    d.rect(42, 40, 2, 24, '#a8a8b0')
    d.rect(68, 40, 2, 24, '#a8a8b0')
    d.rect(47, 42, 18, 22, '#4a4a52')
    d.rect(48, 43, 8, 21, '#a8d0e0')
    d.rect(57, 43, 8, 21, '#a8d0e0')
    d.rect(48, 43, 8, 4, '#d0e8f0')
    d.rect(57, 43, 8, 4, '#d0e8f0')
    # bankje en een asbak bij de ingang
    d.rect(74, 58, 12, 2, '#7a4a2a')
    d.rect(75, 60, 1, 4, '#4a4a52')
    d.rect(84, 60, 1, 4, '#4a4a52')
    return omlijn(d.img, K(ZWART))


# ================================================================== kleine dingen buiten

def scootmobiel():
    """Rode scootmobiel met een boodschappenmandje. 24x20."""
    d = Doek(24, 20)
    d.rect(3, 10, 18, 5, '#c83a3a')
    d.rect(3, 10, 18, 1, '#e86a5a')
    d.rect(5, 4, 7, 7, '#2a2a30')       # stoel
    d.rect(5, 3, 7, 2, '#4a4a52')
    d.lijn(17, 10, 19, 3, '#5a5a62')    # stuurstang
    d.rect(17, 2, 5, 2, '#2a2a30')
    d.rect(18, 4, 5, 4, '#c8a060')      # mandje
    d.rect(18, 5, 5, 1, '#a07e48')
    for x in (6, 18):
        d.ellips(x, 16, 3, 3, '#1e1e22')
        d.ellips(x, 16, 1.2, 1.2, '#a8a8b0')
    d.p(21, 11, '#f8e080')
    return omlijn(d.img, K(ZWART))


def bord_vakantiepark():
    """Bruin toeristisch bord: VAKANTIEPARK met een pijl naar boven. 54x38."""
    w, h = 54, 38
    d = Doek(w, h)
    for x in (9, 42):
        d.rect(x, 26, 3, 12, '#6a6a72')
    d.rect(0, 0, w, 28, '#f4f4f0')
    d.rect(1, 1, w - 2, 26, '#7a4a28')
    gecentreerd(d, 1, w - 2, 2, 'VAKANTIE', '#f4f4f0')
    gecentreerd(d, 1, 34, 13, 'PARK', '#f4f4f0')
    # pijl omhoog
    d.rect(42, 16, 3, 8, '#f4f4f0')
    for i in range(5):
        d.rect(43 - i, 12 + i, 1 + 2 * i, 1, '#f4f4f0')
    # tentje
    for i in range(5):
        d.rect(31 - i, 18 + i, 1 + 2 * i, 1, '#f4f4f0')
    return omlijn(d.img, K(ZWART))


# ================================================================== binnen (dorp_binnen, index 39+)

def tapijt(variant=0):
    """Jaren-zeventig-tapijt, bruin met oranje rondjes."""
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#8a5a34')
    for (x, y) in ((4, 4), (12, 12)) if variant == 0 else ((12, 4), (4, 12)):
        d.ellips(x, y, 3.2, 3.2, '#c8742e')
        d.ellips(x, y, 1.6, 1.6, '#e8a050')
    for (x, y) in ((1, 9), (9, 1), (14, 7), (7, 14)):
        d.p(x, y, '#a06a3c')
    return d.img


def binnen_extra():
    a = tapijt(0)
    return [
        a,             # 39 tapijt
        tapijt(1),     # 40 tapijt variant
        schaduw(a),    # 41 tapijt onder de muur
    ]


def tabaksbalie():
    """Toonbank met sigaren in een vitrine, krasloten en een kassa. 48x24, voet 3x1."""
    w, h = 48, 24
    d = Doek(w, h)
    d.rect(0, 8, w, 16, '#6e4628')
    d.rect(0, 8, w, 2, '#9a6a40')
    d.rect(2, 12, 28, 9, '#c8e0e8')
    d.rect(3, 13, 26, 7, '#3a2a20')
    for x in range(4, 28, 4):
        d.rect(x, 15, 3, 3, '#8a5a34')
        d.p(x + 1, 15, '#e8c040')
    d.rect(0, 22, w, 2, '#3a2214')
    # krasloten en een kassa
    for i in range(3):
        d.rect(4 + i * 6, 3 + i, 5, 5, ('#e8c040', '#3a8ac8', '#c83a3a')[i])
    d.rect(32, 1, 12, 8, '#3a3a42')
    d.rect(33, 2, 10, 3, '#7ac87a')
    d.rect(34, 6, 8, 2, '#a8a8b0')
    return omlijn(d.img, K(ZWART))


def tabaksschap():
    """Wandkast vol pakjes shag, sigarenkistjes en pijpen. 32x34, voet 2x1."""
    w, h = 32, 34
    d = Doek(w, h)
    d.rect(0, 0, w, h, '#5a3a20')
    d.rect(2, 2, w - 4, h - 4, '#3a2414')
    random.seed(5)
    for y in (3, 12, 21):
        d.rect(2, y + 8, w - 4, 1, '#7a5030')
        x = 3
        while x < w - 5:
            b = random.choice((3, 4, 5))
            c = random.choice(('#c83a3a', '#3a6ac8', '#e8c040', '#2a2a2a', '#3a8a4a', '#8a5a34', '#e8e0cc'))
            hoog = random.choice((5, 6, 7))
            d.rect(x, y + 8 - hoog, b, hoog, c)
            d.rect(x, y + 8 - hoog, b, 1, '#f0f0f0' if c != '#e8e0cc' else '#c8c0a8')
            x += b + 1
    d.rect(0, h - 2, w, 2, '#2a1a10')
    return omlijn(d.img, K(ZWART))


def krantenrek():
    """Rek met kranten. 16x24."""
    d = Doek(16, 24)
    d.rect(1, 4, 14, 18, '#8a8e98')
    for i, y in enumerate((5, 11, 17)):
        d.rect(2, y, 12, 5, '#f4f4f0')
        d.rect(2, y, 12, 1, ('#c83a3a', '#3a3a42', '#3a6ac8')[i])
        d.rect(3, y + 2, 7, 1, '#8a8a8a')
    d.rect(1, 22, 2, 2, '#4a4a52')
    d.rect(13, 22, 2, 2, '#4a4a52')
    return omlijn(d.img, K(ZWART))


def tv_kast():
    """Oude beeldbuistelevisie op een eikenhouten kastje. 32x30, voet 2x1."""
    w, h = 32, 30
    d = Doek(w, h)
    d.rect(2, 16, 28, 14, '#7a4a2a')
    d.rect(2, 16, 28, 2, '#9a643a')
    d.rect(5, 20, 10, 8, '#5a341c')
    d.rect(17, 20, 10, 8, '#5a341c')
    d.rect(5, 0, 22, 17, '#4a4a52')
    d.rect(7, 2, 15, 12, '#3a5a5a')
    d.rect(8, 3, 6, 4, '#7aa8a0')
    d.rect(23, 4, 2, 2, '#c8c8c8')
    d.rect(23, 8, 2, 2, '#c8c8c8')
    d.lijn(12, 0, 8, -6, '#8a8a8a')
    return omlijn(d.img, K(ZWART))


def fauteuil(kleur='#8a2a3a'):
    """Oude fauteuil met een gehaakt kleedje. 16x20."""
    d = Doek(16, 20)
    licht = {'#8a2a3a': '#a84a5a', '#3a6a3a': '#5a8a5a'}.get(kleur, '#aaaaaa')
    d.rect(2, 0, 12, 12, kleur)
    d.rect(2, 0, 12, 2, licht)
    d.rect(5, 1, 6, 4, '#f4f0e0')
    d.rect(0, 6, 3, 10, kleur)
    d.rect(13, 6, 3, 10, kleur)
    d.rect(2, 11, 12, 5, licht)
    d.rect(1, 16, 2, 4, '#4a2e18')
    d.rect(13, 16, 2, 4, '#4a2e18')
    return omlijn(d.img, K(ZWART))


def bingotafel():
    """Tafel met bingokaarten en een bingomolen. 32x26, voet 2x1."""
    w, h = 32, 26
    d = Doek(w, h)
    d.rect(1, 10, 30, 8, '#c8a070')
    d.rect(1, 10, 30, 1, '#e0c090')
    d.rect(1, 18, 30, 2, '#8a6a40')
    d.rect(4, 20, 2, 6, '#6a4a2a')
    d.rect(26, 20, 2, 6, '#6a4a2a')
    for x in (4, 12):
        d.rect(x, 11, 7, 6, '#f4f4f0')
        for yy in (12, 14):
            for xx in (x + 1, x + 3, x + 5):
                d.p(xx, yy, '#c83a3a' if (xx + yy) % 3 else '#3a3a42')
    # bingomolen
    d.ellips(24, 6, 5, 5, '#e8e0a0')
    d.ellips(24, 6, 3.6, 3.6, '#f8f0c0')
    d.p(23, 5, '#c83a3a')
    d.p(25, 7, '#3a6ac8')
    d.rect(19, 10, 10, 1, '#8a8a8a')
    d.lijn(29, 6, 31, 3, '#8a8a8a')
    return omlijn(d.img, K(ZWART))


def staande_klok():
    """Friese staande klok. 16x36."""
    d = Doek(16, 36)
    d.rect(2, 4, 12, 32, '#6e3a1e')
    d.rect(1, 2, 14, 4, '#8a4a28')
    d.rect(4, 0, 8, 3, '#8a4a28')
    d.ellips(8, 11, 5, 5, '#f4ecd8')
    d.lijn(8, 11, 8, 8, '#2a2a2a')
    d.lijn(8, 11, 10, 12, '#2a2a2a')
    d.rect(5, 18, 6, 14, '#3a1e10')
    d.rect(7, 19, 2, 8, '#c8a040')
    d.ellips(8, 28, 2, 2, '#e8c040')
    return omlijn(d.img, K(ZWART))


def rollator():
    """Een rollator met een mandje. 16x18."""
    d = Doek(16, 18)
    d.lijn(3, 2, 2, 15, '#5a5a62')
    d.lijn(12, 2, 13, 15, '#5a5a62')
    d.rect(2, 2, 11, 2, '#3a3a42')
    d.rect(3, 7, 10, 4, '#3a6ac8')
    d.rect(3, 7, 10, 1, '#5a8ae8')
    for x in (2, 13):
        d.ellips(x, 16, 1.6, 1.6, '#1e1e22')
    return omlijn(d.img, K(ZWART))


def objecten():
    return {
        'huisje_rood': huisje('rood'),
        'huisje_geel': huisje('geel'),
        'huisje_wit': huisje('wit'),
        'tabakszaak': tabakszaak(),
        'bejaardenhuis': bejaardenhuis(),
        'scootmobiel': scootmobiel(),
        'bord_vakantiepark': bord_vakantiepark(),
        'tabaksbalie': tabaksbalie(),
        'tabaksschap': tabaksschap(),
        'krantenrek': krantenrek(),
        'tv_kast': tv_kast(),
        'fauteuil': fauteuil('#8a2a3a'),
        'fauteuil_groen': fauteuil('#3a6a3a'),
        'bingotafel': bingotafel(),
        'staande_klok': staande_klok(),
        'rollator': rollator(),
    }


# ================================================================== iconen (16x16)

def icoon_shag():
    """Een pakje Duitse zware shag (eigen merk: SCHWER)."""
    d = Doek(16, 16)
    d.rect(1, 3, 14, 11, '#2a2a30')
    d.rect(1, 3, 14, 3, '#4a4a52')
    d.rect(2, 7, 12, 5, '#c8a040')
    d.rect(3, 8, 10, 1, '#8a2a1e')
    d.rect(3, 10, 7, 1, '#8a2a1e')
    d.rect(5, 1, 6, 3, '#6a4a2a')        # tabak die eruit piept
    d.p(6, 0, '#8a5a34')
    d.p(9, 0, '#8a5a34')
    return omlijn(d.img, K('#141414'))


def icoon_envelop():
    """Een envelop met geld van opa Jannes."""
    d = Doek(16, 16)
    d.rect(1, 4, 14, 10, '#f0ead8')
    d.lijn(1, 4, 8, 9, '#c8c0a8')
    d.lijn(14, 4, 8, 9, '#c8c0a8')
    d.rect(4, 1, 8, 4, '#7ab87a')        # briefje van vijftig steekt eruit
    d.rect(5, 2, 3, 1, '#4a8a4a')
    d.rect(2, 11, 6, 1, '#6a6a72')
    return omlijn(d.img, K('#2a2018'))


def icoon_pepermuntje():
    d = Doek(16, 16)
    d.ellips(8, 8, 6, 6, '#f4f4f4')
    d.ellips(8, 8, 4, 4, '#e4e8ec')
    d.rect(6, 7, 4, 2, '#c8ccd4')
    d.p(5, 5, '#ffffff')
    return omlijn(d.img, K('#3a3a44'))


def iconen():
    return {
        'icoon_shag': icoon_shag(),
        'icoon_envelop': icoon_envelop(),
        'icoon_pepermuntje': icoon_pepermuntje(),
    }
