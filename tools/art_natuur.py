"""Het Drentse natuurgebied: landweg met trekkers en koeien, de Drentse Blue Lagoon en een recreatiestrandje."""
import random
from PIL import Image
from pixel import hexkleur, omlijn, maak_palet, sprite, spiegel
from art_buiten import Doek

K = hexkleur
ZWART = '#24201c'


# ================================================================== tegels (buiten.png, index 45+)

def blauw_water(zaad=131, rand=None):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#2aa8c8')
    for y in range(0, 16, 4):
        for x in range(16):
            if (x + y // 2) % 6 == 0:
                d.rect(x, y + 1, 3, 1, '#6ad8e8')
    for _ in range(5):
        d.p(random.randrange(16), random.randrange(16), '#1e8aa8')
    if rand == 'boven':
        d.rect(0, 0, 16, 4, '#ece6d4')
        d.rect(0, 4, 16, 1, '#bfe8f0')
        for x in range(0, 16, 3):
            d.p(x, 4, '#ffffff')
    elif rand == 'onder':
        d.rect(0, 12, 16, 4, '#ece6d4')
        d.rect(0, 11, 16, 1, '#bfe8f0')
        for x in range(1, 16, 3):
            d.p(x, 11, '#ffffff')
    return d.img


def wit_zand(zaad=133):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#ece6d4')
    for _ in range(22):
        d.p(random.randrange(16), random.randrange(16), random.choice(['#f8f4e8', '#d8d0bc', '#e0d8c4']))
    return d.img


def strandzand(zaad=135):
    random.seed(zaad)
    d = Doek(16, 16)
    d.rect(0, 0, 16, 16, '#ecd49a')
    for _ in range(24):
        d.p(random.randrange(16), random.randrange(16), random.choice(['#f8e4b0', '#d8bc84', '#e4c890']))
    for _ in range(2):
        x, y = random.randrange(14), random.randrange(15)
        d.rect(x, y, 2, 1, '#c8a870')
    return d.img


def boerenhek():
    """Houten hek met twee planken, als bovenlaag."""
    d = Doek(16, 16)
    for x in (1, 9):
        d.rect(x, 3, 3, 13, '#7a5a3a')
        d.rect(x, 3, 1, 13, '#9a7a52')
    d.rect(0, 6, 16, 2, '#9a7a52')
    d.rect(0, 11, 16, 2, '#9a7a52')
    d.rect(0, 8, 16, 1, '#5a4028')
    d.rect(0, 13, 16, 1, '#5a4028')
    return omlijn(d.img, K('#3a2a1a'))


def tegelset_extra():
    return [
        blauw_water(131),            # 45 (vast)
        blauw_water(132, 'boven'),   # 46 (vast)
        blauw_water(134, 'onder'),   # 47 (vast)
        wit_zand(133),               # 48
        wit_zand(136),               # 49
        strandzand(135),             # 50
        strandzand(137),             # 51
        boerenhek(),                 # 52 (boven, vast)
    ]


# ================================================================== voertuigen (van opzij, rijden naar rechts)

def wiel(d, cx, cy, r, band='#141418', velg='#e0c040'):
    d.ellips(cx, cy, r + 0.5, r + 0.5, band)
    d.ellips(cx, cy, r * 0.55, r * 0.55, velg)
    d.ellips(cx, cy, r * 0.2, r * 0.2, '#3a3a3a')


def trekker(kleur, donker):
    """Trekker van opzij: groot achterwiel, klein voorwiel, cabine. 40x28."""
    w, h = 40, 28
    d = Doek(w, h)
    # motorkap (voor, rechts)
    d.rect(18, 12, 20, 8, kleur)
    d.rect(18, 12, 20, 2, donker)
    d.rect(36, 13, 2, 6, '#3a3a40')          # grille
    d.rect(30, 6, 2, 7, '#3a3a40')           # uitlaat
    # cabine
    d.rect(4, 2, 16, 18, kleur)
    d.rect(6, 4, 12, 9, '#9cc8dc')
    d.rect(6, 4, 12, 2, '#c8e4f0')
    d.rect(3, 1, 18, 2, donker)
    wiel(d, 10, 20, 7.5)
    wiel(d, 32, 23, 4.5)
    return omlijn(d.img, K('#141418'))


def trekker_met_hooikar():
    """Trekker met een kar vol hooi. 80x30."""
    w, h = 80, 30
    d = Doek(w, h)
    # kar (links)
    d.rect(2, 18, 40, 4, '#8a5a34')
    d.rect(4, 4, 36, 14, '#d8c070')
    for x in range(5, 40, 4):
        d.rect(x, 4, 1, 14, '#b8a050')
    d.ellips(22, 4, 18, 4, '#e0cc80')
    wiel(d, 10, 24, 4.5, velg='#c8c8c8')
    wiel(d, 34, 24, 4.5, velg='#c8c8c8')
    d.rect(42, 20, 4, 2, '#3a3a40')
    t = trekker('#c83a3a', '#8a2626')
    img = d.img
    img.paste(t, (40, 2), t)
    return omlijn(img, K('#141418'))


def voertuigen():
    return {
        'voertuig_trekker_rood': trekker('#c83a3a', '#8a2626'),
        'voertuig_trekker_groen': trekker('#3a8a3a', '#26602a'),
        'voertuig_trekker_blauw': trekker('#3a6ac8', '#2a4a8a'),
        'voertuig_hooikar': trekker_met_hooikar(),
    }


# ================================================================== objecten

def hooibaal():
    """Ronde, in wit plastic gewikkelde hooibaal ("marshmallow"). 24x20."""
    w, h = 24, 20
    d = Doek(w, h)
    d.ellips(12, 11, 11, 8.5, '#f0f0ec')
    d.ellips(9, 8, 5, 3, '#ffffff')
    d.ellips(16, 14, 6, 3, '#d8d8d4')
    d.rect(4, 9, 16, 1, '#c8c8c4')
    return omlijn(d.img, K('#5a5a58'))


def melkbussen():
    w, h = 16, 20
    d = Doek(w, h)
    for (x, y) in ((2, 6), (8, 4)):
        d.rect(x, y + 3, 6, 11, '#c8ccd4')
        d.rect(x, y + 3, 2, 11, '#e8ecf0')
        d.rect(x + 1, y, 4, 4, '#a8acb4')
        d.rect(x, y, 6, 1, '#8a8e98')
    return omlijn(d.img, K(ZWART))


def parasol(kleur1='#e84848', kleur2='#f4f4f0'):
    """Parasol in het zand. 32x40."""
    w, h = 32, 40
    d = Doek(w, h)
    d.rect(15, 10, 2, 30, '#c8c8c8')
    for y in range(2, 14):
        half = int(4 + (y - 2) * 1.2)
        for x in range(16 - half, 16 + half):
            d.p(x, y, kleur1 if ((x - 16) // 4) % 2 else kleur2)
    d.rect(14, 0, 4, 3, '#e0e0e0')
    return omlijn(d.img, K(ZWART))


def bbq():
    w, h = 16, 22
    d = Doek(w, h)
    d.ellips(8, 8, 7, 4, '#2a2a30')
    d.rect(2, 6, 12, 2, '#5a5a62')
    for (x, c) in ((4, '#a85a3a'), (8, '#c86a4a'), (11, '#a85a3a')):
        d.rect(x, 5, 2, 2, c)           # worstjes
    d.lijn(4, 11, 2, 21, '#3a3a42')
    d.lijn(12, 11, 14, 21, '#3a3a42')
    d.lijn(8, 11, 8, 20, '#3a3a42')
    d.lijn(5, 4, 4, 0, (220, 220, 220, 160))
    d.lijn(10, 4, 11, 0, (220, 220, 220, 160))
    return omlijn(d.img, K(ZWART))


def koelbox():
    w, h = 16, 14
    d = Doek(w, h)
    d.rect(1, 4, 14, 10, '#3a6ac8')
    d.rect(1, 2, 14, 3, '#f4f4f4')
    d.rect(5, 0, 6, 2, '#f4f4f4')
    d.rect(3, 7, 10, 1, '#2a4a8a')
    return omlijn(d.img, K(ZWART))


def flamingo():
    """Opblaasflamingo op het water. 24x26."""
    w, h = 24, 26
    d = Doek(w, h)
    d.ellips(12, 20, 10, 5, '#f088b0')
    d.ellips(12, 19, 6, 2.5, '#2aa8c8')
    d.rect(17, 6, 3, 13, '#f088b0')
    d.ellips(18, 5, 3, 3, '#f088b0')
    d.rect(20, 5, 3, 2, '#2a2a2a')
    d.p(18, 4, '#141414')
    return omlijn(d.img, K('#8a3a5a'))


def visbord():
    w, h = 16, 26
    d = Doek(w, h)
    d.rect(7, 12, 2, 14, '#6a4a2a')
    d.rect(0, 0, 16, 13, '#f0e8c8')
    d.rect(1, 1, 14, 11, '#3a8ac8')
    d.ellips(7, 6, 4, 2.5, '#f0e8c8')
    d.lijn(11, 6, 13, 4, '#f0e8c8')
    d.lijn(11, 6, 13, 8, '#f0e8c8')
    d.p(5, 5, '#3a8ac8')
    return omlijn(d.img, K(ZWART))


def strandstoel(kleur='#3a8ac8'):
    w, h = 16, 20
    d = Doek(w, h)
    for y in range(3, 14):
        d.rect(3 + (y - 3) // 3, y, 9, 1, kleur if y % 2 else '#f4f4f4')
    d.lijn(3, 3, 1, 19, '#a87848')
    d.lijn(13, 8, 14, 19, '#a87848')
    d.lijn(5, 14, 12, 14, '#a87848')
    return omlijn(d.img, K(ZWART))


def handdoek(kleur='#e84848'):
    w, h = 16, 24
    d = Doek(w, h)
    for y in range(2, 24):
        d.rect(1, y, 14, 1, kleur if (y // 3) % 2 else '#f4f4f0')
    return d.img


def reddingstoren():
    """Strandwacht-stoel met een rode vlag. 32x52."""
    w, h = 32, 52
    d = Doek(w, h)
    for (x0, x1) in ((6, 10), (26, 22)):
        d.lijn(x0, 51, x1, 22, '#c8c8c8')
        d.lijn(x0 + 1, 51, x1 + 1, 22, '#a8a8a8')
    d.lijn(8, 40, 24, 40, '#a8a8a8')
    d.rect(8, 16, 16, 8, '#f4f4f4')
    d.rect(8, 20, 16, 4, '#e84848')
    d.rect(8, 10, 2, 8, '#c8c8c8')
    d.rect(22, 10, 2, 8, '#c8c8c8')
    d.rect(6, 8, 20, 3, '#f0c830')
    d.rect(27, 0, 1, 20, '#8a8a8a')
    d.rect(28, 0, 4, 4, '#e84848')
    return omlijn(d.img, K(ZWART))


def ijscokar():
    w, h = 32, 30
    d = Doek(w, h)
    d.rect(2, 12, 28, 12, '#f4f4f0')
    d.rect(2, 12, 28, 3, '#f088b0')
    d.rect(4, 6, 24, 6, '#f0c830')
    for x in range(4, 28, 4):
        d.rect(x, 6, 2, 6, '#f4f4f0')
    d.rect(14, 2, 4, 4, '#e8b060')     # ijshoorntje
    d.ellips(16, 2, 3, 2, '#f8d0e0')
    wiel(d, 8, 25, 4, velg='#c8c8c8')
    wiel(d, 24, 25, 4, velg='#c8c8c8')
    return omlijn(d.img, K(ZWART))


def zandkuil():
    w, h = 16, 16
    d = Doek(w, h)
    d.ellips(8, 9, 7, 5, '#c8a870')
    d.ellips(8, 9, 5.5, 3.6, '#5a4628')
    d.ellips(8, 10, 4, 2.4, '#3a2a18')
    return d.img


def zandkasteel():
    w, h = 24, 22
    d = Doek(w, h)
    zand, schaduw = '#e4c890', '#c8a870'
    d.rect(2, 12, 20, 9, zand)
    d.rect(2, 18, 20, 3, schaduw)
    for x in (2, 16):
        d.rect(x, 6, 6, 8, zand)
        for i in range(0, 6, 2):
            d.rect(x + i, 4, 1, 2, zand)
    d.rect(9, 2, 6, 11, zand)
    d.rect(11, 15, 2, 4, '#8a6a3a')
    d.rect(12, 0, 1, 3, '#8a6a3a')
    d.rect(13, 0, 3, 2, '#e84848')
    return omlijn(d.img, K('#8a6a3a'))


def schep():
    w, h = 16, 22
    d = Doek(w, h)
    d.lijn(9, 0, 9, 14, '#a87848')
    d.rect(7, 0, 5, 2, '#a87848')
    d.rect(6, 14, 7, 6, '#e84848')
    d.ellips(9.5, 20, 3.5, 2, '#e84848')
    d.rect(3, 19, 13, 3, '#e4c890')
    return omlijn(d.img, K(ZWART))


def bord_natuur():
    """Bruin-groen bord bij het natuurgebied. 48x40."""
    w, h = 48, 40
    d = Doek(w, h)
    for x in (8, 38):
        d.rect(x, 20, 3, 20, '#6a4a2a')
    d.rect(0, 0, 48, 22, '#2e5a32')
    d.rect(1, 1, 46, 20, '#5a3a22')
    d.tekst(5, 0, 'NATUUR', '#f4f0e8')
    d.tekst(5, 10, 'GEBIED', '#f4f0e8')
    return omlijn(d.img, K(ZWART))


def objecten():
    return {
        'hooibaal': hooibaal(),
        'melkbussen': melkbussen(),
        'parasol': parasol(),
        'parasol_blauw': parasol('#3a8ac8', '#f4f4f0'),
        'bbq': bbq(),
        'koelbox': koelbox(),
        'flamingo': flamingo(),
        'visbord': visbord(),
        'strandstoel': strandstoel(),
        'strandstoel_groen': strandstoel('#3a9a4a'),
        'handdoek': handdoek(),
        'handdoek_blauw': handdoek('#3a8ac8'),
        'reddingstoren': reddingstoren(),
        'ijscokar': ijscokar(),
        'zandkuil': zandkuil(),
        'zandkasteel': zandkasteel(),
        'schep': schep(),
        'bord_natuur': bord_natuur(),
    }


# ================================================================== koe (4 standen, 24x20)

KOE_PALET = maak_palet({
    'k': '#1e1a18', 'w': '#f4f4f0', 'z': '#2a2624', 'r': '#f0b0b0', 'R': '#c88080', 'h': '#d8d0b0', 'e': '#101010',
})
KOE = {
    'links': [
        "........................",
        "........................",
        "........................",
        "..kk....................",
        ".khhkkk.................",
        ".kwzzzwk................",
        "kwzezwwkkkkkkkkkkkk.....",
        "kwwwwwwzzzwwwwzzzwwk....",
        "krrrwwwzzzwwwwzzzwwkk...",
        "kRrrkwwwwwwwzzwwwwwwk...",
        ".kkk.kwwwwwwzzwwwwwwk...",
        ".....kwwzzwwwwwwwzzwk...",
        ".....kwwzzwwwwwwwzzwk...",
        "......kwwwwwrrwwwwwk....",
        "......kwwkkkrrkkkwwk....",
        "......kwwk.kk..kwwk.....",
        "......kwwk.....kwwk.....",
        "......kzzk.....kzzk.....",
        "......kkkk.....kkkk.....",
        "........................",
    ],
    'omlaag': [
        "........................",
        "........................",
        "........kk....kk........",
        ".......khhk..khhk.......",
        "......kkwwzkkzwwkk......",
        ".....kwwwzzwwzzwwwk.....",
        ".....kwwewwwwwwewwk.....",
        "......kwwwwwwwwwwk......",
        "......kwrrrrrrrrwk......",
        "......kkrRrrrrRrkk......",
        ".....kwkkrrrrrrkkwk.....",
        "....kwwwzkkkkkkzwwwk....",
        "....kwwzzwwwwwwzzwwk....",
        "....kwwwwwwwzzwwwwwk....",
        "....kwwwwwwwzzwwwwwk....",
        ".....kwwk......kwwk.....",
        ".....kwwk......kwwk.....",
        ".....kzzk......kzzk.....",
        ".....kkkk......kkkk.....",
        "........................",
    ],
    'omhoog': [
        "........................",
        "........................",
        "........kk....kk........",
        ".......khhk..khhk.......",
        "......kkwwwkkwwwkk......",
        ".....kwwwwwwwwwwwwk.....",
        ".....kwwzzwwwwwwwwk.....",
        "......kwzzwwwwwwwk......",
        "......kwwwwwwwwwwk......",
        ".....kkwwwwwzzwwwkk.....",
        "....kwwwwwwwzzwwwwwk....",
        "....kwwzzwwwwwwwwwwk....",
        "....kwwzzwwwwwwzzwwk....",
        "....kwwwwwwwwwwzzwwk....",
        "....kwwwwwwkkwwwwwwk....",
        ".....kwwk...kk.kwwk.....",
        ".....kwwk......kwwk.....",
        ".....kzzk......kzzk.....",
        ".....kkkk......kkkk.....",
        "........................",
    ],
}


def koe():
    links = sprite(KOE['links'], KOE_PALET, 24, 20, 'koe-links')
    return [
        sprite(KOE['omlaag'], KOE_PALET, 24, 20, 'koe-omlaag'),
        sprite(KOE['omhoog'], KOE_PALET, 24, 20, 'koe-omhoog'),
        links,
        spiegel(links),
    ]


# ================================================================== iconen

def icoon_hengel():
    d = Doek(16, 16)
    d.lijn(2, 15, 14, 1, '#8a5a34')
    d.lijn(3, 15, 15, 1, '#a87848')
    d.ellips(5, 12, 2, 2, '#3a3a42')
    d.lijn(14, 1, 13, 10, '#c8c8d0')
    d.rect(12, 10, 3, 3, '#e84848')
    return omlijn(d.img, K('#2a2018'))


def icoon_vis(kleur, streep, vin):
    d = Doek(16, 16)
    d.ellips(7, 8, 6, 3.5, kleur)
    d.ellips(6, 9, 4, 1.5, '#f0f0e8')
    for x in range(4, 11, 3):
        d.rect(x, 5, 1, 4, streep)
    d.lijn(12, 8, 15, 5, vin)
    d.lijn(12, 8, 15, 11, vin)
    d.rect(14, 5, 1, 7, vin)
    d.p(3, 7, '#141414')
    d.rect(5, 4, 4, 1, vin)
    return omlijn(d.img, K('#1e2a2a'))


def iconen():
    return {
        'icoon_hengel': icoon_hengel(),
        'icoon_baars': icoon_vis('#8aa848', '#3a5a2a', '#e86a3a'),
        'icoon_snoek': icoon_vis('#6a8a5a', '#c8d888', '#5a6a3a'),
        'icoon_karper': icoon_vis('#c8a050', '#a87830', '#a87830'),
    }


def dobber():
    d = Doek(8, 12)
    d.rect(3, 0, 2, 4, '#f4f4f4')
    d.ellips(4, 6, 3, 3, '#e84848')
    d.rect(1, 6, 6, 1, '#f4f4f4')
    d.rect(3, 9, 2, 3, '#2a2a30')
    return omlijn(d.img, K('#141414'))


# ================================================================== de strand-Duitser

def strandduitser():
    """Verbrande Duitser in zwembroek, met duikbril op het voorhoofd en een schep. 48x56."""
    d = Doek(48, 56)
    huid, huidS, rood = '#f0a080', '#cc7a5a', '#e86a5a'
    broek, broekS = '#3a6ac8', '#2a4a8a'
    # benen en sandalen met sokken
    d.rect(17, 40, 6, 10, huid)
    d.rect(26, 40, 6, 10, huidS)
    d.rect(16, 48, 8, 4, '#f4f4f4')
    d.rect(25, 48, 8, 4, '#e0e0e6')
    d.rect(15, 52, 10, 3, '#8a5a34')
    d.rect(24, 52, 10, 3, '#8a5a34')
    # zwembroek
    d.rect(15, 36, 19, 6, broek)
    d.rect(15, 36, 19, 1, broekS)
    d.rect(23, 38, 3, 4, broekS)
    # buik en borst (verbrand)
    d.ellips(24, 30, 11, 9, huid)
    d.ellips(24, 32, 8, 6, rood)
    d.ellips(30, 30, 5, 8, huidS, alleen=lambda x, y: x > 30)
    d.p(24, 33, '#a85a4a')
    # armen; rechts met schep
    d.ellips(11, 30, 3.5, 8, huid)
    d.ellips(11, 38, 3, 2.5, huid)
    d.ellips(37, 28, 3.5, 7, huidS)
    d.ellips(38, 34, 3, 2.5, huid)
    d.lijn(39, 36, 44, 10, '#a87848')
    d.rect(41, 2, 6, 9, '#e84848')
    d.ellips(44, 2, 3, 2, '#e84848')
    # hoofd
    d.rect(21, 18, 6, 4, huidS)
    d.ellips(24, 13, 8, 8, huid)
    d.ellips(28, 14, 4, 7, huidS, alleen=lambda x, y: x > 28)
    d.ellips(20, 15, 2, 1.5, rood)
    d.ellips(28, 15, 2, 1.5, rood)
    d.rect(20, 12, 2, 2, '#202028')
    d.rect(27, 12, 2, 2, '#202028')
    d.rect(23, 14, 2, 3, huidS)
    d.ellips(24, 18.5, 4, 1.4, '#c8a050')   # snor
    d.rect(22, 20, 5, 1, '#7a3a30')
    # haar en duikbril op het voorhoofd
    d.ellips(24, 6, 8, 3, '#e8d090', alleen=lambda x, y: y <= 7)
    d.rect(15, 7, 18, 3, '#3a3a42')
    d.rect(18, 7, 5, 3, '#9cd8f0')
    d.rect(25, 7, 5, 3, '#9cd8f0')
    # zand op hem
    random.seed(141)
    for _ in range(26):
        x, y = random.randrange(10, 40), random.randrange(4, 54)
        if d.px[x, y][3]:
            d.p(x, y, '#e4c890')
    return omlijn(d.img, K('#141418'))


def gevecht_strand():
    random.seed(23)
    w, h = 240, 112
    img = Image.new('RGBA', (w, h), K('#000000'))
    d = Doek(w, h)
    d.img = img
    d.px = img.load()
    for i, c in enumerate(['#58a8e8', '#68b4ec', '#78c0ee', '#88caf0', '#98d4f2']):
        d.rect(0, i * 6, w, 6, c)
    d.ellips(200, 8, 9, 9, '#fff4b0')
    d.rect(0, 30, w, 6, '#2e6a32')
    for x in range(-4, w + 4, 8):
        d.ellips(x, 30, 6, 7, '#2e6a32' if (x // 8) % 2 else '#3e7a3e')
    # meer
    d.rect(0, 36, w, 16, '#2aa8c8')
    for y in range(38, 52, 4):
        for x in range(0, w, 14):
            d.rect(x + (y % 7), y, 6, 1, '#6ad8e8')
    d.ellips(60, 44, 6, 2, '#f088b0')
    # strand
    for i, c in enumerate(['#ecd49a', '#e8cc90', '#e4c486', '#e0bc7c']):
        d.rect(0, 52 + i * 15, w, 15, c)
    for _ in range(400):
        d.p(random.randrange(w), random.randrange(52, h), random.choice(['#f8e4b0', '#d8bc84']))
    # parasol op de achtergrond
    d.rect(30, 30, 1, 24, '#c8c8c8')
    for y in range(26, 34):
        half = 3 + (y - 26)
        for x in range(30 - half, 30 + half):
            d.p(x, y, '#e84848' if ((x - 30) // 3) % 2 else '#f4f4f0')
    # podia (zandhopen)
    d.ellips(176, 80, 46, 11, '#c8a870')
    d.ellips(176, 78, 44, 10, '#f0dca8')
    d.ellips(62, 112, 60, 14, '#c8a870')
    d.ellips(62, 110, 58, 13, '#f0dca8')
    return img
