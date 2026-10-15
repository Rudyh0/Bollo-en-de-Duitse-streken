"""Eigen pixel-lettertype (variabele breedte) + groot titellettertype.

Elke glyph: rijen gescheiden door '/', '#' = pixel. Rij 0..6 is de hoofdletterhoogte,
rij 7..8 zijn onderstokken (g, j, p, q, y, komma).
Er worden BMFont-bestanden (.png + .xml) gemaakt die Phaser direct kan laden.
"""
from PIL import Image
from pixel import hexkleur

G = {
    'A': ".###./#...#/#...#/#####/#...#/#...#/#...#",
    'B': "####./#...#/#...#/####./#...#/#...#/####.",
    'C': ".###./#...#/#..../#..../#..../#...#/.###.",
    'D': "####./#...#/#...#/#...#/#...#/#...#/####.",
    'E': "#####/#..../#..../####./#..../#..../#####",
    'F': "#####/#..../#..../####./#..../#..../#....",
    'G': ".###./#...#/#..../#.###/#...#/#...#/.####",
    'H': "#...#/#...#/#...#/#####/#...#/#...#/#...#",
    'I': "###/.#./.#./.#./.#./.#./###",
    'J': "..##/...#/...#/...#/#..#/#..#/.##.",
    'K': "#...#/#..#./#.#../##.../#.#../#..#./#...#",
    'L': "#.../#.../#.../#.../#.../#.../####",
    'M': "#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#",
    'N': "#...#/##..#/#.#.#/#..##/#...#/#...#/#...#",
    'O': ".###./#...#/#...#/#...#/#...#/#...#/.###.",
    'P': "####./#...#/#...#/####./#..../#..../#....",
    'Q': ".###./#...#/#...#/#...#/#.#.#/#..#./.##.#",
    'R': "####./#...#/#...#/####./#.#../#..#./#...#",
    'S': ".###./#...#/#..../.###./....#/#...#/.###.",
    'T': "#####/..#../..#../..#../..#../..#../..#..",
    'U': "#...#/#...#/#...#/#...#/#...#/#...#/.###.",
    'V': "#...#/#...#/#...#/#...#/#...#/.#.#./..#..",
    'W': "#...#/#...#/#...#/#.#.#/#.#.#/##.##/#...#",
    'X': "#...#/#...#/.#.#./..#../.#.#./#...#/#...#",
    'Y': "#...#/#...#/.#.#./..#../..#../..#../..#..",
    'Z': "#####/....#/...#./..#../.#.../#..../#####",
    'a': "..../..../.##./...#/.###/#..#/.###",
    'b': "#.../#.../###./#..#/#..#/#..#/###.",
    'c': "..../..../.##./#..#/#.../#..#/.##.",
    'd': "...#/...#/.###/#..#/#..#/#..#/.###",
    'e': "..../..../.##./#..#/####/#.../.##.",
    'f': ".##/#../###/#../#../#../#..",
    'g': "..../..../.###/#..#/#..#/#..#/.###/...#/.##.",
    'h': "#.../#.../###./#..#/#..#/#..#/#..#",
    'i': "#/./#/#/#/#/#",
    'j': "..#/.../..#/..#/..#/..#/..#/#.#/.#.",
    'k': "#.../#.../#..#/#.#./##../#.#./#..#",
    'l': "#./#./#./#./#./#./.#",
    'm': "...../...../##.#./#.#.#/#.#.#/#.#.#/#.#.#",
    'n': "..../..../###./#..#/#..#/#..#/#..#",
    'o': "..../..../.##./#..#/#..#/#..#/.##.",
    'p': "..../..../###./#..#/#..#/#..#/###./#.../#...",
    'q': "..../..../.###/#..#/#..#/#..#/.###/...#/...#",
    'r': "..../..../#.##/##../#.../#.../#...",
    's': "..../..../.###/#.../.##./...#/###.",
    't': ".../.#./###/.#./.#./.#./..#",
    'u': "..../..../#..#/#..#/#..#/#..#/.###",
    'v': "...../...../#...#/#...#/.#.#./.#.#./..#..",
    'w': "...../...../#...#/#...#/#.#.#/#.#.#/.#.#.",
    'x': "...../...../#...#/.#.#./..#../.#.#./#...#",
    'y': "..../..../#..#/#..#/#..#/#..#/.###/...#/.##.",
    'z': "..../..../####/...#/.##./#.../####",
    '0': ".##./#..#/#.##/##.#/#..#/#..#/.##.",
    '1': ".#./##./.#./.#./.#./.#./###",
    '2': ".##./#..#/...#/..#./.#../#.../####",
    '3': "###./...#/...#/.##./...#/...#/###.",
    '4': "..#./.##./#.#./#.#./####/..#./..#.",
    '5': "####/#.../###./...#/...#/#..#/.##.",
    '6': ".##./#.../#.../###./#..#/#..#/.##.",
    '7': "####/...#/..#./..#./.#../.#../.#..",
    '8': ".##./#..#/#..#/.##./#..#/#..#/.##.",
    '9': ".##./#..#/#..#/.###/...#/...#/.##.",
    '.': "././././././#",
    ',': "../../../../../../.#/#.",
    '!': "#/#/#/#/#/./#",
    '?': ".##./#..#/...#/..#./.#../..../.#..",
    ':': "./././#/././#",
    ';': "../../../.#/../../.#/#.",
    "'": "#/#",
    '"': "#.#/#.#",
    '-': ".../.../.../.../###",
    '(': ".#/#./#./#./#./#./.#",
    ')': "#./.#/.#/.#/.#/.#/#.",
    '/': "..#/..#/.#./.#./.#./#../#..",
    '+': ".../.../.#./###/.#.",
    '=': ".../.../###/.../###",
    '%': "##..#/##.#./...#./..#../.#.../.#.##/#..##",
    '&': ".##../#..#./.##../.#.../#.#.#/#..#./.##.#",
    '*': ".../#.#/.#./#.#",
    '€': "..###/.#.../####./.#.../####./.#.../..###",
    '…': "...../...../...../...../...../...../#.#.#",
    '_': "..../..../..../..../..../..../####",
    '#': ".#.#./#####/.#.#./.#.#./#####/.#.#.",
    'ß': ".##./#..#/#.#./#..#/#..#/#..#/#.#.",
    '×': "..../#..#/.##./.##./#..#",
}

