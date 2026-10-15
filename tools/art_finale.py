"""De finale: de receptie (van binnen), de directeur als eindbaas, de straat met vakantiehuisjes, huisje 7
(de hoekbank met de vrienden, de beamer, de salontafel, de trap, de sauna en de douche) en de aftiteling."""
import math
import random
from PIL import Image
from pixel import hexkleur, omlijn, maak_palet, sprite
from art_buiten import Doek
import art_font
import art_portretten
import art_park

K = hexkleur
ZWART = '#24201c'
WIT = '#f0f0ec'
HOUT, HOUT_D, HOUT_L = '#b07a48', '#8a5a34', '#c8945a'


def tekstbreedte(s):
    g = art_font.alle_glyphs()
    return sum((len(g[c][0]) + 1) if c != ' ' else 4 for c in s) - 1


def gecentreerd(d, x0, b, y, s, kleur):
    d.tekst(x0 + (b - tekstbreedte(s)) // 2, y, s, kleur)


# ================================================================== de directeur als eindbaas

def gevecht_directeur():
    """Het portret van de directeur, met een waaier Duits smeergeld in zijn hand. 56x64."""
    portret = art_portretten.directeur(False)
    img = Image.new('RGBA', (56, 64), (0, 0, 0, 0))
    img.paste(portret, (0, 0), portret)
    d = Doek(56, 64)
    d.img = img
    d.px = img.load()
    for i, hoek in enumerate((-35, -15, 5, 25)):
        a = math.radians(hoek - 90)
        for t in range(10):
            for w in range(-2, 3):
                x = int(44 + math.cos(a) * t - math.sin(a) * w * 0.6)
                y = int(56 + math.sin(a) * t + math.cos(a) * w * 0.6)
                d.p(x, y, '#7ac87a' if (t + i) % 4 else '#4a9a4a')
    d.ellips(44, 58, 3, 3, '#f2bb92')
    return omlijn(d.img, K('#141418'))


# ================================================================== de receptie van binnen

def receptiebalie():
    """Een lange balie met een computer, een belletje en folders. 80x26, voet 5x1."""
    w, h = 80, 26
    d = Doek(w, h)
    d.rect(0, 8, w, 18, HOUT)
    d.rect(0, 8, w, 3, '#f0ead8')
    d.rect(0, 8, w, 1, '#ffffff')
    for x in range(3, w - 6, 15):
        d.rect(x, 14, 12, 9, HOUT_D)
        d.rect(x + 1, 15, 10, 7, HOUT_L)
    d.rect(0, 24, w, 2, '#5a3a20')
    d.rect(30, 16, 20, 5, art_park.PARK_GROEN)
    d.rect(32, 17, 16, 3, art_park.PARK_ORANJE)
    # computer
    d.rect(52, 0, 14, 9, '#2a2a30')
    d.rect(53, 1, 12, 6, '#7ab8d8')
    d.rect(57, 8, 4, 1, '#4a4a52')
    # belletje en folders
    d.ellips(12, 6, 3, 2.4, '#e8c040', alleen=lambda x, y: y <= 7)
    d.rect(9, 7, 7, 1, '#a07820')
    for i, c in enumerate(('#3a8ac8', '#f0902a', '#2e8a5a')):
        d.rect(22 + i * 5, 3 + (i % 2), 4, 6, c)
    return omlijn(d.img, K(ZWART))


def folderrek():
    """Rek met folders: zwembad, minigolf en de Duitse week. 16x30."""
    d = Doek(16, 30)
    d.rect(1, 4, 14, 24, '#8a8e98')
    for i, y in enumerate((6, 13, 20)):
        for j, x in enumerate((2, 8)):
            c = ('#3a8ac8', '#f0902a', '#2e8a5a', '#c83a3a', '#e8c040', '#8a5aa8')[(i * 2 + j) % 6]
            d.rect(x, y, 5, 6, c)
            d.rect(x, y, 5, 1, '#f4f4f0')
    d.rect(1, 28, 3, 2, '#4a4a52')
    d.rect(12, 28, 3, 2, '#4a4a52')
    return omlijn(d.img, K(ZWART))


def bouwtekening():
    """Een ezel met een bouwtekening: het park als kamp, met prikkeldraad en een wachttoren. 34x42, voet 2x1."""
    w, h = 34, 42
    d = Doek(w, h)
    d.lijn(6, 6, 2, 41, '#6a4224')
    d.lijn(28, 6, 32, 41, '#6a4224')
    d.lijn(17, 4, 17, 41, '#5a341c')
    d.rect(2, 2, 30, 24, '#2a5ab0')
    d.rect(3, 3, 28, 22, '#3a6ac8')
    for x in range(4, 30, 4):
        d.rect(x, 3, 1, 22, '#4a7ad8')
    # prikkeldraad rondom (zigzag)
    for x in range(5, 29):
        d.p(x, 6 + (x % 2), '#f0f0f0')
        d.p(x, 21 + (x % 2), '#f0f0f0')
    for y in range(6, 23):
        d.p(5 + (y % 2), y, '#f0f0f0')
        d.p(28 - (y % 2), y, '#f0f0f0')
    # drie lange barakken (alleen omtrek) en een wachttoren
    for y in (10, 14, 18):
        d.rect(9, y, 10, 3, '#f0f0f0')
        d.rect(10, y + 1, 8, 1, '#3a6ac8')
    d.rect(23, 11, 1, 9, '#f0f0f0')
    d.rect(21, 9, 5, 3, '#f0f0f0')
    d.rect(22, 10, 3, 1, '#3a6ac8')
    d.rect(0, 26, 34, 2, '#6a4224')
    return omlijn(d.img, K(ZWART))


def geldkoffer():
    """Een open koffer vol Duits smeergeld. 24x18."""
    d = Doek(24, 18)
    d.rect(1, 0, 22, 7, '#2a2a30')
    d.rect(2, 1, 20, 5, '#4a4a52')
    d.rect(1, 7, 22, 10, '#1e1e22')
    d.rect(2, 8, 20, 8, '#3a3a40')
    for y in range(8, 16, 2):
        for x in range(3, 21, 6):
            d.rect(x, y, 5, 2, '#7ac87a')
            d.p(x + 2, y, '#4a9a4a')
    d.rect(10, 16, 4, 2, '#c8a040')
    return omlijn(d.img, K(ZWART))


# ================================================================== de straat met vakantiehuisjes

def villa():
    """Huisje 7: een vakantiewoning met een verdieping (daar zit de sauna). 64x84; voet 4x2, deur op tegel 2."""
    w, h = 64, 84
    d = Doek(w, h)
    # dak
    for y in range(4, 30):
        inspring = max(0, (30 - y) * 3 // 4 - 2)
        d.rect(inspring, y, w - 2 * inspring, 1, '#3a3a44' if y % 3 else '#2a2a32')
    d.rect(0, 29, w, 3, '#22222a')
    # schoorsteen van de sauna, met een beetje stoom
    d.rect(46, 4, 6, 12, '#8a8e98')
    d.rect(45, 3, 8, 2, '#5a5e68')
    # bovenverdieping (hout)
    d.rect(3, 32, 58, 24, HOUT)
    for y in range(34, 56, 3):
        d.rect(3, y, 58, 1, HOUT_D)
    d.rect(8, 36, 14, 12, '#f0f0e8')
    d.rect(9, 37, 12, 10, '#f0c868')       # warm licht: de sauna
    d.rect(9, 37, 12, 3, '#f8e0a0')
    d.rect(42, 36, 14, 12, '#f0f0e8')
    d.rect(43, 37, 12, 10, art_park.RAAM_L)
    # balkonnetje
    d.rect(3, 55, 58, 2, '#5a5e68')
    for x in range(4, 61, 4):
        d.rect(x, 50, 1, 5, '#5a5e68')
    d.rect(3, 50, 58, 1, '#5a5e68')
    # benedenverdieping (steen)
    d.rect(3, 57, 58, 27, '#c8b898')
    for y in range(59, 84, 3):
        d.rect(3, y, 58, 1, '#a89878')
    d.rect(6, 62, 18, 14, '#f0f0e8')
    d.rect(7, 63, 16, 12, '#4a3a5a')       # beamerlicht achter het raam
    d.rect(8, 64, 14, 6, '#8a7ab8')
    d.rect(44, 62, 14, 12, '#f0f0e8')
    d.rect(45, 63, 12, 10, art_park.RAAM_L)
    # deur (tegel 2: x 32..47)
    d.rect(33, 60, 14, 24, '#f0f0e8')
    d.rect(34, 61, 12, 23, '#2e6a4a')
    d.rect(35, 62, 10, 7, art_park.RAAM_L)
    d.rect(43, 72, 2, 2, '#e0c048')
    # huisnummer 7
    d.rect(26, 63, 6, 8, '#f4f4f0')
    d.tekst(27, 62, '7', '#2a2a30')
    return omlijn(d.img, K(ZWART))


def audi_crash():
    """Levi's witte hatchback, scheef in de vijver, met een wolkje rook. 44x34."""
    zij = art_park.auto_levi()[3]
    gedraaid = zij.rotate(-18, resample=Image.NEAREST, expand=True)
    img = Image.new('RGBA', (44, 34), (0, 0, 0, 0))
    d = Doek(44, 34)
    d.img = img
    d.px = img.load()
    d.ellips(24, 28, 18, 5, '#5a92c8')
    d.ellips(24, 28, 14, 3, '#7ab0e0')
    img.paste(gedraaid, (4, 0), gedraaid)
    d.px = img.load()
    for (x, y) in ((34, 6), (36, 3), (33, 2)):
        d.ellips(x, y, 2.5, 2.5, '#c8c8d0')
    for x in range(8, 40, 5):
        d.p(x, 29, '#d0e8f8')
    return img


# ================================================================== huisje 7: beneden

def hoekbank():
    """Grote grijze hoekbank met een chaise longue rechts. 128x68 (de zitplaatsen liggen op y 20..36)."""
    w, h = 128, 68
    d = Doek(w, h)
    stof, stofD, stofL = '#8a8e98', '#6a6e78', '#a8acb4'
    # rugleuning
    d.rect(2, 0, 124, 22, stof)
    d.rect(2, 0, 124, 3, stofL)
    for x in range(2, 126, 18):
        d.rect(x, 4, 16, 16, stofL)
        d.rect(x + 1, 5, 14, 14, stof)
        d.rect(x + 1, 17, 14, 2, stofD)
    # armleuning links
    d.rect(0, 6, 6, 36, stofD)
    d.rect(0, 6, 6, 2, stofL)
    # zitting
    d.rect(4, 22, 92, 16, stofL)
    d.rect(4, 36, 92, 6, stofD)
    for x in range(4, 96, 16):
        d.rect(x, 22, 1, 14, stof)
    # chaise longue rechts (loopt naar voren door)
    d.rect(96, 22, 30, 42, stofL)
    d.rect(96, 60, 30, 8, stofD)
    d.rect(124, 6, 4, 62, stofD)
    d.rect(96, 22, 1, 38, stof)
    # kussentjes
    d.rect(8, 10, 10, 9, '#f0902a')
    d.rect(104, 10, 10, 9, '#2e8a5a')
    d.rect(60, 10, 10, 9, '#c83a3a')
    # plaid op de chaise
    for y in range(40, 58, 3):
        d.rect(98, y, 26, 2, '#c8a0d8' if (y // 3) % 2 else '#a878c0')
    return omlijn(d.img, K(ZWART))


def salontafel():
    """Salontafel vol drugs (en chips), met een beamer op de hoek. 64x28, voet 4x1."""
    w, h = 64, 28
    d = Doek(w, h)
    d.rect(2, 22, 3, 6, '#3a3a40')
    d.rect(59, 22, 3, 6, '#3a3a40')
    d.rect(0, 10, w, 13, '#a8c8d8')        # glazen blad
    d.rect(0, 10, w, 2, '#d8eef8')
    d.rect(0, 21, w, 2, '#7a98a8')
    random.seed(7)
    # zakjes, pillen, een bergje poeder, een jointje, chips
    for (x, y, c) in ((5, 12, '#f4f4f4'), (11, 14, '#f4f4f4'), (18, 12, '#e8f4e8')):
        d.rect(x, y, 5, 5, c)
        d.rect(x, y, 5, 1, '#c83a3a')
    for _ in range(9):
        d.p(random.randrange(26, 38), random.randrange(13, 19), random.choice(('#f088b0', '#80c8f0', '#f8e060')))
    d.ellips(31, 17, 3, 1.5, '#ffffff')
    d.lijn(40, 18, 47, 15, '#f4f0e0')
    d.p(47, 15, '#e86a2a')
    d.ellips(8, 19, 3, 1.4, '#e8c040')
    # beamer (wijst naar rechts)
    d.rect(50, 4, 13, 8, '#e8e8ec')
    d.rect(50, 4, 13, 2, '#ffffff')
    d.ellips(60, 8, 2.5, 2.5, '#2a2a30')
    d.ellips(60, 8, 1.2, 1.2, '#a8d8f8')
    d.p(52, 9, '#4ae84a')
    return omlijn(d.img, K(ZWART))


def projectiescherm():
    """Projectiescherm aan het plafond, met een film over een beer die uit een kamp ontsnapt. 48x40."""
    w, h = 48, 40
    d = Doek(w, h)
    d.rect(0, 0, w, 3, '#3a3a42')
    d.rect(2, 3, 44, 34, '#f4f4f0')
    d.rect(2, 36, 44, 2, '#c8c8d0')
    # het beeld: nachtlucht, zoeklicht, prikkeldraad en een beer
    d.rect(4, 5, 40, 29, '#2a2a5a')
    d.lijn(10, 33, 30, 6, '#5a5a8a')
    d.lijn(11, 33, 31, 6, '#5a5a8a')
    for x in range(4, 44, 3):
        d.p(x, 27, '#9a9ab8')
    d.rect(4, 28, 40, 6, '#2a4a2a')
    d.ellips(30, 24, 4, 4, '#b8743c')
    d.ellips(30, 19, 3.5, 3.5, '#b8743c')
    d.rect(27, 15, 7, 2, '#d84030')
    d.p(29, 19, '#141414')
    d.p(31, 19, '#141414')
    return omlijn(d.img, K(ZWART))


def trap():
    """Houten trap naar boven, met een leuning links. 32x64."""
    w, h = 32, 64
    d = Doek(w, h)
    for i, y in enumerate(range(0, 64, 8)):
        licht = 0.55 + 0.45 * (i / 7)
        c = tuple(int(v * licht) for v in K(HOUT)[:3])
        d.rect(16, y, 16, 8, '#%02x%02x%02x' % c)
        d.rect(16, y + 6, 16, 2, HOUT_D)
    # leuning (houdt een tegel boven de onderkant op, daar stap je de trap op)
    d.rect(10, 0, 4, 46, '#5a341c')
    d.rect(10, 0, 4, 2, '#7a4a2a')
    d.rect(9, 44, 6, 4, '#7a4a2a')
    for y in range(4, 44, 12):
        d.rect(6, y, 2, 10, '#5a341c')
    return omlijn(d.img, K(ZWART))


def hobbelpaard():
    """Het hobbelpaard van Rudy: een pluche paardje op houten hobbels. 26x24."""
    w, h = 26, 24
    d = Doek(w, h)
    d.lijn(1, 20, 24, 20, '#a8743c')
    d.lijn(2, 21, 23, 21, '#a8743c')
    d.rect(1, 18, 3, 2, '#a8743c')
    d.rect(22, 18, 3, 2, '#a8743c')
    for x in (6, 9, 15, 18):
        d.rect(x, 13, 3, 6, '#e8c890')
        d.rect(x, 17, 3, 2, '#f4f4f0')
    d.ellips(13, 11, 8, 4, '#e8c890')
    d.ellips(13, 12, 5, 2.5, '#f4f4f0')
    d.ellips(5, 6, 3.5, 4, '#e8c890')     # hoofd
    d.ellips(3, 8, 2, 1.6, '#d8b070')
    d.rect(6, 2, 4, 5, '#f8f4f0')         # manen
    d.p(5, 4, '#141414')
    d.p(4, 1, '#e8c890')
    d.p(6, 1, '#c83a3a')                  # oortje met een rood vlekje
    d.lijn(9, 9, 12, 7, '#141414')        # teugel
    d.rect(21, 8, 3, 5, '#f8f4f0')        # staart
    return omlijn(d.img, K(ZWART))


# ================================================================== huisje 7: boven

def sauna():
    """Houten saunacabine met een glazen deur en warm licht. 48x58, voet 3x2, deur op tegel 1."""
    w, h = 48, 58
    d = Doek(w, h)
    d.rect(0, 0, w, h, '#a87040')
    for x in range(0, w, 4):
        d.rect(x, 0, 1, h, '#8a5a30')
    d.rect(0, 0, w, 3, '#7a4a28')
    d.rect(16, 14, 16, 44, '#5a3a20')
    d.rect(17, 15, 14, 43, '#f0b860')
    d.rect(17, 15, 14, 8, '#f8d890')
    d.rect(29, 34, 1, 6, '#c8c8c8')
    d.rect(3, 8, 10, 7, '#f4ecd8')
    d.tekst(4, 6, '90', '#c83a3a')
    d.rect(36, 10, 9, 9, '#f0b860')
    d.rect(36, 10, 9, 3, '#f8d890')
    for i in range(3):
        d.p(20 + i * 4, 10 - (i % 2), '#e8e8f0')
    return omlijn(d.img, K(ZWART))


def douche():
    """Een regendouche met een splinternieuwe douchekop. 32x46, voet 2x1."""
    w, h = 32, 46
    d = Doek(w, h)
    d.rect(1, 2, 30, 44, '#d8eef8')
    d.rect(1, 2, 30, 2, '#f4fbff')
    d.rect(1, 40, 30, 6, '#a8c8d8')
    d.rect(14, 4, 2, 10, '#a8acb4')
    d.rect(8, 12, 16, 3, '#c8ccd4')
    for x in range(9, 24, 2):
        d.p(x, 15, '#7a7e88')
    d.rect(25, 18, 3, 5, '#c8ccd4')
    d.rect(4, 30, 4, 6, '#f088b0')        # flesje
    d.rect(1, 2, 1, 44, '#a8c8d8')
    d.rect(30, 2, 1, 44, '#a8c8d8')
    return omlijn(d.img, K(ZWART))


def wastafel():
    """Wastafel met een spiegel. 18x34."""
    d = Doek(18, 34)
    d.rect(2, 0, 14, 14, '#c8ccd4')
    d.rect(3, 1, 12, 12, '#d8eef8')
    d.lijn(5, 3, 9, 9, '#f4fbff')
    d.rect(1, 18, 16, 6, '#f4f4f4')
    d.rect(3, 19, 12, 3, '#c8e0ec')
    d.rect(8, 15, 2, 4, '#a8acb4')
    d.rect(6, 24, 6, 10, '#e8e8ec')
    return omlijn(d.img, K(ZWART))


def wc():
    """Een wc. Met een wc-eend erop. 16x24."""
    d = Doek(16, 24)
    d.rect(3, 0, 10, 8, '#f4f4f4')
    d.ellips(8, 14, 6, 4, '#f4f4f4')
    d.ellips(8, 14, 4, 2.5, '#c8e0ec')
    d.rect(5, 17, 6, 7, '#e8e8ec')
    d.rect(10, 1, 3, 5, '#5ac83a')
    d.rect(11, 0, 2, 2, '#e8c040')
    return omlijn(d.img, K(ZWART))


def objecten():
    return {
        'receptiebalie': receptiebalie(),
        'folderrek': folderrek(),
        'bouwtekening': bouwtekening(),
        'geldkoffer': geldkoffer(),
        'villa': villa(),
        'audi_crash': audi_crash(),
        'hoekbank': hoekbank(),
        'salontafel': salontafel(),
        'projectiescherm': projectiescherm(),
        'trap': trap(),
        'hobbelpaard': hobbelpaard(),
        'sauna': sauna(),
        'douche': douche(),
        'wastafel': wastafel(),
        'wc': wc(),
    }


# ================================================================== de vrienden op de bank (zittend, 16x20)

BENEN_ZIT = [
    ".kppppppppppppk.",
    ".kpPppppppppPpk.",
    "..kkppkkkkppkk..",
    "...kppk..kppk...",
    "...kffk..kffk...",
    "...kkkk..kkkk...",
]

ROMP_ZIT = [
    "...kttttttttk...",
    "..kTttttttttTk..",
    "..kTttttttttTk..",
    "..ksSttttttSsk..",
]

BASIS = {'k': '#24201c', 'e': '#202028', 'q': '#b05048', 's': '#f2c49a', 'S': '#d29c74'}


def zittend(hoofd, romp, palet, benen=BENEN_ZIT):
    pal = maak_palet({**BASIS, **palet})
    return sprite(hoofd + romp + benen, pal, 16, 20, 'zittend')


VRIENDEN = {
    # Jesse: donker haar, bril, headset met microfoontje, zwart shirt
    'jesse': (
        [
            "................",
            "....kKKKKKKk....",
            "...kKhhhhhhKk...",
            "..khhhhhhhhhhk..",
            "..khhHhhhhHhhk..",
            ".KKhsssssssshKK.",
            ".KKgegssgegshKK.",
            "..kKssSSssssk...",
            "...kKKsqqssk....",
            "....kkkkkkkk....",
        ],
        ROMP_ZIT,
        {'h': '#3a2a20', 'H': '#24180e', 'K': '#3a3a42', 'g': '#2a2a30',
         't': '#26262c', 'T': '#16161a', 'p': '#3a4a6a', 'P': '#2a364e', 'f': '#2a2a2a'},
    ),
    # Dewi: donkere krullen, bril, stoppels, streepjestrui
    'dewi': (
        [
            "...kk.kkk.kk....",
            "..khhkhhhkhhk...",
            ".khhHhhhHhhhhk..",
            ".khhhhHhhhhHhhk.",
            ".khHhhhhhhhhhhk.",
            "..khsssssssshhk.",
            "..khgegssgegshk.",
            "..kBssSSssssBk..",
            "...kBBsqqsBBk...",
            "....kkkkkkkk....",
        ],
        [
            "...kwwwwwwwwk...",
            "..knnnnnnnnnnk..",
            "..kwwwwwwwwwwk..",
            "..ksnnnnnnnnsk..",
        ],
        {'h': '#3a2418', 'H': '#24160c', 'g': '#5a4a3a', 'B': '#7a5a44', 'w': '#f0f0f0', 'n': '#2a2e48',
         'p': '#4a5a7a', 'P': '#34405a', 'f': '#e8e8e8'},
    ),
    # Devona: lang lichtbruin haar met een scheiding, zwart kanten topje
    'devona': (
        [
            "................",
            "....kkkkkkkk....",
            "...khhhHHhhhk...",
            "..khhhHkkHhhhk..",
            "..khhkssssshhk..",
            ".khhksssssskhhk.",
            ".khhsessssesshk.",
            ".khhssssSSsshhk.",
            ".khhksssqqsskhk.",
            ".khhhkkkkkkhhhk.",
        ],
        [
            ".khhkttttttkhhk.",
            ".khhTtTttTtThhk.",
            "..khTttTtttThk..",
            "..ksStTttTtSsk..",
        ],
        {'h': '#a8683a', 'H': '#7a4a28', 't': '#1e1e22', 'T': '#4a4a54', 'q': '#c8606a',
         'p': '#2a2a34', 'P': '#1c1c24', 'f': '#3a3a3a', 's': '#f4cba8', 'S': '#d8a888'},
    ),
    # Femke: lang blond haar, roze shirt
    'femke': (
        [
            "................",
            "....kkkkkkkk....",
            "...khhhhHhhhk...",
            "..khhhhHkhhhhk..",
            "..khhkssssshhk..",
            ".khhksssssskhhk.",
            ".khhseesseeshhk.",
            ".khhssssSSsshhk.",
            ".khhksssqqsskhk.",
            ".khhhkkkkkkhhhk.",
        ],
        [
            ".khhkttttttkhhk.",
            ".khhTttttttThhk.",
            ".khhTttttttThhk.",
            "..ksStttttttSsk.",
        ],
        {'h': '#e8c878', 'H': '#c8a050', 't': '#f4c8d4', 'T': '#d8a0b0', 'e': '#3a6aa8', 'q': '#d86a7a',
         'p': '#7a9ac8', 'P': '#5a7aa8', 'f': '#f0f0f0', 's': '#f8d4b8', 'S': '#e0b090'},
    ),
    # Frank: beige pet, bruine baard, wit shirt
    'frank': (
        [
            "................",
            "....kkkkkkkk....",
            "...kggggggggk...",
            "..kgggglgggggk..",
            "..kGGGGGGGGGGk..",
            ".kGGGGGGGGGGGGk.",
            "..khsesssseshk..",
            "..kBssssSSssBk..",
            "...kBBBqqBBBk...",
            "....kkBBBBkk....",
        ],
        [
            "...kttttttttk...",
            "..kTttttttttTk..",
            "..kTttttttttTk..",
            "..ksSttttttSsk..",
        ],
        {'g': '#c8b090', 'G': '#a89070', 'l': '#f4f4f0', 'h': '#7a5a3a', 'B': '#7a5a3a',
         't': '#f0f0f0', 'T': '#c8c8d0', 'p': '#3a3a42', 'P': '#26262c', 'f': '#f0f0f0'},
    ),
    # Mathijs: lichtbruin opgeschoren haar, zwart shirt, met zijn camera
    'mathijs': (
        [
            ".....kkkkk......",
            "....khhhhhkk....",
            "...khhhhhhhhk...",
            "..khhHhhhhhhhk..",
            "..kHsssssssHHk..",
            "..ksssssssssSk..",
            "..ksesssseessk..",
            "..kssssSSssssk..",
            "...ksssqqsssk...",
            "....kkkkkkkk....",
        ],
        [
            "...kttttttttk...",
            "..kTtkKKKKKktk..",
            "..kTtkKoOKKktk..",
            "..ksSkkkkkkkSk..",
        ],
        {'h': '#c8985a', 'H': '#a07840', 't': '#26262c', 'T': '#16161a', 'K': '#2a2a30', 'o': '#5a7a94',
         'O': '#c8e0f0', 'p': '#3a4a6a', 'P': '#2a364e', 'f': '#2a2a2a', 's': '#f4c8a4', 'S': '#d8a080'},
    ),
    # Rudy: zwarte pet met een wit logootje, stoppelbaard, zwart shirt, heuptas, witte sneakers
    'rudy': (
        [
            "................",
            "....kkkkkkkk....",
            "...kggggggggk...",
            "..kgggwwwgggk...",
            "..kGGGGGGGGGGk..",
            ".kGGGGGGGGGGGGk.",
            "..khsesssseshk..",
            "..kBssssSSssBk..",
            "...kBBsqqsBBk...",
            "....kkkkkkkk....",
        ],
        [
            "...kttttttatk...",
            "..kTttttttatTk..",
            "..kTtttttattTk..",
            "..ksAAAAattSsk..",
        ],
        {'g': '#1e1e22', 'G': '#141418', 'w': '#f4f4f4', 'h': '#3a2a1e', 'B': '#5a4434',
         't': '#1e1e22', 'T': '#141418', 'a': '#4a4a52', 'A': '#2a2a30',
         'p': '#1e1e22', 'P': '#141418', 'f': '#f4f4f4'},
    ),
}


def vrienden():
    """Per vriend 12 (gelijke) frames, zodat het als gewone npc-sprite werkt."""
    uit = {}
    for naam, (hoofd, romp, palet) in VRIENDEN.items():
        img = zittend(hoofd, romp, palet)
        uit[naam] = [img] * 12
    return uit


# ================================================================== de aftiteling: de beer in de sauna

def aftiteling_sauna():
    """De sauna van binnen, met banken, een kachel met stenen en een thermometer. 120x150."""
    w, h = 120, 150
    d = Doek(w, h)
    d.rect(0, 0, w, h, '#a87040')
    for x in range(0, w, 6):
        d.rect(x, 0, 1, h, '#8a5a30')
        d.rect(x + 3, 0, 1, h, '#b88050')
    # lampje
    d.rect(52, 8, 16, 8, '#5a3a20')
    d.rect(54, 10, 12, 4, '#f8d890')
    # thermometer
    d.rect(94, 20, 18, 30, '#f4ecd8')
    d.rect(102, 24, 2, 20, '#e8e8e8')
    d.rect(102, 30, 2, 14, '#e83a3a')
    d.ellips(103, 46, 3, 3, '#e83a3a')
    d.tekst(95, 18, '90', '#c83a3a')
    # bovenste bank
    d.rect(0, 84, w, 10, '#c89058')
    d.rect(0, 84, w, 2, '#e0b078')
    d.rect(0, 94, w, 20, '#8a5a30')
    for x in range(4, w, 16):
        d.rect(x, 96, 2, 18, '#6a4224')
    # onderste bank
    d.rect(0, 114, w, 10, '#c89058')
    d.rect(0, 114, w, 2, '#e0b078')
    d.rect(0, 124, w, 26, '#7a4a28')
    # kachel met stenen (links onder)
    d.rect(6, 118, 26, 32, '#3a3a42')
    d.rect(6, 118, 26, 3, '#5a5a62')
    for (x, y) in ((9, 113), (15, 112), (21, 113), (27, 114), (12, 116), (24, 117)):
        d.ellips(x, y, 3.5, 3, '#6a6a72')
        d.p(x - 1, y - 1, '#e86a2a')
    d.rect(10, 128, 18, 6, '#e86a2a')
    d.rect(12, 129, 14, 3, '#f8c040')
    # emmertje met een lepel
    d.rect(96, 104, 14, 10, '#a87040')
    d.rect(96, 104, 14, 2, '#c89058')
    d.rect(97, 107, 12, 1, '#5a3a20')
    d.lijn(106, 104, 112, 96, '#5a3a20')
    return d.img


def aftiteling_beer(ogen_dicht=False):
    """De beer op de bank, met zijn muts nog op en een handdoek om. 52x58."""
    d = Doek(52, 58)
    vacht, vachtS, vachtL = '#b8743c', '#8a5228', '#dc9c5c'
    snuit, snuitS = '#f2dcae', '#d2b07e'
    # benen (over de rand van de bank)
    d.ellips(18, 50, 6, 7, vacht)
    d.ellips(34, 50, 6, 7, vachtS)
    d.ellips(18, 55, 5, 3, vachtL)
    d.ellips(34, 55, 5, 3, vacht)
    # lijf
    d.ellips(26, 36, 15, 13, vacht)
    d.ellips(33, 37, 9, 12, vachtS, alleen=lambda x, y: x > 33)
    d.ellips(26, 38, 9, 8, vachtL)
    # handdoek om het middel
    d.rect(10, 40, 32, 9, '#f4f4f0')
    for x in range(10, 42, 4):
        d.rect(x, 40, 2, 9, '#e84848')
    d.rect(10, 40, 32, 1, '#ffffff')
    # armen
    d.ellips(10, 36, 4, 8, vacht)
    d.ellips(42, 36, 4, 8, vachtS)
    # hoofd
    d.ellips(13, 10, 5, 5, vacht)
    d.ellips(39, 10, 5, 5, vachtS)
    d.ellips(26, 17, 13, 11, vacht)
    d.ellips(33, 18, 7, 10, vachtS, alleen=lambda x, y: x > 35)
    d.ellips(26, 22, 6, 4.5, snuit)
    d.ellips(27, 24, 4, 2.4, snuitS, alleen=lambda x, y: y > 24)
    d.ellips(26, 19.5, 2.6, 1.8, '#2a1a14')
    d.lijn(24, 25, 28, 25, '#2a1a14')
    # rode wangen van de warmte
    d.ellips(17, 21, 2.5, 1.5, '#e86a5a')
    d.ellips(35, 21, 2.5, 1.5, '#e86a5a')
    # ogen
    for ox in (20, 32):
        if ogen_dicht:
            d.lijn(ox - 2, 15, ox + 1, 15, '#202028')
        else:
            d.rect(ox - 1, 13, 2, 3, '#202028')
            d.p(ox - 1, 13, '#f8f8f8')
    # de rode muts, natuurlijk
    d.ellips(26, 6, 12, 5, '#d84030', alleen=lambda x, y: y <= 7)
    d.rect(14, 6, 24, 3, '#a02820')
    d.ellips(26, 1.5, 3, 2.5, '#f0e8d8')
    return omlijn(d.img, K('#302018'))


def aftiteling():
    return {
        'aftiteling_sauna': aftiteling_sauna(),
        'aftiteling_beer': [aftiteling_beer(False), aftiteling_beer(True)],
    }


# ================================================================== icoon

def icoon_sleutels():
    """De sleutels van huisje 7, aan een ring met een labeltje."""
    d = Doek(16, 16)
    d.ellips(5, 5, 3.5, 3.5, '#c8c8d0')
    d.ellips(5, 5, 2, 2, (0, 0, 0, 0))
    for (x0, y0, x1, y1) in ((7, 7, 13, 13), (6, 8, 9, 14)):
        d.lijn(x0, y0, x1, y1, '#e8c040')
    d.rect(12, 12, 2, 1, '#e8c040')
    d.rect(8, 13, 1, 2, '#e8c040')
    d.rect(10, 2, 5, 5, '#2e8a5a')
    d.tekst(11, 0, '7', '#ffffff')
    return omlijn(d.img, K('#2a2018'))


def iconen():
    return {'icoon_sleutels': icoon_sleutels()}
