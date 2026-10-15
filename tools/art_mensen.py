"""Sjabloon voor mensen (16x20) met loopanimaties in drie richtingen.

Een persoon = hoofd-variant + romp-variant + kleurenpalet.
Frames per richting: staan, stap1, stap2. Volgorde: omlaag, omhoog, links, rechts (gespiegeld).
Tekens in de sjablonen:
  k omlijning   s/S huid   e oog   q mond
  h/H haar      g/G/l hoofddeksel (helm, pet, hoofddoek)
  t/T kleding boven   p/P broek/rok   f schoenen   c handboeien   b riem
"""
from pixel import maak_palet, sprite, spiegel

# ------------------------------------------------------------------ hoofden (rij 0..9)

HOOFD = {
    'kort': {
        'omlaag': [
            "................",
            "....kkkkkkkk....",
            "...khhhhhhhhk...",
            "..khhhhhhhhhhk..",
            "..khhHhhhhHhhk..",
            "..khsssssssshk..",
            "..khsesssseshk..",
            "..kssssSSssssk..",
            "...ksssqqsssk...",
            "....kkkkkkkk....",
        ],
        'omhoog': [
            "................",
            "....kkkkkkkk....",
            "...khhhhhhhhk...",
            "..khhhhhhhhhhk..",
            "..khhhhhhhhhhk..",
            "..khhhhhhhhhhk..",
            "..kHhhhhhhhhHk..",
            "..ksHHHHHHHHsk..",
            "...kssssssssk...",
            "....kkkkkkkk....",
        ],
        'links': [
            "................",
            ".....kkkkkkk....",
            "....khhhhhhhk...",
            "...khhhhhhhhhk..",
            "...khhhhhhhhhk..",
            "...ksssshhhhHk..",
            "..ksessshhhHHk..",
            "..ksssssshHHk...",
            "...ksqsssshk....",
            "....kkkkkkk.....",
        ],
    },
    'lang': {
        'omlaag': [
            "................",
            "....kkkkkkkk....",
            "...khhhhhhhhk...",
            "..khhhhhhhhhhk..",
            "..khhHhhhhHhhk..",
            "..khsssssssshk..",
            "..khsesssseshk..",
            "..khsssSSssshk..",
            "..khhssqqsshhk..",
            "..khhkkkkkkhhk..",
        ],
        'omhoog': [
            "................",
            "....kkkkkkkk....",
            "...khhhhhhhhk...",
            "..khhhhhhhhhhk..",
            "..khhhhhhhhhhk..",
            "..khhhhhhhhhhk..",
            "..khhhhhhhhhhk..",
            "..khhhhhhhhhhk..",
            "..kHhhhhhhhhHk..",
            "..kHHkkkkkkHHk..",
        ],
        'links': [
            "................",
            ".....kkkkkkk....",
            "....khhhhhhhk...",
            "...khhhhhhhhhk..",
            "...khhhhhhhhhk..",
            "...ksssshhhhHk..",
            "..ksessshhhHHk..",
            "..ksssssshHHHk..",
            "...ksqssshHHHk..",
            "....kkkkkhHHk...",
        ],
    },
    'kaal': {
        'omlaag': [
            "................",
            "....kkkkkkkk....",
            "...kssssssssk...",
            "..kssssssssssk..",
            "..khsssssssshk..",
            "..khhsssssshhk..",
            "..khsesssseshk..",
            "..kssssSSssssk..",
            "...ksssqqsssk...",
            "....kkkkkkkk....",
        ],
        'omhoog': [
            "................",
            "....kkkkkkkk....",
            "...kssssssssk...",
            "..kssssssssssk..",
            "..khsssssssshk..",
            "..khhhhhhhhhhk..",
            "..kHhhhhhhhhHk..",
            "..ksHHHHHHHHsk..",
            "...kssssssssk...",
            "....kkkkkkkk....",
        ],
        'links': [
            "................",
            ".....kkkkkkk....",
            "....ksssssssk...",
            "...kssssssssk...",
            "...ksssssshhk...",
            "...ksssshhhHk...",
            "..ksesssshhHk...",
            "..ksssssshHk....",
            "...ksqssssk.....",
            "....kkkkkk......",
        ],
    },
    'helm': {
        'omlaag': [
            "....kkkkkkkk....",
            "...kglllgggGk...",
            "..kgllgggggGGk..",
            "..kggggggggGGk..",
            ".kgggggggggggGk.",
            "kGGGGGGGGGGGGGGk",
            "..kssesssseskk..",
            "..kssssSSssssk..",
            "...ksssqqsssk...",
            "....kkkkkkkk....",
        ],
        'omhoog': [
            "....kkkkkkkk....",
            "...kggggggggk...",
            "..kggggggggggk..",
            "..kggggggggggk..",
            ".kGgggggggggGGk.",
            "kGGGGGGGGGGGGGGk",
            "..khhhhhhhhhhk..",
            "..ksHhhhhhhHsk..",
            "...kssssssssk...",
            "....kkkkkkkk....",
        ],
        'links': [
            ".....kkkkkkk....",
            "....kglllgggk...",
            "...kglggggggGk..",
            "...kgggggggggGk.",
            "..kgggggggggGGk.",
            ".kGGGGGGGGGGGGk.",
            "..ksesssshhHk...",
            "..ksssssshHk....",
            "...ksqsssshk....",
            "....kkkkkkk.....",
        ],
    },
    'pet': {
        'omlaag': [
            "................",
            "....kkkkkkkk....",
            "...kggggggggk...",
            "..kgggglgggggk..",
            "..kGGGGGGGGGGk..",
            ".kGGGGGGGGGGGGk.",
            "..khsesssseshk..",
            "..kssssSSssssk..",
            "...ksssqqsssk...",
            "....kkkkkkkk....",
        ],
        'omhoog': [
            "................",
            "....kkkkkkkk....",
            "...kggggggggk...",
            "..kggggggggggk..",
            "..kggggggggggk..",
            "..kGGGGGGGGGGk..",
            "..khhhhhhhhhhk..",
            "..ksHHHHHHHHsk..",
            "...kssssssssk...",
            "....kkkkkkkk....",
        ],
        'links': [
            "................",
            ".....kkkkkkk....",
            "....kgggggggk...",
            "...kgglggggggk..",
            "...kGGGGGGGGGk..",
            "kkGGGGshhhhHk...",
            "..ksesshhhhHk...",
            "..ksssssshHk....",
            "...ksqsssshk....",
            "....kkkkkkk.....",
        ],
    },
    'hoofddoek': {
        'omlaag': [
            "................",
            "....kkkkkkkk....",
            "...kggggggggk...",
            "..kgggglgggggk..",
            "..kggssssssggk..",
            "..kgssssssssgk..",
            "..kgsessssesgk..",
            "..kgsssSSsssgk..",
            "...kgssqqssgk...",
            "....kkggggkk....",
        ],
        'omhoog': [
            "................",
            "....kkkkkkkk....",
            "...kggggggggk...",
            "..kggggggggggk..",
            "..kggggggggggk..",
            "..kggggggggggk..",
            "..kgggggggggGk..",
            "..kGgggggggGGk..",
            "...kGGggggGGk...",
            "....kkGGGGkk....",
        ],
        'links': [
            "................",
            ".....kkkkkkk....",
            "....kgggggggk...",
            "...kgglggggggk..",
            "...kssssgggggk..",
            "...ksssssggggk..",
            "..ksesssgggGGk..",
            "..ksssssgggGk...",
            "...ksqssgGGGk...",
            "....kkkkkGGk....",
        ],
    },
}