ACCENTEN = {
    'é': ('e', 'acuut'), 'è': ('e', 'grave'), 'ë': ('e', 'trema'), 'ê': ('e', 'dak'),
    'á': ('a', 'acuut'), 'à': ('a', 'grave'), 'ä': ('a', 'trema'), 'â': ('a', 'dak'),
    'ó': ('o', 'acuut'), 'ò': ('o', 'grave'), 'ö': ('o', 'trema'), 'ô': ('o', 'dak'),
    'ú': ('u', 'acuut'), 'ù': ('u', 'grave'), 'ü': ('u', 'trema'), 'û': ('u', 'dak'),
    'í': ('i', 'acuut'), 'ì': ('i', 'grave'), 'ï': ('i', 'trema'), 'î': ('i', 'dak'),
    'ç': ('c', 'cedille'),
}
HOOFD_ACCENT = {
    'É': 'E', 'È': 'E', 'Ë': 'E', 'Á': 'A', 'À': 'A', 'Ä': 'A', 'Ó': 'O', 'Ö': 'O',
    'Ú': 'U', 'Ü': 'U', 'Í': 'I', 'Ï': 'I', 'Ç': 'C',
}


def ontleed(s):
    rijen = s.split('/')
    w = max(len(r) for r in rijen)
    rijen = [r.ljust(w, '.') for r in rijen]
    while len(rijen) < 9:
        rijen.append('.' * w)
    return rijen


