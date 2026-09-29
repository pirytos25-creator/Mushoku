/* Kadry atlasowe w układzie 1441 × 1024 ilustracji mapy z tomu 4.
   bbox oznacza użyteczny prostokąt kamery, nie ścisłą granicę polityczną.
   Źródło obrazu: https://www.baka-tsuki.org/project/index.php?title=File%3AMushoku_Tensei_Vol.4_map_translated.jpg */

export const regions = [
  {
    id: 'asura-fittoa',
    name: 'Asura i Fittoa',
    subtitle: 'Żyzny zachód Kontynentu Centralnego',
    continent: 'central', bbox: [118, 225, 385, 590],
    blurb: 'Zachód kontynentu należy do bogatej Asury, której równiny przecinają rzeki i trakty. Fittoa leży w północno-wschodniej części królestwa, blisko Gór Czerwonego Smoka.',
    landmarks: ['asura', 'ars', 'donati', 'fittoa', 'buena', 'roa'],
    features: ['Stolica Ars', 'Domeny Greyratów', 'Żyzne równiny i rzeki', 'Okrąg katastrofy w Fittoa'],
    source: 'https://ncode.syosetu.com/n9669bk/192/'
  },
  {
    id: 'northern-lands',
    name: 'Północne krainy',
    subtitle: 'Ranoa, Uniwersytet Magii i Kraina Miecza',
    continent: 'central', bbox: [82, 75, 740, 353],
    blurb: 'Na północ od Gór Czerwonego Smoka rozciągają się chłodniejsze ziemie z większą liczbą lasów. Mapa umieszcza tu Ranoa i Uniwersytet Magii, Neris, Basherant, Krainę Miecza oraz dalekie Biheiril.',
    landmarks: ['northlands', 'sharia', 'sword-sanctum', 'ranoa-kingdom', 'neris', 'basherant', 'biheiril', 'red-dragon-upper-jaw'],
    features: ['Uniwersytet Magii w Ranoa', 'Kraina Miecza na zachodzie', 'Górna Szczęka Czerwonego Smoka', 'Lasy i chłodna północ'],
    source: 'https://ncode.syosetu.com/n9669bk/72/'
  },
  {
    id: 'strife-zone-region',
    name: 'Strefa Konfliktu',
    subtitle: 'Małe państwa między pasmem a wybrzeżem',
    continent: 'central', bbox: [360, 276, 590, 550],
    blurb: 'Między górami i wschodnim brzegiem kontynentu mapa zaznacza skupisko małych państw. Autor opisuje je jako obszar nieustannych potyczek, a Shirone jako zaporę na jego południowej granicy.',
    landmarks: ['strife-zone', 'dragon-gods-hole', 'red-dragon', 'shirone'],
    features: ['Liczne małe państwa', 'Smocza Jama w górskim sąsiedztwie', 'Shirone na południowym obrzeżu'],
    source: 'https://ncode.syosetu.com/n9669bk/72/'
  },
  {
    id: 'southern-central',
    name: 'Południe Kontynentu Centralnego',
    subtitle: 'Od Dolnej Szczęki do Wschodniego Portu',
    continent: 'central', bbox: [326, 505, 833, 886],
    blurb: 'Na długim południowym jęzorze kontynentu występują gęstsze lasy, rzeki i Góry Króla Smoków. Wzdłuż wschodniego brzegu leżą kolejno Shirone, Kikka, Sanakia i rozległe Królestwo Króla Smoków.',
    landmarks: ['red-wyrm-jaw', 'dense-forest', 'dragon-king-range', 'shirone', 'kikka', 'sanakia', 'dragon-king', 'east-port'],
    features: ['Dolna Szczęka jako przełęcz', 'Gęsty Las', 'Góry Króla Smoków', 'Trakt do Wschodniego Portu'],
    source: 'https://ncode.syosetu.com/n9669bk/72/'
  },
  {
    id: 'demon-continent-region',
    name: 'Kontynent Demonów',
    subtitle: 'Cała droga Dead End: od Migurdów do morza',
    continent: 'demon', bbox: [984, 116, 1370, 548],
    blurb: 'Pustkowia po teleportacji prowadzą do osady Migurdów, potem do krateru Rikaris i na długi południowy szlak przez Las Petryfikacji ku Wen Port. Kurasuma leży na osobnym północno-zachodnim odgałęzieniu. Autor podaje orientacyjny kształt i pozycje dużych miast, bez dokładnej skali i punktu wioski.',
    landmarks: ['demon-north', 'migurd-village', 'rikaris', 'kishirika-castle', 'petrified-forest', 'demon-south-route', 'wind-port', 'kurasuma'],
    features: ['Osada pod pancerzami Wielkich Żółwi', 'Rikaris w olbrzymim kraterze', 'Kościsty Las Petryfikacji', 'Długi południowy szlak', 'Wen Port i oddzielna Kurasuma'],
    source: 'https://ncode.syosetu.com/n9669bk/72/'
  },
  {
    id: 'demon-migurd-region',
    name: 'Pustkowia i Migurdowie',
    subtitle: 'Początek podróży Rudeusa, Eris i Ruijerda',
    continent: 'demon', bbox: [1110, 126, 1332, 293], zoomMax: 3.2,
    blurb: 'Spękana ziemia i wysokie progi skalne sprawiają, że niedaleka w linii prostej wioska Migurdów wymaga krętej marszruty. Osada Roxy ma kilkanaście domów w ziemi, każdy pod wielkim pancerzem żółwia. Jej dokładny punkt jest umowny.',
    landmarks: ['demon-north', 'migurd-village'],
    features: ['Suche żleby i niemal brak roślin', 'Dom wodza pod około 20-metrową skorupą', 'Brama, skromne pole i wspólne ognisko', 'Roin i Rokari — rodzice Roxy'],
    source: 'https://ncode.syosetu.com/n9669bk/26/'
  },
  {
    id: 'demon-rikaris-region',
    name: 'Rikaris i Las Petryfikacji',
    subtitle: 'Krater, zamek Kishirisu i niebezpieczny skrót',
    continent: 'demon', bbox: [1217, 150, 1395, 350], zoomMax: 3.2,
    blurb: 'Rikaris zajmuje dno wielkiego krateru z trzema wejściami w obręczy. W środku stoją czarnozłote ruiny zamku Kishirisu, gdzie w późniejszej wyprawie pojawia się Atofe. Około dzień drogi na południe leży las ostro zakończonych drzew, które wyglądają na skamieniałe.',
    landmarks: ['rikaris', 'kishirika-castle', 'petrified-forest'],
    features: ['Trzy przejścia przez pierścień krateru', 'Zajazdy i Gildia Poszukiwaczy Przygód', 'Zamek Kishirisu w środku miasta', 'Kościste drzewa i groźne potwory na południu'],
    source: 'https://ncode.syosetu.com/n9669bk/28/'
  },
  {
    id: 'demon-south-region',
    name: 'Południowy szlak i Wen Port',
    subtitle: 'Nienazwane stacje, stocznia i przeprawa na Millis',
    continent: 'demon', bbox: [1120, 265, 1395, 557], zoomMax: 3.05,
    blurb: 'Za Rikaris podróż trwa przez wiele miast, które tekst często pozostawia bez nazw. Drużyna bierze w nich zlecenia i oszczędza na przeprawę. Wen Port schodzi po zboczach ku ruchliwemu drewnianemu nabrzeżu i statkom do Zant Port.',
    landmarks: ['petrified-forest', 'demon-south-route', 'wind-port'],
    features: ['Długi pas nienazwanych przystanków', 'Strome ulice Wen Port', 'Ziemne i kamienne domy, stocznia', 'Szlak morski do Zant Port'],
    source: 'https://ncode.syosetu.com/n9669bk/38/'
  },
  {
    id: 'demon-kurasuma-region',
    name: 'Kurasuma i północny zachód',
    subtitle: 'Osobny szlak handlowy Roxy',
    continent: 'demon', bbox: [982, 115, 1235, 375], zoomMax: 3.05,
    blurb: 'Kurasuma leży na północno-zachodnim cyplu. Utrzymuje handel z ludem morza i pojawia się w wątku Roxy, ale nie jest kolejnym etapem marszu Dead End ani portem przeprawy na Millis.',
    landmarks: ['kurasuma'],
    features: ['Boczny szlak Roxy', 'Wymiana towarów z ludem morza', 'Ostre lokalne zioła i alkohol'],
    source: 'https://ncode.syosetu.com/n9669bk/71/'
  },
  {
    id: 'great-forest-region',
    name: 'Wielki Las Millis',
    subtitle: 'Ludy lasu i Trakt Świętego Miecza',
    continent: 'millis', bbox: [1040, 548, 1364, 814],
    blurb: 'Wielki Las zajmuje północ kontynentu Millis i jest domem zwierzoludzi oraz innych ludów oznaczonych na mapie. Przez las biegnie niemal prosty Trakt Świętego Miecza, a na północnym cyplu leży Zant Port.',
    landmarks: ['great-forest', 'zant-port', 'holy-sword-road', 'hobbit-territory', 'beast-territory', 'elf-territory', 'dwarf-territory'],
    features: ['Trzymiesięczna pora deszczowa', 'Terytoria kilku ludów', 'Trakt bez potworów', 'Zant Port'],
    source: 'https://ncode.syosetu.com/n9669bk/72/'
  },
  {
    id: 'holy-millis-region',
    name: 'Święty Kraj Millis',
    subtitle: 'Południe za Górami Błękitnego Smoka',
    continent: 'millis', bbox: [830, 720, 1335, 900],
    blurb: 'Południe Millis jest żyźniejsze i pełne wód; od Wielkiego Lasu oddzielają je Góry Błękitnego Smoka. Rzeka Nikolaus przepływa przez Millishion i jezioro Gran, pośrodku którego stoi Biały Pałac. Stolica ma cztery kierunkowe dzielnice oraz siedem magicznych wież.',
    landmarks: ['millishion', 'west-port', 'blue-dragon-range'],
    features: ['Jezioro Gran i Biały Pałac', 'Rzeka Nikolaus', 'Siedem magicznych wież', 'Cztery dzielnice stolicy'],
    source: 'https://ncode.syosetu.com/n9669bk/49/'
  },
  {
    id: 'begaritt-region',
    name: 'Kontynent Begaritt',
    subtitle: 'Pustynia, oazy i labirynty',
    continent: 'begaritt', bbox: [80, 545, 640, 954],
    blurb: 'Begaritt jest w większości pustynny, lecz mapa pokazuje także góry, jezioro i wyspy zieleni. W południowo-wschodniej części leży Rapan, miasto labiryntów zbudowane pośród żeber behemota.',
    landmarks: ['begaritt-desert', 'rapan', 'labyrinth'],
    features: ['Żebra behemota w Rapan', 'Liczne labirynty', 'Anomalie magiczne', 'Pustynia z oazami'],
    source: 'https://ncode.syosetu.com/n9669bk/129/'
  },
  {
    id: 'heaven-continent-region',
    name: 'Kontynent Niebiański',
    subtitle: 'Płaskowyż nad urwistym klifem',
    continent: 'heaven', bbox: [714, 75, 1028, 191],
    blurb: 'Kontynent Niebiański jest wysokim płaskowyżem przy północnej krawędzi mapy, między lądami Centralnym i Demonów. Autor umieszcza płaski teren około trzech tysięcy metrów nad poziomem morza i wiąże go z ludem niebiańskim.',
    landmarks: ['heaven', 'heaven-cliff'],
    features: ['Klif na północnym łuku', 'Płaskowyż około 3000 m', 'Lud niebiański'],
    source: 'https://ncode.syosetu.com/n9669bk/37/'
  }
];

export default regions;
