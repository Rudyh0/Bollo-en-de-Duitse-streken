"""Tegels en objecten voor de barak (binnen)."""
from PIL import Image
from pixel import maak_palet, sprite, hexkleur

K = hexkleur

# ---------------------------------------------------------------- helpers

def nieuw(w, h):
    return Image.new('RGBA', (w, h), (0, 0, 0, 0))


def rect(img, x, y, w, h, kleur):
    px = img.load()
    c = K(kleur) if isinstance(kleur, str) else kleur
    for yy in range(max(0, y), min(img.size[1], y + h)):
        for xx in range(max(0, x), min(img.size[0], x + w)):
            px[xx, yy] = c


def pix(img, x, y, kleur):
    if 0 <= x < img.size[0] and 0 <= y < img.size[1]:
        img.load()[x, y] = K(kleur) if isinstance(kleur, str) else kleur


def donkerder(img, rijen, factor=0.72):
    px = img.load()
    for y in rijen:
        for x in range(img.size[0]):
            r, g, b, a = px[x, y]
            px[x, y] = (int(r * factor), int(g * factor), int(b * factor), a)


# ---------------------------------------------------------------- vloer

VLOER_PALET = maak_palet({
    'g': '#cda474', 'f': '#bb8f5f', 'F': '#a67b4d', 'd': '#8d6741', 'n': '#6e4f33',
})

VLOER_A = [
    "gggggggdgggggggg",
    "fffffffdffffffff",
    "fffffffdffffffff",
    "dddddddddddddddd",
    "gggggggggggggdgg",
    "fffffffffffffdff",
    "fFfffffffffffdff",
    "dddddddddddddddd",
    "gggdgggggggggggg",
    "fffdfffffffnffff",
    "fffdffffffffffff",
    "dddddddddddddddd",
    "ggggggggggdggggg",
    "ffffffffffdfffff",
    "ffffffffffdffFff",
    "dddddddddddddddd",
]
VLOER_B = [
    "gggggggggggdgggg",
    "fffffffffffdffff",
    "fffnfffffffdffff",
    "dddddddddddddddd",
    "gggggdgggggggggg",
    "fffffdffffffffff",
    "fffffdffffffFfff",
    "dddddddddddddddd",
    "gggggggggggggdgg",
    "fffffffffffffdff",
    "ffFffffffffffdff",
    "dddddddddddddddd",
    "ggdggggggggggggg",
    "ffdfffffffffnfff",
    "ffdfffffffffffff",
    "dddddddddddddddd",
]

# ---------------------------------------------------------------- muren

MUUR_PALET = maak_palet({
    'x': '#2a180e', 'W': '#563620', 'w': '#704830', 'v': '#8a5c38', 'L': '#a8784a',
})

PLANKEN = "vwwWvwwWvwwWvwwW"


def muur_boven():
    rijen = ["xxxxxxxxxxxxxxxx", "WWWWWWWWWWWWWWWW", "LLLLLLLLLLLLLLLL", "xxxxxxxxxxxxxxxx"]
    for i in range(12):
        r = PLANKEN
        if i in (2, 9):
            r = r[:2] + 'x' + r[3:10] + 'x' + r[11:]
        rijen.append(r)
    return sprite(rijen, MUUR_PALET, 16, 16, 'muur-boven')


def muur_onder():
    rijen = [PLANKEN for _ in range(11)]
    rijen[5] = PLANKEN[:2] + 'x' + PLANKEN[3:10] + 'x' + PLANKEN[11:]
    rijen += ["xxxxxxxxxxxxxxxx", "LLLLLLLLLLLLLLLL", "vvvvvvvvvvvvvvvv", "wwwwwwwwwwwwwwww", "xxxxxxxxxxxxxxxx"]
    return sprite(rijen, MUUR_PALET, 16, 16, 'muur-onder')