# ------------------------------------------------------------------ rompen (rij 10..15)

ROMP = {
    'normaal': {
        'omlaag': [
            "...kttttttttk...",
            "..kTtkttttktTk..",
            "..kTtkttttktTk..",
            "..kTtkttttktTk..",
            "..ksSkbbbbkSsk..",
            "...kkTTTTTTkk...",
        ],
        'omhoog': [
            "...kttttttttk...",
            "..kTtkttttktTk..",
            "..kTtkttttktTk..",
            "..kTtkTTTTktTk..",
            "..ksSkbbbbkSsk..",
            "...kkTTTTTTkk...",
        ],
        'links': [
            ".....ktttttk....",
            "....kttTTtttk...",
            "....kttTTtttk...",
            "....kttTTtttk...",
            "....kbbsSbbbk...",
            ".....kTTTTTk....",
        ],
    },
    'boeien': {
        'omlaag': [
            "...kttttttttk...",
            "..kTtkttttktTk..",
            "..kTtkttttktTk..",
            "...kTktttktTk...",
            "....ksccccsk....",
            "...kkTTTTTTkk...",
        ],
        'omhoog': [
            "...kttttttttk...",
            "..kTtkttttktTk..",
            "..kTtkttttktTk..",
            "...kTkTTTTkTk...",
            "...kkkbbbbkkk...",
            "...kkTTTTTTkk...",
        ],
        'links': [
            ".....ktttttk....",
            "....kttTTtttk...",
            "...kTTTTtttk....",
            "..ksccktttttk...",
            "....kbbbbbbbk...",
            ".....kTTTTTk....",
        ],
    },
}

