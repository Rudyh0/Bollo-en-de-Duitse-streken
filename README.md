# … en de Duitse streken

Een korte RPG in de stijl van de klassieke handheld-monster-RPG's, helemaal in het Nederlands, die je in de browser speelt. Een beer zit vast in Kamp Westerbork en moet ontsnappen naar zijn vakantiepark bij Aalden, terwijl Drenthe weer eens bezet is door Duitsers in ouderwetse uniformen. Ze zijn op zoek naar Friezen. Speelduur: ongeveer een uur (als alles af is).

Gebouwd met [Phaser 3](https://phaser.io). Geen build-stap: het zijn gewone statische bestanden.

## Spelers, opslaan en namen

Op de server logt elke speler in met een **spelersnaam en een pincode van 6 cijfers**. De voortgang en de gekozen namen staan dan op de server, dus je speelt op elk apparaat en in elke browser verder waar je gebleven was. Er wordt geen e-mailadres of andere persoonlijke informatie gevraagd.

- Een nieuwe speler kiest daarna hoe het vakantiepark en de beer heten. Het hele spel gebruikt die namen (titel, gesprekken, menu's). Wijzigen kan via **Instellingen → Namen wijzigen** op het titelscherm; uitloggen ook daar.
- Pincodes worden niet als tekst bewaard (PBKDF2 met zout). Na 8 verkeerde pogingen is een spelersnaam een kwartier geblokkeerd.
- Wie de game host, kan ook vaste namen voor iedereen instellen: via de installer, of in `js/spel-config.js`.
- Draait de game zonder opslagserver (bijv. als losse bestanden), dan werkt alles nog steeds, maar wordt alleen in die ene browser opgeslagen.

De opslagdienst staat in `server/opslagdienst.py`: Python 3 met SQLite, zonder extra pakketten. Op de server bewaart hij alles in `/var/lib/duitse-streken/spel.db`, met elke nacht een back-up in `/var/backups/duitse-streken` (14 dagen).

## Besturing

| Actie | Toetsenbord | Telefoon/tablet |
|---|---|---|
| Lopen | pijltjes of WASD | D-pad |
| A (praten, kiezen, tekst verder) | Z, Spatie of Enter | A |
| B (terug, rennen als je hem vasthoudt) | X of Backspace | B |
| Menu | Esc of M | START |

Op een telefoon of tablet verschijnen de knoppen vanzelf (staand onder het beeld, liggend aan de zijkanten). Dat kun je aanpassen bij **Instellingen**.

## Installeren op een Ubuntu-server

Op een Ubuntu-server (22.04 of nieuwer), als root:

```bash
curl -fsSL https://raw.githubusercontent.com/Rudyh0/Bollo-en-de-Duitse-streken/main/install.sh | sudo bash
```

De installer vraagt naar het domein (standaard `bollo.rudymedia.nl`), of dat via Cloudflare loopt, en of hij nieuwe versies automatisch moet ophalen. Daarna:

- installeert hij nginx, git, rsync, UFW en (zonder Cloudflare) certbot, allemaal uit Ubuntu zelf;
- zet hij de game in `/var/www/duitse-streken` (alleen wat de browser nodig heeft, geen tools);
- draait de game **alleen op dat ene domein**: andere domeinnamen en het kale IP-adres krijgen geen antwoord (tenzij een andere site op de server al de standaardsite is; die laat hij met rust);
- zet hij de opslagdienst voor spelers klaar (alleen intern bereikbaar; nginx stuurt `/api/` door) met een dagelijkse back-up;
- regelt hij HTTPS:
  - **zonder Cloudflare** via Let's Encrypt, dat vanzelf verlengt. Wijst het domein nog niet naar de server, dan draait de game eerst via http; draai de installer opnieuw zodra de DNS klopt.
  - **met Cloudflare** (proxy aan, oranje wolkje) met een eigen certificaat. Zet in Cloudflare bij SSL/TLS de modus op **Full** (niet "Full (strict)"). De echte IP van bezoekers wordt herkend.
- zet hij poort 80 en 443 open in de firewall en houdt hij SSH altijd bereikbaar (ook op een andere poort dan 22);
- haalt hij (als je dat wilt) elke 10 minuten de nieuwste versie van GitHub. Wat op `main` staat, staat dus binnen 10 minuten live. Is de opslagdienst veranderd, dan wordt die ook herstart.

Handige commando's:

```bash
sudo duitse-streken-update            # nu meteen bijwerken
sudo duitse-streken-update --forceer  # opnieuw neerzetten, ook zonder nieuwe versie
journalctl -u duitse-streken-update   # logboek van het bijwerken
journalctl -u duitse-streken-opslag   # logboek van de opslagdienst
```

Instellingen wijzigen: draai de installer opnieuw (je vorige antwoorden blijven staan) of pas `/etc/duitse-streken/config` aan en draai daarna de installer. Alle opties staan bovenin `install.sh` (bijv. `--domein`, `--cloudflare ja`, `--ja` voor geen vragen). Verwijderen: `sudo bash install.sh --verwijder`.

## Lokaal testen

Met inloggen en opslaan op de "server":

```bash
python3 server/opslagdienst.py serveer --db test.db --poort 8000 --statisch .
```

Of zonder opslagserver (opslaan alleen in de browser):

```bash
python3 -m http.server 8000
```

Open daarna <http://localhost:8000>. (Direct het bestand openen werkt niet: browsers laden JavaScript-modules alleen via een webserver.)

## Projectstructuur

```
index.html, css/          pagina en aanraakknoppen
lib/phaser.min.js         Phaser 3.90
js/main.js                start van het spel
js/spel-config.js         vaste namen (leeg = speler kiest)
js/core/                  invoer, geluid (chiptune-synth), muziek, opslaan, instellingen, namen, voorwerpen
js/ui/                    tekstvak, keuzelijsten, naamscherm, pauzemenu, rugzak, winkel, telefoon, dagboek, instellingen
js/scenes/                Boot, Start, Setup (namen), Titel, Intro (directeur), Wereld, UI
js/maps/                  kaarten (tegels, objecten, personen) en hun scripts
server/opslagdienst.py    opslag voor spelers en saves (Python + SQLite)
assets/                   pixel-art en lettertypes (gegenereerd), en audio/intake.mp3
tools/                    Python-scripts die alle pixel-art maken
install.sh                installer voor een Ubuntu-server
```

Alle pixel-art, het lettertype en de chiptune-muziek zijn eigen werk; `assets/audio/intake.mp3` (de muziek tijdens de intake) en `assets/audio/outro.mp3` (de aftiteling) zijn aangeleverd. De plaatjes worden gemaakt met:

```bash
pip install pillow
python3 tools/genereer_assets.py
```

## Stand van zaken

Klaar (hoofdstuk 1, Kamp Westerbork):

- hoofdmenu, inloggen met spelersnaam + pincode, en de namen-invoer bij de eerste keer spelen
- intro met de directeur van het vakantiepark, met intake en eigen intakemuziek
- barak 7: kistje onder het bed (voedselbonnen en soeplepel), en de rookpuzzel: schep water uit de emmer, gooi het op de kachel, het brandalarm laat de deur openspringen
- het kampplein: rondlopende gevangenen, stoeten geketende gevangenen met een wachter voorop, de keuken, een waterpomp die je opknapt
- de uitgang: twee wachters die je zien aankomen en die je moet verslaan om de poort open te krijgen
- gevechten: SOEPLEPELSLAG en de VOLKSZANGER (Sepp Schunkelhuber brengt de vijand in de war, waardoor die vaker mist) tegen een Walther P38 en een mesje; rugzak tijdens het gevecht, ervaring en niveaus; wie verliest, begint opgeknapt opnieuw aan het begin van de scène
- pauzemenu met rugzak, status, telefoon (zodra je die hebt), opslaan en instellingen

Klaar (hoofdstuk 2, het bos):

- deel 1, het dennenbos: een kist met de tweede aanval, de BEVROREN FRIKANDEL (harder dan de soeplepel, maar je mist vaker)
- deel 2, diep in het bos: een patrouille van drie Duitsers (Horst, Jürgen en Feldwebel Uwe) die je niet kunt ontlopen, en een bosbron die je weer opknapt
- deel 3, de kikkerpoel: Kikker verkoopt RITALIN (sneller lopen), XTC (alles wordt een tijdje heel mooi) en 3MMC (allebei). Het geld daarvoor vind je bij de verslagen Duitsers. De 3MMC krijg je op de pof: "tientje nu, tientje later"
- als alles verkocht is, springt Kikker de poel in. Daarna trilt je telefoon: in de chat-app KWEBBEL eist Kikker zijn tientje en noemt hij je een oplichter. Pas na CONTACT BLOKKEREN kun je verder. Het gesprek blijft terug te lezen via START, TELEFOON
- de middelen werken ongeveer anderhalve minuut en alleen buiten gevechten

Klaar (hoofdstuk 3, Orvelte):

- een Drents dorpje met klinkers, een draaiende molen, hunebedden, een boerderij met rieten dak en plaggenhutten waar je naar binnen kunt; bij de in- en uitgang hangt de vlag van de bezetter
- coffeeshop De Zwevende Kei met 8-bit reggae: WIET en HASJ (onbeperkt te koop) herstellen gezondheid, ook in gevechten; buiten gevechten word je even stoned (wazige randen, rookwolkjes, langzamer lopen)
- Djelano en Mustafah staan met hun fatbikes voor de coffeeshop. Spreek je ze aan, dan volgen twee (makkelijke) gevechten tegen een broodmes en een vapewolk; daarna scheuren ze weg
- de quest: wie het dorp wil verlaten, wordt bij de slagboom tegengehouden door Obergefreiter Wolfgang. Hij geeft drie handboeien: vind de drie Friese onderduikers (onder een hunebed, in de molen en onder de vloer van een plaggenhut). Ze lopen geboeid achter je aan, ook naar binnen en na opslaan. Lever ze af bij Wolfgang, dan gaat de slagboom open
- dorpelingen geven hints (en spreken een beetje Drents, de onderduikers Fries)

Klaar (hoofdstuk 4, de N34 - Hunebed Highway):

- drie stukken N34 met een rood fietspad achter de vangrail en doorlopend verkeer in twee richtingen: auto's, een Duitser met caravan, jeeps, legertrucks en pantserwagens
- deel 1: een legervrachtwagen verliest een kistje (in beslag genomen bij kruidenier Fries uit Leeuwarden) met een voedselbon en het dagboek van Anne Fries. Het dagboek lees je in de rugzak als een schriftje om door te bladeren; het verwijst naar een geheime kamer achter een boekenkast in Wezup
- deel 2: tankstation Tank & Tosti. Ga je naar binnen, dan vecht je meteen met Unteroffizier Bernd; loop je door, dan stormt hij naar buiten en houdt hij je tegen. Daarna krijg je van de kassière een broodje kroket
- deel 3: de afslag naar Wezup met een grenscontrole (Grenzer Helmut, Jens en drugshond Rex). Drugs op zak: in beslag genomen en gevecht. Niks op zak: speekseltest. Ooit iets gebruikt (van Kikker of uit de coffeeshop): positief en gevecht. Nooit iets gebruikt: negatief, maar dan ben je een mietje, en mietjes horen hier niet thuis: gevecht

Klaar (hoofdstuk 5, Wezup):

- een ambachtsstadje met trapgeveltjes, een haventje met vissersboten, een viskraam, een bakkerij, slagerij, klompenmaker en kruidenier (de bakkerij, slagerij en kruidenier zijn van binnen te bezoeken)
- de inwoners zijn het hartgrondig met de Duitsers eens en hebben het voortdurend over "die verdomde tjibbes uit Friesland"
- verstopt achter de visnetten op de kade: een kistje met een voedselbon en de vierde aanval, GLOEIEND HETE SNERT (een pan kokende erwtensoep die je naar de Duitsers gooit)
- wie het stadje wil verlaten, wordt tegengehouden door Leutnant Friedrich: zoek Anne Fries, de dochter van de kruidenier, die gezocht wordt voor de verkoop van Friese droge worst en suikerbrood
- ze zit achter de boekenkast van kruidenier Hendrik, in een geheime kamer. Heb je haar dagboek bij je, dan geef je het terug. Ze loopt met je mee; bij de Leutnant kies je of je haar inlevert. Pas daarna kun je verder

Klaar (hoofdstuk 6, het Drentse land):

- deel 1, de landweg: trekkers, hooikarren en legervoertuigen in plaats van auto's, koeien in de wei en boer Lubbert (in het Drents), die je een voedselbon geeft
- deel 2, de Drentse Blue Lagoon: Duitsers op verlof (verbrand, sokken in sandalen, barbecue en schlagermuziek) vallen je niet aan. Heinz geeft je zijn hengel: vang drie vissen (baars, snoek en karper) bij drie verschillende steigers. Vissen is een minispel: wacht tot de dobber echt onder gaat en druk dan op A. Te vroeg of te laat, dan is de vis weg. Pas als je de hengel en de vissen terugbrengt, kun je verder
- deel 3, het recreatiestrandje: vlak voor de uitgang komt Strandduitser Kurt uit het zand, vertelt waarom Duitsers altijd kuilen graven en valt je aan (met een schep, een zandstraal en een handdoekslag)

Klaar (hoofdstuk 7, Aalden):

- het laatste stadje: Drentse huisjes met groen-witte luiken, molen De Hoop, een brink met een eik en een dobbe, tabakszaak Gerard, bejaardenhuis Huize Avondrood en een De Beren
- de weg naar het vakantiepark (met een bruin bord VAKANTIEPARK) zit dicht: Stabsgefreiter Manfred is zijn pakje Duitse zware shag kwijt en laat niemand door
- gevonden spullen gaan in Aalden naar de tabakszaak. Gerard wil €150 voor het pakje, en dat heb je niet
- opa Jannes in Huize Avondrood geeft je een envelop met boodschappengeld (koffie, beschuit, drop, advocaat). Je doet alsof je boodschappen gaat doen, maar gaat terug naar Gerard. Die vindt dat het enige wat de Duitsers goed doen de tabaksprijzen zijn, en dat Rob Jetten daar nog wat van kan leren
- met de shag gaat de slagboom open. Ga je daarna nog bij opa Jannes langs, dan weet hij niet meer waarvoor je kwam en krijg je een pepermuntje
- eigen muziek: een dorpsdeuntje en een orgelwals in het bejaardenhuis

Klaar (hoofdstuk 8, het vakantiepark, deel 1 en 2):

- de parkeerplaats: rijen Duitse auto's en caravans, Duitsers die heel erg zin hebben in hun vakantie (ook Heinz, Rüdiger en Karl van de Blue Lagoon) en een kistje met een voedselbon
- loop je richting het park, dan krijg je een melding: het park is alleen per auto bereikbaar. Je hoort een motor (!), springt opzij en Levi stopt naast je in zijn witte Audi A1. Hij gaat met 180 over het park scheuren en raast weg
- daarna kun je elke geparkeerde auto pakken en rondrijden (veel sneller dan lopen, met B nog sneller). Terug naar Aalden rijden mag niet
- de ingang: een welkomstboog met de naam van jouw park, een slagboom met een kaartlezer en slagboomwachter Jochem. Levi heeft de slagboomkaart uit zijn raampje de struiken in gegooid: zoek de glinstering, haal de kaart langs de lezer en rijd naar de receptie
- eigen muziek bij de ingang; op de parkeerplaats klinkt de schlager van de Duitsers

Klaar (de finale):

- in de receptie staat directeur Harm Rookhuys. Hij bekent dat alles een test was: hij is omgekocht door de Duitsers en van het park moet het tweede kamp van de regio worden. Hij is de eindbaas (parkreglement, smeergeld, parkeerboete en een oude krentenbol), met eigen muziek
- na het gevecht vallen de sleutels van huisje 7 uit zijn zak. Rechts van het plein ligt de straat met vakantiehuisjes (en Levi, met zijn Audi in de vijver)
- in huisje 7 zitten Jesse, Devona, Dewi, Femke, Frank, Mathijs en Rudy op de hoekbank voor de beamer, met de salontafel vol. Ze sturen je naar de sauna, boven in de badkamer
- de aftiteling: de beer in de sauna terwijl de namen voorbijkomen, precies even lang als de Outro (`assets/audio/outro.mp3`, aangeleverd). Daarna rook, een zwart scherm, het einde, en terug naar het menu

De Beren (in elk dorp):

- een restaurant in Orvelte (naast de molen), in Wezup (aan de noordkant) en in Aalden (aan de hoofdstraat), met eigen muziekje
- AANSCHUIVEN bij de gastvrouw is voor beren gratis: de kok zet de borden op de balie, je eet alles op en je gezondheid en PP zijn weer helemaal vol, net als in een Pokémon Center
- AFHALEN voor onderweg: BROODPLANKJE (€5, herstelt 15), KIPSATE (€10, herstelt 30) en SPARERIBS (€18, herstelt 60), ook te gebruiken in gevechten
- bij De Beren wordt niet gevochten, ook niet door de Duitsers die er zitten te eten

Nog te doen: een speelronde om bugs te vinden en op te lossen.