RAAM_PALET = maak_palet({
    'k': '#2a180e', 'n': '#d4ccb8', 'N': '#9c9480', 'L': '#e8e2d2',
    'b': '#a8d6ee', 'B': '#84b8dc', 't': '#4c7c46', 'T': '#2f5631',
    'f': '#585858', 'h': '#8e5c8c', 'H': '#6a4270',
})
RAAM = [
    "kkkkkkkkkkkkkk",
    "knnnnnnnnnnnnk",
    "knbbbbnnbbbBNk",
    "knbbbbnnbbbbNk",
    "knbbtbnnbbbtNk",
    "kntttbnnbtttNk",
    "kntTttnnttTtNk",
    "knTTTTnnTTTTNk",
    "knnnnnnnnnnnNk",
    "knNNNNnnNNNNNk",
    "knffffnnffffNk",
    "knhhhhnnhhhhNk",
    "knhfhhnnhhfhNk",
    "knhHhhnnhhHhNk",
    "knhhhhnnhhhhNk",
    "knnnnnnnnnnnNk",
    "kNNNNNNNNNNNNk",
    "kLLLLLLLLLLLLk",
    "kkkkkkkkkkkkkk",
]


def raam_tegels():
    muur = nieuw(16, 32)
    muur.paste(muur_boven(), (0, 0))
    muur.paste(muur_onder(), (0, 16))
    raam = sprite(RAAM, RAAM_PALET, 14, 19, 'raam')
    muur.alpha_composite(raam, (1, 6))
    return muur.crop((0, 0, 16, 16)), muur.crop((0, 16, 16, 32))


def deur_tegels():
    """Deur in de muur (twee tegels hoog)."""
    muur = nieuw(16, 32)
    muur.paste(muur_boven(), (0, 0))
    muur.paste(muur_onder(), (0, 16))
    k, L, o, O, d = '#2a180e', '#9a6a40', '#6e4628', '#4c2f1a', '#86583a'
    rect(muur, 1, 5, 14, 27, k)
    rect(muur, 2, 6, 12, 26, L)
    rect(muur, 3, 7, 10, 25, k)
    rect(muur, 4, 8, 8, 24, o)
    for x in (6, 9):
        rect(muur, x, 8, 1, 24, O)
    for x in (4, 7, 10):
        rect(muur, x, 8, 1, 24, d)
    # klein tralievenster
    rect(muur, 5, 10, 6, 5, k)
    rect(muur, 6, 11, 4, 3, '#203040')
    rect(muur, 7, 11, 1, 3, '#8a8a96')
    rect(muur, 8, 11, 1, 3, '#8a8a96')
    # scharnieren
    for y in (17, 27):
        rect(muur, 4, y, 4, 1, '#7a7a88')
        rect(muur, 4, y + 1, 4, 1, '#4a4a56')
    # klink
    rect(muur, 10, 21, 2, 2, '#e0bc48')
    pix(muur, 11, 22, '#9a7a20')
    return muur.crop((0, 0, 16, 16)), muur.crop((0, 16, 16, 32))


def deur_open_tegels():
    """Open deur: je kijkt naar buiten (daglicht en grind)."""
    muur = nieuw(16, 32)
    muur.paste(muur_boven(), (0, 0))
    muur.paste(muur_onder(), (0, 16))
    k, L = '#2a180e', '#9a6a40'
    rect(muur, 1, 5, 14, 27, k)
    rect(muur, 2, 6, 12, 26, L)
    rect(muur, 3, 7, 10, 25, '#a8d4ec')
    rect(muur, 3, 7, 10, 6, '#cfe8f4')
    rect(muur, 3, 19, 10, 13, '#cbbb98')
    rect(muur, 3, 19, 10, 1, '#5aa850')
    rect(muur, 3, 13, 10, 6, '#4c7c46')
    # opengeslagen deurblad
    rect(muur, 3, 7, 3, 25, '#6e4628')
    rect(muur, 5, 7, 1, 25, '#4c2f1a')
    return muur.crop((0, 0, 16, 16)), muur.crop((0, 16, 16, 32))


