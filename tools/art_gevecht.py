"""Gevechtsgraphics: grote sprites (48x56), achtergrond (240x112) en effecten."""
import random
from PIL import Image
from pixel import hexkleur, omlijn
from art_portretten import Doek, OMLIJNING

K = hexkleur


def nieuw(w, h):
    return Image.new('RGBA', (w, h), (0, 0, 0, 0))


# ------------------------------------------------------------------ wachter (vijand, van voren)

VARIANTEN = {
    'klaus': {'hoofd': 'helm'},
    'dieter': {'hoofd': 'pet', 'snor': True},
    'horst': {'hoofd': 'helm', 'takjes': True, 'uni': ('#6a7448', '#4c5434', '#86906a')},
    'jurgen': {'hoofd': 'veldmuts', 'bril': True, 'uni': ('#727c5c', '#525a42', '#8e987a')},
    'uwe': {'hoofd': 'pet', 'snor': True, 'epauletten': True, 'uni': ('#5c6250', '#40463a', '#787e6a')},
    # de N34
    'bernd': {'hoofd': 'veldmuts', 'snor': True, 'uni': ('#6a6e52', '#4c503a', '#868a6c')},
    'helmut': {'hoofd': 'pet', 'bril': True, 'epauletten': True, 'uni': ('#5a6a7a', '#3e4a58', '#7a8a9a'),
               'helm': ('#3e4a58', '#2a3440', '#5a6a7a')},
}


