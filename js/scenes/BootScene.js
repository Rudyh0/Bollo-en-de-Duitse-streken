// Laadt alle afbeeldingen en lettertypes en start daarna de UI-laag en het startscherm.
import { zetCamera, BREEDTE, HOOGTE, VERSIE } from '../core/constanten.js';

const v = `?v=${VERSIE}`;

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    zetCamera(this);
    const balkRand = this.add.rectangle(BREEDTE / 2, HOOGTE / 2, 122, 8).setStrokeStyle(1, 0x8890b0);
    const balk = this.add.rectangle(BREEDTE / 2 - 59, HOOGTE / 2, 1, 4, 0xf0d060).setOrigin(0, 0.5);
    this.load.on('progress', (p) => { balk.width = Math.max(1, 118 * p); });
    this.load.on('complete', () => { balkRand.destroy(); balk.destroy(); });

    this.load.setPath('assets/');
    const afbeeldingen = {
      bg_titel: 'bg/titel.png',
      bg_intro: 'bg/intro.png',
      patroon: 'ui/patroon.png',
      kader_tekst: 'ui/kader_tekst.png',
      kader_menu: 'ui/kader_menu.png',
      kader_info: 'ui/kader_info.png',
      cursor: 'ui/cursor.png',
      pijl: 'ui/pijl.png',
      icoon_voedselbon: 'ui/icoon_voedselbon.png',
      icoon_soeplepel: 'ui/icoon_soeplepel.png',
      icoon_rugzak: 'ui/icoon_rugzak.png',
      icoon_ritalin: 'ui/icoon_ritalin.png',
      icoon_xtc: 'ui/icoon_xtc.png',
      icoon_3mmc: 'ui/icoon_3mmc.png',
      icoon_wiet: 'ui/icoon_wiet.png',
      icoon_hasj: 'ui/icoon_hasj.png',
      icoon_handboeien: 'ui/icoon_handboeien.png',
      icoon_dagboek: 'ui/icoon_dagboek.png',
      icoon_hengel: 'ui/icoon_hengel.png',
      icoon_baars: 'ui/icoon_baars.png',
      icoon_snoek: 'ui/icoon_snoek.png',
      icoon_karper: 'ui/icoon_karper.png',
      dobber: 'sprites/dobber.png',
      icoon_kipsate: 'ui/icoon_kipsate.png',
      icoon_broodplankje: 'ui/icoon_broodplankje.png',
      icoon_spareribs: 'ui/icoon_spareribs.png',
      bord_spareribs: 'sprites/bord_spareribs.png',
      bord_sate: 'sprites/bord_sate.png',
      bord_broodplankje: 'sprites/bord_broodplankje.png',
      bg_gevecht_strand: 'bg/gevecht_strand.png',
      gevecht_strandduitser_kurt: 'sprites/gevecht_strandduitser_kurt.png',
      obj_stapelbed: 'sprites/obj_stapelbed.png',
      obj_stapelbed_rood: 'sprites/obj_stapelbed_rood.png',
      obj_kist: 'sprites/obj_kist.png',
      obj_kist_open: 'sprites/obj_kist_open.png',
      obj_kachel: 'sprites/obj_kachel.png',
      obj_tafel: 'sprites/obj_tafel.png',
      obj_kruk: 'sprites/obj_kruk.png',
      obj_emmer: 'sprites/obj_emmer.png',
      binnen: 'tiles/binnen.png',
      buiten: 'tiles/buiten.png',
      dorp_binnen: 'tiles/dorp_binnen.png',
      bg_gevecht: 'bg/gevecht.png',
      bg_gevecht_bos: 'bg/gevecht_bos.png',
      bg_gevecht_dorp: 'bg/gevecht_dorp.png',
      bg_gevecht_weg: 'bg/gevecht_weg.png',
      bg_gevecht_winkel: 'bg/gevecht_winkel.png',
      gevecht_unteroffizier_bernd: 'sprites/gevecht_unteroffizier_bernd.png',
      gevecht_grenzer_helmut: 'sprites/gevecht_grenzer_helmut.png',
      gevecht_djelano: 'sprites/gevecht_djelano.png',
      gevecht_mustafah: 'sprites/gevecht_mustafah.png',
      effect_vape: 'sprites/effect_vape.png',
      effect_snert: 'sprites/effect_snert.png',
      effect_spetter: 'sprites/effect_spetter.png',
      gevecht_wachter_klaus: 'sprites/gevecht_wachter_klaus.png',
      gevecht_wachter_dieter: 'sprites/gevecht_wachter_dieter.png',
      gevecht_soldaat_horst: 'sprites/gevecht_soldaat_horst.png',
      gevecht_soldaat_jurgen: 'sprites/gevecht_soldaat_jurgen.png',
      gevecht_feldwebel_uwe: 'sprites/gevecht_feldwebel_uwe.png',
      gevecht_beer_rug: 'sprites/gevecht_beer_rug.png',
      effect_noot: 'sprites/effect_noot.png',
      effect_uitroep: 'sprites/effect_uitroep.png',
      effect_ster: 'sprites/effect_ster.png',
      effect_flits: 'sprites/effect_flits.png',
      effect_inslag: 'sprites/effect_inslag.png',
      effect_snee: 'sprites/effect_snee.png',
      effect_lepel: 'sprites/effect_lepel.png',
      effect_frikandel: 'sprites/effect_frikandel.png',
    };
    ['barak', 'barak_5', 'barak_6', 'barak_7', 'barak_7_open', 'keuken', 'wachttoren', 'poort', 'poort_open',
      'wachthuisje', 'den', 'waterpomp', 'lantaarn', 'bankje', 'kisten', 'bord',
      'schatkist', 'schatkist_open', 'bron', 'boomstronk',
      'molen', 'hunebed', 'plaggenhut', 'coffeeshop', 'boerderij', 'slagboom', 'slagboom_open', 'fatbike', 'eik',
      'meelzakken', 'bedstee', 'haard', 'tafeltje', 'luik', 'luik_open', 'spinnewiel', 'toonbank', 'bank', 'plant',
      'boxen', 'asbak',
      'bord_hunebedhighway', 'bord_n34', 'bord_afslag', 'krat', 'krat_open', 'dranghek', 'pion', 'tankstation',
      'schap', 'koelkast', 'koffieautomaat', 'kassabalie',
      'huis_rood', 'huis_donker', 'huis_geel', 'huis_wit', 'winkel_bakker', 'winkel_slager', 'winkel_kruidenier',
      'winkel_klompen', 'viskraam', 'vissersboot', 'roeiboot', 'netten', 'tonnen', 'poster_gezocht', 'boekenkast',
      'boekenkast_open', 'toonbank_oud', 'kast_kruidenier', 'broodvitrine', 'oven', 'vleesvitrine', 'worsten', 'bedje',
      'bureautje', 'smokkelwaar',
      'hooibaal', 'melkbussen', 'parasol', 'parasol_blauw', 'bbq', 'koelbox', 'flamingo', 'visbord', 'strandstoel',
      'strandstoel_groen', 'handdoek', 'handdoek_blauw', 'reddingstoren', 'ijscokar', 'zandkuil', 'zandkasteel', 'schep',
      'bord_natuur',
      'restaurant_beren', 'beren_balie', 'beren_tafel', 'beren_tafel_groen', 'houten_beer', 'beren_plant'].forEach((naam) => {
      afbeeldingen[`obj_${naam}`] = `sprites/obj_${naam}.png`;
    });
    ['auto_rood', 'auto_blauw', 'auto_zilver', 'auto_geel', 'caravan', 'jeep', 'truck', 'truck_kisten', 'pantser',
      'trekker_rood', 'trekker_groen', 'trekker_blauw', 'hooikar'].forEach((naam) => {
      afbeeldingen[`voertuig_${naam}`] = `sprites/voertuig_${naam}.png`;
    });
    Object.entries(afbeeldingen).forEach(([k, pad]) => this.load.image(k, pad + v));

    this.load.spritesheet('beer', `sprites/beer.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('henk', `sprites/henk.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('fenna', `sprites/fenna.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('directeur', `sprites/directeur.png${v}`, { frameWidth: 48, frameHeight: 64 });
    this.load.spritesheet('beer_groot', `sprites/beer_groot.png${v}`, { frameWidth: 48, frameHeight: 56 });
    this.load.spritesheet('anim_wieken', `sprites/anim_wieken.png${v}`, { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('anim_vlag', `sprites/anim_vlag.png${v}`, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('koe', `sprites/koe.png${v}`, { frameWidth: 24, frameHeight: 20 });
    this.load.spritesheet('rex', `sprites/rex.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('kikker', `sprites/kikker.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('gevecht_volkszanger', `sprites/gevecht_volkszanger.png${v}`, { frameWidth: 48, frameHeight: 56 });
    ['wachter', 'wachter_pet', 'gevangene_a', 'gevangene_b', 'gevangene_c', 'gevangene_d',
      'oma', 'sporter', 'boer', 'kokkin', 'dichter', 'soldaat_bos', 'soldaat_muts', 'feldwebel',
      'djelano', 'mustafah', 'sjoerd', 'tjitske', 'wiebe', 'molenaar', 'budtender', 'grenswacht', 'opa', 'toerist',
      'dorpsvrouw', 'bernd', 'kassiere', 'helmut', 'jens',
      'anne', 'hendrik', 'bakker', 'slager', 'visser', 'vissersvrouw', 'leutnant', 'klompenmaker',
      'heinz', 'rudiger', 'karl', 'kurt', 'ijsman', 'gastvrouw', 'kok'].forEach((naam) => {
      this.load.spritesheet(`mens_${naam}`, `sprites/mens_${naam}.png${v}`, { frameWidth: 16, frameHeight: 20 });
    });

    ['donker', 'wit', 'grijs', 'rood', 'blauw', 'titel'].forEach((naam) => {
      this.load.bitmapFont(`font_${naam}`, `fonts/font_${naam}.png${v}`, `fonts/font_${naam}.xml${v}`);
    });
  }

  create() {
    this.scene.launch('UI');
    this.scene.start('Start');
  }
}