def prikbord_tegel():
    t = muur_onder()
    k = '#2a180e'
    rect(t, 2, 1, 12, 9, k)
    rect(t, 3, 2, 10, 7, '#c49260')
    rect(t, 3, 8, 10, 1, '#9c7046')
    rect(t, 4, 3, 4, 4, '#f4f0e4')
    rect(t, 5, 4, 2, 1, '#888888')
    rect(t, 5, 5, 2, 1, '#888888')
    rect(t, 9, 2, 3, 5, '#e8e0a0')
    pix(t, 10, 3, '#888888')
    pix(t, 10, 4, '#888888')
    pix(t, 5, 3, '#d04040')
    pix(t, 10, 2, '#4060c0')
    return t


def zijmuur(links=True):
    t = nieuw(16, 16)
    rect(t, 0, 0, 16, 16, '#2a180e')
    if links:
        rect(t, 11, 0, 3, 16, '#563620')
        rect(t, 14, 0, 2, 16, '#a8784a')
    else:
        rect(t, 2, 0, 3, 16, '#563620')
        rect(t, 0, 0, 2, 16, '#a8784a')
    return t


def onderrand():
    t = nieuw(16, 16)
    rect(t, 0, 0, 16, 16, '#2a180e')
    rect(t, 0, 0, 16, 2, '#a8784a')
    rect(t, 0, 2, 16, 3, '#563620')
    return t


def hoek():
    t = nieuw(16, 16)
    rect(t, 0, 0, 16, 16, '#2a180e')
    return t


def vloer_schaduw(basis):
    t = basis.copy()
    donkerder(t, [0, 1], 0.6)
    donkerder(t, [2, 3], 0.8)
    return t


def tegelset():
    """Volgorde moet overeenkomen met js/maps/tegels.js."""
    va = sprite(VLOER_A, VLOER_PALET, 16, 16, 'vloer-a')
    vb = sprite(VLOER_B, VLOER_PALET, 16, 16, 'vloer-b')
    raam_b, raam_o = raam_tegels()
    deur_b, deur_o = deur_tegels()
    open_b, open_o = deur_open_tegels()
    tegels = [
        va,                       # 0 vloer
        vb,                       # 1 vloer variant
        vloer_schaduw(va),        # 2 vloer onder muur
        vloer_schaduw(vb),        # 3 vloer onder muur variant
        muur_boven(),             # 4
        muur_onder(),             # 5
        raam_b,                   # 6
        raam_o,                   # 7
        deur_b,                   # 8
        deur_o,                   # 9
        prikbord_tegel(),         # 10
        zijmuur(True),            # 11
        zijmuur(False),           # 12
        onderrand(),              # 13
        hoek(),                   # 14
        open_b,                   # 15 open deur boven
        open_o,                   # 16 open deur onder
    ]
    return tegels


# ---------------------------------------------------------------- objecten

BED_PALET = maak_palet({
    'k': '#2a1a10', 'L': '#9c6a40', 'O': '#5a3820', 'o': '#7a5030',
    'p': '#eeeade', 'P': '#c8c2b2', 'a': '#8a92aa', 'A': '#666e88', 'i': '#a8b0c8',
    'z': '#3a2a20', 'Z': '#4e3a2c', 'r': '#c04838', 'R': '#8c2e24', 's': '#d6be7a',
})