# ------------------------------------------------------------------ benen (rij 16..19)

BENEN = {
    'omlaag': [
        ["....kppppppk....", "....kpPkkPpk....", "....kpPkkPpk....", "...kfffkkfffk..."],
        ["....kppppppk....", "....kpPkkPpk....", "....kpPk.kPk....", "...kfffk..kk...."],
        ["....kppppppk....", "....kpPkkPpk....", "....kPk.kPpk....", "....kk..kfffk..."],
    ],
    'omhoog': [
        ["....kppppppk....", "....kpPkkPpk....", "....kpPkkPpk....", "...kfffkkfffk..."],
        ["....kppppppk....", "....kpPkkPpk....", "....kPk.kPpk....", "....kk..kfffk..."],
        ["....kppppppk....", "....kpPkkPpk....", "....kpPk.kPk....", "...kfffk..kk...."],
    ],
    'links': [
        [".....kppppk.....", ".....kpPPpk.....", ".....kpPPpk.....", "....kffffk......"],
        [".....kppppk.....", "....kpPkkPpk....", "...kpPk..kPpk...", "..kffk....kffk.."],
        [".....kppppk.....", ".....kpPpk......", "....kpPPpk......", "...kffffk......."],
    ],
}


def persoon(hoofd, palet, romp='normaal'):
    """Geeft 12 frames: omlaag(3), omhoog(3), links(3), rechts(3)."""
    pal = maak_palet(palet)
    frames = {}
    for richting in ('omlaag', 'omhoog', 'links'):
        lijst = []
        for f in range(3):
            rijen = HOOFD[hoofd][richting] + ROMP[romp][richting] + BENEN[richting][f]
            lijst.append(sprite(rijen, pal, 16, 20, f'{hoofd}-{romp}-{richting}-{f}'))
        frames[richting] = lijst
    frames['rechts'] = [spiegel(f) for f in frames['links']]
    return frames['omlaag'] + frames['omhoog'] + frames['links'] + frames['rechts']


BASIS = {
    'k': '#24201c', 'e': '#202028', 'q': '#b05048', 'c': '#b0b8c8',
    's': '#f2c49a', 'S': '#d29c74',
}


def kleuren(**extra):
    pal = dict(BASIS)
    pal.update(extra)
    return pal


