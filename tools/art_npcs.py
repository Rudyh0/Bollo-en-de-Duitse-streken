"""Medegevangenen in de barak: Opa Henk en Fenna. Frames: omlaag, omhoog, links (rechts = gespiegeld)."""
from pixel import maak_palet, sprite, spiegel

HENK_PALET = maak_palet({
    'k': '#282020', 's': '#f0c098', 'S': '#cf9870', 'h': '#ececec', 'H': '#b4b4c0',
    'c': '#8a6a48', 'C': '#5e4630', 't': '#e8e0c8', 'p': '#5a5a6c', 'P': '#3e3e4e',
    'e': '#282028', 'f': '#3e2c22',
})

HENK = {
    'omlaag': [
        "................",
        "....kkkkkkkk....",
        "...kssssssssk...",
        "..khsssssssshk..",
        "..khhsssssshhk..",
        "..kHhessssehHk..",
        "..kHsssSSsssHk..",
        "..kshhhhhhhhsk..",
        "...kshhhhhhsk...",
        "....kkhhhhkk....",
        "...kccttttcck...",
        "..kCcckttkccCk..",
        "..kCcccttcccCk..",
        "..kCcccttcccCk..",
        "..ksSccccccSsk..",
        "...kkCCCCCCkk...",
        "....kppppppk....",
        "....kpPkkPpk....",
        "....kpPkkPpk....",
        "...kfffkkfffk...",
    ],
    'omhoog': [
        "................",
        "....kkkkkkkk....",
        "...kssssssssk...",
        "..khsssssssshk..",
        "..khhhhhhhhhhk..",
        "..kHhhhhhhhhHk..",
        "..kHhhhhhhhhHk..",
        "..ksHHHHHHHHsk..",
        "...kHHHHHHHHk...",
        "....kkkkkkkk....",
        "...kcccccccck...",
        "..kCccccccccCk..",
        "..kCccccccccCk..",
        "..kCcccCCcccCk..",
        "..ksScccccccSsk.",
        "...kkCCCCCCkk...",
        "....kppppppk....",
        "....kpPkkPpk....",
        "....kpPkkPpk....",
        "...kfffkkfffk...",
    ],
    'links': [
        "................",
        ".....kkkkkkk....",
        "....ksssssssk...",
        "...ksssssssshk..",
        "...ksssssshhhk..",
        "..kseshhhhhHHk..",
        ".kSsssshhhHHk...",
        "..khhhssssHHk...",
        "...khhhhsssk....",
        "....kkkkkkk.....",
        ".....kccttck....",
        "....kccctttk....",
        "....kcccctck....",
        "....kccScCck....",
        "....kcSsCCck....",
        ".....kCCCCk.....",
        ".....kppppk.....",
        ".....kpPPpk.....",
        ".....kpPPpk.....",
        "....kfffffk.....",
    ],
}

FENNA_PALET = maak_palet({
    'k': '#2a1c1c', 's': '#f4c8a0', 'S': '#d4a07a', 'h': '#7a4424', 'H': '#52301a',
    'e': '#28202a', 'q': '#d86868', 'w': '#f6f2ea', 'd': '#3c9c8c', 'D': '#2a6c62',
    'f': '#5a3424', 'r': '#e05a48',
})

FENNA = {
    'omlaag': [
        "......kkkk......",
        "....kkhhhhkk....",
        "...khhhhhhhhk...",
        "..khhhhhhhhhhk..",
        "..khhHhhhhHhhk..",
        "..khsssssssshk..",
        "..khsesssseshk..",
        "..khsssSSssshk..",
        "..khhssqqsshhk..",
        "..khkkssssskhk..",
        "..khkdwwwwdkhk..",
        "..kHkddrrddkHk..",
        "..kdkddddddkDk..",
        "..kskddddddkSk..",
        "...kddddddddk...",
        "..kdddddddddDk..",
        "..kkkkkkkkkkkk..",
        "....ksk..ksk....",
        "....ksk..ksk....",
        "...kffk..kffk...",
    ],
    'omhoog': [
        "......kkkk......",
        "....kkhhhhkk....",
        "...khhhhhhhhk...",
        "..khhhhhhhhhhk..",
        "..khhhhhhhhhhk..",
        "..khhhhHHhhhhk..",
        "..khhhhHHhhhhk..",
        "..khhhhrrhhhhk..",
        "..kHhhhhhhhhHk..",
        "..kHhkhhhhkhHk..",
        "..kHkddhhddkHk..",
        "..kHkddhhddkHk..",
        "..kdkddddddkDk..",
        "..kskddddddkSk..",
        "...kddddddddk...",
        "..kdddddddddDk..",
        "..kkkkkkkkkkkk..",
        "....ksk..ksk....",
        "....ksk..ksk....",
        "...kffk..kffk...",
    ],
    'links': [
        "......kkkk......",
        "....kkhhhhkk....",
        "...khhhhhhhhk...",
        "..khhhhhhhhhhk..",
        "..khhhhhhhhhHk..",
        "..kssshhhhhHHk..",
        ".ksessshhhHHHk..",
        "..ksssshhHrHHk..",
        "..kqssshhhhHHk..",
        "...kkskkhhHHk...",
        "....kdwwdkHHk...",
        "....kddrdkHk....",
        "....kddddk......",
        "....kdsSdk......",
        "...kddddddk.....",
        "...kdddddDk.....",
        "...kkkkkkkk.....",
        ".....kssk.......",
        ".....kssk.......",
        "....kfffk.......",
    ],
}


def frames(data, palet, naam):
    omlaag = sprite(data['omlaag'], palet, 16, 20, naam + '-omlaag')
    omhoog = sprite(data['omhoog'], palet, 16, 20, naam + '-omhoog')
    links = sprite(data['links'], palet, 16, 20, naam + '-links')
    return [omlaag, omhoog, links, spiegel(links)]


def henk():
    return frames(HENK, HENK_PALET, 'henk')


def fenna():
    return frames(FENNA, FENNA_PALET, 'fenna')


if __name__ == '__main__':
    from pixel import vel, voorbeeld
    sheet = vel(henk() + fenna(), 4)
    voorbeeld(sheet, 6).save('voorbeeld_npcs.png')
