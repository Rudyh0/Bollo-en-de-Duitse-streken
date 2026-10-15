"""De N34 (Hunebed Highway): wegtegels, borden, voertuigen, het tankstation, de grenspost en Rex de drugshond."""
import random
from PIL import Image
from pixel import hexkleur, omlijn, maak_palet, sprite, spiegel
from art_buiten import Doek

K = hexkleur
ZWART = '#24201c'
WIT = '#f0f0ec'


# ================================================================== wegtegels (achter de dorpstegels, index 30+)

def asfalt(zaad=81):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#4a4a50')
    for _ in range(26):
        d.p(random.randrange(16), random.randrange(16), random.choice(['#55555c', '#404046', '#5c5c64']))
    return d


def asfalt_rand_boven():
    d = asfalt(82)
    d.rect(0, 2, 16, 2, WIT)
    return d.img


def asfalt_plat():
    return asfalt(83).img


def asfalt_streep():
    d = asfalt(84)
    d.rect(0, 0, 8, 2, WIT)
    return d.img


def asfalt_rand_onder():
    d = asfalt(85)
    d.rect(0, 12, 16, 2, WIT)
    return d.img


def fietspad(zaad=86):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#a8483c')
    for _ in range(26):
        d.p(random.randrange(16), random.randrange(16), random.choice(['#b85a4a', '#94403a', '#b04e40']))
    return d.img


def vangrail():
    d = Doek(16, 16)
    for x in (3, 11):
        d.rect(x, 8, 2, 8, '#6a6e78')
        d.rect(x, 8, 1, 8, '#8a8e98')
    d.rect(0, 5, 16, 4, '#c8ccd4')
    d.rect(0, 5, 16, 1, '#eef0f4')
    d.rect(0, 8, 16, 1, '#8a8e98')
    return omlijn(d.img, K('#3a3c44'))


def afslag(kant):
    d = asfalt(87 if kant == 'links' else 88)
    if kant == 'links':
        d.rect(2, 0, 2, 16, WIT)
    else:
        d.rect(12, 0, 2, 16, WIT)
    return d.img


def stopstreep():
    d = asfalt(89)
    d.rect(0, 6, 16, 4, WIT)
    return d.img


def tegelset_extra():
    """Index 30 en verder in buiten.png."""
    return [
        asfalt_rand_boven(),   # 30
        asfalt_plat(),         # 31
        asfalt_streep(),       # 32 (onderbroken middenstreep bovenaan)
        asfalt_rand_onder(),   # 33
        fietspad(),            # 34
        vangrail(),            # 35 (boven, vast)
        afslag('links'),       # 36
        afslag('rechts'),      # 37
        stopstreep(),          # 38
    ]


# ================================================================== tankstation van binnen (achter dorp_binnen, index 20+)

def tegelvloer(zaad=91, schaduw=False):
    d = Doek(16, 16)
    for y in range(0, 16, 8):
        for x in range(0, 16, 8):
            d.rect(x, y, 8, 8, '#e4e4e0' if (x + y) % 16 == 0 else '#c8ccd0')
    d.rect(0, 0, 16, 1, '#b0b4b8')
    d.rect(0, 0, 1, 16, '#b0b4b8')
    if schaduw:
        for y in range(4):
            for x in range(16):
                r, g, b, a = d.px[x, y]
                f = 0.65 + 0.08 * y
                d.px[x, y] = (int(r * f), int(g * f), int(b * f), a)
    return d.img


def winkelmuur(onder=False, poster=False):
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#eceae4')
    if not onder:
        d.rect(0, 10, 16, 3, '#c83a3a')
        d.rect(0, 13, 16, 1, '#f0c830')
    else:
        d.rect(0, 13, 16, 3, '#8a8e98')
        if poster:
            d.rect(2, 0, 12, 11, '#f8e060')
            d.rect(3, 1, 10, 3, '#c83a3a')
            d.ellips(8, 7.5, 3.5, 2, '#c88a3a')     # kroket
            d.rect(5, 7, 6, 1, '#a86a2a')
    return d.img


