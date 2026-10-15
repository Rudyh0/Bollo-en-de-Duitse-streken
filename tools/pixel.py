"""Kleine hulpfuncties om pixel-art uit tekst te maken.

Elke sprite is een lijst met regels tekst. Elk teken is een pixel en wordt via
een palet (dict teken -> kleur) omgezet. '.' en ' ' zijn transparant.
"""
from PIL import Image


def hexkleur(h, a=255):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def maak_palet(d):
    return {k: (hexkleur(v) if isinstance(v, str) else v) for k, v in d.items()}


def sprite(rijen, palet, breedte=None, hoogte=None, naam='?'):
    """Zet tekstregels om in een RGBA-afbeelding."""
    h = len(rijen)
    w = max(len(r) for r in rijen)
    for i, r in enumerate(rijen):
        if breedte is not None and len(r) != breedte:
            raise ValueError(f'{naam}: regel {i} heeft lengte {len(r)} i.p.v. {breedte}: "{r}"')
    if hoogte is not None and h != hoogte:
        raise ValueError(f'{naam}: {h} regels i.p.v. {hoogte}')
    img = Image.new('RGBA', (breedte or w, hoogte or h), (0, 0, 0, 0))
    px = img.load()
    for y, r in enumerate(rijen):
        for x, c in enumerate(r):
            if c in '. ':
                continue
            if c not in palet:
                raise ValueError(f'{naam}: onbekend teken "{c}" op ({x},{y})')
            px[x, y] = palet[c]
    return img


def spiegel(img):
    return img.transpose(Image.FLIP_LEFT_RIGHT)


def schuif(img, dx, dy):
    out = Image.new('RGBA', img.size, (0, 0, 0, 0))
    out.paste(img, (dx, dy), img)
    return out


def omlijn(img, kleur, dikte=1, diagonaal=True):
    """Voegt een omlijning toe rond niet-transparante pixels (vergroot de afbeelding niet)."""
    w, h = img.size
    src = img.load()
    out = img.copy()
    dst = out.load()
    buren = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    if diagonaal:
        buren += [(-1, -1), (1, -1), (-1, 1), (1, 1)]
    for _ in range(dikte):
        src = out.copy().load()
        for y in range(h):
            for x in range(w):
                if src[x, y][3] != 0:
                    continue
                for dx, dy in buren:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and src[nx, ny][3] != 0:
                        dst[x, y] = kleur
                        break
    return out


def vel(sprites, kolommen):
    """Plakt even grote sprites in een raster (spritesheet)."""
    w, h = sprites[0].size
    rijen = (len(sprites) + kolommen - 1) // kolommen
    sheet = Image.new('RGBA', (w * kolommen, h * rijen), (0, 0, 0, 0))
    for i, s in enumerate(sprites):
        sheet.paste(s, ((i % kolommen) * w, (i // kolommen) * h), s)
    return sheet


def voorbeeld(img, schaal=6, achtergrond=(120, 160, 120, 255)):
    bg = Image.new('RGBA', img.size, achtergrond)
    bg.alpha_composite(img)
    return bg.resize((img.size[0] * schaal, img.size[1] * schaal), Image.NEAREST)
