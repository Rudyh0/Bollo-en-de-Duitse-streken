"""Interface-onderdelen: kaders, cursor, pijltje, item-iconen, patroon."""
from PIL import Image
from pixel import maak_palet, sprite, hexkleur

K = hexkleur

# 24x24 kaders met hoeken van 8 pixels (voor Phaser NineSlice)
KADER_TEKST = [
    "...kkkkkkkkkkkkkkkkkk...",
    ".kkbbbbbbbbbbbbbbbbbbkk.",
    ".kbBBBBBBBBBBBBBBBBBBbk.",
    "kbBkkkkkkkkkkkkkkkkkkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkwwwwwwwwwwwwwwwwkBbk",
    "kbBkkkkkkkkkkkkkkkkkkBbk",
    ".kbBBBBBBBBBBBBBBBBBBbk.",
    ".kkbbbbbbbbbbbbbbbbbbkk.",
    "...kkkkkkkkkkkkkkkkkk...",
]


def kader(palet, naam):
    return sprite(KADER_TEKST, maak_palet(palet), 24, 24, naam)


def kaders():
    return {
        'kader_tekst': kader({'k': '#384058', 'b': '#8ca0c8', 'B': '#c8d4ec', 'w': '#f8f8f8'}, 'kader-tekst'),
        'kader_menu': kader({'k': '#484050', 'b': '#d07060', 'B': '#f0b0a0', 'w': '#f8f8f8'}, 'kader-menu'),
        'kader_info': kader({'k': '#3c5040', 'b': '#78a878', 'B': '#c0e0b8', 'w': '#f8f8f0'}, 'kader-info'),
    }


CURSOR = [
    "k....",
    "kk...",
    "kkk..",
    "kkkk.",
    "kkk..",
    "kk...",
    "k....",
]
PIJL = [
    "rrrrrrr",
    ".rrrrr.",
    "..rrr..",
    "...r...",
]


def cursor():
    img = Image.new('RGBA', (6, 8), (0, 0, 0, 0))
    schaduw = sprite(CURSOR, maak_palet({'k': '#d0d0c8'}), 5, 7)
    voor = sprite(CURSOR, maak_palet({'k': '#404048'}), 5, 7)
    img.alpha_composite(schaduw, (1, 1))
    img.alpha_composite(voor, (0, 0))
    return img


def pijl():
    img = Image.new('RGBA', (8, 5), (0, 0, 0, 0))
    img.alpha_composite(sprite(PIJL, maak_palet({'r': '#a8a8a8'}), 7, 4), (1, 1))
    img.alpha_composite(sprite(PIJL, maak_palet({'r': '#e04038'}), 7, 4), (0, 0))
    return img


ICOON_PALET = maak_palet({
    'k': '#2a2a30', 'w': '#f4f0e0', 'W': '#d6ceb4', 'r': '#c83c34', 'g': '#5a8a4a',
    'm': '#b8b8c8', 'M': '#7c7c90', 'l': '#e8e8f4', 'h': '#8a5a34', 'H': '#5e3a1e',
    'y': '#e8c040',
})
VOEDSELBON = [
    "................",
    "................",
    "..kkkkkkkkkkkk..",
    ".kwwwwwwwwwwwwk.",
    ".kwkkwwkkkwwWwk.",
    ".kwwwwwwwwwrrwk.",
    ".kwkkkkwwwrwwrk.",
    ".kWwwwwwwwrwwrk.",
    ".kwkkkwwwwwrrwk.",
    ".kwwwwwwwwwwwWk.",
    ".kw.w.w.w.w.wWk.",
    ".kwwwwwwwwwwwWk.",
    ".kWWWWWWWWWWWWk.",
    "..kkkkkkkkkkkk..",
    "................",
    "................",
]
SOEPLEPEL = [
    "................",
    "............kk..",
    "...........kmk..",
    "..........kmk...",
    ".........kmk....",
    "........kmk.....",
    ".......kMk......",
    "......kmk.......",
    "..kkkkmk........",
    ".klllmmMk.......",
    "kllmmmmMMk......",
    "kmmmmmmMMk......",
    "kMmmmmMMMk......",
    ".kMMMMMMk.......",
    "..kkkkkk........",
    "................",
]
RUGZAK_ICOON = [
    "................",
    ".....kkkkkk.....",
    "....kHk..kHk....",
    "...kkkkkkkkkk...",
    "..khhhhhhhhhhk..",
    "..khhhhhhhhhHk..",
    "..kkkkkkkkkkkk..",
    "..khhhhyyhhhHk..",
    "..khhhhhhhhhHk..",
    "..khkkkkkkkhHk..",
    "..khkhhhhhkhHk..",
    "..khkhhhhhkhHk..",
    "..khkkkkkkkhHk..",
    "..kHHHHHHHHHHk..",
    "...kkkkkkkkkk...",
    "................",
]


def iconen():
    return {
        'icoon_voedselbon': sprite(VOEDSELBON, ICOON_PALET, 16, 16, 'voedselbon'),
        'icoon_soeplepel': sprite(SOEPLEPEL, ICOON_PALET, 16, 16, 'soeplepel'),
        'icoon_rugzak': sprite(RUGZAK_ICOON, ICOON_PALET, 16, 16, 'rugzak'),
    }


def patroon():
    """Tegel voor achtergronden van naam- en instellingenschermen."""
    rijen = [
        "aaaaaaaabaaaaaaa",
        "aaaaaaabbbaaaaaa",
        "aaaaaabbcbbaaaaa",
        "aaaaaaabbbaaaaaa",
        "aaaaaaaabaaaaaaa",
        "aaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaa",
        "baaaaaaaaaaaaaaa",
        "bbaaaaaaaaaaaaab",
        "cbbaaaaaaaaaaabb",
        "bbaaaaaaaaaaaaab",
        "baaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaa",
    ]
    return sprite(rijen, maak_palet({'a': '#e8f0d8', 'b': '#d0e0bc', 'c': '#b8d0a0'}), 16, 16, 'patroon')