def schuifdeur():
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#1e1610')
    d.rect(1, 0, 14, 16, '#9cc8dc')
    d.rect(1, 0, 14, 3, '#c8e4f0')
    d.rect(7, 0, 2, 16, '#6a6e78')
    d.rect(2, 12, 12, 4, '#4a4a52')
    return d.img


def binnen_extra():
    return [
        tegelvloer(91),                    # 20
        tegelvloer(92),                    # 21
        tegelvloer(93, schaduw=True),      # 22
        winkelmuur(False),                 # 23
        winkelmuur(True),                  # 24
        winkelmuur(True, poster=True),     # 25
        schuifdeur(),                      # 26
    ]


# ================================================================== borden en spullen langs de weg

def bord_hunebedhighway():
    """Bruin toeristisch bord. 48x44."""
    w, h = 48, 44
    d = Doek(w, h)
    for x in (8, 38):
        d.rect(x, 22, 3, 22, '#8a8e98')
        d.rect(x, 22, 1, 22, '#b0b4bc')
    d.rect(0, 0, 48, 25, '#f4f0e8')
    d.rect(1, 1, 46, 23, '#7a4422')
    d.tekst(4, 1, 'HUNEBED', '#f4f0e8')
    d.tekst(4, 12, 'HIGHWAY', '#f4f0e8')
    return omlijn(d.img, K(ZWART))


def bord_n34():
    """Geel N-wegschild. 24x32."""
    w, h = 24, 32
    d = Doek(w, h)
    d.rect(11, 12, 2, 20, '#8a8e98')
    d.rect(1, 0, 22, 13, '#1a1a1e')
    d.rect(2, 1, 20, 11, '#f0c820')
    d.tekst(3, 1, 'N34', '#1a1a1e')
    return omlijn(d.img, K(ZWART))


def bord_afslag(tekst='WEZUP'):
    """Blauw wegwijsbord met een pijl naar boven. 64x40."""
    w, h = 64, 40
    d = Doek(w, h)
    for x in (10, 52):
        d.rect(x, 20, 3, 20, '#8a8e98')
    d.rect(0, 0, 64, 22, '#f4f4f4')
    d.rect(1, 1, 62, 20, '#2a5aa8')
    # pijl
    d.rect(7, 7, 3, 11, '#f4f4f4')
    for i in range(5):
        d.rect(8 - i, 3 + i, 1 + 2 * i, 1, '#f4f4f4')
    d.tekst(16, 5, tekst, '#f4f4f4')
    return omlijn(d.img, K(ZWART))


def krat(open_=False):
    """Houten kistje dat uit de vrachtwagen valt. 16x16."""
    d = Doek(16, 16)
    hout, houtD, houtL = '#b8905a', '#8a6a3a', '#d4ac74'
    if open_:
        d.rect(1, 5, 14, 10, hout)
        d.rect(2, 6, 12, 4, '#3a2a18')
        for x in (3, 6, 9, 12):
            d.rect(x, 7, 2, 2, '#e0c870')       # stro
        d.rect(1, 9, 14, 1, houtD)
        d.lijn(0, 4, 6, 0, houtL)               # deksel ernaast
        d.lijn(1, 4, 7, 0, houtD)
    else:
        d.rect(1, 3, 14, 12, hout)
        d.rect(1, 3, 14, 2, houtL)
        for y in (7, 11):
            d.rect(1, y, 14, 1, houtD)
        d.rect(4, 8, 8, 2, '#2a2a2a')           # stempel
        d.p(5, 8, hout)
        d.p(9, 9, hout)
    return omlijn(d.img, K('#3a2414'))