def wachter(variant='klaus'):
    cfg = VARIANTEN[variant]
    d = Doek(48, 56)
    uni, uniS, uniL = cfg.get('uni', ('#7a8068', '#585e4a', '#969c84'))
    broek, broekS = '#5c6250', '#444a3a'
    huid, huidS, wang = '#f0c49a', '#cc9a72', '#e49478'
    laars, laarsL = '#1e1e22', '#3e3e46'
    helm, helmS, helmL = cfg.get('helm', ('#68705c', '#4a5242', '#8c947e'))
    metaal, metaalD = '#5a5a64', '#2c2c34'

    # benen en laarzen
    d.rect(16, 40, 7, 10, broek)
    d.rect(26, 40, 7, 10, broekS)
    d.rect(15, 46, 9, 9, laars)
    d.rect(25, 46, 9, 9, laars)
    d.rect(16, 47, 2, 6, laarsL)
    d.rect(26, 47, 2, 6, laarsL)
    # jas
    d.ellips(24, 32, 13, 12, uni)
    d.rect(12, 30, 25, 12, uni)
    d.ellips(30, 33, 7, 10, uniS, alleen=lambda x, y: x > 30)
    d.rect(17, 24, 3, 18, uniL)
    # knopen, zakken en riem (zonder emblemen)
    for y in (27, 31, 35):
        d.p(24, y, metaalD)
    d.rect(15, 28, 6, 4, uniS)
    d.rect(28, 28, 6, 4, uniS)
    d.rect(12, 38, 25, 3, '#2a2a2c')
    d.rect(22, 38, 5, 3, '#8a8a92')
    # mes aan de riem
    d.rect(31, 41, 2, 6, '#3a2a1e')
    d.rect(31, 40, 2, 1, metaal)
    # linkerarm (hangend)
    d.ellips(11, 33, 3.5, 8, uniS)
    d.ellips(11, 41, 3, 2.5, huid)
    # rechterarm naar voren met pistool (richting speler: links-onder)
    d.ellips(37, 31, 4, 6, uni)
    d.ellips(33, 36, 4, 3, uni)
    d.ellips(29, 37, 3, 2.5, huid)
    d.rect(20, 34, 9, 3, metaalD)   # loop
    d.rect(21, 34, 7, 1, metaal)
    d.rect(26, 36, 3, 4, metaalD)   # kolf
    d.p(20, 35, '#000000')
    # hals en hoofd
    d.rect(20, 18, 9, 5, huidS)
    d.rect(18, 21, 13, 3, uni)
    d.ellips(24, 14, 8, 8, huid)
    d.ellips(28, 15, 4, 7, huidS, alleen=lambda x, y: x > 28)
    d.rect(18, 17, 3, 2, wang)
    # gezicht: streng
    d.rect(19, 11, 4, 1, '#3a2a1e')
    d.rect(26, 11, 4, 1, '#3a2a1e')
    d.rect(20, 13, 2, 2, '#202028')
    d.rect(27, 13, 2, 2, '#202028')
    d.rect(23, 15, 2, 3, huidS)
    if cfg.get('epauletten'):
        d.rect(12, 23, 7, 2, '#c8b060')
        d.rect(30, 23, 7, 2, '#c8b060')
    if cfg.get('bril'):
        for ox in (19, 26):
            d.rect(ox, 12, 4, 4, '#2a2a30')
            d.rect(ox + 1, 13, 2, 2, '#c8e4f0')
        d.rect(23, 13, 3, 1, '#2a2a30')
    if cfg.get('snor'):
        d.ellips(24, 19, 6, 1.6, '#4a3424')
        d.rect(21, 21, 6, 1, '#7a3a30')
    elif cfg['hoofd'] != 'helm':
        d.rect(21, 19, 6, 1, '#7a3a30')
    if cfg['hoofd'] == 'pet':
        d.ellips(24, 6, 11, 4.5, helm, alleen=lambda x, y: y <= 8)
        d.rect(13, 6, 22, 3, helmS)
        d.rect(14, 8, 20, 2, '#1e1e22')
        d.ellips(24, 9.5, 10, 1.6, '#1e1e22')
        d.rect(21, 3, 6, 2, helmL)
    elif cfg['hoofd'] == 'veldmuts':
        # schuitje: plat mutsje schuin op het hoofd
        for i in range(5):
            d.rect(16 + i, 3 + i, 18 - i, 1, helm if i < 4 else helmS)
        d.rect(16, 7, 18, 2, helmS)
        d.rect(18, 4, 6, 1, helmL)
    else:
        d.rect(21, 19, 6, 1, '#7a3a30')
        # stalen helm met brede rand
        d.ellips(24, 9, 12, 9, helm, alleen=lambda x, y: y <= 9)
        d.ellips(24, 9, 12, 9, helmS, alleen=lambda x, y: x > 30 and y <= 9)
        d.ellips(20, 4, 4, 2.5, helmL)
        for y in range(9, 14):
            b = 12 + (y - 9)
            d.rect(24 - b, y, 2 * b, 1, helm if y < 12 else helmS)
        d.rect(16, 13, 16, 1, helmS)
        if cfg.get('takjes'):
            for (x, y) in ((15, 6), (19, 3), (24, 2), (29, 4), (33, 8), (13, 10), (21, 7), (28, 9)):
                d.rect(x, y, 2, 2, '#3e7a3a')
                d.p(x + 1, y - 1, '#5aa852')
    return omlijn(d.img, OMLIJNING)


# ------------------------------------------------------------------ de beer van achteren

