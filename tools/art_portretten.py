"""Grote sprites voor de intro: de directeur (48x64) en de beer (48x56)."""
from PIL import Image
from pixel import hexkleur, omlijn

K = hexkleur


def nieuw(w, h):
    return Image.new('RGBA', (w, h), (0, 0, 0, 0))


class Doek:
    def __init__(self, w, h):
        self.img = nieuw(w, h)
        self.px = self.img.load()
        self.w, self.h = w, h

    def p(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px[x, y] = K(c) if isinstance(c, str) else c

    def rect(self, x, y, w, h, c):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.p(xx, yy, c)

    def ellips(self, cx, cy, rx, ry, c, alleen=None):
        """Gevulde ellips. `alleen` is een functie (x,y)->bool om te beperken."""
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                dx = (x + 0.5 - cx) / rx
                dy = (y + 0.5 - cy) / ry
                if dx * dx + dy * dy <= 1.0 and (alleen is None or alleen(x, y)):
                    self.p(x, y, c)

    def lijn_h(self, x1, x2, y, c):
        for x in range(x1, x2 + 1):
            self.p(x, y, c)

    def lijn_v(self, x, y1, y2, c):
        for y in range(y1, y2 + 1):
            self.p(x, y, c)

    def is_gevuld(self, x, y):
        return 0 <= x < self.w and 0 <= y < self.h and self.px[x, y][3] > 0


OMLIJNING = K('#181018')


def directeur(knipper=False):
    d = Doek(48, 64)
    pak, pakS, pakH = '#2c2c38', '#1c1c24', '#474758'
    huid, huidS, huidL, wang = '#f2bb92', '#cf8c66', '#fad4b6', '#ea8a7a'
    hemd, hemdS = '#f4f4f4', '#c4c8d4'
    das, dasS = '#c43434', '#84201c'
    snor, snorS = '#7c6c62', '#54463e'
    hoed, hoedH, band = '#1e1e28', '#3c3c4e', '#6a2c2c'
    goud = '#e8c444'

    # --- lichaam: brede jas met dikke buik
    d.ellips(24, 49, 21, 16, pak)
    d.rect(6, 50, 36, 14, pak)
    d.ellips(24, 50, 15, 13, pakH, alleen=lambda x, y: x < 18 and y < 52)
    d.ellips(24, 49, 21, 16, pak, alleen=lambda x, y: x >= 18 or y >= 52)
    # schaduw rechterkant
    d.ellips(24, 49, 21, 16, pakS, alleen=lambda x, y: x > 37)
    d.rect(38, 50, 4, 14, pakS)
    # overhemd (V) en buik
    for y in range(31, 64):
        breedte = min(7, 1 + (y - 31) // 2)
        d.lijn_h(24 - breedte, 23 + breedte, y, hemd)
    d.ellips(24, 52, 9, 10, hemd, alleen=lambda x, y: y >= 40)
    d.ellips(27, 54, 7, 8, hemdS, alleen=lambda x, y: x > 27 and y > 46)
    # revers
    for y in range(31, 50):
        dx = 1 + (y - 31) // 2
        d.p(24 - dx - 1, y, pakH)
        d.p(23 + dx + 1, y, pakS)
    # das
    d.rect(22, 31, 4, 3, das)
    for y in range(34, 48):
        breedte = 1 if y < 36 else 2
        d.lijn_h(24 - breedte, 23 + breedte, y, das)
        d.p(23 + breedte, y, dasS)
    d.p(23, 48, das)
    d.p(24, 48, dasS)
    # knopen en horlogeketting
    for y in (52, 58):
        d.p(16, y, '#0e0e14')
    for i, x in enumerate(range(15, 33)):
        y = 55 + int(2.2 * (1 - ((x - 24) / 9) ** 2))
        d.p(x, y, goud if i % 2 == 0 else '#b08a20')
    d.rect(31, 55, 2, 3, goud)
    # armen en handen
    d.ellips(6, 52, 4, 9, pak)
    d.ellips(42, 52, 4, 9, pakS)
    d.ellips(6, 60, 3, 3, huid)
    d.ellips(42, 60, 3, 3, huidS)

    # --- hoofd (rond, dubbele kin)
    d.ellips(24, 21, 10, 11, huid)
    d.ellips(24, 28, 9, 4, huid)
    d.ellips(24, 30, 7, 2.2, huidS)
    d.ellips(30, 22, 4, 9, huidS, alleen=lambda x, y: x >= 31)
    d.ellips(20, 17, 4, 3, huidL)
    # oren
    d.ellips(13.5, 21, 2, 3, huid)
    d.ellips(34.5, 21, 2, 3, huidS)
    # wangen
    d.rect(16, 23, 3, 2, wang)
    d.rect(30, 23, 3, 2, wang)
    # wenkbrauwen
    d.lijn_h(17, 21, 15, snorS)
    d.lijn_h(27, 31, 15, snorS)
    d.p(17, 16, snorS)
    d.p(31, 16, snorS)
    # ogen
    if knipper:
        d.lijn_h(18, 21, 18, '#2a1a1a')
        d.lijn_h(27, 30, 18, '#2a1a1a')
    else:
        for ox in (19, 28):
            d.rect(ox, 17, 2, 3, '#2a1a1a')
            d.p(ox, 17, '#ffffff')
    # neus
    d.rect(23, 18, 3, 4, huid)
    d.ellips(24.5, 21.5, 2.5, 1.8, wang)
    d.p(25, 22, huidS)
    # snor
    d.ellips(24, 24, 7, 2, snor)
    d.lijn_h(18, 30, 25, snorS)
    d.p(17, 25, snor)
    d.p(31, 25, snor)
    # mond + sigaar
    d.lijn_h(22, 26, 27, '#7a3030')
    d.rect(27, 26, 10, 2, '#8c5a30')
    d.lijn_h(27, 36, 27, '#5c3a1c')
    d.rect(29, 26, 1, 2, '#c43434')  # bandje
    d.rect(37, 26, 2, 2, '#c8c8c8')
    d.p(39, 26, '#ff6a30' if not knipper else '#ffc060')
    d.p(39, 27, '#e0e0e0')

    # --- hoed (bolhoed)
    d.ellips(24, 9, 9, 8, hoed, alleen=lambda x, y: y <= 11)
    d.rect(15, 9, 18, 3, hoed)
    d.ellips(24, 12.5, 14, 2.4, hoed)
    d.rect(15, 9, 18, 2, band)
    d.ellips(21, 5, 3, 2, hoedH)
    d.lijn_h(13, 34, 12, hoedH)

    img = omlijn(d.img, OMLIJNING)
    return img


def beer_groot(zwaai=False):
    d = Doek(48, 56)
    vacht, vachtS, vachtL = '#b8743c', '#8a5228', '#dc9c5c'
    snuit, snuitS = '#f2dcae', '#d2b07e'
    muts, mutsS, mutsL, pompon = '#d84030', '#a02820', '#f47c5c', '#f0e8d8'
    trui, truiS, truiL = '#4a7ad2', '#2f56a0', '#7cacf0'
    oog = '#202028'

    # benen
    d.ellips(17, 51, 5, 5, vacht)
    d.ellips(31, 51, 5, 5, vachtS)
    d.ellips(17, 53, 3.5, 2, vachtL)
    # lichaam (trui)
    d.ellips(24, 40, 13, 11, trui)
    d.ellips(30, 41, 8, 10, truiS, alleen=lambda x, y: x > 30)
    d.ellips(18, 36, 5, 4, truiL)
    d.lijn_h(13, 35, 47, truiS)
    # zak en koordjes
    d.rect(19, 41, 11, 5, truiS)
    d.rect(20, 42, 9, 3, trui)
    d.lijn_v(22, 31, 36, '#f8f8f8')
    d.lijn_v(26, 31, 36, '#f8f8f8')
    # armen
    d.ellips(11, 39, 4, 7, trui)
    d.ellips(10, 45, 3.5, 3, vacht)
    if zwaai:
        d.ellips(39, 28, 4, 7, truiS)
        d.ellips(40, 21, 4, 4, vacht)
        d.ellips(40, 20, 2.5, 2, vachtL)
    else:
        d.ellips(37, 39, 4, 7, truiS)
        d.ellips(38, 45, 3.5, 3, vachtS)
    # oren
    d.ellips(10, 10, 5, 5, vacht)
    d.ellips(38, 10, 5, 5, vachtS)
    d.ellips(10, 10, 2.5, 2.5, vachtL)
    d.ellips(38, 10, 2.5, 2.5, vacht)
    # hoofd
    d.ellips(24, 20, 14, 12, vacht)
    d.ellips(31, 21, 7, 11, vachtS, alleen=lambda x, y: x > 33)
    d.ellips(17, 17, 5, 4, vachtL)
    # snuit
    d.ellips(24, 25, 7, 5, snuit)
    d.ellips(26, 27, 5, 3, snuitS, alleen=lambda x, y: y > 27)
    d.ellips(24, 22.5, 3, 2, '#2a1a14')
    d.p(23, 22, '#7a6a64')
    d.lijn_v(24, 24, 26, '#2a1a14')
    d.lijn_h(21, 23, 27, '#2a1a14')
    d.lijn_h(25, 27, 27, '#2a1a14')
    # ogen
    for ox in (17, 30):
        d.rect(ox, 17, 3, 4, oog)
        d.p(ox, 17, '#ffffff')
        d.p(ox + 1, 17, '#ffffff')
    # wangetjes
    d.rect(13, 23, 3, 2, '#e08a6a')
    d.rect(33, 23, 3, 2, '#c87a5a')
    # muts
    d.ellips(24, 9, 13, 8, muts, alleen=lambda x, y: y <= 11)
    d.ellips(30, 8, 7, 7, mutsS, alleen=lambda x, y: x > 31 and y <= 11)
    d.ellips(19, 5, 4, 2.5, mutsL)
    d.rect(10, 10, 28, 4, mutsS)
    for x in range(11, 38, 2):
        d.lijn_v(x, 10, 13, muts)
    d.ellips(24, 1.5, 4, 3, pompon)
    d.ellips(25.5, 2.5, 2, 1.5, '#d0c6b4')

    return omlijn(d.img, OMLIJNING)


if __name__ == '__main__':
    from pixel import voorbeeld
    sheet = nieuw(48 * 4, 64)
    sheet.paste(directeur(), (0, 0))
    sheet.paste(directeur(True), (48, 0))
    sheet.paste(beer_groot(), (96, 8))
    sheet.paste(beer_groot(True), (144, 8))
    voorbeeld(sheet, 4).save('voorbeeld_portretten.png')
