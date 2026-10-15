"""Genereert alle pixel-art in ../assets.

Gebruik:  python3 tools/genereer_assets.py
Nodig:    Python 3 + Pillow  (pip install pillow)
"""
import os
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HIER)
ASSETS = os.path.join(HIER, '..', 'assets')

from pixel import vel  # noqa: E402
import art_beer  # noqa: E402
import art_npcs  # noqa: E402
import art_barak  # noqa: E402
import art_portretten  # noqa: E402
import art_ui  # noqa: E402
import art_font  # noqa: E402
import art_achtergronden  # noqa: E402
import art_mensen  # noqa: E402
import art_buiten  # noqa: E402
import art_gevecht  # noqa: E402
import art_bos  # noqa: E402
import art_dorp  # noqa: E402
import art_n34  # noqa: E402
import art_wezup  # noqa: E402
import art_natuur  # noqa: E402
import art_beren  # noqa: E402
import art_aalden  # noqa: E402
import art_park  # noqa: E402


def pad(*delen):
    p = os.path.join(ASSETS, *delen)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


def main():
    # personages (16x20, volgorde: omlaag, omhoog, links, rechts)
    vel(art_beer.frames(), 3).save(pad('sprites', 'beer.png'))
    vel(art_npcs.henk(), 4).save(pad('sprites', 'henk.png'))
    vel(art_npcs.fenna(), 4).save(pad('sprites', 'fenna.png'))
    # grote sprites
    vel([art_portretten.directeur(False), art_portretten.directeur(True)], 2).save(pad('sprites', 'directeur.png'))
    vel([art_portretten.beer_groot(False), art_portretten.beer_groot(True)], 2).save(pad('sprites', 'beer_groot.png'))
    # tegels en objecten
    vel(art_barak.tegelset(), 8).save(pad('tiles', 'binnen.png'))
    for naam, img in art_barak.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    # interface
    for naam, img in art_ui.kaders().items():
        img.save(pad('ui', naam + '.png'))
    art_ui.cursor().save(pad('ui', 'cursor.png'))
    art_ui.pijl().save(pad('ui', 'pijl.png'))
    art_ui.patroon().save(pad('ui', 'patroon.png'))
    for naam, img in art_ui.iconen().items():
        img.save(pad('ui', naam + '.png'))
    # lettertypes
    fonts = pad('fonts', 'x')[:-2]
    art_font.maak_font('donker', '#404048', '#d0d0c8', fonts, fonts, 'font_donker')
    art_font.maak_font('wit', '#f8f8f8', '#505068', fonts, fonts, 'font_wit')
    art_font.maak_font('grijs', '#a8a8b0', '#e4e4e0', fonts, fonts, 'font_grijs')
    art_font.maak_font('rood', '#d83830', '#f0c0b0', fonts, fonts, 'font_rood')
    art_font.maak_font('blauw', '#3060c8', '#c0d0f0', fonts, fonts, 'font_blauw')
    art_font.maak_titelfont(fonts)
    # mensen buiten (16x20, 12 frames: omlaag, omhoog, links, rechts x staan/stap1/stap2)
    for naam, frames in art_mensen.alle().items():
        vel(frames, 3).save(pad('sprites', f'mens_{naam}.png'))
    # buitenterrein
    vel(art_buiten.tegelset() + art_bos.tegelset_extra() + art_dorp.tegelset_extra() + art_n34.tegelset_extra() + art_wezup.tegelset_extra() + art_natuur.tegelset_extra() + art_park.tegelset_extra(), 6).save(pad('tiles', 'buiten.png'))
    for naam, img in art_buiten.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    # bos
    for naam, img in art_bos.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    vel(art_bos.kikker(), 4).save(pad('sprites', 'kikker.png'))
    for naam, img in art_bos.iconen().items():
        img.save(pad('ui' if naam.startswith('icoon') else 'sprites', naam + '.png'))
    # Orvelte
    vel(art_dorp.binnen_tegelset() + art_n34.binnen_extra() + art_wezup.binnen_extra() + art_beren.binnen_extra() + art_aalden.binnen_extra(), 8).save(pad('tiles', 'dorp_binnen.png'))
    for naam, img in art_dorp.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    for naam, frames in art_dorp.animaties().items():
        vel(frames, len(frames)).save(pad('sprites', 'anim_' + naam + '.png'))
    for naam, img in art_dorp.iconen().items():
        img.save(pad('ui', naam + '.png'))
    art_dorp.effect_vape().save(pad('sprites', 'effect_vape.png'))
    art_dorp.jongere('djelano').save(pad('sprites', 'gevecht_djelano.png'))
    art_dorp.jongere('mustafah').save(pad('sprites', 'gevecht_mustafah.png'))
    art_dorp.gevecht_dorp().save(pad('bg', 'gevecht_dorp.png'))
    # de N34
    for naam, img in {**art_n34.objecten(), **art_n34.voertuigen()}.items():
        bestand = naam if naam.startswith('voertuig') else 'obj_' + naam
        img.save(pad('sprites', bestand + '.png'))
    vel(art_n34.rex(), 4).save(pad('sprites', 'rex.png'))
    art_n34.icoon_dagboek().save(pad('ui', 'icoon_dagboek.png'))
    art_n34.gevecht_weg().save(pad('bg', 'gevecht_weg.png'))
    art_n34.gevecht_winkel().save(pad('bg', 'gevecht_winkel.png'))
    # Wezup
    for naam, img in art_wezup.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    art_wezup.effect_snert().save(pad('sprites', 'effect_snert.png'))
    art_wezup.effect_spetter().save(pad('sprites', 'effect_spetter.png'))
    # het natuurgebied
    for naam, img in art_natuur.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    for naam, img in art_natuur.voertuigen().items():
        img.save(pad('sprites', naam + '.png'))
    for naam, img in art_natuur.iconen().items():
        img.save(pad('ui', naam + '.png'))
    vel(art_natuur.koe(), 4).save(pad('sprites', 'koe.png'))
    art_natuur.dobber().save(pad('sprites', 'dobber.png'))
    art_natuur.strandduitser().save(pad('sprites', 'gevecht_strandduitser_kurt.png'))
    art_natuur.gevecht_strand().save(pad('bg', 'gevecht_strand.png'))
    # De Beren-restaurant
    for naam, img in art_beren.objecten().items():
        img.save(pad('sprites', ('obj_' if not naam.startswith('bord_') else '') + naam + '.png'))
    for naam, img in art_beren.iconen().items():
        img.save(pad('ui', naam + '.png'))
    # Aalden
    for naam, img in art_aalden.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    for naam, img in art_aalden.iconen().items():
        img.save(pad('ui', naam + '.png'))
    # het vakantiepark
    for naam, img in art_park.objecten().items():
        img.save(pad('sprites', 'obj_' + naam + '.png'))
    for naam, frames in art_park.autos().items():
        vel(frames, 4).save(pad('sprites', naam + '.png'))
    for naam, frames in art_park.animaties().items():
        vel(frames, len(frames)).save(pad('sprites', 'anim_' + naam + '.png'))
    for naam, img in art_park.iconen().items():
        img.save(pad('ui', naam + '.png'))
    # gevechten
    for naam, img in art_gevecht.alles().items():
        img.save(pad('sprites', naam + '.png'))
    vel([art_gevecht.volkszanger(False), art_gevecht.volkszanger(True)], 2).save(pad('sprites', 'gevecht_volkszanger.png'))
    art_gevecht.achtergrond().save(pad('bg', 'gevecht.png'))
    art_gevecht.achtergrond_bos().save(pad('bg', 'gevecht_bos.png'))
    # achtergronden
    art_achtergronden.titel_achtergrond().save(pad('bg', 'titel.png'))
    art_achtergronden.intro_achtergrond().save(pad('bg', 'intro.png'))
    print('Klaar: assets gegenereerd in', os.path.normpath(ASSETS))


if __name__ == '__main__':
    main()