def beer_rug():
    d = Doek(48, 56)
    vacht, vachtS, vachtL = '#b8743c', '#8a5228', '#dc9c5c'
    muts, mutsS, mutsL, pompon = '#d84030', '#a02820', '#f47c5c', '#f0e8d8'
    trui, truiS, truiL = '#4a7ad2', '#2f56a0', '#7cacf0'
    zak, zakS = '#64748a', '#44505e'
    # benen
    d.ellips(16, 51, 5, 5, vacht)
    d.ellips(32, 51, 5, 5, vachtS)
    # trui (rug)
    d.ellips(24, 39, 14, 12, trui)
    d.ellips(31, 40, 8, 11, truiS, alleen=lambda x, y: x > 31)
    d.ellips(16, 33, 5, 4, truiL)
    # capuchon
    d.ellips(24, 28, 9, 4, truiS)
    d.ellips(24, 27, 7, 2.5, trui)
    # rugzak
    d.rect(15, 32, 18, 16, zak)
    d.rect(15, 32, 18, 2, '#8494aa')
    d.rect(15, 46, 18, 2, zakS)
    d.rect(17, 37, 14, 6, zakS)
    d.rect(18, 38, 12, 4, zak)
    d.rect(23, 36, 2, 2, '#e8c040')
    # armen; rechts met soeplepel omhoog
    d.ellips(9, 38, 4, 7, trui)
    d.ellips(8, 45, 3.5, 3, vacht)
    d.ellips(40, 32, 4, 7, truiS)
    d.ellips(42, 25, 3.5, 3, vachtS)
    d.rect(42, 8, 2, 16, '#b8b8c8')
    d.rect(42, 8, 1, 16, '#e0e0ec')
    d.ellips(43, 6, 4, 3, '#a8a8b8')
    d.ellips(42.5, 5.5, 2.5, 1.6, '#d8d8e4')
    # oren
    d.ellips(10, 9, 5, 5, vacht)
    d.ellips(38, 9, 5, 5, vachtS)
    # achterhoofd
    d.ellips(24, 18, 14, 11, vacht)
    d.ellips(31, 19, 7, 10, vachtS, alleen=lambda x, y: x > 33)
    d.ellips(17, 15, 5, 4, vachtL)
    # muts (achterkant)
    d.ellips(24, 9, 13, 8, muts, alleen=lambda x, y: y <= 11)
    d.ellips(30, 8, 7, 7, mutsS, alleen=lambda x, y: x > 31 and y <= 11)
    d.ellips(19, 5, 4, 2.5, mutsL)
    d.rect(10, 10, 28, 4, mutsS)
    for x in range(11, 38, 2):
        d.lijn_v(x, 10, 13, muts)
    d.ellips(24, 1.5, 4, 3, pompon)
    return omlijn(d.img, OMLIJNING)


# ------------------------------------------------------------------ de volkszanger

def volkszanger(open_=False):
    d = Doek(48, 56)
    huid, huidS, wang = '#f0c49a', '#cc9a72', '#ec8a78'
    hemd, hemdS = '#f4f4f4', '#c8ccd8'
    leer, leerS, leerL = '#7a5030', '#5a3820', '#9a6a44'
    sok, schoen = '#f0f0f0', '#3a2a20'
    hoed, hoedS = '#3e6a3a', '#2a4a28'
    snor = '#6a4424'
    # benen: lederhosen tot de knie, witte kniekousen
    d.rect(15, 40, 8, 6, leer)
    d.rect(25, 40, 8, 6, leerS)
    d.rect(16, 46, 6, 6, sok)
    d.rect(26, 46, 6, 6, '#d8d8e0')
    d.rect(15, 51, 8, 4, schoen)
    d.rect(25, 51, 8, 4, schoen)
    # romp: wit hemd met bretels
    d.ellips(24, 32, 12, 11, hemd)
    d.ellips(30, 33, 6, 10, hemdS, alleen=lambda x, y: x > 30)
    d.rect(13, 36, 22, 6, leer)
    d.rect(17, 22, 3, 16, leer)
    d.rect(28, 22, 3, 16, leer)
    d.rect(17, 28, 14, 3, leerL)
    # accordeon voor de buik
    breed = 26 if open_ else 20
    x0 = 24 - breed // 2
    d.rect(x0, 27, 6, 13, '#c83030')       # linkerkast
    d.rect(x0 + 1, 28, 4, 11, '#e85050')
    for y in range(29, 39, 2):
        d.rect(x0 + 1, y, 3, 1, '#f8f8f8')  # knopjes
    balg = breed - 12
    for i in range(balg):
        kleur = '#f0e0c0' if i % 2 == 0 else '#a08a60'
        d.rect(x0 + 6 + i, 26 + (i % 2), 1, 15 - (i % 2) * 2, kleur)
    d.rect(x0 + breed - 6, 27, 6, 13, '#c83030')  # rechterkast
    d.rect(x0 + breed - 5, 28, 4, 11, '#e85050')
    d.rect(x0 + breed - 4, 30, 2, 7, '#f0d060')
    # handen aan het accordeon
    d.ellips(x0 - 1, 33, 2.5, 2.5, huid)
    d.ellips(x0 + breed + 1, 33, 2.5, 2.5, huidS)
    # hoofd
    d.rect(21, 17, 6, 4, huidS)
    d.ellips(24, 13, 8, 8, huid)
    d.ellips(28, 14, 4, 7, huidS, alleen=lambda x, y: x > 28)
    d.rect(17, 15, 3, 3, wang)
    d.rect(28, 15, 3, 3, wang)
    # ogen dicht van plezier
    d.rect(19, 11, 3, 1, '#2a1a1a')
    d.rect(26, 11, 3, 1, '#2a1a1a')
    d.p(19, 10, '#2a1a1a')
    d.p(28, 10, '#2a1a1a')
    # flinke snor en (zingende) mond
    d.ellips(24, 16.5, 6.5, 1.8, snor)
    d.p(17, 17, snor)
    d.p(31, 17, snor)
    if open_:
        d.ellips(24, 19.5, 2.5, 2, '#7a2a2a')
        d.rect(23, 19, 2, 1, '#e86868')
    else:
        d.rect(22, 19, 4, 1, '#7a2a2a')
    # tirolerhoed met veer
    d.ellips(24, 5, 9, 5, hoed, alleen=lambda x, y: y <= 6)
    d.rect(14, 5, 20, 2, hoed)
    d.ellips(24, 7, 12, 2, hoedS)
    d.rect(15, 4, 18, 1, '#a07a3a')
    d.lijn(31, 4, 37, -2, '#e8e8e8')
    d.lijn(32, 4, 38, -1, '#c8c8c8')
    d.lijn(30, 4, 34, -3, '#4a6a9a')
    return omlijn(d.img, OMLIJNING)