def dranghek():
    w, h = 32, 18
    d = Doek(w, h)
    d.rect(1, 2, 30, 2, '#c8ccd4')
    d.rect(1, 13, 30, 2, '#c8ccd4')
    for x in range(2, 31, 4):
        d.rect(x, 2, 1, 12, '#a8acb4')
    for x in (1, 29):
        d.rect(x, 2, 2, 13, '#8a8e98')
        d.rect(x - 1, 15, 4, 2, '#6a6e78')
    return omlijn(d.img, K('#3a3c44'))


def pion():
    d = Doek(16, 16)
    for y in range(3, 14):
        b = 1 + (y - 3) // 2
        d.rect(8 - b, y, 2 * b, 1, '#f07020' if not (6 <= y <= 8) else '#f4f4f4')
    d.rect(2, 13, 12, 2, '#f07020')
    return omlijn(d.img, K('#3a2414'))


def tankstation():
    """Tankstation 'TANK & TOSTI': winkel links, overkapping met twee pompen rechts. 144x72."""
    w, h = 144, 72
    d = Doek(w, h)
    # winkel
    d.rect(0, 24, 64, 48, '#eceae4')
    d.rect(0, 22, 64, 8, '#c83a3a')
    d.rect(0, 30, 64, 2, '#f0c830')
    d.tekst(18, 21, 'SHOP', '#f4f4f4')
    for x in (4, 50):
        d.rect(x, 38, 12, 18, '#5a6a7a')
        d.rect(x + 1, 39, 10, 16, '#9cc8dc')
        d.rect(x + 1, 39, 10, 5, '#c8e4f0')
    # schuifdeur (tegel 2)
    d.rect(32, 42, 16, 30, '#5a6a7a')
    d.rect(33, 43, 14, 29, '#9cc8dc')
    d.rect(39, 43, 2, 29, '#6a6e78')
    d.rect(33, 43, 14, 5, '#c8e4f0')
    d.rect(0, 68, 64, 4, '#9a9ea8')
    # overkapping
    d.rect(64, 4, 80, 14, '#c83a3a')
    d.rect(64, 4, 80, 2, '#e85a50')
    d.rect(64, 16, 80, 3, '#f0c830')
    d.tekst(70, 5, 'TANK & TOSTI', '#f4f4f4')
    for x in (70, 136):
        d.rect(x, 19, 4, 53, '#c8ccd4')
        d.rect(x, 19, 1, 53, '#eef0f4')
    # pompen
    for x in (84, 112):
        d.rect(x, 44, 12, 26, '#e8e8ec')
        d.rect(x, 44, 12, 5, '#c83a3a')
        d.rect(x + 2, 51, 8, 5, '#2a3a2a')
        d.rect(x + 3, 52, 6, 3, '#7ae87a')
        d.rect(x + 11, 56, 3, 2, '#2a2a30')
        d.lijn(x + 13, 57, x + 15, 66, '#2a2a30')
        d.rect(x - 2, 68, 16, 4, '#9a9ea8')
    return omlijn(d.img, K(ZWART))


# ================================================================== spullen in het tankstation

def schap():
    """Schap met chips, drop en blikjes. 32x30."""
    w, h = 32, 30
    d = Doek(w, h)
    d.rect(0, 0, 32, 30, '#8a8e98')
    d.rect(1, 1, 30, 28, '#d8dce0')
    kleuren = ['#e84848', '#f0c830', '#3a8ae8', '#5ac85a', '#e870b0', '#f08830', '#8a4ac8']
    random.seed(95)
    for y in (2, 11, 20):
        d.rect(1, y + 7, 30, 2, '#8a8e98')
        x = 2
        while x < 29:
            b = random.choice([3, 4, 5])
            hh = random.choice([5, 6, 7])
            d.rect(x, y + 7 - hh, min(b, 30 - x), hh, random.choice(kleuren))
            x += b + 1
    return omlijn(d.img, K(ZWART))


