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
    'muts': {
        'omlaag': [
            "................",
            "....kkkkkkkk....",
            "...kgggggggggk..",
            "..kgGgGgGgGgGk..",
            "..kllllllllllk..",
            "..khhhhhhhhhhk..",
            "..khsesssseshk..",
            "..kssssSSssssk..",
            "...ksssqqsssk...",
            "....kkkkkkkk....",
        ],
        'omhoog': [
            "................",
            "....kkkkkkkk....",
            "...kgggggggggk..",
            "..kgGgGgGgGgGk..",
            "..kllllllllllk..",
            "..khhhhhhhhhhk..",
            "..khhhhhhhhhhk..",
            "..ksHHHHHHHHsk..",
            "...kssssssssk...",
            "....kkkkkkkk....",
        ],
        'links': [
            "................",
            ".....kkkkkkk....",
            "....kgggggggk...",
            "...kgGgGgGgGgk..",
            "...kllllllllk...",
            "...ksssshhhhHk..",
            "..ksessshhhHHk..",
            "..ksssssshHHk...",
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
    # Orvelte
    'djelano': ('pet', 'normaal', kleuren(
        h='#1a1412', H='#0e0a08', g='#1a1a1e', G='#0e0e12', l='#e0c048',
        t='#26262c', T='#16161a', p='#26262c', P='#16161a', f='#f4f4f4', b='#f4f4f4',
        s='#b07a52', S='#8c5e3c')),
    'mustafah': ('kort', 'normaal', kleuren(
        h='#1e1814', H='#0e0a08', t='#8a8e98', T='#6a6e78', p='#8a8e98', P='#6a6e78', f='#f4f4f4', b='#1a1a1e',
        s='#d8a478', S='#b4825a')),
    'sjoerd': ('kort', 'boeien', kleuren(
        h='#e8d070', H='#c0a848', t='#3a6ab8', T='#f4f4f4', p='#4a4a52', P='#34343c', f='#c89a50', b='#4a4a52')),
    'tjitske': ('lang', 'boeien', kleuren(
        h='#f0d88a', H='#c8b060', t='#c83a3a', T='#9a2a2a', p='#3a5a9a', P='#2a4278', f='#c89a50', b='#3a5a9a')),
    'wiebe': ('pet', 'boeien', kleuren(
        h='#c8c8c8', H='#9a9a9a', g='#3a4a6a', G='#26324a', l='#5a6a8a',
        t='#7a5a3a', T='#5a4028', p='#3a3a42', P='#26262c', f='#c89a50', b='#3a3a42',
        s='#f0c4a0', S='#d09c7a')),
    'molenaar': ('pet', 'normaal', kleuren(
        h='#9a7a5a', H='#7a5a3a', g='#f4f4f4', G='#c8c8d0', l='#ffffff',
        t='#f0ece0', T='#c8c4b8', p='#8a8a94', P='#6a6a74', f='#4a3424', b='#c8c4b8')),
    'budtender': ('muts', 'normaal', kleuren(
        h='#c8b8a0', H='#a89880', g='#d83a30', G='#3a9a4a', l='#f0c830',
        t='#6a8a4a', T='#4e6a34', p='#3a5a8a', P='#2a4268', f='#8a6a44', b='#6a8a4a')),
    'grenswacht': ('pet', 'normaal', kleuren(
        h='#c8a868', H='#a08048', g='#4a5040', G='#1e1e22', l='#6a705c',
        t='#5c6250', T='#40463a', p='#4a5040', P='#34382e', f='#1e1e22', b='#2a2a2c')),
    'opa': ('kaal', 'normaal', kleuren(
        h='#d8d8d8', H='#b0b0b0', t='#7a6a9a', T='#5a4c78', p='#5a5a62', P='#44444c', f='#3a2a20', b='#7a6a9a',
        s='#f0c4a0', S='#d09c7a')),
    'toerist': ('pet', 'normaal', kleuren(
        h='#e0c060', H='#b89838', g='#f0f0f0', G='#3a8ac8', l='#ffffff',
        t='#f08848', T='#e05a8a', p='#e8d8b0', P='#c8b890', f='#7a5a3a', b='#e8d8b0',
        s='#f4b090', S='#d88a6a')),
    'dorpsvrouw': ('lang', 'normaal', kleuren(
        h='#7a4a2a', H='#5a3418', t='#4a7ac8', T='#3a5a9a', p='#4a7ac8', P='#3a5a9a', f='#3a2a20', b='#f0f0f0')),
    # de N34
    'bernd': ('pet', 'normaal', kleuren(
        h='#8a5a3a', H='#6a4028', g='#6a6e52', G='#4c503a', l='#868a6c',
        t='#6a6e52', T='#4c503a', p='#5a5e46', P='#424632', f='#1e1e22', b='#2a2a2c')),
    'kassiere': ('lang', 'normaal', kleuren(
        h='#c86a2a', H='#9a4a1a', t='#c83a3a', T='#9a2a2a', p='#2a2a30', P='#1a1a1e', f='#2a2a2a', b='#f0c830')),
    'helmut': ('pet', 'normaal', kleuren(
        h='#c8b088', H='#a08860', g='#3e4a58', G='#2a3440', l='#5a6a7a',
        t='#5a6a7a', T='#3e4a58', p='#3e4a58', P='#2a3440', f='#1e1e22', b='#2a2a2c')),
    'jens': ('kort', 'normaal', kleuren(
        h='#e8d070', H='#c0a848', t='#5a6a7a', T='#3e4a58', p='#3e4a58', P='#2a3440', f='#1e1e22', b='#2a2a2c')),
    # Wezup
    'anne': ('lang', 'normaal', kleuren(
        h='#e8c868', H='#c0a048', t='#4a7ac8', T='#3a5a9a', p='#4a7ac8', P='#3a5a9a', f='#6a4a2a', b='#f4f4f0',
        s='#f6cfae', S='#d8a888')),
    'hendrik': ('kaal', 'normaal', kleuren(
        h='#a8a8a8', H='#808080', t='#8a6a44', T='#6a4e30', p='#3a3a42', P='#26262c', f='#3a2a20', b='#e8e0cc')),
    'bakker': ('muts', 'normaal', kleuren(
        h='#c8a070', H='#a08050', g='#f8f8f4', G='#d8d8d0', l='#ffffff',
        t='#f4f4f0', T='#d0d0c8', p='#5a5a62', P='#44444c', f='#3a2a20', b='#f4f4f0')),
    'slager': ('kort', 'normaal', kleuren(
        h='#3a2a1e', H='#24180e', t='#f4f4f0', T='#c83a3a', p='#3a3a42', P='#26262c', f='#2a2a2a', b='#c83a3a',
        s='#f0b090', S='#d08a6a')),
    'visser': ('muts', 'normaal', kleuren(
        h='#a8a8a8', H='#808080', g='#f0c830', G='#c8a020', l='#f8e060',
        t='#f0c830', T='#c8a020', p='#2a3a5a', P='#1e2a44', f='#2a2a2a', b='#c8a020')),
    'vissersvrouw': ('hoofddoek', 'normaal', kleuren(
        g='#3a5aa8', G='#2a4278', l='#5a7ac8', t='#3a3a42', T='#26262c', p='#3a3a42', P='#26262c',
        f='#3a2a20', b='#f4f4f0')),
    'leutnant': ('pet', 'normaal', kleuren(
        h='#d8c090', H='#b0a070', g='#2a2e28', G='#141614', l='#4a4e44',
        t='#5c6250', T='#40463a', p='#4a5040', P='#34382e', f='#141414', b='#c8b060')),
    'klompenmaker': ('pet', 'normaal', kleuren(
        h='#d8d8d8', H='#b0b0b0', g='#6a4a2a', G='#4a3420', l='#8a6a4a',
        t='#4a6a8a', T='#3a5068', p='#5a4a3a', P='#44382c', f='#f0e0b0', b='#4a6a8a')),
    # het natuurgebied
    'heinz': ('kort', 'normaal', kleuren(
        h='#c8a868', H='#a08048', t='#f08848', T='#3aa8a0', p='#e8d8b0', P='#c8b890', f='#f4f4f4', b='#e8d8b0',
        s='#f0a080', S='#cc7a5a')),
    'rudiger': ('kaal', 'normaal', kleuren(
        h='#e8c8a0', H='#c8a880', t='#f4f4f4', T='#d8d8d8', p='#3a6ac8', P='#2a4a8a', f='#8a5a34', b='#3a6ac8',
        s='#f08070', S='#c85a4a')),
    'karl': ('pet', 'normaal', kleuren(
        h='#8a8a8a', H='#6a6a6a', g='#f4f4f0', G='#3a8a3a', l='#ffffff',
        t='#8ac8e8', T='#5a9ac8', p='#5a6a3a', P='#44502c', f='#f4f4f4', b='#5a6a3a',
        s='#f0b090', S='#d08a6a')),
    'kurt': ('kort', 'normaal', kleuren(
        h='#e8d090', H='#c0a868', t='#f0a080', T='#cc7a5a', p='#3a6ac8', P='#2a4a8a', f='#f4f4f4', b='#3a6ac8',
        s='#f0a080', S='#cc7a5a')),
    'ijsman': ('pet', 'normaal', kleuren(
        h='#5a3a2a', H='#3a2418', g='#f088b0', G='#c86a90', l='#f8b0d0',
        t='#f4f4f0', T='#d0d0c8', p='#3a3a42', P='#26262c', f='#2a2a2a', b='#f088b0')),
    'dichter': ('lang', 'normaal', kleuren(
        h='#2a2a30', H='#18181c', t='#4a3a5a', T='#342842', p='#2a2a34', P='#1c1c24', f='#1a1a1a', b='#4a3a5a')),
    # De Beren: gastvrouw in het zwart met een rood schort, en de kok
    'gastvrouw': ('lang', 'normaal', kleuren(
        h='#7a4a2a', H='#5a341c', t='#2a2a30', T='#1a1a1e', p='#b8322a', P='#86221c', f='#1a1a1a', b='#b8322a')),
    'kok': ('muts', 'normaal', kleuren(
        h='#3a2a20', H='#24180e', g='#f8f8f4', G='#d8d8d0', l='#ffffff',
        t='#f4f4f0', T='#d0d0c8', p='#2a2a30', P='#1a1a1e', f='#1a1a1a', b='#b8322a',
        s='#c08860', S='#9c6a48')),
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
