"""De beer (speler): loopsprites 16x20 in drie richtingen (rechts = gespiegeld links)."""
from pixel import maak_palet, sprite, spiegel

PALET = maak_palet({
    'k': '#302018',  # omlijning
    'b': '#b8743c',  # vacht
    'B': '#8a5228',  # vacht schaduw
    'l': '#dc9c5c',  # vacht licht
    'm': '#f2dcae',  # snuit
    'M': '#d2b07e',  # snuit schaduw
    'e': '#202028',  # oog
    'w': '#f8f8f8',  # wit
    'r': '#d84030',  # muts
    'R': '#a02820',  # muts schaduw
    'p': '#f47c5c',  # muts licht
    'W': '#f0e8d8',  # pompon
    'c': '#4a7ad2',  # trui
    'C': '#2f56a0',  # trui schaduw
    'q': '#7cacf0',  # trui licht
    'g': '#64748a',  # rugzak
    'G': '#44505e',  # rugzak schaduw
})

MUTS_VOOR = [
    "......kkkk......",
    ".....kWWWWk.....",
    "....kkkWWkkk....",
    ".kkkkprrrrrRkkk.",
    "kblkrrrrrrrRklbk",
    "kbkRRRRRRRRRRkbk",
    ".kkRrRrRRrRrRkk.",
]

GEZICHT_VOOR = [
    ".kbbbbbbbbbbbbk.",
    ".kbbbebbbbebbbk.",
    ".kbbbemkkmebbbk.",
    ".kBbbmmMMmmbbBk.",
    "..kBBbmmmmbBBk..",
    "...kkkkkkkkkk...",
]

ACHTERHOOFD = [
    ".kbbbbbbbbbbbbk.",
    ".kbbbbbbbbbbbbk.",
    ".kbbbbbbbbbbbbk.",
    ".kBbbbbbbbbbbBk.",
    "..kBBbbbbbbBBk..",
    "...kkkkkkkkkk...",
]

ROMP_VOOR = [
    ".kcckccwwcckcck.",
    ".kqckcwccwckcCk.",
    ".kqckcCCCCckcCk.",
    ".klbkcCccCckbBk.",
    "..kkkCCCCCCkkk..",
]
ROMP_VOOR_ZWAAI1 = [
    ".kcckccwwcckcck.",
    ".klbkcwccwckcCk.",
    "..kkkcCCCCckcCk.",
    "....kcCccCckbBk.",
    "....kCCCCCCkkk..",
]
ROMP_VOOR_ZWAAI2 = [
    ".kcckccwwcckcck.",
    ".kqckcwccwckbBk.",
    ".kqckcCCCCckkk..",
    ".klbkcCccCck....",
    "..kkkCCCCCCk....",
]

ROMP_ACHTER = [
    ".kcckGggggGkcck.",
    ".kqckggggggkcCk.",
    ".kqckgGGGGgkcCk.",
    ".klbkggggggkbBk.",
    "..kkkGGGGGGkkk..",
]
ROMP_ACHTER_ZWAAI1 = [
    ".kcckGggggGkcck.",
    ".klbkggggggkcCk.",
    "..kkkgGGGGgkcCk.",
    "....kggggggkbBk.",
    "....kGGGGGGkkk..",
]
ROMP_ACHTER_ZWAAI2 = [
    ".kcckGggggGkcck.",
    ".kqckggggggkbBk.",
    ".kqckgGGGGgkkk..",
    ".klbkggggggk....",
    "..kkkGGGGGGk....",
]

BENEN_STAAN = [
    "....kbbkkbbk....",
    "....kkkkkkkk....",
]
BENEN_STAP1 = [
    "....kbbkkBBk....",
    "....kkkk.kk.....",
]
BENEN_STAP2 = [
    "....kBBkkbbk....",
    ".....kk.kkkk....",
]

MUTS_ZIJ = [
    ".......kkkk.....",
    "......kWWWWk....",
    ".....kkkWWkkk...",
    "....kprrrrrRk.kk",
    "...krrrrrrrrRklk",
    "..kRRRRRRRRRRkbk",
    "..kRrRrRRrRrRkk.",
]
GEZICHT_ZIJ = [
    "..kbbbbbbbbbbbk.",
    "..kbebbbbbbbbbk.",
    "kkmbebbbbbbbBbk.",
    "kmmMbbbbbbbbBBk.",
    ".kMMbbbbbbbBBk..",
    "..kkkkkkkkkkk...",
]
ROMP_ZIJ = [
    "....kcccccckGk..",
    "...kcqqccccckgGk",
    "...kcqbbcccckgGk",
    "...kcClbccCCkgGk",
    "....kCCCCCCCkkk.",
]
ROMP_ZIJ_ZWAAI1 = [
    "....kcccccckGk..",
    "..kbbqqccccckgGk",
    "..kblkcccccckgGk",
    "...kkcCccCCCkgGk",
    "....kCCCCCCCkkk.",
]
ROMP_ZIJ_ZWAAI2 = [
    "....kcccccckGk..",
    "...kcqqccccckgGk",
    "...kcqqccccbbkGk",
    "...kcCcccCClbkGk",
    "....kCCCCCCCkkk.",
]
BENEN_ZIJ_STAAN = [
    ".....kbbbbk.....",
    ".....kkkkkk.....",
]
BENEN_ZIJ_STAP1 = [
    "...kbbk.kbbk....",
    "...kkk...kkk....",
]
BENEN_ZIJ_STAP2 = [
    "....kbBkbbk.....",
    "....kkk.kkk.....",
]


def frames():
    """Volgorde: omlaag(staan, stap1, stap2), omhoog(...), links(...), rechts(...)."""
    def maak(delen, naam):
        rijen = [r for deel in delen for r in deel]
        return sprite(rijen, PALET, 16, 20, naam)

    omlaag = [
        maak([MUTS_VOOR, GEZICHT_VOOR, ROMP_VOOR, BENEN_STAAN], 'omlaag-staan'),
        maak([MUTS_VOOR, GEZICHT_VOOR, ROMP_VOOR_ZWAAI1, BENEN_STAP1], 'omlaag-stap1'),
        maak([MUTS_VOOR, GEZICHT_VOOR, ROMP_VOOR_ZWAAI2, BENEN_STAP2], 'omlaag-stap2'),
    ]
    omhoog = [
        maak([MUTS_VOOR, ACHTERHOOFD, ROMP_ACHTER, BENEN_STAAN], 'omhoog-staan'),
        maak([MUTS_VOOR, ACHTERHOOFD, ROMP_ACHTER_ZWAAI2, BENEN_STAP2], 'omhoog-stap1'),
        maak([MUTS_VOOR, ACHTERHOOFD, ROMP_ACHTER_ZWAAI1, BENEN_STAP1], 'omhoog-stap2'),
    ]
    links = [
        maak([MUTS_ZIJ, GEZICHT_ZIJ, ROMP_ZIJ, BENEN_ZIJ_STAAN], 'links-staan'),
        maak([MUTS_ZIJ, GEZICHT_ZIJ, ROMP_ZIJ_ZWAAI1, BENEN_ZIJ_STAP1], 'links-stap1'),
        maak([MUTS_ZIJ, GEZICHT_ZIJ, ROMP_ZIJ_ZWAAI2, BENEN_ZIJ_STAP2], 'links-stap2'),
    ]
    rechts = [spiegel(f) for f in links]
    return omlaag + omhoog + links + rechts


if __name__ == '__main__':
    from pixel import vel, voorbeeld
    sheet = vel(frames(), 6)
    voorbeeld(sheet, 6).save('voorbeeld_berend.png')