# ------------------------------------------------------------------ achtergrond

def achtergrond():
    random.seed(11)
    w, h = 240, 112
    img = Image.new('RGBA', (w, h), K('#000000'))
    d = Doek(w, h)
    d.img = img
    d.px = img.load()
    # lucht in banden
    banden = ['#78b8e8', '#88c4ec', '#98ccee', '#a8d6f0', '#b8def2']
    for i, c in enumerate(banden):
        d.rect(0, i * 8, w, 8, c)
    # wolken
    for (cx, cy, r) in ((40, 12, 9), (52, 10, 7), (180, 16, 8), (192, 13, 10), (205, 17, 6)):
        d.ellips(cx, cy, r, r * 0.6, '#f4f8fc')
    # bomenrij
    for x in range(-4, w + 4, 6):
        top = 22 + random.randint(0, 6)
        for y in range(top, 50):
            b = (y - top) // 2 + 1
            d.rect(x - b, y, 2 * b, 1, '#3a6a44' if (x // 6) % 2 else '#2e5a3a')
    d.rect(0, 46, w, 6, '#2e5a3a')
    # hek met prikkeldraad
    for x in range(4, w, 22):
        d.rect(x, 34, 2, 20, '#5a4a3a')
        d.rect(x, 34, 1, 20, '#7a6650')
    for y in (37, 42, 47):
        for x in range(w):
            d.p(x, y + (1 if x % 5 == 2 else 0), '#5a5e66')
    # wachttoren links
    d.rect(14, 12, 3, 40, '#4a3a2a')
    d.rect(34, 12, 3, 40, '#4a3a2a')
    d.rect(10, 6, 30, 10, '#5a4a3a')
    d.rect(13, 8, 24, 5, '#f0d880')
    d.rect(8, 3, 34, 3, '#3a3440')
    # grond (grind)
    grondkleuren = ['#bcac88', '#c4b492', '#ccbc9a', '#d2c4a2']
    for i, c in enumerate(grondkleuren):
        d.rect(0, 54 + i * 15, w, 15, c)
    for _ in range(500):
        x, y = random.randrange(w), random.randrange(54, h)
        d.p(x, y, random.choice(['#a89a78', '#dccfae', '#b0a080']))
    # podia
    d.ellips(176, 80, 46, 11, '#9a8a68')
    d.ellips(176, 78, 44, 10, '#d8caa8')
    d.ellips(170, 77, 30, 5, '#e4d8ba')
    d.ellips(62, 112, 60, 14, '#9a8a68')
    d.ellips(62, 110, 58, 13, '#d8caa8')
    d.ellips(56, 108, 38, 6, '#e4d8ba')
    return img


def achtergrond_bos():
    """Gevechtsachtergrond in het bos: dichte dennen, een open plek met mos en dennennaalden."""
    random.seed(12)
    w, h = 240, 112
    img = Image.new('RGBA', (w, h), K('#000000'))
    d = Doek(w, h)
    d.img = img
    d.px = img.load()
    # lucht die tussen de bomen door piept
    banden = ['#8cc0dc', '#9ccae0', '#acd4e4', '#bcdce8']
    for i, c in enumerate(banden):
        d.rect(0, i * 6, w, 6, c)
    # achterste bomenrij (donker, blauwig)
    for x in range(-6, w + 6, 9):
        top = 2 + random.randint(0, 8)
        for y in range(top, 46):
            b = (y - top) // 2 + 1
            d.rect(x - b, y, 2 * b, 1, '#2a4a40' if (x // 9) % 2 else '#24423a')
    # voorste bomenrij (groener), met stammen
    for x in range(-4, w + 4, 14):
        top = 10 + random.randint(0, 10)
        for y in range(top, 50):
            b = (y - top) // 2 + 2
            kleur = '#2e6a3a' if (x // 14) % 2 else '#3a7a44'
            d.rect(x - b, y, 2 * b, 1, kleur)
            if (y - top) % 6 == 5:
                d.rect(x - b, y, 2 * b, 1, '#245a30')
        d.rect(x - 2, 50, 4, 6, '#5a3a24')
    d.rect(0, 50, w, 4, '#24502e')
    # bosgrond
    grondkleuren = ['#4e7a3e', '#56843f', '#5e8c44', '#669448']
    for i, c in enumerate(grondkleuren):
        d.rect(0, 54 + i * 15, w, 15, c)
    for _ in range(420):
        x, y = random.randrange(w), random.randrange(54, h)
        d.p(x, y, random.choice(['#46703a', '#74a052', '#7a5a34', '#3e6a34']))
    for _ in range(40):  # dennennaalden
        x, y = random.randrange(w - 3), random.randrange(56, h)
        d.rect(x, y, 3, 1, '#8a6a3c')
    # paddenstoeltjes en varens aan de rand
    for (x, y) in ((8, 64), (226, 70), (120, 58)):
        d.rect(x, y, 1, 3, '#f0e8d8')
        d.ellips(x + 0.5, y, 2.5, 1.5, '#d83a30')
    for (x, y) in ((24, 60), (210, 59), (96, 62)):
        for dx in (-4, -2, 0, 2, 4):
            d.lijn(x, y + 6, x + dx, y, '#3e8a3e')
    # podia (mos)
    d.ellips(176, 80, 46, 11, '#3e6a32')
    d.ellips(176, 78, 44, 10, '#78a858')
    d.ellips(170, 77, 30, 5, '#88b866')
    d.ellips(62, 112, 60, 14, '#3e6a32')
    d.ellips(62, 110, 58, 13, '#78a858')
    d.ellips(56, 108, 38, 6, '#88b866')
    return img


# ------------------------------------------------------------------ effecten

def noot():
    d = Doek(8, 10)
    d.ellips(2.5, 7.5, 2.5, 2, '#303048')
    d.rect(4, 1, 1, 7, '#303048')
    d.rect(4, 1, 3, 1, '#303048')
    d.rect(6, 1, 1, 3, '#303048')
    return d.img


def uitroep():
    d = Doek(12, 14)
    d.ellips(6, 6, 6, 6, '#ffffff')
    d.rect(5, 11, 3, 3, '#ffffff')
    d.rect(5, 2, 2, 6, '#e03030')
    d.rect(5, 9, 2, 2, '#e03030')
    return omlijn(d.img, K('#303030'), diagonaal=False)


def ster():
    d = Doek(7, 7)
    for (x, y) in ((3, 0), (3, 1), (0, 3), (1, 3), (2, 3), (3, 3), (4, 3), (5, 3), (6, 3), (3, 5), (3, 6), (2, 2), (4, 2), (2, 4), (4, 4)):
        d.p(x, y, '#f8d838')
    d.p(3, 3, '#ffffff')
    return d.img


def flits():
    d = Doek(14, 14)
    d.ellips(7, 7, 6, 3, '#f8a838')
    d.ellips(7, 7, 3, 6, '#f8a838')
    d.ellips(7, 7, 4, 4, '#f8e060')
    d.ellips(7, 7, 2, 2, '#ffffff')
    return d.img


def inslag():
    d = Doek(18, 18)
    for (x0, y0, x1, y1) in ((9, 0, 9, 17), (0, 9, 17, 9), (2, 2, 15, 15), (15, 2, 2, 15)):
        d.lijn(x0, y0, x1, y1, '#f8f0a0')
    d.ellips(9, 9, 5, 5, '#ffffff')
    d.ellips(9, 9, 3, 3, '#f8e060')
    return d.img


def snee():
    d = Doek(24, 24)
    for i, kleur in ((0, '#ffffff'), (1, '#c8d8f0'), (5, '#ffffff'), (6, '#c8d8f0'), (10, '#ffffff')):
        d.lijn(2 + i, 2, 21, 21 - i, kleur)
    return d.img


def lepel():
    d = Doek(24, 24)
    d.lijn(3, 21, 15, 9, '#a8a8b8')
    d.lijn(4, 21, 16, 9, '#d8d8e4')
    d.lijn(3, 20, 15, 8, '#7c7c90')
    d.ellips(18, 6, 5, 4, '#a8a8b8')
    d.ellips(17.5, 5.5, 3, 2, '#e4e4ee')
    return omlijn(d.img, K('#2a2a30'))


def alles():
    return {
        'gevecht_wachter_klaus': wachter('klaus'),
        'gevecht_wachter_dieter': wachter('dieter'),
        'gevecht_soldaat_horst': wachter('horst'),
        'gevecht_soldaat_jurgen': wachter('jurgen'),
        'gevecht_feldwebel_uwe': wachter('uwe'),
        'gevecht_unteroffizier_bernd': wachter('bernd'),
        'gevecht_grenzer_helmut': wachter('helmut'),
        'gevecht_beer_rug': beer_rug(),
        'effect_noot': noot(),
        'effect_uitroep': uitroep(),
        'effect_ster': ster(),
        'effect_flits': flits(),
        'effect_inslag': inslag(),
        'effect_snee': snee(),
        'effect_lepel': lepel(),
    }


if __name__ == '__main__':
    from pixel import voorbeeld
    bg = achtergrond()
    bg.alpha_composite(wachter('klaus'), (152, 26))
    bg.alpha_composite(beer_rug(), (40, 56))
    bg.alpha_composite(volkszanger(True), (0, 56))
    groot = Image.new('RGBA', (240 + 48 * 4 + 20, 112), (90, 140, 90, 255))
    groot.paste(bg, (0, 0))
    for i, s in enumerate([wachter('klaus'), wachter('dieter'), volkszanger(False), volkszanger(True)]):
        groot.alpha_composite(s, (244 + i * 48, 0))
    x = 244
    for e in (noot(), uitroep(), ster(), flits(), inslag(), snee(), lepel()):
        groot.alpha_composite(e, (x, 70))
        x += e.size[0] + 3
    groot.resize((groot.size[0] * 3, groot.size[1] * 3), Image.NEAREST).save('voorbeeld_gevecht.png')