def accent_glyph(basis, soort):
    rijen = ontleed(G[basis])
    w = len(rijen[0])
    if basis == 'i':
        w = 3
        rijen = ['.' + r + '.' for r in rijen]
        rijen[0] = '...'
    else:
        rijen[0] = '.' * w
        rijen[1] = '.' * w
    if soort == 'acuut':
        rijen[0] = '.' * (w // 2) + '#' + '.' * (w - w // 2 - 1)
        if w >= 4:
            rijen[0] = '.' * (w - 2) + '#.'
    elif soort == 'grave':
        rijen[0] = '.#' + '.' * (w - 2)
    elif soort == 'trema':
        rijen[0] = '#' + '.' * (w - 2) + '#'
    elif soort == 'dak':
        mid = w // 2
        rijen[0] = '.' * (mid - 1) + '#.#' + '.' * (w - mid - 2) if w >= 3 else '#' * w
        rijen[0] = rijen[0][:w].ljust(w, '.')
    elif soort == 'cedille':
        rijen[7] = '.#'.ljust(w, '.') if w > 2 else '#'
    return rijen


def alle_glyphs():
    glyphs = {c: ontleed(s) for c, s in G.items()}
    for c, (basis, soort) in ACCENTEN.items():
        glyphs[c] = accent_glyph(basis, soort)
    for c, basis in HOOFD_ACCENT.items():
        glyphs[c] = glyphs[basis]
    return glyphs


def maak_font(naam, tekst, schaduw, map_png, map_xml, bestandsnaam):
    """Bakt alle glyphs met schaduw (rechts, onder, rechtsonder) in een PNG + BMFont XML."""
    glyphs = alle_glyphs()
    tekst_k = hexkleur(tekst)
    schaduw_k = hexkleur(schaduw) if schaduw else None
    cel_h = 10
    tekens = sorted(glyphs.keys(), key=lambda c: ord(c))
    breedte_atlas = 256
    x = y = 1
    posities = {}
    for c in tekens:
        w = len(glyphs[c][0]) + 1
        if x + w + 1 > breedte_atlas:
            x = 1
            y += cel_h + 1
        posities[c] = (x, y, w)
        x += w + 1
    hoogte_atlas = y + cel_h + 2
    img = Image.new('RGBA', (breedte_atlas, hoogte_atlas), (0, 0, 0, 0))
    px = img.load()
    for c in tekens:
        gx, gy, w = posities[c]
        rijen = glyphs[c]
        if schaduw_k:
            for ry, r in enumerate(rijen):
                for rx, v in enumerate(r):
                    if v == '#':
                        for dx, dy in ((1, 0), (0, 1), (1, 1)):
                            px[gx + rx + dx, gy + ry + dy] = schaduw_k
        for ry, r in enumerate(rijen):
            for rx, v in enumerate(r):
                if v == '#':
                    px[gx + rx, gy + ry] = tekst_k
    img.save(f'{map_png}/{bestandsnaam}.png')
    regels = [
        '<?xml version="1.0"?>',
        '<font>',
        f'  <info face="{naam}" size="10"/>',
        f'  <common lineHeight="14" base="7" scaleW="{breedte_atlas}" scaleH="{hoogte_atlas}" pages="1"/>',
        f'  <pages><page id="0" file="{bestandsnaam}.png"/></pages>',
        f'  <chars count="{len(tekens) + 1}">',
        '    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="4" page="0" chnl="15"/>',
    ]
    for c in tekens:
        gx, gy, w = posities[c]
        breedte = len(glyphs[c][0])
        regels.append(
            f'    <char id="{ord(c)}" x="{gx}" y="{gy}" width="{w}" height="{cel_h}" '
            f'xoffset="0" yoffset="0" xadvance="{breedte + 1}" page="0" chnl="15"/>'
        )
    regels += ['  </chars>', '</font>']
    with open(f'{map_xml}/{bestandsnaam}.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(regels))


def maak_titelfont(map_uit, bestandsnaam='font_titel'):
    """Groot hoofdletterfont: glyphs 2x vergroot, verloop geel->oranje, dikke donkere rand."""
    glyphs = alle_glyphs()
    tekens = [c for c in glyphs if c.isupper() or c.isdigit() or c in "!?.-'&"]
    tekens = sorted(set(tekens), key=ord)
    boven, onder = hexkleur('#ffe46a'), hexkleur('#f08a1c')
    rand, rand2 = hexkleur('#2a1408'), hexkleur('#7a2a10')
    glans = hexkleur('#fffbe0')
    S = 2
    R = 2
    cel_h = 7 * S + 2 * R + 2
    x = y = 1
    breedte_atlas = 512
    posities = {}
    for c in tekens:
        w = len(glyphs[c][0]) * S + 2 * R + 1
        if x + w + 1 > breedte_atlas:
            x = 1
            y += cel_h + 1
        posities[c] = (x, y, w)
        x += w + 1
    hoogte_atlas = y + cel_h + 2
    img = Image.new('RGBA', (breedte_atlas, hoogte_atlas), (0, 0, 0, 0))
    px = img.load()
    for c in tekens:
        gx, gy, w = posities[c]
        rijen = glyphs[c][:7]
        vul = set()
        for ry, r in enumerate(rijen):
            for rx, v in enumerate(r):
                if v == '#':
                    for sy in range(S):
                        for sx in range(S):
                            vul.add((rx * S + sx + R, ry * S + sy + R))
        # schaduw (rechtsonder), dan rand, dan vulling
        rand_set = set()
        for (vx, vy) in vul:
            for dx in range(-R, R + 1):
                for dy in range(-R, R + 1):
                    if abs(dx) + abs(dy) <= R + 1:
                        rand_set.add((vx + dx, vy + dy))
        for (vx, vy) in rand_set:
            px[gx + vx + 1, gy + vy + 1] = rand
        for (vx, vy) in rand_set:
            px[gx + vx, gy + vy] = rand2 if (vx, vy) not in vul else px[gx + vx, gy + vy]
        hoogte = 7 * S
        for (vx, vy) in vul:
            t = (vy - R) / max(1, hoogte - 1)
            kleur = tuple(int(boven[i] + (onder[i] - boven[i]) * t) for i in range(3)) + (255,)
            px[gx + vx, gy + vy] = kleur
        for (vx, vy) in vul:
            if (vx, vy - 1) not in vul and vy - R < 6:
                px[gx + vx, gy + vy] = glans
    img.save(f'{map_uit}/{bestandsnaam}.png')
    regels = [
        '<?xml version="1.0"?>', '<font>',
        f'  <info face="titel" size="{cel_h}"/>',
        f'  <common lineHeight="{cel_h}" base="{cel_h}" scaleW="{breedte_atlas}" scaleH="{hoogte_atlas}" pages="1"/>',
        f'  <pages><page id="0" file="{bestandsnaam}.png"/></pages>',
        f'  <chars count="{len(tekens) + 1}">',
        '    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="8" page="0" chnl="15"/>',
    ]
    for c in tekens:
        gx, gy, w = posities[c]
        breedte = len(glyphs[c][0]) * S + R
        regels.append(
            f'    <char id="{ord(c)}" x="{gx}" y="{gy}" width="{w}" height="{cel_h}" '
            f'xoffset="0" yoffset="0" xadvance="{breedte + 1}" page="0" chnl="15"/>'
        )
    regels += ['  </chars>', '</font>']
    with open(f'{map_uit}/{bestandsnaam}.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(regels))
    return tekens


def tekst_voorbeeld(tekst, kleur='#404048', schaduw='#d0d0c8'):
    glyphs = alle_glyphs()
    w = sum((len(glyphs[c][0]) + 1) if c in glyphs else 4 for c in tekst) + 4
    img = Image.new('RGBA', (w, 14), hexkleur('#f8f8f8'))
    px = img.load()
    x = 2
    for c in tekst:
        if c not in glyphs:
            x += 4
            continue
        for ry, r in enumerate(glyphs[c]):
            for rx, v in enumerate(r):
                if v == '#':
                    for dx, dy in ((1, 0), (0, 1), (1, 1)):
                        px[x + rx + dx, 2 + ry + dy] = hexkleur(schaduw)
        for ry, r in enumerate(glyphs[c]):
            for rx, v in enumerate(r):
                if v == '#':
                    px[x + rx, 2 + ry] = hexkleur(kleur)
        x += len(glyphs[c][0]) + 1
    return img


if __name__ == '__main__':
    from pixel import voorbeeld
    regels = [
        "Hallo daar! Welkom in de Duitse streken.",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789",
        "abcdefghijklmnopqrstuvwxyz .,!?:;'\"-()",
        "Één café, ruïne, ideeën, coördinatie. Ja, mögen!",
        "Halt! Isch hoorrr jou wel, hè? Gezondheid 12/20",
    ]
    imgs = [tekst_voorbeeld(r) for r in regels]
    W = max(i.size[0] for i in imgs)
    sheet = Image.new('RGBA', (W, 14 * len(imgs)), hexkleur('#f8f8f8'))
    for n, i in enumerate(imgs):
        sheet.paste(i, (0, 14 * n))
    voorbeeld(sheet, 4).save('voorbeeld_font.png')
