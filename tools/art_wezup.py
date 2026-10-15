"""Wezup: een ambachtsstadje met haventje, trapgevels, winkels, vissers en een geheime kamer."""
import random
from PIL import Image
from pixel import hexkleur, omlijn
from art_buiten import Doek
import art_font

K = hexkleur
ZWART = '#24201c'


def tekstbreedte(s):
    g = art_font.alle_glyphs()
    return sum((len(g[c][0]) + 1) if c != ' ' else 4 for c in s) - 1


# ================================================================== buitentegels (index 39+)

def kade(zaad=101):
    """Kinderkopjes op de kade."""
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#6a645a')
    for by in range(0, 16, 4):
        for bx in range(-2 + (by // 4 % 2) * 2, 16, 4):
            c = random.choice(['#8a8478', '#968e80', '#7e786c', '#a09888'])
            d.rect(bx + 1, by + 1, 3, 3, c)
            d.p(bx + 1, by + 1, '#b0a898')
    return d.img


def water_rand(boven=True, zaad=103):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#2e6aa0')
    for y in range(0, 16, 4):
        for x in range(16):
            if (x + y // 2) % 7 == 0:
                d.rect(x, y + 1, 3, 1, '#5a92c8')
    if boven:
        d.rect(0, 0, 16, 5, '#7a746a')
        for x in range(0, 16, 4):
            d.rect(x, 0, 3, 4, '#968e80')
        d.rect(0, 5, 16, 1, '#1e4a74')
    else:
        d.rect(0, 12, 16, 4, '#7a746a')
        for x in range(1, 16, 4):
            d.rect(x, 13, 3, 3, '#968e80')
        d.rect(0, 11, 16, 1, '#1e4a74')
    return d.img


def brug():
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#8a6038')
    for y in range(0, 16, 4):
        d.rect(0, y, 16, 3, '#a87848')
        d.rect(0, y, 16, 1, '#c08e5a')
        d.p((y * 5) % 16, y + 1, '#6a4628')
    return d.img


def leuning():
    """Brugleuning (verticaal), als bovenlaag."""
    d = Doek(16, 16)
    d.rect(6, 0, 4, 16, '#f0f0ec')
    d.rect(6, 0, 1, 16, '#ffffff')
    d.rect(9, 0, 1, 16, '#b0b0aa')
    for y in (2, 10):
        d.rect(5, y, 6, 3, '#2e6a4a')
    return omlijn(d.img, K('#3a3a34'))


def tegelset_extra():
    return [
        kade(101),             # 39
        water_rand(True),      # 40 (vast)
        brug(),                # 41
        leuning(),             # 42 (boven, vast)
        kade(102),             # 43
        water_rand(False),     # 44 (vast)
    ]


# ================================================================== binnentegels (dorp_binnen, index 27+)

def behang(onder=False):
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#d8b870')
    for y in range(2, 16, 6):
        for x in range((y // 6 % 2) * 4, 16, 8):
            d.rect(x + 1, y, 2, 2, '#b8944a')
            d.p(x + 1, y + 2, '#5a8a4a')
    if onder:
        d.rect(0, 7, 16, 9, '#6e4628')
        d.rect(0, 7, 16, 1, '#9a6a40')
        for x in range(0, 16, 8):
            d.rect(x + 1, 9, 6, 5, '#7a5030')
        d.rect(0, 14, 16, 2, '#4a2e18')
    return d.img


def delfts(onder=False):
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#f4f4f0')
    d.rect(0, 7, 16, 1, '#c8ccd4')
    d.rect(7, 0, 1, 16, '#c8ccd4')
    for (x, y) in ((2, 2), (10, 10), (10, 2), (2, 10)):
        d.rect(x + 1, y, 2, 1, '#3a5aa8')
        d.rect(x, y + 1, 4, 1, '#3a5aa8')
        d.rect(x + 1, y + 2, 2, 1, '#3a5aa8')
    if onder:
        d.rect(0, 13, 16, 3, '#6a6e78')
    return d.img


def binnen_extra():
    return [
        behang(False),   # 27
        behang(True),    # 28
        delfts(False),   # 29
        delfts(True),    # 30
    ]


# ================================================================== gebouwen

STEEN = {
    'rood': ('#9a4a36', '#7a3a2a', '#b45e46'),
    'donker': ('#6a3a2e', '#4e2a20', '#84483a'),
    'geel': ('#c8a060', '#a07e48', '#dcb878'),
    'wit': ('#e8e4dc', '#c8c4bc', '#f8f6f0'),
}


def muur(d, x0, y0, b, h, kleur):
    steen, voeg, licht = STEEN[kleur]
    d.rect(x0, y0, b, h, steen)
    for y in range(y0 + 1, y0 + h, 3):
        d.rect(x0, y, b, 1, voeg)
        for x in range(x0 + (y // 3 % 2) * 3, x0 + b, 6):
            d.p(x, y + 1, voeg)


def trapgevel(d, x0, y0, b, kleur, treden=4):
    """Trapgevel: aan beide kanten trapjes naar het midden (smalste trede bovenaan)."""
    steen, voeg, licht = STEEN[kleur]
    stap = b // (2 * treden + 1)
    bodem = y0 + (treden + 1) * 5 + 2
    for i in range(treden + 1):
        x = x0 + i * stap
        w = b - 2 * i * stap
        top = y0 + (treden - i) * 5
        d.rect(x, top, w, bodem - top, steen)
        d.rect(x, top, w, 1, licht)
    for y in range(y0 + 2, bodem, 3):
        for x in range(x0, x0 + b):
            if d.px[x, y][3] and d.px[x, y][:3] == K(steen)[:3]:
                d.p(x, y, voeg) if (x + y) % 7 == 0 else None


def raam(d, x, y, b=8, h=10):
    d.rect(x, y, b, h, '#f0f0e8')
    d.rect(x + 1, y + 1, b - 2, h - 2, '#5a8ab0')
    d.rect(x + 1, y + 1, b - 2, 2, '#9cc8dc')
    d.rect(x + b // 2, y, 1, h, '#f0f0e8')
    d.rect(x, y + h // 2, b, 1, '#f0f0e8')


def huis(kleur='rood', deurkleur='#2e6a4a'):
    """Smal grachtenpandje met trapgevel. 48x72; voet 3x2, deur op tegel 1."""
    w, h = 48, 72
    d = Doek(w, h)
    trapgevel(d, 2, 0, 44, kleur)
    muur(d, 2, 22, 44, 50, kleur)
    raam(d, 20, 6, 8, 10)
    for x in (8, 32):
        raam(d, x, 28, 8, 12)
    d.rect(6, 48, 12, 12, '#f0f0e8')
    d.rect(7, 49, 10, 10, '#5a8ab0')
    d.rect(7, 49, 10, 3, '#9cc8dc')
    d.rect(34, 50, 8, 9, '#f0f0e8')
    d.rect(35, 51, 6, 7, '#5a8ab0')
    # deur
    d.rect(18, 48, 12, 24, '#f0f0e8')
    d.rect(19, 50, 10, 22, deurkleur)
    d.rect(20, 51, 8, 4, '#9cc8dc')
    d.rect(26, 61, 2, 2, '#e0c048')
    # hijsbalk
    d.rect(23, 1, 2, 4, '#3a2a1e')
    return omlijn(d.img, K(ZWART))


ETALAGE = {
    'bakker': ('BAKKER', '#d8a050', ('#f4f4f4', '#c8a050')),
    'slager': ('SLAGER', '#c83a3a', ('#f4f4f4', '#c83a3a')),
    'kruidenier': ('KRUIDENIER', '#2e6a4a', ('#f4f4f4', '#2e6a4a')),
    'klompen': ('KLOMPEN', '#c8a030', ('#f0e8c8', '#8a6a3a')),
}


def winkel(soort, kleur='rood'):
    """Winkelpand met trapgevel, luifel, uithangbord en etalage. 64x80; voet 4x2, deur op tegel 2."""
    naam, accent, luifel = ETALAGE[soort]
    w, h = 64, 80
    d = Doek(w, h)
    trapgevel(d, 2, 0, 60, kleur, treden=5)
    muur(d, 2, 28, 60, 52, kleur)
    raam(d, 12, 18, 8, 8)
    raam(d, 44, 18, 8, 8)
    raam(d, 28, 4, 8, 10)
    # naambord
    d.rect(3, 32, 58, 12, '#1e1e22')
    d.rect(4, 33, 56, 10, accent)
    tb = tekstbreedte(naam)
    d.tekst(4 + (56 - tb) // 2, 33, naam, '#f8f8f0')
    # luifel
    for x in range(2, 62):
        d.rect(x, 45, 1, 6, luifel[(x // 4) % 2])
    for x in range(2, 62, 4):
        d.rect(x, 51, 2, 1, luifel[(x // 4) % 2])
    # etalage
    d.rect(4, 54, 28, 22, '#f0f0e8')
    d.rect(5, 55, 26, 20, '#3a4a5a')
    d.rect(5, 55, 26, 4, '#5a6a7a')
    if soort == 'bakker':
        for (x, y) in ((8, 66), (16, 65), (24, 66)):
            d.ellips(x + 2, y + 2, 4, 2.5, '#c88a3a')
            d.ellips(x + 1, y + 1, 2, 1, '#e8b060')
        d.rect(8, 70, 20, 2, '#a86a2a')
    elif soort == 'slager':
        for x in range(8, 30, 5):
            d.lijn(x, 59, x, 67, '#5a2a1e')
            d.ellips(x, 68, 1.6, 3, '#a83a3a')
        d.ellips(18, 72, 6, 2.5, '#d86a6a')
    elif soort == 'kruidenier':
        for (x, y, c) in ((7, 64, '#c83a3a'), (12, 64, '#f0c830'), (17, 64, '#3a8ae8'), (22, 64, '#5ac85a'), (27, 64, '#e8e0cc')):
            d.rect(x, y, 4, 7, c)
            d.rect(x, y, 4, 1, '#3a3a44')
        d.rect(6, 71, 24, 1, '#7a5030')
    elif soort == 'klompen':
        for (x, y) in ((8, 64), (16, 66), (24, 64)):
            d.ellips(x + 3, y + 3, 4, 2.5, '#f0e0b0')
            d.ellips(x + 1, y + 2, 1.5, 1.2, '#7a5a3a')
    # deur
    d.rect(36, 54, 14, 26, '#f0f0e8')
    d.rect(37, 56, 12, 24, '#2e4a6a' if soort != 'kruidenier' else '#2e6a4a')
    d.rect(38, 57, 10, 8, '#9cc8dc')
    d.rect(46, 67, 2, 2, '#e0c048')
    # raampje naast de deur
    d.rect(52, 56, 8, 14, '#f0f0e8')
    d.rect(53, 57, 6, 12, '#5a8ab0')
    return omlijn(d.img, K(ZWART))


def viskraam():
    """Viskraam met haring en een blauw-wit afdak. 48x38."""
    w, h = 48, 38
    d = Doek(w, h)
    for x in (2, 44):
        d.rect(x, 8, 2, 30, '#8a8e98')
    for x in range(0, 48):
        d.rect(x, 2, 1, 8, '#2a5aa8' if (x // 6) % 2 else '#f4f4f4')
    d.rect(0, 0, 48, 3, '#1e3a78')
    d.rect(10, 0, 28, 7, '#f4f4f4')
    d.tekst(10 + (28 - tekstbreedte('VIS')) // 2, -1, 'VIS', '#2a5aa8')
    d.rect(0, 22, 48, 16, '#e8e8ec')
    d.rect(0, 22, 48, 3, '#c8ccd4')
    for x in range(3, 45, 7):
        d.ellips(x + 3, 21, 3.5, 1.5, '#b8c8d8')
        d.p(x, 21, '#4a5a6a')
    d.rect(4, 28, 40, 1, '#c8ccd4')
    return omlijn(d.img, K(ZWART))


def vissersboot():
    """Kotter op het water. 56x32."""
    w, h = 56, 32
    d = Doek(w, h)
    for y in range(18, 28):
        inspring = max(0, (y - 22)) * 2
        d.rect(2 + inspring, y, 52 - 2 * inspring, 1, '#2a4a7a' if y < 23 else '#c83a3a')
    d.rect(2, 18, 52, 2, '#f4f4f0')
    d.rect(30, 8, 14, 10, '#f4f4f0')
    d.rect(32, 10, 4, 4, '#5a8ab0')
    d.rect(38, 10, 4, 4, '#5a8ab0')
    d.rect(29, 7, 16, 2, '#c83a3a')
    d.rect(16, 0, 2, 18, '#6a4a2a')
    d.lijn(17, 1, 4, 17, '#8a8e98')
    d.lijn(17, 1, 28, 17, '#8a8e98')
    d.tekst(6, 19, 'WZ 7', '#f4f4f0')
    return omlijn(d.img, K('#141418'))


def roeiboot():
    w, h = 32, 16
    d = Doek(w, h)
    for y in range(4, 13):
        inspring = abs(y - 7) // 2
        d.rect(2 + inspring, y, 28 - 2 * inspring, 1, '#8a5a34')
    d.rect(4, 6, 24, 4, '#5a3a20')
    d.rect(10, 6, 2, 4, '#8a5a34')
    d.rect(20, 6, 2, 4, '#8a5a34')
    d.lijn(6, 2, 14, 12, '#c8a070')
    return omlijn(d.img, K('#2a1a10'))


def netten():
    """Visnetten te drogen aan palen. 40x30."""
    w, h = 40, 30
    d = Doek(w, h)
    for x in (2, 36):
        d.rect(x, 2, 2, 28, '#6a4a2a')
    for y in range(4, 22, 3):
        for x in range(4, 36, 3):
            d.p(x, y, '#5a7a6a')
            d.p(x + 1, y + 1, '#5a7a6a')
    d.lijn(3, 3, 37, 3, '#4a3a2a')
    for (x, y) in ((10, 10), (24, 14), (16, 18)):
        d.ellips(x, y, 2.5, 2, '#e0c048')   # drijvers
    return omlijn(d.img, K('#2a2a24'))


def tonnen():
    w, h = 16, 18
    d = Doek(w, h)
    d.ellips(8, 10, 6.5, 7.5, '#8a5a34')
    d.rect(2, 5, 12, 1, '#4a4a52')
    d.rect(2, 14, 12, 1, '#4a4a52')
    d.ellips(8, 4, 6, 2, '#a87848')
    d.ellips(7, 4, 3, 1, '#c8d8e8')
    return omlijn(d.img, K(ZWART))


def poster_gezocht():
    """Paal met een gezocht-affiche (een silhouet met vlechtjes). 20x34."""
    w, h = 20, 34
    d = Doek(w, h)
    d.rect(9, 16, 2, 18, '#6a4a2a')
    d.rect(0, 0, 20, 18, '#f0e8c8')
    d.rect(1, 1, 18, 4, '#c83a3a')
    d.ellips(10, 10, 3.5, 3.5, '#5a5048')
    d.rect(5, 9, 2, 6, '#5a5048')
    d.rect(13, 9, 2, 6, '#5a5048')
    d.rect(4, 15, 12, 1, '#5a5048')
    return omlijn(d.img, K(ZWART))


# ================================================================== binnen

def boekenkast(open_=False):
    """Boekenkast tegen de achterwand. Open: geschoven, met een donkere doorgang. 32x36."""
    w, h = 32, 36
    d = Doek(w, h)
    if open_:
        d.rect(4, 4, 24, 32, '#140e0a')
        d.rect(6, 6, 20, 30, '#24180e')
        d.rect(10, 30, 12, 6, '#3a2a18')
        d.rect(24, 0, 8, 36, '#6e4628')       # kast opzij geschoven
        d.rect(25, 2, 6, 32, '#8a5a34')
        return omlijn(d.img, K(ZWART))
    d.rect(0, 0, 32, 36, '#6e4628')
    d.rect(2, 2, 28, 32, '#3a2414')
    kleuren = ['#c83a3a', '#2e6a4a', '#3a5aa8', '#d8b870', '#7a4a8a', '#e8e0cc', '#a85a2a']
    random.seed(111)
    for y in (3, 11, 19, 27):
        x = 3
        while x < 29:
            b = random.choice([2, 2, 3])
            hh = random.choice([5, 6, 7])
            d.rect(x, y + 7 - hh, b, hh, random.choice(kleuren))
            x += b
        d.rect(2, y + 7, 28, 1, '#6e4628')
    d.rect(12, 18, 3, 8, '#f0c830')   # het boek dat uitsteekt
    return omlijn(d.img, K(ZWART))


def toonbank_oud():
    """Ouderwetse toonbank met een koperen weegschaal en snoeppotten. 48x24."""
    w, h = 48, 24
    d = Doek(w, h)
    d.rect(0, 8, 48, 16, '#7a5030')
    d.rect(0, 8, 48, 3, '#a8784a')
    for x in range(4, 48, 8):
        d.rect(x, 13, 6, 9, '#6a4428')
    d.rect(4, 3, 12, 2, '#d8a840')     # weegschaal
    d.rect(9, 5, 2, 4, '#b88a30')
    d.ellips(6, 3, 3, 1.2, '#e8c050')
    for (x, c) in ((26, '#e86070'), (33, '#f0c830'), (40, '#5ac85a')):
        d.rect(x, 1, 6, 8, '#cfe8f0')
        d.rect(x + 1, 4, 4, 4, c)
        d.rect(x, 0, 6, 2, '#a8a8b0')
    return omlijn(d.img, K(ZWART))


def kast_kruidenier():
    """Kast met potten, blikken en zakken. 32x32."""
    w, h = 32, 32
    d = Doek(w, h)
    d.rect(0, 0, 32, 32, '#6e4628')
    d.rect(2, 2, 28, 28, '#3a2414')
    for y, items in ((3, ['#c83a3a', '#f0c830', '#3a8ae8', '#e8e0cc']), (13, ['#5ac85a', '#e8e0cc', '#c83a3a', '#a85a2a']),
                     (23, ['#e8e0cc', '#d8b870', '#e8e0cc', '#d8b870'])):
        for i, c in enumerate(items):
            d.rect(4 + i * 7, y, 5, 6, c)
            d.rect(4 + i * 7, y, 5, 1, '#3a3a44')
        d.rect(2, y + 6, 28, 1, '#6e4628')
    return omlijn(d.img, K(ZWART))


def broodvitrine():
    w, h = 48, 26
    d = Doek(w, h)
    d.rect(0, 10, 48, 16, '#e8e0cc')
    d.rect(0, 10, 48, 2, '#ffffff')
    d.rect(2, 2, 44, 9, '#cfe8f0')
    for (x, c) in ((6, '#c88a3a'), (15, '#e8b060'), (24, '#a86a2a'), (33, '#c88a3a'), (41, '#f0d090')):
        d.ellips(x, 8, 3.5, 2.2, c)
    d.rect(4, 15, 40, 1, '#c8c0a8')
    return omlijn(d.img, K(ZWART))


def oven():
    w, h = 32, 34
    d = Doek(w, h)
    d.rect(0, 0, 32, 34, '#9a4a36')
    for y in range(1, 34, 3):
        for x in range((y // 3 % 2) * 3, 32, 6):
            d.rect(x, y, 5, 2, '#b45e46')
    d.ellips(16, 20, 10, 8, '#2a1a10')
    d.ellips(16, 23, 7, 4, '#f08030')
    d.ellips(16, 24, 4, 2, '#f8e060')
    d.rect(6, 28, 20, 2, '#5a5a62')
    return omlijn(d.img, K(ZWART))


def vleesvitrine():
    w, h = 48, 26
    d = Doek(w, h)
    d.rect(0, 10, 48, 16, '#f4f4f0')
    d.rect(0, 10, 48, 2, '#ffffff')
    d.rect(0, 22, 48, 4, '#c83a3a')
    d.rect(2, 2, 44, 9, '#cfe8f0')
    for (x, c) in ((6, '#d86a6a'), (14, '#a83a3a'), (22, '#e88a8a'), (30, '#a83a3a'), (39, '#d86a6a')):
        d.ellips(x, 8, 3.5, 2, c)
    return omlijn(d.img, K(ZWART))


def worsten():
    """Rek met hangende worsten. 32x26."""
    w, h = 32, 26
    d = Doek(w, h)
    d.rect(0, 2, 32, 2, '#6a4a2a')
    for x in range(3, 30, 5):
        d.lijn(x, 4, x, 7, '#e8e0cc')
        d.ellips(x, 15, 2, 8, '#8a3a2a' if x % 2 else '#a8584a')
    return omlijn(d.img, K(ZWART))


def bedje():
    w, h = 32, 22
    d = Doek(w, h)
    d.rect(0, 4, 32, 14, '#6e4628')
    d.rect(2, 4, 28, 10, '#eeeade')
    d.rect(2, 9, 28, 5, '#c84a5a')
    d.rect(3, 5, 8, 4, '#f8f8f0')
    d.rect(0, 0, 3, 22, '#5a3820')
    d.rect(29, 2, 3, 20, '#5a3820')
    return omlijn(d.img, K(ZWART))


def bureautje():
    """Tafeltje met een kaarsje en een opengeslagen schriftje. 32x22."""
    w, h = 32, 22
    d = Doek(w, h)
    d.rect(1, 5, 30, 8, '#7a5030')
    d.rect(1, 5, 30, 2, '#9a6a44')
    for x in (3, 26):
        d.rect(x, 13, 3, 9, '#5a3820')
    d.rect(8, 2, 10, 4, '#f8f0e0')
    d.rect(12, 2, 1, 4, '#c8b8a0')
    d.rect(22, 0, 2, 5, '#f0e8c8')
    d.p(22, 0, '#f8c040')
    return omlijn(d.img, K(ZWART))


def smokkelwaar():
    """Kistje met Friese droge worst en suikerbrood. 16x20."""
    w, h = 16, 20
    d = Doek(w, h)
    d.rect(1, 8, 14, 12, '#a87848')
    d.rect(1, 8, 14, 2, '#c08e5a')
    for x in (3, 7, 11):
        d.ellips(x + 1, 6, 1.6, 5, '#7a2a20')
    d.ellips(8, 3, 5, 2.5, '#e8b060')
    d.rect(4, 13, 8, 2, '#3a2a1a')
    return omlijn(d.img, K(ZWART))


def objecten():
    return {
        'huis_rood': huis('rood', '#2e6a4a'),
        'huis_donker': huis('donker', '#8a2a2a'),
        'huis_geel': huis('geel', '#2e4a6a'),
        'huis_wit': huis('wit', '#2e6a4a'),
        'winkel_bakker': winkel('bakker', 'rood'),
        'winkel_slager': winkel('slager', 'geel'),
        'winkel_kruidenier': winkel('kruidenier', 'donker'),
        'winkel_klompen': winkel('klompen', 'rood'),
        'viskraam': viskraam(),
        'vissersboot': vissersboot(),
        'roeiboot': roeiboot(),
        'netten': netten(),
        'tonnen': tonnen(),
        'poster_gezocht': poster_gezocht(),
        'boekenkast': boekenkast(False),
        'boekenkast_open': boekenkast(True),
        'toonbank_oud': toonbank_oud(),
        'kast_kruidenier': kast_kruidenier(),
        'broodvitrine': broodvitrine(),
        'oven': oven(),
        'vleesvitrine': vleesvitrine(),
        'worsten': worsten(),
        'bedje': bedje(),
        'bureautje': bureautje(),
        'smokkelwaar': smokkelwaar(),
    }


# ================================================================== gevecht: een pan gloeiend hete snert

def effect_snert():
    """Pannetje snert met stoom. 24x20."""
    d = Doek(24, 20)
    d.ellips(12, 13, 10, 6, '#5a5a62')
    d.ellips(12, 11, 9, 4, '#6a8a2a')
    d.ellips(10, 10, 4, 1.5, '#8aaa3a')
    d.rect(4, 11, 3, 2, '#c86a4a')     # stukje rookworst
    d.rect(15, 10, 3, 2, '#c86a4a')
    d.rect(0, 12, 4, 2, '#3a3a42')     # steel
    for x in (8, 13, 18):
        d.lijn(x, 6, x - 1, 3, (240, 240, 240, 200))
        d.lijn(x - 1, 3, x, 0, (240, 240, 240, 150))
    return omlijn(d.img, K('#2a2a24'))


def effect_spetter():
    """Groene spetter. 32x24."""
    d = Doek(32, 24)
    random.seed(121)
    d.ellips(16, 14, 9, 6, '#6a8a2a')
    for _ in range(9):
        x, y = random.randrange(3, 29), random.randrange(3, 21)
        d.ellips(x, y, 2.5, 2, '#7a9a32')
    d.ellips(14, 12, 4, 2, '#9aba4a')
    return d.img