PERSONEN = {
    # Duitse wachter: veldgrijs uniform, stalen helm, zwarte laarzen en riem.
    'wachter': ('helm', 'normaal', kleuren(
        h='#c8a868', H='#a08048', g='#68705c', G='#4a5242', l='#8c947e',
        t='#7a8068', T='#5a604c', p='#5c6250', P='#444a3a', f='#1e1e22', b='#2a2a2c')),
    # Wachter met pet (de baas van de stoet)
    'wachter_pet': ('pet', 'normaal', kleuren(
        h='#5a4430', H='#3e2e20', g='#68705c', G='#3c4236', l='#8c947e',
        t='#7a8068', T='#5a604c', p='#5c6250', P='#444a3a', f='#1e1e22', b='#2a2a2c')),
    # Geketende gevangenen
    'gevangene_a': ('kort', 'boeien', kleuren(
        h='#6a4428', H='#4a2e1a', t='#6a8ab8', T='#4a6690', p='#5a5248', P='#423c34', f='#3a2a20', b='#5a5248')),
    'gevangene_b': ('lang', 'boeien', kleuren(
        h='#e0c060', H='#b89838', t='#b85a5a', T='#8c4040', p='#6a5a4a', P='#4c4034', f='#3a2a20', b='#6a5a4a')),
    'gevangene_c': ('kaal', 'boeien', kleuren(
        h='#a8a8a8', H='#808080', t='#9a9a86', T='#76766a', p='#4a4a52', P='#34343c', f='#2a2a2a', b='#4a4a52')),
    'gevangene_d': ('pet', 'boeien', kleuren(
        h='#2a2420', H='#1a1614', g='#4a6a8a', G='#344c66', l='#6a8aaa',
        t='#c8a060', T='#9c7840', p='#4a5a6a', P='#34404c', f='#2a2a2a', b='#4a5a6a')),
    # Vrije rondlopers
    'oma': ('hoofddoek', 'normaal', kleuren(
        g='#c04848', G='#8c3030', l='#e07070', t='#7a5a8a', T='#5a4068', p='#6a6a72', P='#4c4c54',
        f='#3a2a2a', b='#7a5a8a', s='#f0c8a8', S='#d0a080')),
    'sporter': ('kort', 'normaal', kleuren(
        h='#1e1a18', H='#0e0c0c', t='#f0f0f0', T='#c8c8d0', p='#3a5ab0', P='#2a428a', f='#e0e0e0', b='#3a5ab0',
        s='#c08860', S='#9c6a48')),
    'boer': ('pet', 'normaal', kleuren(
        h='#8a6a4a', H='#6a4e34', g='#4a6a3a', G='#344c28', l='#6a8a5a', t='#a85a3a', T='#844228',
        p='#3c5a8a', P='#2c4268', f='#4a3424', b='#3c5a8a')),
    'kokkin': ('hoofddoek', 'normaal', kleuren(
        g='#f4f4f4', G='#c8c8d0', l='#ffffff', t='#f0f0f0', T='#c8c8d0', p='#6a7a8a', P='#4c5a68',
        f='#3a2a2a', b='#e0e0e0')),
    # Duitse soldaten in het bos
    'soldaat_bos': ('helm', 'normaal', kleuren(
        h='#c8a868', H='#a08048', g='#5a6a40', G='#3e4a2c', l='#7c8c5a',
        t='#6a7448', T='#4c5434', p='#545c40', P='#3c4230', f='#1e1e22', b='#2a2a2c')),
    'soldaat_muts': ('pet', 'normaal', kleuren(
        h='#7a5a3a', H='#5a4028', g='#727c5c', G='#525a42', l='#8e987a',
        t='#727c5c', T='#525a42', p='#545c40', P='#3c4230', f='#1e1e22', b='#2a2a2c')),
    'feldwebel': ('pet', 'normaal', kleuren(
        h='#4a3424', H='#2e2018', g='#5c6250', G='#2c3028', l='#787e6a',
        t='#5c6250', T='#40463a', p='#4a5040', P='#34382e', f='#1e1e22', b='#c8b060')),
    'dichter': ('lang', 'normaal', kleuren(
        h='#2a2a30', H='#18181c', t='#4a3a5a', T='#342842', p='#2a2a34', P='#1c1c24', f='#1a1a1a', b='#4a3a5a')),
}


def alle():
    uit = {}
    for naam, (hoofd, romp, palet) in PERSONEN.items():
        uit[naam] = persoon(hoofd, palet, romp)
    return uit


if __name__ == '__main__':
    from pixel import vel, voorbeeld
    from PIL import Image
    alles = alle()
    rijen = [vel(f, 12) for f in alles.values()]
    sheet = Image.new('RGBA', (rijen[0].size[0], 20 * len(rijen)))
    for i, r in enumerate(rijen):
        sheet.paste(r, (0, 20 * i))
    voorbeeld(sheet, 4).save('voorbeeld_mensen.png')
