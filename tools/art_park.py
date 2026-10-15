"""Het vakantiepark: de parkeerplaats (tegels, geparkeerde auto's, koffers), de auto's in vier richtingen
(ook die van de beer en de witte hatchback van Levi), de ingang met slagboom en kaartlezer, de welkomstboog,
bungalows, vlaggen en de receptie."""
import math
import random
from pixel import hexkleur, omlijn, spiegel
from art_buiten import Doek
from art_n34 import asfalt
import art_font

K = hexkleur
ZWART = '#24201c'
WIT = '#f0f0ec'
PARK_GROEN, PARK_ORANJE = '#2e8a5a', '#f0902a'


def tekstbreedte(s):
    g = art_font.alle_glyphs()
    return sum((len(g[c][0]) + 1) if c != ' ' else 4 for c in s) - 1


def gecentreerd(d, x0, b, y, s, kleur):
    d.tekst(x0 + (b - tekstbreedte(s)) // 2, y, s, kleur)


# ================================================================== tegels (buiten.png, index 53+)

def parkeer_asfalt(zaad=301):
    return asfalt(zaad).img


def parkeervak(zaad=302):
    """Asfalt met een witte lijn links: de scheiding tussen twee parkeervakken."""
    d = asfalt(zaad)
    d.rect(0, 0, 1, 16, WIT)
    return d.img


def parkeerlijn(zaad=303):
    """Asfalt met een witte lijn onderaan (de achterkant van de vakken)."""
    d = asfalt(zaad)
    d.rect(0, 14, 16, 1, WIT)
    d.rect(0, 0, 1, 16, WIT)
    return d.img


def parkeerlijn_onder(zaad=305):
    """Asfalt met alleen een witte lijn onderaan."""
    d = asfalt(zaad)
    d.rect(0, 14, 16, 1, WIT)
    return d.img


def pijl(zaad=304):
    """Witte pijl naar boven op het asfalt."""
    d = asfalt(zaad)
    d.rect(7, 6, 2, 9, WIT)
    for i in range(5):
        d.rect(8 - i, 2 + i, 2 * i, 1, WIT)
    return d.img


def tegelset_extra():
    return [
        parkeer_asfalt(),   # 53
        parkeervak(),       # 54
        parkeerlijn(),      # 55
        pijl(),             # 56
        parkeerlijn_onder(),  # 57
    ]


# ================================================================== auto's (32x32, frames: omlaag, omhoog, links, rechts)

AUTO_KLEUREN = {
    'wit': ('#f0f0f0', '#b8bcc4'),
    'rood': ('#c83a3a', '#8a2424'),
    'blauw': ('#3a6ac8', '#244a8a'),
    'zilver': ('#b8bcc4', '#7a7e88'),
    'geel': ('#e8c040', '#a8862a'),
    'zwart': ('#3a3a42', '#1e1e24'),
    'groen': ('#3a8a4a', '#245a30'),
}
RAAM, RAAM_L = '#5a7a94', '#9cc8dc'


def kenteken(d, x, y):
    """Duits kenteken: wit met een blauw EU-randje."""
    d.rect(x, y, 10, 3, WIT)
    d.rect(x, y, 2, 3, '#2a4ab0')
    d.rect(x + 3, y + 1, 6, 1, '#3a3a3a')


def auto_voor(kleur, donker, dak=None, ramen=RAAM):
    """Van voren (rijdt naar beneden)."""
    d = Doek(32, 32)
    dak = dak or kleur
    d.rect(7, 27, 4, 4, '#141418')
    d.rect(21, 27, 4, 4, '#141418')
    d.rect(6, 17, 20, 11, kleur)          # motorkap en bumper
    d.rect(6, 26, 20, 2, donker)
    d.rect(8, 9, 16, 9, dak)              # cabine
    d.rect(9, 11, 14, 6, ramen)           # voorruit
    d.rect(9, 11, 14, 2, RAAM_L)
    d.rect(8, 17, 16, 1, donker)
    d.rect(7, 20, 4, 2, '#f8f0a0')        # koplampen
    d.rect(21, 20, 4, 2, '#f8f0a0')
    d.rect(12, 21, 8, 2, '#2a2a30')       # grille
    kenteken(d, 11, 24)
    d.rect(4, 14, 3, 2, donker)           # spiegels
    d.rect(25, 14, 3, 2, donker)
    return omlijn(d.img, K('#141418'))


def auto_achter(kleur, donker, dak=None, ramen=RAAM):
    """Van achteren (rijdt naar boven)."""
    d = Doek(32, 32)
    dak = dak or kleur
    d.rect(7, 27, 4, 4, '#141418')
    d.rect(21, 27, 4, 4, '#141418')
    d.rect(6, 16, 20, 12, kleur)
    d.rect(6, 26, 20, 2, donker)
    d.rect(8, 8, 16, 9, dak)
    d.rect(9, 10, 14, 6, ramen)           # achterruit
    d.rect(9, 10, 14, 1, RAAM_L)
    d.rect(7, 19, 4, 3, '#e84848')        # achterlichten
    d.rect(21, 19, 4, 3, '#e84848')
    kenteken(d, 11, 22)
    d.rect(4, 13, 3, 2, donker)
    d.rect(25, 13, 3, 2, donker)
    return omlijn(d.img, K('#141418'))


def wiel(d, cx, cy, r=3, velg='#c8c8d0'):
    d.ellips(cx, cy, r + 0.5, r + 0.5, '#141418')
    d.ellips(cx, cy, r * 0.55, r * 0.55, velg)


def auto_zij(kleur, donker, dak=None, ramen=RAAM, velg='#c8c8d0'):
    """Van opzij, rijdend naar rechts."""
    d = Doek(32, 32)
    dak = dak or kleur
    d.rect(1, 18, 30, 8, kleur)
    d.rect(1, 25, 30, 1, donker)
    d.rect(7, 11, 17, 8, dak)
    d.lijn(24, 11, 28, 18, dak)
    d.lijn(23, 12, 27, 18, dak)
    d.rect(8, 12, 7, 6, ramen)
    d.rect(16, 12, 7, 6, ramen)
    d.lijn(23, 13, 25, 17, ramen)
    d.rect(8, 12, 7, 1, RAAM_L)
    d.rect(16, 12, 7, 1, RAAM_L)
    d.rect(15, 12, 1, 7, dak)
    d.rect(29, 19, 2, 2, '#f8f0a0')       # koplamp
    d.rect(1, 19, 2, 2, '#e84848')        # achterlicht
    d.rect(14, 20, 3, 1, donker)          # portiergreep
    wiel(d, 8, 26, 3, velg)
    wiel(d, 24, 26, 3, velg)
    return omlijn(d.img, K('#141418'))


def auto(kleur):
    k, dk = AUTO_KLEUREN[kleur]
    zij = auto_zij(k, dk)
    return [auto_voor(k, dk), auto_achter(k, dk), spiegel(zij), zij]


def auto_levi():
    """Levi's witte hatchback: zwart dak, getinte ramen en zwarte velgen (geen merklogo)."""
    k, dk = '#f4f4f4', '#b8bcc4'
    dak, ramen = '#1e1e24', '#2a3440'
    zij = auto_zij(k, dk, dak, ramen, velg='#2a2a30')
    voor = auto_voor(k, dk, dak, ramen)
    achter = auto_achter(k, dk, dak, ramen)
    return [voor, achter, spiegel(zij), zij]


def autos():
    uit = {f'auto_{n}': auto(n) for n in AUTO_KLEUREN}
    uit['auto_levi'] = auto_levi()
    return uit


# ================================================================== objecten op de parkeerplaats

def parkeerbord():
    """Blauw P-bord. 16x30."""
    d = Doek(16, 30)
    d.rect(7, 12, 2, 18, '#8a8e98')
    d.rect(1, 0, 14, 14, WIT)
    d.rect(2, 1, 12, 12, '#2a5ab0')
    d.rect(5, 3, 2, 8, WIT)
    d.rect(5, 3, 5, 1, WIT)
    d.rect(5, 7, 5, 1, WIT)
    d.rect(10, 4, 1, 3, WIT)
    return omlijn(d.img, K(ZWART))


def parkeerautomaat():
    """Parkeerautomaat. 16x28."""
    d = Doek(16, 28)
    d.rect(3, 4, 10, 22, '#3a6aa8')
    d.rect(3, 4, 10, 3, '#5a8ac8')
    d.rect(5, 8, 6, 4, '#a8d8a8')
    d.rect(5, 14, 6, 1, '#2a2a30')
    d.rect(6, 17, 4, 4, '#e8c040')
    d.rect(4, 26, 8, 2, '#4a4a52')
    d.rect(5, 1, 6, 3, '#e8e8e8')
    return omlijn(d.img, K(ZWART))


def koffers():
    """Een stapel vakantiekoffers. 18x22."""
    d = Doek(18, 22)
    d.rect(1, 10, 16, 12, '#c83a3a')
    d.rect(1, 10, 16, 1, '#e86a5a')
    d.rect(7, 8, 4, 2, '#2a2a30')
    d.rect(3, 2, 12, 8, '#3a6ac8')
    d.rect(3, 2, 12, 1, '#5a8ae8')
    d.rect(7, 0, 4, 2, '#2a2a30')
    d.rect(4, 14, 4, 3, '#f4ecd8')       # label
    d.rect(10, 4, 3, 2, '#e8c040')       # sticker
    return omlijn(d.img, K(ZWART))


# ================================================================== de ingang van het park

def kaartlezer(groen=False):
    """Paaltje met een kaartlezer en een lampje. 16x28."""
    d = Doek(16, 28)
    d.rect(4, 6, 8, 20, '#8a8e98')
    d.rect(4, 6, 8, 2, '#a8acb4')
    d.rect(5, 9, 6, 5, '#2a2a30')
    d.rect(6, 10, 4, 3, '#7ac87a' if groen else '#3a5a4a')
    d.rect(6, 16, 4, 1, '#141414')       # gleuf
    d.ellips(8, 21, 2, 2, '#4ae84a' if groen else '#e84848')
    d.rect(3, 26, 10, 2, '#4a4a52')
    return omlijn(d.img, K(ZWART))


def parkhuisje():
    """Houten slagboomhuisje van het park. 32x42, voet 2x2."""
    w, h = 32, 42
    d = Doek(w, h)
    d.rect(0, 4, 32, 6, PARK_GROEN)
    d.rect(0, 4, 32, 1, '#4aaa7a')
    d.rect(2, 10, 28, 32, '#b07a48')
    for y in range(12, 42, 3):
        d.rect(2, y, 28, 1, '#8a5a34')
    d.rect(5, 14, 22, 10, '#f0f0e8')
    d.rect(6, 15, 20, 8, RAAM_L)
    d.rect(6, 15, 20, 2, '#d0e8f0')
    d.rect(10, 28, 12, 14, '#6a4224')
    d.rect(20, 34, 1, 2, '#e0c048')
    d.rect(10, 1, 12, 4, PARK_ORANJE)
    return omlijn(d.img, K(ZWART))


def poortboog():
    """Houten welkomstboog over de weg. 128x56; de palen staan op de buitenste tegels.
    De naam van het park wordt er in het spel op geschreven."""
    w, h = 128, 56
    d = Doek(w, h)
    for x in (3, 115):
        d.rect(x, 6, 10, 50, '#7a4a2a')
        d.rect(x, 6, 2, 50, '#9a643a')
        d.rect(x + 8, 6, 2, 50, '#5a341c')
    d.rect(0, 2, w, 30, '#5a341c')
    d.rect(2, 4, w - 4, 26, '#f4ecd8')
    d.rect(2, 4, w - 4, 3, PARK_ORANJE)
    d.rect(2, 27, w - 4, 3, PARK_GROEN)
    gecentreerd(d, 2, w - 4, 7, 'WELKOM IN', '#5a341c')
    # zonnetjes op de hoeken
    for cx in (12, 116):
        d.ellips(cx, 17, 4, 4, PARK_ORANJE)
        d.ellips(cx, 17, 2.4, 2.4, '#f8d040')
    return omlijn(d.img, K(ZWART))


def receptie():
    """De receptie van het park: houten gebouw met een grote luifel en veel glas. 112x80; voet 7x2, deur op tegel 3."""
    w, h = 112, 80
    d = Doek(w, h)
    # dak
    for y in range(6, 30):
        inspring = max(0, (30 - y) // 2 - 2)
        d.rect(inspring, y, w - 2 * inspring, 1, '#3a4a42' if y % 3 else '#2a3a32')
    d.rect(0, 29, w, 3, '#1e2a24')
    # gevel
    d.rect(2, 32, w - 4, 48, '#c08a54')
    for y in range(34, 80, 4):
        d.rect(2, y, w - 4, 1, '#a07040')
    # naambord
    d.rect(30, 14, 52, 13, '#1e2a24')
    d.rect(31, 15, 50, 11, PARK_GROEN)
    gecentreerd(d, 31, 50, 16, 'RECEPTIE', '#f8f4e8')
    # ramen
    for x in (6, 26, 70, 90):
        d.rect(x, 40, 16, 22, '#f0f0e8')
        d.rect(x + 1, 41, 14, 20, RAAM_L)
        d.rect(x + 1, 41, 14, 5, '#d0e8f0')
        d.rect(x + 8, 41, 1, 20, '#f0f0e8')
    # luifel en schuifdeuren (tegel 3: x 48..63)
    d.rect(40, 34, 32, 5, PARK_ORANJE)
    d.rect(40, 38, 32, 1, '#c86a1a')
    d.rect(42, 39, 2, 41, '#8a8e98')
    d.rect(68, 39, 2, 41, '#8a8e98')
    d.rect(47, 44, 18, 36, '#3a3a42')
    d.rect(48, 45, 8, 35, '#a8d0e0')
    d.rect(57, 45, 8, 35, '#a8d0e0')
    d.rect(48, 45, 17, 4, '#d0e8f0')
    # bloembakken
    for x in (4, 88):
        d.rect(x, 72, 20, 6, '#6a4224')
        for bx in range(x + 1, x + 19, 3):
            d.p(bx, 70, PARK_ORANJE if bx % 2 else '#e84878')
            d.rect(bx, 71, 2, 1, '#3a8a3a')
    return omlijn(d.img, K(ZWART))


def bungalow(kleur='#b07a48'):
    """Vakantiebungalow met terrasje. 48x46; voet 3x2."""
    w, h = 48, 46
    d = Doek(w, h)
    for y in range(4, 22):
        inspring = max(0, (22 - y) // 2)
        d.rect(inspring, y, w - 2 * inspring, 1, '#5a4a44' if y % 3 else '#4a3a34')
    d.rect(0, 21, w, 2, '#3a2a24')
    d.rect(3, 23, 42, 19, kleur)
    for y in range(25, 42, 3):
        d.rect(3, y, 42, 1, '#8a5a34')
    d.rect(7, 26, 10, 8, '#f0f0e8')
    d.rect(8, 27, 8, 6, RAAM_L)
    d.rect(29, 26, 12, 16, '#f0f0e8')
    d.rect(30, 27, 10, 15, '#6a4224')
    d.rect(31, 28, 8, 5, RAAM_L)
    d.rect(1, 42, 46, 4, '#a8a8a0')     # terrasje
    d.rect(5, 38, 6, 4, PARK_ORANJE)    # tuinstoel
    return omlijn(d.img, K(ZWART))


def wegwijzer():
    """Wegwijzer met drie bordjes. 60x44."""
    w, h = 60, 44
    d = Doek(w, h)
    d.rect(28, 4, 3, 40, '#7a4a2a')
    for i, (tekst, links) in enumerate((('RECEPTIE', False), ('ZWEMBAD', True), ('MINIGOLF', False))):
        y = 2 + i * 12
        x0 = 4 if links else 2
        d.rect(x0, y, 52, 10, '#f4ecd8')
        d.rect(x0, y, 52, 1, '#ffffff')
        # puntje aan de kant waar het bordje naartoe wijst
        px = x0 - 1 if links else x0 + 52
        for k in range(1, 4):
            d.rect(px - (k - 1) if links else px + (k - 1), y + k, 1, 10 - 2 * k, '#f4ecd8')
        gecentreerd(d, x0, 52, y, tekst, PARK_GROEN)
    return omlijn(d.img, K(ZWART))


def parkvlag(fase=0):
    """Vlaggenmast met de vrolijke vlag van het park (oranje met een zonnetje). 32x48, twee standen."""
    w, h = 32, 48
    d = Doek(w, h)
    d.rect(3, 3, 2, 45, '#c8c8d0')
    d.rect(4, 3, 1, 45, '#8a8a94')
    d.ellips(4, 2.5, 2, 2, '#e0c048')
    d.rect(1, 45, 6, 3, '#5a5a62')
    for x in range(20):
        golf = round(math.sin((x + fase * 3) / 3.2) * 1.2) if x > 2 else 0
        for y in range(15):
            golfje = round(math.sin(x / 2.5) * 1)
            c = '#f8f4e8' if 10 + golfje <= y <= 11 + golfje else PARK_GROEN
            d.p(5 + x, 5 + y + golf, c)
    golf = round(math.sin((9 + fase * 3) / 3.2) * 1.2)
    d.ellips(14.5, 10.5 + golf, 4, 4, PARK_ORANJE)
    d.ellips(14.5, 10.5 + golf, 2.6, 2.6, '#f8d040')
    return omlijn(d.img, K('#2a2a2a'))


def slagboomkaart(fase=0):
    """De verloren slagboomkaart in het gras, met een glinstering. 16x16, twee standen."""
    d = Doek(16, 16)
    d.rect(3, 9, 10, 6, WIT)
    d.rect(3, 9, 10, 2, PARK_GROEN)
    d.rect(4, 12, 3, 2, '#e8c040')
    d.rect(9, 13, 3, 1, '#8a8a8a')
    out = omlijn(d.img, K('#2a2a2a'))
    if fase:
        px = out.load()
        for (x, y) in ((12, 2), (12, 3), (12, 4), (11, 3), (13, 3), (4, 5)):
            px[x, y] = K('#ffffff')
        px[12, 1] = K('#fff8c0')
        px[10, 3] = K('#fff8c0')
        px[14, 3] = K('#fff8c0')
        px[12, 5] = K('#fff8c0')
    return out


def remsporen():
    """Remsporen in een slinger over het asfalt. 64x40."""
    d = Doek(64, 40)
    for spoor in (0, 6):
        for t in range(60):
            x = 4 + t
            y = 30 - int(14 * math.sin(t / 19)) - spoor
            d.p(x, y, '#1e1e22')
            d.p(x, y + 1, '#2a2a30')
    return d.img


def objecten():
    return {
        'parkeerbord': parkeerbord(),
        'parkeerautomaat': parkeerautomaat(),
        'koffers': koffers(),
        'kaartlezer': kaartlezer(False),
        'kaartlezer_groen': kaartlezer(True),
        'parkhuisje': parkhuisje(),
        'poortboog': poortboog(),
        'receptie': receptie(),
        'bungalow': bungalow('#b07a48'),
        'bungalow_groen': bungalow('#6a9a6a'),
        'wegwijzer': wegwijzer(),
        'remsporen': remsporen(),
    }


def animaties():
    return {
        'parkvlag': [parkvlag(0), parkvlag(1)],
        'slagboomkaart': [slagboomkaart(0), slagboomkaart(1)],
    }


def icoon_slagboomkaart():
    d = Doek(16, 16)
    d.rect(1, 4, 14, 9, WIT)
    d.rect(1, 4, 14, 3, PARK_GROEN)
    d.rect(3, 8, 4, 3, '#e8c040')
    d.rect(9, 9, 5, 1, '#8a8a8a')
    d.rect(9, 11, 3, 1, '#8a8a8a')
    return omlijn(d.img, K('#2a2a2a'))


def iconen():
    return {'icoon_slagboomkaart': icoon_slagboomkaart()}