def stapelbed(variant='grijs'):
    deken = {'grijs': ('a', 'A', 'i'), 'rood': ('r', 'R', 'r')}[variant]
    a, A, i = deken
    rijen = [
        ".kkkkkkkkkkkkkk.",
        "kLLLLLLLLLLLLLLk",
        "kOOOOOOOOOOOOOOk",
        "kokkkkkkkkkkkkok",
        "kokppppppppppkok",
        "kokpppppppppPkok",
        "kokPPPPPPPPPPkok",
        f"kok{i*10}kok",
        f"kok{a*10}kok",
        f"kok{a*10}kok",
        f"kok{A*10}kok",
        f"kok{a*10}kok",
        f"kok{a*10}kok",
        f"kok{A*10}kok",
        f"kok{a*10}kok",
        "kokkkkkkkkkkkkok",
        "kLLLLLLLLLLLLLLk",
        "kOOOOOOOOOOOOOOk",
        "kokkkkkkkkkkkkok",
        "kokzzzzzzzzzzkok",
        "kokzzzzzzzzzzkok",
        "kokssssssssssko k".replace(' ', ''),
        "kokZZZZZZZZZZkok",
        "kokAAAAAAAAAAkok",
        "kokAAAAAAAAAAkok",
        "kokkkkkkkkkkkkok",
        "kLLLLLLLLLLLLLLk",
        "kOOOOOOOOOOOOOOk",
        "kkkkkkkkkkkkkkkk",
        "kok..........kok",
        "kok..........kok",
        ".k............k.",
    ]
    return sprite(rijen, BED_PALET, 16, 32, 'stapelbed-' + variant)


KIST_PALET = maak_palet({
    'k': '#24160c', 'L': '#c48c52', 'o': '#9a6a3a', 'O': '#6e4824',
    'm': '#a4a4b2', 'M': '#6a6a78', 'y': '#e8c440', 'z': (0, 0, 0, 90),
    'd': '#1a1210',
})

KIST_DICHT = [
    ".kkkkkkkkkkkk.",
    "kLLmLLLLLLmLLk",
    "kooMooooooMook",
    "kkkkkkyykkkkkk",
    "koomooyyoomook",
    "koomooOOoomook",
    "kOomoooooomoOk",
    "kOOMOOOOOOMOOk",
    "kkkkkkkkkkkkkk",
    ".zzzzzzzzzzzz.",
]
KIST_OPEN = [
    ".kkkkkkkkkkkk.",
    "kOOMOOOOOOMOOk",
    "kkkkkkkkkkkkkk",
    "kddddddddddddk",
    "koddddddddddok",
    "koomooOOoomook",
    "kOomoooooomoOk",
    "kOOMOOOOOOMOOk",
    "kkkkkkkkkkkkkk",
    ".zzzzzzzzzzzz.",
]


def kisten():
    return sprite(KIST_DICHT, KIST_PALET, 14, 10, 'kist'), sprite(KIST_OPEN, KIST_PALET, 14, 10, 'kist-open')


KACHEL_PALET = maak_palet({
    'k': '#16161c', 'i': '#3c3c48', 'I': '#26262e', 'j': '#62627a', 'r': '#f07034',
    'R': '#b83a1c', 'y': '#ffc860', 'z': (0, 0, 0, 90),
})
KACHEL = [
    ".....kkkkk......",
    ".....kjiIk......",
    ".....kjiIk......",
    ".....kjiIk......",
    ".....kjiIk......",
    ".....kjiIk......",
    ".....kjiIk......",
    ".....kjiIk......",
    "....kkkkkkk.....",
    "...kjjiiiIIk....",
    "...kkkkkkkkk....",
    "..kjiiiiiiIIk...",
    ".kjjiiiiiiiIIk..",
    ".kjiikkkkkiiIk..",
    ".kjikRrrrRkiIk..",
    ".kjikryyyrkiIk..",
    ".kjikRrrrRkiIk..",
    ".kjiikkkkkiiIk..",
    ".kjjiiiiiiiIIk..",
    "..kjiiiiiiiIk...",
    "...kkkkkkkkk....",
    "...kIk...kIk....",
    "...kkk...kkk....",
    "..zzzzzzzzzzz...",
]


def kachel():
    return sprite(KACHEL, KACHEL_PALET, 16, 24, 'kachel')