def koelkast():
    w, h = 16, 34
    random.seed(97)
    d = Doek(w, h)
    d.rect(0, 0, 16, 34, '#e8e8ec')
    d.rect(1, 3, 14, 29, '#2a3a4a')
    d.rect(1, 0, 14, 3, '#3a8ae8')
    for y in (6, 13, 20, 27):
        for x in range(2, 14, 3):
            d.rect(x, y, 2, 5, random.choice(['#e84848', '#f0c830', '#5ac85a', '#f4f4f4']))
        d.rect(1, y + 5, 14, 1, '#8a8e98')
    d.rect(12, 14, 1, 6, '#c8ccd4')
    return omlijn(d.img, K(ZWART))


def koffieautomaat():
    w, h = 16, 30
    d = Doek(w, h)
    d.rect(1, 0, 14, 30, '#2a2a30')
    d.rect(2, 2, 12, 6, '#c83a3a')
    d.rect(3, 10, 10, 4, '#7ac8a0')
    d.rect(4, 18, 8, 8, '#141418')
    d.rect(6, 21, 4, 4, '#f4f4f4')
    return omlijn(d.img, K(ZWART))


def kassabalie():
    """Toonbank met kassa, krasloten en een bakje kroketten. 48x24."""
    w, h = 48, 24
    d = Doek(w, h)
    d.rect(0, 8, 48, 16, '#c83a3a')
    d.rect(0, 8, 48, 3, '#e8e8ec')
    d.rect(4, 0, 12, 9, '#3a3a44')
    d.rect(5, 1, 10, 3, '#7ac8a0')
    d.rect(20, 3, 10, 6, '#f8f0c0')       # warmhoudvitrine
    d.ellips(23, 7, 2, 1.2, '#c88a3a')
    d.ellips(27, 7, 2, 1.2, '#c88a3a')
    d.rect(34, 2, 10, 7, '#f0c830')       # krasloten
    d.rect(36, 3, 6, 1, '#c83a3a')
    return omlijn(d.img, K(ZWART))


def objecten():
    return {
        'bord_hunebedhighway': bord_hunebedhighway(),
        'bord_n34': bord_n34(),
        'bord_afslag': bord_afslag('WEZUP'),
        'krat': krat(False),
        'krat_open': krat(True),
        'dranghek': dranghek(),
        'pion': pion(),
        'tankstation': tankstation(),
        'schap': schap(),
        'koelkast': koelkast(),
        'koffieautomaat': koffieautomaat(),
        'kassabalie': kassabalie(),
    }


# ================================================================== voertuigen (van opzij, rijden naar rechts)

def wiel(d, cx, cy, r=3):
    d.ellips(cx, cy, r + 0.5, r + 0.5, '#141418')
    d.ellips(cx, cy, r - 1.2, r - 1.2, '#8a8e98')


def auto(kleur, donker):
    w, h = 32, 16
    d = Doek(w, h)
    d.rect(1, 7, 30, 6, kleur)
    d.rect(1, 12, 30, 1, donker)
    d.rect(7, 2, 16, 6, kleur)
    d.rect(8, 3, 6, 4, '#9cc8dc')
    d.rect(15, 3, 7, 4, '#9cc8dc')
    d.rect(14, 3, 1, 4, kleur)
    d.lijn(23, 2, 27, 7, kleur)
    d.lijn(22, 3, 25, 7, '#9cc8dc')
    d.rect(29, 8, 2, 2, '#f8f0a0')       # koplamp
    d.rect(1, 8, 2, 2, '#e84848')        # achterlicht
    wiel(d, 8, 13)
    wiel(d, 24, 13)
    return omlijn(d.img, K('#141418'))


