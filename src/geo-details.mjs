/* Dodatkowe kotwice geograficzne z ilustracji mapy tomu 4 light novel.
   mapX/mapY odnoszą się do obrazu 1441 × 1024 px. Granice regionów są przybliżone. */

export const geoDetails = [
  {
    id: 'neris', name: 'Królestwo Neris', sub: 'Północny brzeg Kontynentu Centralnego',
    continent: 'central', mapX: 243, mapY: 116, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Nazwane na mapie tomu 4 królestwo północy, na zachód od Basherant.',
    story: 'Ilustracja wskazuje przybliżone położenie jego ośrodka; przebieg granic nie jest określony.',
    links: ['Basherant', 'Ranoa', 'Kraina Miecza'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'basherant', name: 'Księstwo Basherant', sub: 'Północne państwo',
    continent: 'central', mapX: 320, mapY: 116, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Księstwo oznaczone przy północnym wybrzeżu, na wschód od Neris.',
    story: 'Mapa podaje nazwę i położenie orientacyjne, lecz nie rysuje jego granic.',
    links: ['Neris', 'Ranoa', 'Północne krainy'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'ranoa-kingdom', name: 'Królestwo Ranoa', sub: 'Kraina Uniwersytetu Magii',
    continent: 'central', mapX: 263, mapY: 199, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Północne królestwo, w którym znajduje się Uniwersytet Magii.',
    story: 'Na ilustracji Ranoa i uczelnia leżą blisko siebie, na północ od Gór Czerwonego Smoka.',
    links: ['Sharia', 'Uniwersytet Magii', 'Neris'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'donati', name: 'Domena Donati', sub: 'Północno-zachodnia Asura',
    continent: 'central', mapX: 146, mapY: 294, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Domena rodu Zephyros oznaczona na zachodnim skraju Asury.',
    story: 'Autor wymienia cukier, wełnę i broń wśród jej wyrobów; dokładna granica domeny nie jest znana.',
    links: ['Asura', 'Ars', 'Fittoa'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'ars', name: 'Ars', sub: 'Stolica Królestwa Asura',
    continent: 'central', mapX: 193, mapY: 369, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Stolica Asury oznaczona ikoną miasta przy zachodniej części kontynentu.',
    story: 'Od miasta biegnie na mapie główny trakt ku południu i Dolnej Szczęce Czerwonego Smoka.',
    links: ['Asura', 'Donati', 'Dolna Szczęka'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'biheiril', name: 'Królestwo Biheiril', sub: 'Północno-wschodni cypel Centralnego',
    continent: 'central', mapX: 676, mapY: 196, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Królestwo oznaczone blisko urwistego styku z Kontynentem Niebiańskim.',
    story: 'Ilustracja tomu 4 umieszcza je na skraju północnego lądu, niedaleko Wyspy Ogrów.',
    links: ['Kontynent Niebiański', 'Wyspa Ogrów'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'ogre-island', name: 'Wyspa Ogrów', sub: 'Wyspa przy północnym cyplu',
    continent: 'central', mapX: 715, mapY: 209, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Mała wyspa oznaczona przy wschodnim krańcu Kontynentu Centralnego.',
    story: 'Na mapie leży tuż obok Biheiril i klifowego podejścia do Kontynentu Niebiańskiego.',
    links: ['Biheiril', 'Kontynent Niebiański'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'dragon-gods-hole', name: 'Smocza Jama', sub: 'Dragon God’s Hole',
    continent: 'central', mapX: 393, mapY: 296, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Punkt zaznaczony w górskiej części Kontynentu Centralnego.',
    story: 'Ilustracja umieszcza go na północ od Strefy Konfliktu, wśród wschodnich grzbietów Gór Czerwonego Smoka.',
    links: ['Góry Czerwonego Smoka', 'Strefa Konfliktu'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'strife-zone', name: 'Strefa Konfliktu', sub: 'Mozaika małych państw',
    continent: 'central', mapX: 442, mapY: 404, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Obszar na południe od gór, gdzie małe państwa stale ze sobą walczą.',
    story: 'Mapa oznacza szeroką strefę, ale nie podaje granic poszczególnych państw.',
    links: ['Shirone', 'Smocza Jama', 'Góry Czerwonego Smoka'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'kikka', name: 'Królestwo Kikka', sub: 'Południowy wschód Centralnego',
    continent: 'central', mapX: 576, mapY: 592, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Wasal Królestwa Króla Smoków, położony na południe od Shirone.',
    story: 'Autor wskazuje rzepak jako miejscowy produkt; na mapie Kikka sąsiaduje od południa z Sanakią.',
    links: ['Shirone', 'Sanakia', 'Królestwo Króla Smoków'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'sanakia', name: 'Królestwo Sanakia', sub: 'Południowy wschód Centralnego',
    continent: 'central', mapX: 595, mapY: 661, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Wasal Królestwa Króla Smoków, na południe od Kikka.',
    story: 'Autor wymienia ryż jako tutejszy produkt; mapa prowadzi dalej na południe ku królestwu i portowi.',
    links: ['Kikka', 'Królestwo Króla Smoków', 'Wschodni Port'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'dense-forest', name: 'Gęsty Las', sub: 'Południowy jęzor Centralnego',
    continent: 'central', mapX: 431, mapY: 652, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Wyraźna strefa lasu na zachodnim skraju południowej części kontynentu.',
    story: 'Leży za Dolną Szczęką Czerwonego Smoka, przed Górami Króla Smoków.',
    links: ['Dolna Szczęka', 'Góry Króla Smoków'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'dragon-king-range', name: 'Góry Króla Smoków', sub: 'Pasmo południowego jęzora',
    continent: 'central', mapX: 535, mapY: 706, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Osobny łańcuch gór ciągnący się ku południowemu cyplowi Centralnego.',
    story: 'Mapa odróżnia go od Gór Czerwonego Smoka i rysuje wzdłuż szlaku do portu.',
    links: ['Gęsty Las', 'Królestwo Króla Smoków', 'Wschodni Port'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'kurasuma', name: 'Kurasuma', sub: 'Północny port Kontynentu Demonów',
    continent: 'demon', mapX: 1014, mapY: 158, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Miasto na północno-zachodnim skraju Kontynentu Demonów.',
    story: 'Według autora to jedyne tamtejsze miasto utrzymujące handel z ludem morza.',
    links: ['Kontynent Demonów', 'Morze Ringus'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'kishirika-castle', name: 'Stary zamek Kishirisu', sub: 'Ruina w centrum krateru Rikaris',
    continent: 'demon', mapX: 1312, mapY: 213, seasons: [1, 3], ep: 'S3 · odc. 10',
    lead: 'W centrum Rikaris stoją ruiny dawnego zamku Kishirisu.',
    story: 'Strażnicy Atofe prowadzą tam Rudeusa i jego towarzyszy. To miejsce w obrębie Rikaris, nie odrębna siedziba Atofe w regionie Gaslow. Punkt wewnątrz krateru jest orientacyjny.',
    links: ['Rikaris', 'Kishirika', 'Atofe'], mapOnly: true, detailOnly: true, certainty: 'B', source: 'https://ncode.syosetu.com/n9669bk/163/'
  },
  {
    id: 'hobbit-territory', name: 'Terytorium hobbitów', sub: 'Zachodni skraj Millis',
    continent: 'millis', mapX: 1089, mapY: 732, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Obszar podpisany na zachodnim obrzeżu Wielkiego Lasu.',
    story: 'Ilustracja wskazuje terytorium orientacyjnie; nie wytycza granic ani miast.',
    links: ['Wielki Las', 'Święty Kraj Millis'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'beast-territory', name: 'Terytorium zwierzoludzi', sub: 'Północny Wielki Las',
    continent: 'millis', mapX: 1265, mapY: 663, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Obszar zwierzoludzi oznaczony w północnej części Wielkiego Lasu.',
    story: 'Mapa umieszcza nazwę nad lasem, bez dokładnej granicy między sąsiednimi ludami.',
    links: ['Wielki Las', 'Trakt Świętego Miecza'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'elf-territory', name: 'Terytorium elfów', sub: 'Wielki Las na Millis',
    continent: 'millis', mapX: 1285, mapY: 747, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Terytorium elfów podpisane przy wschodniej części Wielkiego Lasu.',
    story: 'Pozycja na mapie jest orientacyjna; źródło nie wyznacza linii granicznej.',
    links: ['Wielki Las', 'Terytorium zwierzoludzi'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'dwarf-territory', name: 'Terytorium krasnoludów', sub: 'Pogórze Millis',
    continent: 'millis', mapX: 1253, mapY: 794, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Obszar podpisany na południowym skraju lasu, blisko Błękitnych Gór.',
    story: 'Ilustracja łączy go wizualnie z górskim obrzeżem; dokładne granice pozostają nieznane.',
    links: ['Wielki Las', 'Góry Błękitnego Smoka'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'blue-dragon-range', name: 'Góry Błękitnego Smoka', sub: 'Granica lasu i południowego Millis',
    continent: 'millis', mapX: 1178, mapY: 799, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Pasmo oddzielające Wielki Las od południowego Świętego Kraju Millis.',
    story: 'Przez góry biegnie niemal prosty Trakt Świętego Miecza, opisany przez autora jako droga bez potworów.',
    links: ['Wielki Las', 'Trakt Świętego Miecza', 'Millishion'], mapOnly: true, detailOnly: true, certainty: 'B'
  },
  {
    id: 'red-dragon-upper-jaw', name: 'Górna Szczęka Czerwonego Smoka', sub: 'Północna przełęcz',
    continent: 'central', mapX: 169, mapY: 214, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Jedna z dwóch przełęczy przez Góry Czerwonego Smoka.',
    story: 'Leży przy północno-zachodnim skraju gór, na drodze między Asurą a krainami północy.',
    links: ['Góry Czerwonego Smoka', 'Dolna Szczęka', 'Ranoa'], mapOnly: true, detailOnly: true, certainty: 'A'
  },
  {
    id: 'heaven-cliff', name: 'Wysoki klif (ok. 3000 m)', sub: 'Urwista krawędź Kontynentu Niebiańskiego',
    continent: 'heaven', mapX: 833, mapY: 171, seasons: [1, 2, 3], ep: 'GEOGRAFIA',
    lead: 'Stroma krawędź oddzielająca płaskowyż od lądów położonych niżej.',
    story: 'Mapa tomu 4 podaje przy klifie wysokość około 3000 metrów. Punkt wskazuje fragment krawędzi, nie dokładnie wytyczoną granicę.',
    links: ['Płaskowyż Niebiański', 'Kontynent Niebiański'], mapOnly: true, detailOnly: true, certainty: 'A'
  }
];

export default geoDetails;