def tafel():
    """Lange houten tafel, 64x26 (4 tegels breed)."""
    w, h = 64, 26
    t = nieuw(w, h)
    k, L, l, d, D = '#2a1a10', '#d2a46e', '#b8895a', '#946a42', '#6e4c2e'
    rect(t, 0, 0, w, 18, k)
    rect(t, 1, 1, w - 2, 1, L)
    rect(t, 1, 2, w - 2, 13, l)
    for y in (6, 11):
        rect(t, 1, y, w - 2, 1, d)
    for x, y in ((15, 2), (40, 7), (27, 12), (52, 2)):
        rect(t, x, y, 1, 4, d)
    rect(t, 1, 15, w - 2, 2, D)
    # poten
    for x in (2, w - 6):
        rect(t, x, 18, 4, 6, k)
        rect(t, x + 1, 18, 2, 5, D)
    rect(t, 1, 24, w - 2, 2, (0, 0, 0, 70))
    # blikken bekers en een kom
    for cx in (10, 34):
        rect(t, cx, 4, 5, 5, '#3a3a44')
        rect(t, cx + 1, 5, 3, 3, '#a8a8b8')
        rect(t, cx + 1, 5, 3, 1, '#d8d8e4')
        rect(t, cx + 5, 6, 1, 2, '#3a3a44')
    rect(t, 47, 6, 8, 5, '#3a3a44')
    rect(t, 48, 7, 6, 3, '#9a9aaa')
    rect(t, 49, 7, 4, 1, '#6a5030')
    # gekraste boter-kaas-en-eieren
    for x in (22, 25):
        rect(t, x, 3, 1, 8, d)
    for y in (6, 8):
        rect(t, 20, y, 8, 1, d)
    return t


def kruk():
    t = nieuw(14, 14)
    k, L, l, D = '#2a1a10', '#d2a46e', '#b8895a', '#6e4c2e'
    rect(t, 1, 0, 12, 7, k)
    rect(t, 2, 1, 10, 4, l)
    rect(t, 2, 1, 10, 1, L)
    rect(t, 2, 5, 10, 1, D)
    rect(t, 2, 7, 3, 5, k)
    rect(t, 9, 7, 3, 5, k)
    rect(t, 3, 7, 1, 4, D)
    rect(t, 10, 7, 1, 4, D)
    rect(t, 1, 12, 12, 2, (0, 0, 0, 70))
    return t


def emmer():
    t = nieuw(14, 15)
    k, m, M, l, w = '#20202a', '#9a9aaa', '#6c6c7c', '#c8c8d6', '#5a7aa0'
    rect(t, 1, 2, 12, 11, k)
    rect(t, 2, 3, 10, 9, m)
    rect(t, 2, 3, 10, 3, w)
    rect(t, 2, 3, 10, 1, '#88a8c8')
    rect(t, 9, 6, 3, 6, M)
    rect(t, 3, 6, 1, 6, l)
    rect(t, 3, 0, 8, 1, k)
    rect(t, 2, 1, 1, 2, k)
    rect(t, 11, 1, 1, 2, k)
    rect(t, 1, 13, 12, 2, (0, 0, 0, 70))
    return t


def objecten():
    kist_dicht, kist_open = kisten()
    return {
        'stapelbed': stapelbed('grijs'),
        'stapelbed_rood': stapelbed('rood'),
        'kist': kist_dicht,
        'kist_open': kist_open,
        'kachel': kachel(),
        'tafel': tafel(),
        'kruk': kruk(),
        'emmer': emmer(),
    }


if __name__ == '__main__':
    from pixel import vel, voorbeeld
    tegels = tegelset()
    voorbeeld(vel(tegels, 8), 6).save('voorbeeld_tegels.png')
    obj = objecten()
    w = sum(o.size[0] + 4 for o in obj.values())
    h = max(o.size[1] for o in obj.values())
    sheet = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    x = 0
    for o in obj.values():
        sheet.paste(o, (x, 0), o)
        x += o.size[0] + 4
    voorbeeld(sheet, 5).save('voorbeeld_objecten.png')