def auto_met_caravan():
    """Duitse toerist met caravan. 72x20."""
    w, h = 72, 20
    d = Doek(w, h)
    # caravan (achteraan, links)
    d.rect(1, 2, 34, 14, '#f4f4f0')
    d.rect(1, 9, 34, 2, '#3a8ae8')
    d.rect(6, 4, 10, 5, '#9cc8dc')
    d.rect(22, 4, 6, 9, '#c8ccd0')
    d.rect(35, 13, 6, 1, '#3a3a44')
    wiel(d, 18, 17)
    # auto (rechts)
    a = auto('#e8e8e8', '#a8acb4')
    img = d.img
    img.paste(a, (40, 4), a)
    return omlijn(img, K('#141418'))


def legerjeep():
    w, h = 32, 18
    d = Doek(w, h)
    groen, groenD = '#5a6a3a', '#3e4a28'
    d.rect(1, 8, 30, 6, groen)
    d.rect(1, 13, 30, 1, groenD)
    d.rect(20, 3, 2, 6, '#3a3a44')          # voorruit
    d.rect(21, 3, 1, 5, '#9cc8dc')
    d.rect(4, 6, 12, 2, groenD)             # zitjes
    d.ellips(3, 10, 2, 3, '#2a2a2e')       # reservewiel
    d.rect(10, 9, 6, 3, '#f4f4f0')         # nummer
    d.p(11, 10, groen)
    d.p(14, 10, groen)
    wiel(d, 8, 14)
    wiel(d, 25, 14)
    return omlijn(d.img, K('#141418'))


def legertruck(kisten=False):
    """Legervrachtwagen; met kisten = de open laadbak met kistjes (voor het script). 56x26."""
    w, h = 56, 26
    d = Doek(w, h)
    groen, groenD, zeil = '#5a6a3a', '#3e4a28', '#7a8458'
    # cabine rechts
    d.rect(40, 6, 15, 14, groen)
    d.rect(43, 8, 8, 5, '#9cc8dc')
    d.rect(52, 14, 3, 2, '#f8f0a0')
    # laadbak
    d.rect(1, 15, 38, 5, groenD)
    if kisten:
        for (x, y) in ((3, 6), (13, 6), (23, 6), (8, 0), (18, 0)):
            k = krat(False)
            d.img.paste(k.crop((1, 3, 15, 15)), (x, y + 3), k.crop((1, 3, 15, 15)))
        d.px = d.img.load()
    else:
        d.rect(1, 2, 38, 14, zeil)
        for x in range(4, 38, 8):
            d.rect(x, 2, 1, 14, groenD)
        d.rect(1, 2, 38, 2, '#8a9468')
    d.rect(1, 19, 54, 2, '#2a2a2e')
    wiel(d, 9, 21)
    wiel(d, 20, 21)
    wiel(d, 46, 21)
    return omlijn(d.img, K('#141418'))


def pantserwagen():
    w, h = 48, 22
    d = Doek(w, h)
    grijs, grijsD, grijsL = '#6a7060', '#4a5042', '#868c7a'
    d.rect(2, 8, 44, 9, grijs)
    d.lijn(36, 8, 46, 14, grijs)
    for y in range(8, 15):
        d.rect(38 + (y - 8) * 1, y, 8 - (y - 8), 1, grijs)
    d.rect(2, 8, 44, 1, grijsL)
    d.rect(14, 3, 14, 6, grijsD)            # torentje
    d.rect(28, 5, 12, 2, '#3a3e34')         # loop
    d.rect(6, 11, 4, 3, '#2a2e26')
    for x in (9, 19, 29, 39):
        wiel(d, x, 18)
    return omlijn(d.img, K('#141418'))


def voertuigen():
    return {
        'voertuig_auto_rood': auto('#c83a3a', '#8a2626'),
        'voertuig_auto_blauw': auto('#3a6ac8', '#2a4a8a'),
        'voertuig_auto_zilver': auto('#b8bcc4', '#7a7e88'),
        'voertuig_auto_geel': auto('#e8c030', '#a88a20'),
        'voertuig_caravan': auto_met_caravan(),
        'voertuig_jeep': legerjeep(),
        'voertuig_truck': legertruck(False),
        'voertuig_truck_kisten': legertruck(True),
        'voertuig_pantser': pantserwagen(),
    }


# ================================================================== Rex de drugshond

REX_PALET = maak_palet({
    'k': '#1e1610', 'b': '#b07a40', 'B': '#8a5a2a', 'z': '#2a2420', 'e': '#141010', 'n': '#000000',
    't': '#e86070', 'w': '#f4f4f4', 'r': '#c83a3a',
})
REX = {
    'omlaag': [
        "................",
        "................",
        "................",
        "...kk......kk...",
        "..kzzk....kzzk..",
        "..kzbbkkkkbbzk..",
        "...kbbbbbbbbk...",
        "...kbebbbbebk...",
        "...kbbBnnBbbk...",
        "....kbBnnBbk....",
        "....kkbttbkk....",
        "...krrrrrrrrk...",
        "..kzzzzzzzzzzk..",
        "..kbzzzzzzzzbk..",
        "..kbbzzzzzzbbk..",
        "..kbbbbbbbbbbk..",
        "...kbBkkkkBbk...",
        "...kbBk..kBbk...",
        "...kkkk..kkkk...",
        "................",
    ],
    'omhoog': [
        "................",
        "................",
        "................",
        "...kk......kk...",
        "..kzzk....kzzk..",
        "..kzbbkkkkbbzk..",
        "...kbbbbbbbbk...",
        "...kbbbbbbbbk...",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        "....kkbbbbkk....",
        "...krrrrrrrrk...",
        "..kzzzzzzzzzzk..",
        "..kbzzzzzzzzbk..",
        "..kbbzzzzzzbbk..",
        "..kbbbbbbbbbbk..",
        "...kbBkzzkBbk...",
        "...kbBkzzkBbk...",
        "...kkkk.kkkkk...",
        "................",
    ],
    'links': [
        "................",
        "................",
        "................",
        "....kk..........",
        "...kzzk.........",
        "..kzbbkk........",
        ".kbbbbbbk.......",
        "kbebbbbbk.......",
        "knnBbbbbkkkkkk..",
        "kkbBbbrkzzzzzzkk",
        ".kkkbbrzzzzzzzbk",
        "...kbbrzzzzzzbbk",
        "...kbbzzzzzzzbk.",
        "...kbbbbbbbbbbk.",
        "...kbbbbbbbbbk..",
        "...kbBk.kbBk....",
        "...kbBk.kbBk....",
        "...kbBk.kbBk....",
        "...kkkk.kkkk....",
        "................",
    ],
}


def rex():
    omlaag = sprite(REX['omlaag'], REX_PALET, 16, 20, 'rex-omlaag')
    omhoog = sprite(REX['omhoog'], REX_PALET, 16, 20, 'rex-omhoog')
    links = sprite(REX['links'], REX_PALET, 16, 20, 'rex-links')
    return [omlaag, omhoog, links, spiegel(links)]


# ================================================================== iconen en gevechtsachtergronden

def icoon_dagboek():
    d = Doek(16, 16)
    d.rect(3, 1, 11, 14, '#c83a5a')
    d.rect(3, 1, 2, 14, '#8a2640')
    d.rect(5, 2, 8, 12, '#d8486a')
    d.rect(6, 5, 6, 3, '#f8f0e0')
    d.rect(7, 6, 4, 1, '#8a2640')
    d.rect(12, 8, 3, 3, '#e0c048')
    d.rect(13, 1, 1, 14, '#f0e8d8')
    return omlijn(d.img, K('#3a1420'))


def gevecht_weg():
    """Gevechtsachtergrond langs de N34: bomenrij, bord, vangrail en asfalt."""
    random.seed(17)
    w, h = 240, 112
    img = Image.new('RGBA', (w, h), K('#000000'))
    d = Doek(w, h)
    d.img = img
    d.px = img.load()
    for i, c in enumerate(['#78b8e8', '#88c4ec', '#98ccee', '#a8d6f0', '#b8def2']):
        d.rect(0, i * 8, w, 8, c)
    for (cx, cy, r) in ((30, 10, 8), (150, 14, 9), (164, 12, 6)):
        d.ellips(cx, cy, r, r * 0.6, '#f4f8fc')
    d.rect(0, 30, w, 20, '#6aa858')
    for x in range(-6, w + 6, 12):
        d.ellips(x, 30, 9, 11, '#2e6a32' if (x // 12) % 2 else '#3e7a3e')
    # bruin bord in de verte
    d.rect(186, 16, 2, 22, '#8a8e98')
    d.rect(210, 16, 2, 22, '#8a8e98')
    d.rect(178, 10, 42, 14, '#f4f0e8')
    d.rect(179, 11, 40, 12, '#7a4422')
    d.rect(182, 14, 34, 2, '#f4f0e8')
    d.rect(182, 18, 28, 2, '#f4f0e8')
    # vangrail
    d.rect(0, 44, w, 4, '#c8ccd4')
    d.rect(0, 44, w, 1, '#eef0f4')
    for x in range(4, w, 20):
        d.rect(x, 47, 2, 6, '#6a6e78')
    # asfalt
    for i, c in enumerate(['#4a4a50', '#505058', '#56565e', '#5c5c64']):
        d.rect(0, 53 + i * 15, w, 15, c)
    for _ in range(500):
        d.p(random.randrange(w), random.randrange(53, h), random.choice(['#44444a', '#626268']))
    for x in range(0, w, 24):
        d.rect(x, 82, 12, 2, WIT)
    d.rect(0, 56, w, 2, WIT)
    # podia
    d.ellips(176, 80, 46, 11, '#3a3a40')
    d.ellips(176, 78, 44, 10, '#6a6a72')
    d.ellips(170, 77, 30, 5, '#7a7a82')
    d.ellips(62, 112, 60, 14, '#3a3a40')
    d.ellips(62, 110, 58, 13, '#6a6a72')
    d.ellips(56, 108, 38, 6, '#7a7a82')
    return img


def gevecht_winkel():
    """Gevechtsachtergrond in de winkel van het tankstation."""
    random.seed(19)
    w, h = 240, 112
    img = Image.new('RGBA', (w, h), K('#000000'))
    d = Doek(w, h)
    d.img = img
    d.px = img.load()
    d.rect(0, 0, w, 54, '#eceae4')
    for x in range(10, w, 60):
        d.rect(x, 3, 34, 3, '#f8f8f0')            # tl-buizen
    d.rect(0, 36, w, 4, '#c83a3a')
    kleuren = ['#e84848', '#f0c830', '#3a8ae8', '#5ac85a', '#e870b0', '#f08830']
    for x0 in range(4, w, 48):
        d.rect(x0, 10, 40, 30, '#8a8e98')
        d.rect(x0 + 1, 11, 38, 28, '#d8dce0')
        for y in (12, 21, 30):
            d.rect(x0 + 1, y + 7, 38, 2, '#8a8e98')
            x = x0 + 2
            while x < x0 + 37:
                b = random.choice([3, 4, 5])
                hh = random.choice([4, 5, 6])
                d.rect(x, y + 7 - hh, b, hh, random.choice(kleuren))
                x += b + 1
    for y in range(54, h, 8):
        for x in range(0, w, 8):
            d.rect(x, y, 8, 8, '#e4e4e0' if ((x + y) // 8) % 2 else '#c8ccd0')
    d.ellips(176, 80, 46, 11, '#9a9ea4')
    d.ellips(176, 78, 44, 10, '#d8dce0')
    d.ellips(62, 112, 60, 14, '#9a9ea4')
    d.ellips(62, 110, 58, 13, '#d8dce0')
    return img
