import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { places as rawPlaces, routes, events, continents, SOURCE } from './atlas-data.mjs';
import { geoDetails } from './geo-details.mjs';
import { regions } from './region-data.mjs';
import { createCartographicTerrain } from './cartographic-terrain.mjs';
import { CityExplorer } from './city-viewer.js';

// Native coordinates of the much richer world illustration from light novel vol. 4.
// Story-only sites absent from the printed map are deliberately approximate.
const PIXELS_LN={
 fittoa:[275,305],buena:[260,315],roa:[292,320],asura:[288,395],
 'red-dragon':[374,337],'sword-sanctum':[101,124],northlands:[445,185],sharia:[263,170],
 'red-wyrm-jaw':[353,594],shirone:[566,535],'east-port':[810,847],'dragon-king':[715,838],
 rikaris:[1300,208],'demon-north':[1210,185],'migurd-village':[1231,205],'petrified-forest':[1307,275],'demon-south-route':[1300,388],'wind-port':[1268,524],
 'zant-port':[1237,586],'great-forest':[1231,704],millishion:[1194,837],'west-port':[876,847],
 'holy-sword-road':[1217,661],'begaritt-desert':[342,745],rapan:[449,846],labyrinth:[456,824],
 'chaos-breaker':[808,515],heaven:[886,120]
};
const PALETTE={1:0xf5c677,2:0x8bd4e9,3:0xf18e72};
const places=[...rawPlaces.map(p=>({...p,x:PIXELS_LN[p.id]?.[0]??p.x,y:PIXELS_LN[p.id]?.[1]??p.y,mapX:PIXELS_LN[p.id]?.[0]??p.x,mapY:PIXELS_LN[p.id]?.[1]??p.y})),...geoDetails];
const byId=Object.fromEntries(places.map(p=>[p.id,p]));
const qs=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
const atlas=qs('#atlas'),wrap=qs('#sceneWrap'),host=qs('#glmap'),pinLayer=qs('#pinLayer'),continentLayer=qs('#continentLayer');
const mapHost=qs('#cartoMap'),mapStage=qs('#mapStage'),mapPins=qs('#mapPins'),routeSvg=qs('#routeSvg');
const state={season:'all',event:0,selected:null,region:null,mode:'map',cityActive:false,cityScene:null,citySpot:null,cityReturnSpot:null,cityRequestSerial:0,tween:null,pins:[],labelNodes:[],routes:[],ready:false};
const mapView={scale:1,fit:1,x:0,y:0,width:0,height:0,drag:null};
const mapActive=()=>state.mode!=='3d';
const approxIds=new Set(['buena','roa','demon-north','migurd-village','petrified-forest','demon-south-route','labyrinth']);
const fixedA=new Set(['sword-sanctum','sharia','red-wyrm-jaw','shirone','east-port','rikaris','wind-port','zant-port','millishion','west-port','rapan']);
const landmarkIcons={fittoa:'fittoa-calamity',sharia:'ranoa-university',rikaris:'rikaris-crater',rapan:'rapan-behemoth-ribs',millishion:'millishion-temple',heaven:'heaven-cliff'};
const SHARIA_REFERENCES=[
  {spot:'magic-guild',title:'Pięć dzielnic Sharii',kind:'Tekst autora · Gildia Magii w środku, uczelnia na wschodzie',source:'https://ncode.syosetu.com/n9669bk/75/'},
  {spot:'university',title:'Uniwersytet Magii Ranoa',kind:'Oficjalny plakat sezonu 2',image:'https://mushokutensei.jp/wp-content/uploads/2023/07/MT2_keyvisual02_0730-724x1024.jpg',source:'https://mushokutensei.jp/news/230730_1/'},
  {spot:'campus-square',title:'Aleja, pomnik i budynki kampusu',kind:'Tekst autora · plac Frau Claudii, akademiki i mury',source:'https://ncode.syosetu.com/n9669bk/75/'},
  {spot:'library',title:'Biblioteka uczelni',kind:'Tekst autora · osobny dwupiętrowy budynek',source:'https://ncode.syosetu.com/n9669bk/77/'},
  {spot:'cafeteria',title:'Stołówka uczelni',kind:'Tekst autora · osobny trzypiętrowy budynek',source:'https://ncode.syosetu.com/n9669bk/77/'},
  {spot:'research-wing',title:'Gmach badawczy Nanahoshi',kind:'Tekst autora · trzecie piętro, koniec korytarza, trzy połączone pokoje',source:'https://ncode.syosetu.com/n9669bk/87/'},
  {spot:'greyrat',title:'Rezydencja z plakatu',kind:'Oficjalny plakat · inspiracja dla dachu i arkad',image:'https://mushokutensei.jp/wp-content/uploads/2023/12/MT2_s2_teaser_01_web--724x1024.jpg',source:'https://mushokutensei.jp/news/231220_1/'},
  {spot:'greyrat',title:'Spacer do domu Greyratów',kind:'Tekst autora · około 30 minut od uczelni',source:'https://ncode.syosetu.com/n9669bk/108/'},
  {spot:'neris',title:'Zachodnia dzielnica warsztatów',kind:'Tekst autora · pracownia Neris',source:'https://ncode.syosetu.com/n9669bk/75/'},
  {spot:'trade',title:'Północna Gildia Handlowa',kind:'Tekst autora · handel na północy',source:'https://ncode.syosetu.com/n9669bk/75/'}
];
const MILLIS_REFERENCES=[
  {spot:'palace',title:'Panorama Millishion',kind:'Oficjalny opening odcinka 16 · TOHO animation',source:'https://www.youtube.com/watch?v=Zf3zKKf1FNU'},
  {spot:'lake',title:'Opis miasta autora',kind:'Jezioro Gran, rzeka, dzielnice i siedem wież · WN rozdz. 44',source:'https://ncode.syosetu.com/n9669bk/49/'},
  {spot:'guild',title:'Przybycie do stolicy',kind:'Oficjalny opis anime · sezon 1, odcinek 16',source:'https://mushokutensei.jp/story/16/'}
];
const INTERIOR_REFERENCES=[
  {spot:'cloister',title:'Krużganek Uniwersytetu',kind:'Oficjalny kadr anime · S2 odc. 17',image:'https://mushokutensei.jp/wp-content/uploads/2024/05/1_MT2_17_0103.jpg',source:'https://mushokutensei.jp/story/2-17/'},
  {spot:'hall',title:'Sala wykładowa',kind:'Oficjalny kadr anime · S2 odc. 5',image:'https://mushokutensei.jp/wp-content/uploads/2023/08/%E2%91%A2MT2_ep05_0050.jpg',source:'https://mushokutensei.jp/story/2-05/'},
  {spot:'library',title:'Biblioteka i stołówka',kind:'Tekst autora · dwa odrębne budynki uczelni',source:'https://ncode.syosetu.com/n9669bk/77/'},
  {spot:'nanahoshi',title:'Pracownia Nanahoshi',kind:'Tekst autora · koniec trzeciego piętra gmachu badawczego, trzy połączone pokoje',source:'https://ncode.syosetu.com/n9669bk/87/'},
  {spot:'nanahoshi-experiment',title:'Eksperymenty przywołania',kind:'Oficjalny opis anime · sezon 2, odcinek 10',source:'https://mushokutensei.jp/story/2-10/'},
  {spot:'zanoba',title:'Pracownia Zanoby i Julie',kind:'Tekst autora · badanie automatycznej lalki',source:'https://ncode.syosetu.com/n9669bk/115/'},
  {spot:'cliff',title:'Badania Cliffa',kind:'Tekst autora · księgi, narzędzia magiczne i klątwy',source:'https://ncode.syosetu.com/n9669bk/108/'}
];
const DEMON_REFERENCES=[
  {spot:'wasteland',title:'Północne pustkowia',kind:'Oficjalny kadr S1 odc. 9 · sucha warstwowa skała',image:'https://mushokutensei.jp/wp-content/uploads/2021/03/MusyokuTensei_ep09_0115.jpg',source:'https://mushokutensei.jp/story/9/'},
  {spot:'migurd',title:'Wioska Migurdów',kind:'Oficjalny kadr S1 odc. 18 · dom pod pancerzem',image:'https://mushokutensei.jp/wp-content/uploads/2021/11/5-1.jpg',source:'https://mushokutensei.jp/story/18/'},
  {spot:'rikaris',title:'Pierwsze zlecenia Dead End',kind:'Oficjalny opis anime · sezon 1, odcinek 10',source:'https://mushokutensei.jp/story/10/'},
  {spot:'rikaris-guild',title:'Gildia w Rikaris',kind:'Tekst autora · rejestracja drużyny, tablica zleceń i skup za budynkiem',source:'https://ncode.syosetu.com/n9669bk/29/'},
  {spot:'forest',title:'Las Petryfikacji',kind:'Oficjalny kadr S1 odc. 11 · kościste pnie',image:'https://mushokutensei.jp/wp-content/uploads/2021/03/MT_11_058_t1.jpg',source:'https://mushokutensei.jp/story/11/'},
  {spot:'port',title:'Wen Port',kind:'Oficjalny kadr S1 odc. 12 · nabrzeże i morze',image:'https://mushokutensei.jp/wp-content/uploads/2021/09/%E3%83%A1%E3%82%A4%E3%83%B3%EF%BC%91.jpg',source:'https://mushokutensei.jp/story/12/'},
  {spot:'castle',title:'Stary zamek Kishirisu',kind:'Opis zamku w tekście autora · Rikaris',source:'https://ncode.syosetu.com/n9669bk/28/'},
  {spot:'road',title:'Południowa wędrówka',kind:'Nienazwane stacje w tekście autora',source:'https://ncode.syosetu.com/n9669bk/36/'}
];
const MILLIS_SPOTS=[
  {id:'palace',node:'city_white_palace',name:'Biały Pałac',description:'Biały Pałac stoi na wyspie pośrodku jeziora Gran. To centralna dominanta Millishion opisana przez autora.',cameraOffset:[36,30,52],fallback:[0,24,-5]},
  {id:'lake',node:'city_grand_lake',name:'Jezioro Gran i rzeka Nikolaus',description:'Rzeka Nikolaus przepływa przez jezioro w sercu stolicy. Kształt nabrzeża i mostów jest rekonstrukcją.',cameraOffset:[0,42,72],fallback:[0,1,28]},
  {id:'cathedral',node:'city_millis_cathedral',name:'Złota katedra',description:'Święta dzielnica leży na zachodzie miasta. Wznosi się tu złocista katedra.',cameraOffset:[-36,25,50],fallback:[-58,24,5]},
  {id:'guild',node:'city_adventurers_guild',name:'Gildia Poszukiwaczy Przygód',description:'Srebrzysta siedziba Gildii dominuje w południowej dzielnicy przygód, niedaleko drogi wejściowej.',cameraOffset:[34,21,46],fallback:[-4,13,69]},
  {id:'towers',node:'city_seven_towers',name:'Siedem wież Millis',description:'Siedem magicznych wież otacza Millishion; zgodnie z opisem autora podtrzymują barierę i regulują poziom wody.',cameraOffset:[32,29,50],fallback:[84,28,-21]},
  {id:'east',node:'city_east_market',name:'Dzielnica handlowa',description:'Wschodnie kwartały miasta skupiają kupców, warsztaty i wymianę towarów.',cameraOffset:[31,19,35],fallback:[60,13,-6]},
  {id:'market',node:'city_market',name:'Ulice i południowy rynek',description:'Regularna siatka ulic prowadzi od południa w stronę jeziora. Rozmieszczenie pojedynczych domów jest rekonstrukcją.',cameraOffset:[15,10,24],fallback:[0,4,44]},
  {id:'gate',node:'city_south_approach',name:'Południowe wejście',description:'Od południa przybywa się do dzielnicy przygód i siedziby Gildii. Model pokazuje wariant miasta bez ciągłego muru.',cameraOffset:[0,18,54],fallback:[0,5,91]}
];
const INTERIOR_SPOTS=[
  {id:'entrance',node:'ranoa_entrance',name:'Wejście do uczelni',description:'Przejście prowadzi ku dziedzińcowi i arkadom. Dokładny rzut wejścia jest interpretacją.',cameraOffset:[0,0.45,7],fallback:[0,1.65,25.3]},
  {id:'courtyard',node:'ranoa_courtyard',name:'Dziedziniec',description:'Otwarta przestrzeń łączy bramę, krużganek i skrzydło sali wykładowej.',cameraOffset:[0,4.5,10],fallback:[0,1.7,6.4]},
  {id:'cloister',node:'ranoa_cloister',name:'Kamienny krużganek',description:'Jasny kamień, smukłe filary i rytm arkad opierają się na oficjalnym kadrze odcinka 17.',cameraOffset:[0,0,-19],cameraPosition:[-17,1.8,-13.6],lookAt:[-16.5,2.3,14],fallback:[-16.6,1.72,5.4]},
  {id:'arches',node:'ranoa_arches',name:'Arkady dziedzińca',description:'Rząd łuków i cień na płytowej posadzce nawiązują do architektury widocznej w anime.',cameraOffset:[7,1.0,8],fallback:[-13.5,1.68,-4]},
  {id:'hall',node:'ranoa_lecture_hall',name:'Sala wykładowa',description:'Kamienne mury i drewniane ławy odtwarzają cechy oficjalnego kadru odcinka 5. Układ sali jest rekonstrukcją.',cameraOffset:[-4,0.65,8.8],cameraPosition:[26.1,2.45,8.8],lookAt:[43,2.3,0],fallback:[30.2,1.75,0]},
  {id:'lectern',node:'ranoa_lectern',name:'Mównica i ławy',description:'Zbliżenie na środek zajęć. Detale wyposażenia nie są planem 1:1 z anime.',cameraOffset:[-8,0.8,5],fallback:[41.5,1.75,0]},
  {id:'library',node:'ranoa_library',name:'Biblioteka — parter',description:'Osobny dwupiętrowy gmach. Czytelnia ze stołami otwiera się na wysokie regały i galerię; układ półek jest rekonstrukcją opisu autora.',cameraOffset:[0,0,0],cameraPosition:[-58,7.4,20],lookAt:[-56,3.2,-5],fallback:[-56,1.75,8]},
  {id:'gallery',node:'ranoa_library_gallery',name:'Galeria biblioteki',description:'Górna kondygnacja otacza otwarty środek biblioteki. Z galerii widać stoły czytelni i dwa poziomy księgozbioru.',cameraOffset:[0,0,0],cameraPosition:[-56,6.4,-15],lookAt:[-56,2.7,6],fallback:[-56,5.8,-15.8]},
  {id:'refectory',node:'ranoa_refectory',name:'Stołówka uczelni',description:'Trzykondygnacyjny, oddzielny budynek stołówki pokazany w przekroju. Długie stoły, ławy i strefy wydawania posiłków ożywiają wnętrze.',cameraOffset:[0,0,0],cameraPosition:[21,9,-25],lookAt:[28,4,-49],fallback:[28,1.75,-41]},
  {id:'research-entry',node:'ranoa_research_entry',name:'Wejście do gmachu badawczego',description:'Wysoki gmach badań stoi przy końcu uczelnianej drogi. Na trzecim piętrze znajdują się trzy połączone pokoje Nanahoshi.',cameraOffset:[0,0,0],cameraPosition:[76,12,59],lookAt:[83,10,31],fallback:[82,1.75,46]},
  {id:'research-stair',node:'ranoa_research_stair',name:'Schody na trzecie piętro',description:'Droga do pracowni prowadzi w górę gmachu badawczego. Forma bocznej wieży schodowej jest autorską rekonstrukcją.',cameraOffset:[0,0,0],cameraPosition:[117,17,47],lookAt:[100,8,32],fallback:[101,6.3,32]},
  {id:'nanahoshi',node:'ranoa_nanahoshi',name:'Pracownia Nanahoshi — trzecie piętro',description:'Na końcu trzeciego piętra gmachu badawczego Nanahoshi zajmuje trzy połączone pokoje. Zapiski, kryształy i kręgi przywołania wypełniają pracownię.',cameraOffset:[0,0,0],cameraPosition:[79,20,52],lookAt:[82,11,30],fallback:[82,10.95,34]},
  {id:'nanahoshi-store',node:'ranoa_nanahoshi_store',name:'Magazyn Nanahoshi',description:'Zapasy kryształów, kamieni magicznych, papierów i sprzętu przed wejściem do eksperymentowni. Układ rekwizytów jest rekonstrukcją.',cameraOffset:[0,0,0],cameraPosition:[65,16,48],lookAt:[71,11,33],fallback:[70.5,10.95,33]},
  {id:'nanahoshi-experiment',node:'ranoa_nanahoshi_experiment',name:'Eksperymentownia przywołania',description:'Środkowe pomieszczenie z rozrysowanymi kręgami przywołania i stołem notatek. Kręgi są ilustracją badań, nie kopią klatki anime.',cameraOffset:[0,0,0],cameraPosition:[82,17,49],lookAt:[82,11,32],fallback:[82,10.95,32]},
  {id:'nanahoshi-room',node:'ranoa_nanahoshi_room',name:'Prywatny pokój Nanahoshi',description:'Ostatnia z trzech połączonych części. Służy również do odpoczynku; szczegóły umeblowania pozostają interpretacją.',cameraOffset:[0,0,0],cameraPosition:[103,17,45],lookAt:[93,11,28],fallback:[93,10.95,28]},
  {id:'zanoba',node:'ranoa_zanoba',name:'Pracownia Zanoby i Julie',description:'Części automatycznej lalki, figurki, szkice i osobny stół Julie. Pracownia ma wyposażenie wynikające z badań opisanych w powieści.',cameraOffset:[0,0,0],cameraPosition:[79,7,19],lookAt:[82,2,0],fallback:[82,1.75,5]},
  {id:'cliff',node:'ranoa_cliff',name:'Pracownia Cliffa',description:'Księgi i rozebrane magiczne narzędzia towarzyszą badaniom nad klątwami. Dokładne położenie wszystkich pracowni na kampusie jest umowne.',cameraOffset:[0,0,0],cameraPosition:[79,8,-10],lookAt:[82,2,-30],fallback:[82,1.75,-27]}
];
const DEMON_SPOTS=[
  {id:'wasteland',node:'demon_wasteland',name:'Północne pustkowia',description:'Spękana ochrowa skała, żleby i niemal brak roślin — krajobraz po teleportacji. Dokładne miejsce lądowania na mapie jest umowne.',cameraOffset:[0,0,0],cameraPosition:[-133,25,126],lookAt:[-96,3,91],fallback:[-105,2.4,103]},
  {id:'camp',node:'demon_camp',name:'Spotkanie z Ruijerdem',description:'Obozowisko na pustkowiu rozpoczyna drogę Rudeusa i Eris pod opieką Ruijerda.',cameraOffset:[0,0,0],cameraPosition:[-111,11,109],lookAt:[-94,2,85],fallback:[-99,2.2,89]},
  {id:'migurd',node:'demon_migurd',name:'Wioska Migurdów',description:'Kilkanaście półziemianek z dachami z pancerzy Wielkich Żółwi, pole i wspólne palenisko. To rodzinny lud Roxy; układ domów jest rekonstrukcją.',cameraOffset:[0,0,0],cameraPosition:[-115,20,85],lookAt:[-78,3.6,53],fallback:[-80,3.3,54]},
  {id:'migurd-gate',node:'demon_migurd_gate',name:'Brama i domy Migurdów',description:'Wejście przez skromny płot prowadzi między niskimi pancerzowymi dachami. Dom wodza ma największą skorupę.',cameraOffset:[0,0,0],cameraPosition:[-117,6,56],lookAt:[-81,4,55],fallback:[-112,2.2,55]},
  {id:'rikaris',node:'demon_rikaris',name:'Rikaris — skalne miasto Dead End',description:'Jeden z głównych ośrodków Kontynentu Demonów. Miasto leży w ogromnym kraterze; Rudeus, Eris i Ruijerd zaczęli tu przygody pod nazwą Dead End.',cameraOffset:[0,0,0],cameraPosition:[97,29,84],lookAt:[53,7,51],fallback:[53,3.6,51]},
  {id:'rikaris-gate',node:'demon_rikaris_gate',name:'Brama w szczelinie krateru',description:'Jedno z trzech naturalnych przejść w skalnej obręczy. Przy kontroli wjazdu Ruijerd musiał ukryć swoją tożsamość.',cameraOffset:[0,0,0],cameraPosition:[38,13,55],lookAt:[22,5,51],fallback:[22,3.8,51]},
  {id:'rikaris-guild',node:'demon_rikaris_guild',name:'Gildia Poszukiwaczy Przygód',description:'Tutaj drużyna Dead End rejestruje się i odbiera pierwsze zlecenia. Wewnątrz są lada i tablica zleceń; skup znajduje się z tyłu budynku. Otwarty plac przed wejściem jest rekonstrukcją.',cameraOffset:[0,0,0],cameraPosition:[41,11,68],lookAt:[36,3.8,50],fallback:[36,4.2,47]},
  {id:'rikaris-quarter',node:'demon_rikaris_quarter',name:'Ulice i targ Rikaris',description:'Skaliste zaułki, gliniane domy, stragany i wieczorne lampy w cieniu naturalnego muru. Dokładny przebieg ulic jest rekonstrukcją.',cameraOffset:[0,0,0],cameraPosition:[93,24,75],lookAt:[70,4,45],fallback:[65,3.8,44]},
  {id:'castle',node:'demon_kshirishka_castle',name:'Stary zamek Kishirisu',description:'Czarnozłota ruina w centrum Rikaris. W późniejszej podróży Rudeus spotyka tu Atofe; architektura modelu jest interpretacją.',cameraOffset:[0,0,0],cameraPosition:[73,16,72],lookAt:[53,10,51],fallback:[53,12,51]},
  {id:'forest',node:'demon_petrified_forest',name:'Las Petryfikacji',description:'Ostre szare drzewa przypominają kości i wyglądają jak skamieniałe. To niebezpieczny skrót na południe od Rikaris.',cameraOffset:[0,0,0],cameraPosition:[17,15,-8],lookAt:[44,4,-22],fallback:[44,2.8,-22]},
  {id:'road',node:'demon_south_road',name:'Południowy szlak',description:'Wiele nienazwanych przystanków dzieli Rikaris od portu. Droga, stacje i odległości są skompresowane w scenie 3D.',cameraOffset:[0,0,0],cameraPosition:[-4,27,-37],lookAt:[37,3,-50],fallback:[37,3,-51]},
  {id:'port',node:'demon_wind_port',name:'Wen Port',description:'Strome ulice schodzą do portu. Przeważają ziemne i kamienne domy; stocznia stoi bliżej morza.',cameraOffset:[0,0,0],cameraPosition:[7,23,-44],lookAt:[38,4,-84],fallback:[38,5,-81]},
  {id:'harbor',node:'demon_harbor',name:'Nabrzeże i statki',description:'Drewniane nabrzeże, statki i turkusowa woda kończą odcinek podróży przez Kontynent Demonów. Stąd prowadzi przeprawa do Zant Port.',cameraOffset:[0,0,0],cameraPosition:[4,17,-143],lookAt:[38,2,-106],fallback:[38,1,-111]},
  {id:'kurasuma',node:'demon_kurasuma',name:'Kurasuma — boczny szlak',description:'Północno-zachodni ośrodek handlu z ludem morza. W modelu jest odległą sylwetą; nie stanowi etapu podróży Dead End.',cameraOffset:[0,0,0],cameraPosition:[-136,15,118],lookAt:[-125,5,104],fallback:[-125,6,104]}
];
const RIKARIS_SPOTS=DEMON_SPOTS.filter(spot=>['rikaris','rikaris-gate','rikaris-guild','rikaris-quarter','castle'].includes(spot.id));
let terrainMesh;
const world=(x,y,h=2.2)=>new THREE.Vector3((x-720.5)/10,(terrainMesh?.userData.heightAtMapPixel(x,y)||0)+h,(y-512)/10);
const small=()=>innerWidth<790;
const available=()=>events.filter(e=>state.season==='all'||e.s===Number(state.season));
const visible=p=>state.season==='all'||p.seasons.includes(Number(state.season));
const pointColor=p=>p.seasons.includes(3)?PALETTE[3]:p.seasons.includes(2)?PALETTE[2]:PALETTE[1];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));

// Geographic atlas follows the separate 1441 × 1024 light-novel plate.
function applyMap(){mapStage.style.transform=`translate(${mapView.x}px,${mapView.y}px) scale(${mapView.scale})`;mapStage.classList.toggle('zoom-detail',mapView.scale/mapView.fit>1.8)}
function clampMap(){
  const w=mapHost.clientWidth,h=mapHost.clientHeight,sw=1441*mapView.scale,sh=1024*mapView.scale;
  const overX=state.region?w*.58:70,overY=state.region?h*.45:70;
  mapView.x=sw<=w?(w-sw)/2:Math.min(overX,Math.max(w-sw-overX,mapView.x));
  mapView.y=sh<=h?(h-sh)/2:Math.min(overY,Math.max(h-sh-overY,mapView.y));
}
function fitMap(){
  if(!mapHost.clientWidth||!mapHost.clientHeight)return;
  mapView.width=mapHost.clientWidth;mapView.height=mapHost.clientHeight;
  mapView.fit=Math.min(mapHost.clientWidth/1441,mapHost.clientHeight/1024)*.985;
  mapView.scale=mapView.fit;mapView.x=(mapHost.clientWidth-1441*mapView.scale)/2;mapView.y=(mapHost.clientHeight-1024*mapView.scale)/2;applyMap();
}
function resizeMap(){
  const w=mapHost.clientWidth,h=mapHost.clientHeight;if(!w||!h)return;
  if(!mapView.width){fitMap();return}if(w===mapView.width&&h===mapView.height)return;
  const ratio=mapView.scale/mapView.fit,cx=(mapView.width/2-mapView.x)/mapView.scale,cy=(mapView.height/2-mapView.y)/mapView.scale;
  mapView.width=w;mapView.height=h;mapView.fit=Math.min(w/1441,h/1024)*.985;
  if(state.region){qs('#regionGuide').classList.toggle('compact',innerWidth<900);qs('#regionGuideToggle').setAttribute('aria-expanded',String(innerWidth>=900));frameRegion(regions.find(r=>r.id===state.region));return}
  mapView.scale=Math.max(mapView.fit*.9,Math.min(mapView.fit*5.5,mapView.fit*ratio));
  mapView.x=w/2-cx*mapView.scale;mapView.y=h/2-cy*mapView.scale;clampMap();applyMap();
}
function zoomMap(factor,clientX,clientY){
  const rect=mapHost.getBoundingClientRect(),sx=(clientX??(rect.left+rect.width/2))-rect.left,sy=(clientY??(rect.top+rect.height/2))-rect.top;
  const wx=(sx-mapView.x)/mapView.scale,wy=(sy-mapView.y)/mapView.scale;
  mapView.scale=Math.max(mapView.fit*.9,Math.min(mapView.fit*5.5,mapView.scale*factor));
  mapView.x=sx-wx*mapView.scale;mapView.y=sy-wy*mapView.scale;clampMap();applyMap();
}
function focusMap(x,y){
  mapView.scale=Math.max(mapView.scale,mapView.fit*1.9);
  const compact=innerWidth<900;
  mapView.x=mapHost.clientWidth*(compact?.5:.42)-x*mapView.scale;
  mapView.y=mapHost.clientHeight*(compact?.23:.5)-y*mapView.scale;
  clampMap();applyMap();
}
function makeMapPins(){
  const skip=new Set(['red-dragon','northlands','red-wyrm-jaw','great-forest','holy-sword-road','begaritt-desert','heaven','asura','dragon-king','chaos-breaker']);
  const major=new Set(['sharia','rikaris','millishion','rapan','fittoa']);
  mapPins.innerHTML='';
  for(const p of places){
    if(p.id==='chaos-breaker')continue;
    const b=document.createElement('button');b.type='button';b.className='atlas-pin'+(major.has(p.id)?' major':'')+(approxIds.has(p.id)?' approx':'')+(skip.has(p.id)?' overview-hidden':'')+(p.detailOnly?' detail-only':'');
    b.style.left=p.mapX+'px';b.style.top=p.mapY+'px';b.title=p.name;b.setAttribute('aria-label',p.name);
    b.dataset.place=p.id;
    b.innerHTML=(landmarkIcons[p.id]?`<img class="atlas-pin-icon" src="ikony/${landmarkIcons[p.id]}.svg" alt="">`:'<span class="atlas-pin-core"></span>')+`<span class="atlas-pin-name">${esc(p.name)}</span>`;
    b.addEventListener('pointerdown',e=>e.stopPropagation());
    b.addEventListener('click',e=>{e.stopPropagation();selectPlace(p.id,true)});
    mapPins.appendChild(b);
  }
  updateMapPins();
}
function updateMapPins(){all('.atlas-pin').forEach(b=>{const p=byId[b.dataset.place],r=regions.find(x=>x.id===state.region);b.classList.toggle('hidden-season',!p||(!r&&!visible(p))||(state.season==='all'&&approxIds.has(p.id)&&!r));b.classList.toggle('outside-region',!!r&&!r.landmarks.includes(p?.id));b.classList.toggle('selected',!!p&&state.selected===p.id)})}
const routeVia={
 'buena>roa':[[254,301],[270,308],[288,318]],
 'demon-north>migurd-village':[[1210,185],[1216,193],[1231,205]],
 'migurd-village>rikaris':[[1231,205],[1262,200],[1300,208]],
 'rikaris>petrified-forest':[[1300,208],[1306,245],[1307,275]],
 'petrified-forest>demon-south-route':[[1307,275],[1319,331],[1300,388]],
 'demon-south-route>wind-port':[[1300,388],[1270,476],[1267,525]],
 'wind-port>zant-port':[[1267,525],[1251,557],[1237,585]],
 'zant-port>great-forest':[[1237,585],[1226,642],[1220,710]],
 'great-forest>millishion':[[1220,710],[1210,763],[1188,833]],
 'millishion>west-port':[[1188,833],[1106,855],[1010,865],[931,861],[874,855]],
 'west-port>east-port':[[874,855],[842,850],[810,853]],
 'east-port>shirone':[[810,853],[713,837],[633,742],[592,640],[563,536]],
 'shirone>fittoa':[[563,536],[506,546],[436,548],[349,567],[271,528],[225,439],[270,308]],
 'fittoa>northlands':[[270,308],[314,234],[386,191],[492,194]],
 'northlands>sharia':[[492,194],[404,157],[326,137],[262,169]],
 'begaritt-desert>rapan':[[226,759],[301,791],[382,810],[454,827]],
 'rapan>labyrinth':[[454,827],[442,811]],
 'rikaris>sharia':[[1300,208],[1117,230],[1014,153],[883,164],[717,235],[510,193],[262,169]]
};
function drawMapRoutes(){
  const s=Number(state.season);routeSvg.innerHTML='';atlas.classList.toggle('route-active',s>0);
  if(!s)return;
  let markup='';
  for(const [aId,bId] of routes[s]){
    const a=byId[aId],b=byId[bId];if(!a||!b||aId==='chaos-breaker'||bId==='chaos-breaker')continue;
    const points=routeVia[aId+'>'+bId]||[[a.mapX,a.mapY],[b.mapX,b.mapY]];
    const d=points.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(' ');
    const teleport=(aId==='roa'&&bId==='demon-north')||(aId==='sharia'&&bId==='begaritt-desert')||(aId==='labyrinth'&&bId==='sharia')||(aId==='rikaris'&&bId==='sharia')||aId==='chaos-breaker'||bId==='chaos-breaker';
    markup+=`<path class="map-route s${s}${teleport?' teleport':''}" d="${d}"/>`;
  }
  routeSvg.innerHTML=markup;
}
function wireMap(){
  new ResizeObserver(resizeMap).observe(mapHost);fitMap();
  mapHost.addEventListener('wheel',e=>{e.preventDefault();zoomMap(e.deltaY<0?1.18:1/1.18,e.clientX,e.clientY)},{passive:false});
  mapHost.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.atlas-pin'))return;mapView.drag={x:e.clientX,y:e.clientY,ox:mapView.x,oy:mapView.y};mapHost.setPointerCapture(e.pointerId)});
  mapHost.addEventListener('pointermove',e=>{if(!mapView.drag)return;mapView.x=mapView.drag.ox+e.clientX-mapView.drag.x;mapView.y=mapView.drag.oy+e.clientY-mapView.drag.y;clampMap();applyMap()});
  mapHost.addEventListener('pointerup',()=>{mapView.drag=null});mapHost.addEventListener('pointercancel',()=>{mapView.drag=null});
}

// Navigable regional charts: each opens with its own camera frame, index,
// source-based terrain features and clickable places.
function renderRegionIndex(){
  qs('#regionList').innerHTML=regions.map((r,i)=>`<button type="button" data-region="${r.id}"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(r.name)}</strong><small>${esc(r.subtitle)}</small><b aria-hidden="true">↗</b></button>`).join('');
  qs('#regionIndex').classList.add('collapsed');qs('#regionIndexToggle').setAttribute('aria-expanded','false');
}
function renderRegionGuide(r){
  qs('#regionGuideContent').innerHTML=`<div class="region-eyebrow">ŚWIAT LUDZI / ${esc(continents.find(c=>c.id===r.continent)?.name||'ATLAS')}</div><h2>${esc(r.name)}</h2><p class="region-subtitle">${esc(r.subtitle)}</p><p class="region-blurb">${esc(r.blurb)}</p><h3>CECHY KRAINY</h3><ul class="region-features">${r.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><h3>MIEJSCA NA MAPIE</h3>`;
  qs('#regionLandmarks').innerHTML=r.landmarks.map(id=>{const p=byId[id];return p?`<button type="button" data-place="${id}"><span>${p.mapOnly?'◇':'✦'}</span><strong>${esc(p.name)}</strong><small>→</small></button>`:''}).join('')+`<a class="region-source" href="${r.source}" target="_blank" rel="noopener">Opis geografii w tekście autora ↗</a>`;
  qs('#demonRegionEnter').classList.toggle('hidden',r.continent!=='demon');
}
function frameRegion(r){
  const [x1,y1,x2,y2]=r.bbox,w=mapHost.clientWidth,h=mapHost.clientHeight,sidebar=innerWidth>=900?80:0;
  const usableW=Math.max(230,w-sidebar-46),usableH=innerWidth>=900?h-70:h*.80;
  mapView.scale=Math.max(mapView.fit*1.35,Math.min(mapView.fit*(r.zoomMax||2.25),Math.min(usableW/(x2-x1),usableH/(y2-y1))*.93));
  mapView.x=(innerWidth>=900?sidebar+usableW*.5:w*.5)-(x1+x2)*.5*mapView.scale;
  mapView.y=(innerWidth>=900?h*.51:h*.42)-(y1+y2)*.5*mapView.scale;
  clampMap();applyMap();
}
function enterRegion(id){
  const r=regions.find(x=>x.id===id);if(!r)return;
  if(state.mode==='3d')setMode('map');
  state.region=id;atlas.classList.add('region-mode');mapStage.classList.add('in-region');
  qs('#regionIndex').classList.add('hidden');qs('#regionGuide').classList.remove('hidden');qs('#regionGuide').classList.toggle('compact',innerWidth<900);qs('#regionGuideToggle').setAttribute('aria-expanded',String(innerWidth>=900));
  renderRegionGuide(r);closePlace();frameRegion(r);updateMapPins();
}
function exitRegion(keepViewport=false){
  if(!state.region)return;state.region=null;atlas.classList.remove('region-mode');mapStage.classList.remove('in-region');
  qs('#regionIndex').classList.remove('hidden');qs('#regionGuide').classList.add('hidden');
  if(!keepViewport)fitMap();updateMapPins();
}
function shiftRegion(delta){const i=regions.findIndex(r=>r.id===state.region);if(i>=0)enterRegion(regions[(i+delta+regions.length)%regions.length].id)}

let renderer,scene,camera,controls,detailTerrainLabels,raycaster=new THREE.Raycaster(),frameHandle;
function cameraHome(){return small()?new THREE.Vector3(0,125,90):new THREE.Vector3(0,105,100)}
function interruptWorldCamera(){state.tween=null}
function initScene(){
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(wrap.clientWidth,wrap.clientHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
  renderer.domElement.setAttribute('aria-label','Przestrzenny relief pięciu kontynentów świata Mushoku Tensei; przeciągnij, aby obrócić');
  host.appendChild(renderer.domElement);
  scene=new THREE.Scene();scene.background=new THREE.Color(0x5a5346);
  camera=new THREE.PerspectiveCamera(small()?51:39,wrap.clientWidth/wrap.clientHeight,.3,500);camera.position.copy(cameraHome());
  controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);controls.enableDamping=true;controls.dampingFactor=.055;controls.minDistance=37;controls.maxDistance=190;controls.minPolarAngle=.02;controls.maxPolarAngle=1.4;controls.screenSpacePanning=true;controls.update();
  controls.addEventListener('start',interruptWorldCamera);
  qs('#zoomIn').addEventListener('click',interruptWorldCamera,{capture:true});
  qs('#zoomOut').addEventListener('click',interruptWorldCamera,{capture:true});
  const hemi=new THREE.HemisphereLight(0xc8e5e0,0x142c2b,2.1);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffe6b9,2.8);sun.position.set(-37,75,12);scene.add(sun);
  const fill=new THREE.DirectionalLight(0xa6d0cf,.9);fill.position.set(35,32,-40);scene.add(fill);
  new ResizeObserver(()=>{if(!renderer||state.cityActive)return;const w=wrap.clientWidth,h=wrap.clientHeight;camera.aspect=w/h;camera.fov=small()?51:39;camera.updateProjectionMatrix();renderer.setSize(w,h)}).observe(wrap);
  renderer.domElement.addEventListener('pointerdown',()=>{if(state.cityActive)return;interruptWorldCamera();wrap.classList.add('dragging')});
  renderer.domElement.addEventListener('wheel',()=>{if(!state.cityActive)interruptWorldCamera()},{passive:true});
  for(const eventName of ['pointerup','pointercancel','lostpointercapture'])
    renderer.domElement.addEventListener(eventName,()=>wrap.classList.remove('dragging'));
  window.addEventListener('blur',()=>wrap.classList.remove('dragging'));
}
async function loadModel(){
  terrainMesh=await createCartographicTerrain(THREE,MAP_TEXTURE_URL);
  scene.add(terrainMesh);
  async function labelLayer(url,offset){
    const texture=await new Promise((resolve,reject)=>new THREE.TextureLoader().load(url,resolve,undefined,reject));
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
    const mesh=new THREE.Mesh(terrainMesh.geometry.clone(),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
    mesh.position.y=offset;mesh.renderOrder=2;mesh.frustumCulled=false;scene.add(mesh);return mesh;
  }
  try{await labelLayer(MAP_LABELS_URL,.055);detailTerrainLabels=await labelLayer(MAP_DETAILS_URL,.085);detailTerrainLabels.visible=false}catch(error){console.warn('Nie udało się załadować nazw na mapie 3D',error)}
  const backing=new THREE.Mesh(new THREE.BoxGeometry(146.5,.95,104.8),new THREE.MeshStandardMaterial({color:0x4c3c2b,roughness:.9,metalness:0}));
  backing.position.y=-.58;scene.add(backing);
  qs('#poster').style.opacity='0';
}
function routePoints(a,b){const A=world(a.x,a.y,1.65),B=world(b.x,b.y,1.65);const dist=A.distanceTo(B),arch=Math.min(3.2,Math.max(.7,dist*.035));const arr=[];for(let i=0;i<=48;i++){const t=i/48,v=A.clone().lerp(B,t);v.y+=Math.sin(Math.PI*t)*arch;arr.push(v)}return arr}
function makeRoutes(){for(const obj of state.routes){scene.remove(obj);obj.geometry?.dispose();obj.material?.dispose()}state.routes=[];
  if(state.season==='all')return;
  for(let s=1;s<=3;s++)for(const [aid,bid] of routes[s]){if(s!==Number(state.season)||aid==='chaos-breaker'||bid==='chaos-breaker')continue;const a=byId[aid],b=byId[bid];if(!a||!b)continue;const curve=new THREE.CatmullRomCurve3(routePoints(a,b));const geom=new THREE.TubeGeometry(curve,48,.09,5,false);const m=new THREE.MeshBasicMaterial({color:PALETTE[s],transparent:true,opacity:.88,depthWrite:false});const mesh=new THREE.Mesh(geom,m);mesh.userData.season=s;scene.add(mesh);state.routes.push(mesh);
    const ends=[a,b];for(const p of ends){const v=world(p.x,p.y,1.7);const ring=new THREE.Mesh(new THREE.TorusGeometry(.24,.035,4,18),new THREE.MeshBasicMaterial({color:PALETTE[s],transparent:true,opacity:.8}));ring.rotation.x=Math.PI/2;ring.position.copy(v);ring.userData.season=s;scene.add(ring);state.routes.push(ring)}
  }
}
function makePins(){pinLayer.innerHTML='';state.pins=[];const major=new Set(['fittoa','sharia','rikaris','millishion','rapan','wind-port','zant-port']);
  for(const p of places){if(p.mapOnly||p.id==='chaos-breaker')continue;const button=document.createElement('button');button.type='button';button.className='pin'+(major.has(p.id)?' major':'');button.style.setProperty('--pin','#'+pointColor(p).toString(16).padStart(6,'0'));button.setAttribute('aria-label',p.name);button.innerHTML=`<span class="pin-dot"></span><span class="pin-label">${esc(p.name)}</span>`;button.addEventListener('click',e=>{e.stopPropagation();selectPlace(p.id,true)});pinLayer.appendChild(button);state.pins.push({p,el:button,v:world(p.x,p.y,p.continent==='heaven'?2.7:2.1)})}
  continentLayer.innerHTML='';state.labelNodes=[];
}
function renderOverlays(){if(!camera)return;const width=wrap.clientWidth,height=wrap.clientHeight;for(const {p,el,v} of state.pins){const q=v.clone().project(camera),show=q.z>-1&&q.z<1&&q.x>-1.25&&q.x<1.25&&q.y>-1.2&&q.y<1.2;el.classList.toggle('offscreen',!show);if(show){el.style.left=((q.x+1)*width/2)+'px';el.style.top=((-q.y+1)*height/2)+'px'}el.classList.toggle('hidden-season',!visible(p));el.classList.toggle('selected',state.selected===p.id);el.style.zIndex=state.selected===p.id?'7':'1'}for(const {el,v} of state.labelNodes){const q=v.clone().project(camera);el.style.left=((q.x+1)*width/2)+'px';el.style.top=((-q.y+1)*height/2)+'px';el.style.opacity=q.z<1&&q.z>-1?'.9':'0'}}
function animate(t){frameHandle=requestAnimationFrame(animate);if(state.cityActive)return;const motion=state.tween?'flight':'idle';if(host.dataset.cameraMotion!==motion)host.dataset.cameraMotion=motion;if(state.tween){const k=Math.max(0,Math.min(1,(t-state.tween.start)/state.tween.duration)),ease=k*k*(3-2*k);camera.position.copy(state.tween.fromCam).lerp(state.tween.toCam,ease);controls.target.copy(state.tween.fromTarget).lerp(state.tween.toTarget,ease);if(k>=1)state.tween=null}controls.update();if(detailTerrainLabels)detailTerrainLabels.visible=camera.position.distanceTo(controls.target)<100;renderOverlays();renderer.render(scene,camera)}
function flyTo(v,zoom=false){const offset=camera.position.clone().sub(controls.target),dist=offset.length();offset.setLength(zoom?Math.min(dist,76):dist);const target=v.clone();target.y-=1;const destination=target.clone().add(offset);tweenCamera(destination,target)}
function escText(s){return esc(s)}
function selectPlace(id,zoom=false){const p=byId[id];if(!p)return;if(p.mapOnly&&state.mode==='3d')setMode('map');if(zoom&&mapActive()){const current=regions.find(x=>x.id===state.region),target=regions.find(x=>x.landmarks.includes(id));if(target&&(!current||!current.landmarks.includes(id)))enterRegion(target.id)}state.selected=id;const continent=continents.find(c=>c.id===p.continent);const precision=id==='chaos-breaker'?'Latająca forteca nie ma stałej pozycji geograficznej.':approxIds.has(id)?'Pozycja umowna: miejsce nie jest wskazane na ilustracji mapy z tomu 4.':p.certainty==='A'||fixedA.has(id)?'Punkt odpowiada podpisanemu miejscu na ilustracji mapy z tomu 4.':'Zaznaczono środek obszaru lub przebieg szlaku w przybliżeniu.';qs('#placeContent').innerHTML=`<span class="overline">ATLAS / ${escText(continent?.name.toUpperCase()||'ŚWIAT LUDZI')}</span><h2>${escText(p.name)}</h2><div class="place-subtitle">${escText(p.ep)}</div><p class="place-lead">${escText(p.lead)}</p><div class="divider"></div><h3>${p.mapOnly?'GEOGRAFIA':'ZNACZENIE W HISTORII'}</h3><p class="place-story">${escText(p.story)}</p><h3>POWIĄZANIA</h3><div class="tags">${p.links.map(x=>`<span>${escText(x)}</span>`).join('')}</div><div class="note">${precision}</div><div class="source">Źródła: <a href="${SOURCE.anime}" target="_blank" rel="noopener">anime ↗</a> &nbsp; <a href="https://www.baka-tsuki.org/project/index.php?title=File%3AMushoku_Tensei_Vol.4_map_translated.jpg" target="_blank" rel="noopener">mapa tomu 4 ↗</a></div>`;
  if(p.source){
    const sourceLink=document.createElement('a');
    sourceLink.href=p.source;sourceLink.target='_blank';sourceLink.rel='noopener';sourceLink.textContent='tekst autora ↗';
    qs('#placeContent .source').append('  ·  ',sourceLink);
  }
  qs('#placePanel').classList.remove('hidden');qs('#placePanel').setAttribute('aria-hidden','false');
  qs('#cityEnterPlace')?.classList.toggle('hidden',id!=='sharia');
  qs('#millisEnterPlace')?.classList.toggle('hidden',id!=='millishion');
  qs('#demonEnterPlace')?.classList.toggle('hidden',p.continent!=='demon');
  atlas.classList.add('place-open');renderOverlays();updateMapPins();
  if(zoom){if(mapActive()){if(id!=='chaos-breaker')focusMap(p.mapX,p.mapY)}else if(!p.mapOnly&&id!=='chaos-breaker')flyTo(world(p.x,p.y,2),true)}
}
function closePlace(){interruptWorldCamera();state.selected=null;qs('#placePanel').classList.add('hidden');qs('#placePanel').setAttribute('aria-hidden','true');qs('#cityEnterPlace')?.classList.add('hidden');qs('#millisEnterPlace')?.classList.add('hidden');qs('#demonEnterPlace')?.classList.add('hidden');atlas.classList.remove('place-open');updateMapPins()}
function setSeason(s){interruptWorldCamera();state.season=s;all('.season-nav button').forEach(b=>b.classList.toggle('active',b.dataset.season===s));state.event=0;exitRegion();closePlace();if(scene)makeRoutes();drawMapRoutes();updateJourney();state.pins.forEach(o=>o.el.classList.toggle('hidden-season',!visible(o.p)));updateMapPins()}
function updateJourney(){const list=available(),e=list[state.event]||list[0];if(!e)return;qs('#journeyMeta').textContent=`TRASA / SEZON ${String(e.s).padStart(2,'0')} · ODC. ${e.ep}`;qs('#journeyTitle').textContent=e.title;qs('#journeyText').textContent=e.text;qs('#journeyIndex').textContent=String(state.event+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0')}
function stepEvent(delta){const list=available();state.event=(state.event+delta+list.length)%list.length;updateJourney();const p=byId[list[state.event].place];if(p){closePlace();if(mapActive()){if(p.id!=='chaos-breaker')focusMap(p.mapX,p.mapY)}else if(p.id!=='chaos-breaker')flyTo(world(p.x,p.y,2),false);state.selected=p.id;updateMapPins()}}
function updateSearch(){const q=qs('#searchInput').value.trim().toLocaleLowerCase('pl');const hits=places.filter(p=>!q||(p.name+' '+p.sub+' '+continents.find(c=>c.id===p.continent)?.name).toLocaleLowerCase('pl').includes(q)).slice(0,60);qs('#searchResults').innerHTML=hits.length?hits.map(p=>`<button class="search-result" data-place="${p.id}" type="button"><strong>${esc(p.name)}</strong><small>${esc(p.sub)} · ${p.mapOnly?'GEOGRAFIA':p.seasons.map(s=>'S'+s).join(' / ')}</small></button>`).join(''):'<p class="search-empty">Nie znaleziono miejsca.</p>'}
function toggleSearch(force){const open=force??qs('#searchPanel').classList.contains('hidden');qs('#searchPanel').classList.toggle('hidden',!open);qs('#searchPanel').setAttribute('aria-hidden',String(!open));if(open){updateSearch();qs('#searchInput').focus()}}
function info(open){qs('#infoPanel').classList.toggle('hidden',!open);qs('#infoPanel').setAttribute('aria-hidden',String(!open))}
function tweenCamera(cam,target){const distance=Math.max(camera.position.distanceTo(cam),controls.target.distanceTo(target));state.tween={start:performance.now(),duration:Math.max(700,Math.min(1600,650+distance*9)),fromCam:camera.position.clone(),toCam:cam.clone(),fromTarget:controls.target.clone(),toTarget:target.clone()}}
function setMode(mode){interruptWorldCamera();if(mode==='3d')exitRegion(true);state.mode=mode;atlas.classList.toggle('map-mode',mapActive());qs('#view3d').classList.toggle('active',mode==='3d');qs('#view2d').classList.toggle('active',mode==='map');qs('.control-hint').innerHTML=mapActive()?'PRZECIĄGNIJ · PRZESUŃ &nbsp; / &nbsp; KÓŁKO · ZOOM':'PRZECIĄGNIJ · OBRÓĆ &nbsp; / &nbsp; KÓŁKO · ZOOM';if(mode==='3d'&&controls){const target=controls.target.clone();tweenCamera(target.clone().add(cameraHome()),target)}else if(mapActive()&&!mapView.fit)fitMap()}
const CITY_SCENES={
  sharia:{
    title:'Sharia',kicker:'MUSHOKU TENSEI / KRÓLESTWO RANOA',subtitle:'Gildia Magii · wschodni kampus · dom Greyratów',
    district:'Dzielnice Sharii',intro:'Zwiedzaj pięć dzielnic opisanych przez autora, rozległy kampus i oddalony dom Greyratów. Każda zakładka przenosi kamerę do osobnego miejsca.',
    referenceTitle:'ANIME I TEKST AUTORA',referenceIntro:'Plan dzielnic, odległość domu i funkcje budynków wynikają z tekstu autora; sylwetki uczelni i rezydencji z oficjalnych materiałów anime. Geometria ulic jest rekonstrukcją.',
    references:SHARIA_REFERENCES,modelUrl:SHARIA_MODEL_URL,overviewScale:.36
  },
  millis:{
    title:'Millishion',kicker:'MUSHOKU TENSEI / ŚWIĘTY KRAJ MILLIS',subtitle:'Jezioro Gran · Biały Pałac · siedem wież',
    district:'Dzielnice Millishion',intro:'Odkryj jezioro, pałac, katedrę, Gildię i cztery dzielnice opisane przez autora.',
    referenceTitle:'ANIME I POWIEŚĆ',referenceIntro:'Układ jeziora, rzeki, dzielnic i siedmiu wież wynika z tekstu autora. Sylwetkę miasta porównaj z oficjalnym openingiem. Pojedyncze ulice są rekonstrukcją.',
    references:MILLIS_REFERENCES,modelUrl:MILLIS_MODEL_URL,spots:MILLIS_SPOTS,route:null,overviewScale:.35,background:0xa8c3cf,skyHorizon:0xf2e5c8
  },
  demon:{
    title:'Kontynent Demonów',kicker:'MUSHOKU TENSEI / DROGA DEAD END',subtitle:'Pustkowia · Migurdowie · Rikaris · Wen Port',
    district:'Rejony Kontynentu Demonów',intro:'Wybierz etap wędrówki. Otwórz wioskę, krater, las i port osobno lub przeleć całą trasę.',
    referenceTitle:'KADRY I TEKST AUTORA',referenceIntro:'Krajobraz, pancerzowe domy, krater, kościsty las i port oparto na oficjalnych kadrach oraz opisach autora. Odległości i układ modelu są interpretacją.',
    references:DEMON_REFERENCES,modelUrl:DEMON_MODEL_URL,spots:DEMON_SPOTS,
    route:[[-105,2.4,103],[-99,2.2,89],[-80,3.3,54],[-18,3,56],[53,3.6,51],[44,2.8,-22],[34,3,-48],[38,5,-81],[38,1,-111]],
    routeSpot:{id:'route',name:'Trasa Dead End',description:'Przelot od pustkowia przez wioskę Migurdów, krater Rikaris i Las Petryfikacji do Wen Port. Scena ścieśnia rzeczywiste odległości.'},
    routeLabel:'PRZELEĆ: PUSTKOWIA → WEN PORT',routeEndSpot:'harbor',
    routeStatus:'Przelot przez Kontynent Demonów: pustkowia → Migurdowie → Rikaris → Las Petryfikacji → Wen Port.',
    background:0xbca987,skyZenith:0x698ea6,skyHorizon:0xe7c99a,anchorLift:2.0,
    heavyScene:true,maxFlightArc:28,routeCameraHeight:48,entryCamera:[158,150,205],entryTarget:[0,4,0]
  },
  rikaris:{
    title:'Rikaris',kicker:'MUSHOKU TENSEI / PIERWSZE ZLECENIA DEAD END',subtitle:'Trzy szczeliny · Gildia · ruina Kishirisu',
    district:'Skalne miasto w kraterze',intro:'Wejdź przez szczelinę w obręczy, obejrzyj Gildię, targ i ruiny zamku. To osobny widok miasta, w którym Dead End rozpoczęło działalność.',
    referenceTitle:'RIKARIS W ANIME I NOWELI',referenceIntro:'Krater, trzy wejścia, zamek i Gildia wynikają z opisów autora oraz sezonu 1. Dokładne domy i ulice są rekonstrukcją.',
    references:DEMON_REFERENCES.filter(ref=>['rikaris','rikaris-guild','castle'].includes(ref.spot)),
    modelUrl:DEMON_MODEL_URL,spots:RIKARIS_SPOTS,route:null,background:0xbca987,
    skyZenith:0x698ea6,skyHorizon:0xe7c99a,anchorLift:1.0,
    heavyScene:true,maxFlightArc:24,
    entryCamera:[91,45,89],entryTarget:[53,7,51]
  },
  interior:{
    title:'Uniwersytet Ranoa',kicker:'MUSHOKU TENSEI / WNĘTRZA UCZELNI',subtitle:'Biblioteka · stołówka · pracownie · krużganki',
    district:'Wnętrza Uniwersytetu',intro:'Wejdź do biblioteki, pracowni Nanahoshi, Zanoby i Cliffa, stołówki oraz sali wykładowej. Układ przestrzeni jest rekonstrukcją.',
    referenceTitle:'ANIME I OPISY WNĘTRZ',referenceIntro:'Krużganek i salę oparto na oficjalnych kadrach anime. Bibliotekę, stołówkę i pracownie na opisach autora. Wzajemne położenie pomieszczeń i drobne wyposażenie są interpretacją.',
    references:INTERIOR_REFERENCES,modelUrl:RANOA_INTERIOR_MODEL_URL,spots:INTERIOR_SPOTS,route:null,background:0x93aeb6,skyZenith:0x779ba8,skyHorizon:0xc6d8d5,
    anchorLift:.35,interior:true,maxFlightArc:16,
    entryCamera:[0,2.1,32],entryTarget:[0,2.0,4]
  }
};
const cityExplorers={};
const interiorDestinations={library:'library',cafeteria:'refectory','campus-square':'courtyard',university:'entrance','research-wing':'nanahoshi'};
const activeCityExplorer=()=>cityExplorers[state.cityScene];
function showCityHeader(sceneKey){
  const config=CITY_SCENES[sceneKey];
  setCityImmersive(false);
  qs('#cityKicker').textContent=config.kicker;
  qs('#cityTitle').textContent=config.title;
  qs('#citySubtitle').textContent=config.subtitle;
  qs('#cityBackLabel').textContent=sceneKey==='interior'?'WRÓĆ DO SHARII':sceneKey==='rikaris'?'WRÓĆ NA KONTYNENT':'WRÓĆ DO MAPY';
  qs('#cityDistrictKicker').textContent=sceneKey==='interior'?'ZWIEDZAJ UCZELNIĘ':sceneKey==='demon'?'ZWIEDZAJ KONTYNENT':sceneKey==='rikaris'?'ZWIEDZAJ RIKARIS':'EKSPLORUJ MIASTO';
  qs('#cityFocusTitle').textContent=config.district;
  qs('#cityFocusText').textContent=config.intro;
  qs('#cityReferenceHeading').textContent=config.referenceTitle;
  qs('#cityReferenceIntro').textContent=config.referenceIntro;
  qs('#cityOverview').textContent=sceneKey==='interior'?'WEJŚCIE':'PANORAMA';
  qs('#cityStreet').hidden=sceneKey==='interior'||sceneKey==='demon'||sceneKey==='rikaris';
  qs('#cityEnterInterior').classList.toggle('hidden',!['sharia','interior','demon','rikaris'].includes(sceneKey));
  qs('#cityEnterInterior').classList.toggle('active',sceneKey==='interior'||sceneKey==='rikaris');
  qs('#cityEnterInterior small').textContent=sceneKey==='demon'?'SKALNE MIASTO':sceneKey==='rikaris'?'DROGA DEAD END':'UNIWERSYTET RANOA';
  qs('#cityEnterInterior strong').textContent=sceneKey==='interior'?'WNĘTRZA UCZELNI':sceneKey==='demon'?'WEJDŹ DO RIKARIS ↗':sceneKey==='rikaris'?'WRÓĆ NA KONTYNENT':'WEJDŹ DO WNĘTRZA ↗';
  qs('#cityGoSharia').classList.toggle('active',sceneKey==='sharia');
  qs('#cityGoMillis').classList.toggle('active',sceneKey==='millis');
  qs('#cityGoDemon').classList.toggle('active',sceneKey==='demon'||sceneKey==='rikaris');
  qs('#cityView').setAttribute('aria-label',config.title+' — przestrzeń 3D');
  qs('#city3d').setAttribute('aria-label','Interaktywny model 3D: '+config.title);
  qs('#citySources').innerHTML=config.references.map(ref=>'<a class="city-source-card" data-city-ref="'+esc(ref.spot)+'" href="'+esc(ref.source)+'" target="_blank" rel="noopener">'+(ref.image?'<img src="'+esc(ref.image)+'" alt="'+esc(ref.title)+' — oficjalny materiał" loading="lazy">':'')+'<span><strong>'+esc(ref.title)+'</strong><small>'+esc(ref.kind)+' · źródło ↗</small></span></a>').join('');
  qs('#cityReferencePanel').open=false;
  qs('#cityReferencePanel').scrollTop=0;
}
function revealActiveCitySource(){
  const panel=qs('#cityReferencePanel');
  if(panel.open)panel.querySelector('.city-source-card.active')?.scrollIntoView({block:'nearest'});
}
async function enterCity(sceneKey='sharia',spotId=null){
  if(typeof sceneKey!=='string'||!CITY_SCENES[sceneKey])sceneKey='sharia';
  if(state.cityActive&&state.cityScene===sceneKey){
    if(spotId){
      const requestSerial=++state.cityRequestSerial;
      const explorer=activeCityExplorer();
      if(!explorer?.ready&&explorer?.loading)await explorer.loading.catch(()=>{});
      if(requestSerial===state.cityRequestSerial&&state.cityScene===sceneKey)explorer?.focusSpot(spotId);
    }
    return;
  }
  const requestSerial=++state.cityRequestSerial;
  if(state.cityActive)activeCityExplorer()?.close();
  else{
    interruptWorldCamera();
    wrap.classList.remove('dragging');
    state.cityActive=true;
    if(controls)controls.enabled=false;
    atlas.classList.add('city-mode');
    qs('#cityView').classList.remove('hidden');
    qs('#cityView').setAttribute('aria-hidden','false');
  }
  state.cityScene=sceneKey;
  const config=CITY_SCENES[sceneKey];
  showCityHeader(sceneKey);
  qs('#cityView').classList.add('loading-scene');
  qs('#cityHotspots').replaceChildren();
  qs('#cityMarkers').replaceChildren();
  qs('#cityStatus').textContent='Ładowanie modelu: '+config.title+'…';
  const explorer=cityExplorers[sceneKey] ||= new CityExplorer({
    ...config,host:qs('#city3d'),hotspots:qs('#cityHotspots'),markers:qs('#cityMarkers'),renderer,
    onSpotChange:spot=>{
      if(state.cityScene!==sceneKey)return;
      state.citySpot=spot?.id||null;
      qs('#cityEnterInterior strong').textContent=sceneKey==='interior'?'WNĘTRZA UCZELNI':sceneKey==='demon'?'WEJDŹ DO RIKARIS ↗':sceneKey==='rikaris'?'WRÓĆ NA KONTYNENT':sceneKey==='sharia'&&spot?.id==='library'?'WEJDŹ DO BIBLIOTEKI ↗':sceneKey==='sharia'&&spot?.id==='cafeteria'?'WEJDŹ DO STOŁÓWKI ↗':sceneKey==='sharia'&&spot?.id==='research-wing'?'WEJDŹ DO PRACOWNI ↗':'WEJDŹ DO WNĘTRZA ↗';
      qs('#cityStatus').textContent=spot?.id==='route'?(config.routeStatus||'Przelot przez Sharię: kampus → rynek → dzielnica Greyratów.'):spot?'Kamera: '+spot.name+' · wybierz kolejne miejsce lub porównaj ze źródłem.':config.title+' · wybierz miejsce, przeciągnij widok lub użyj W A S D.';
      qs('#cityFocusTitle').textContent=spot?.name||config.district;
      qs('#cityFocusText').textContent=spot?.description||config.intro;
      qs('#cityOverview').classList.toggle('active',!spot);qs('#cityOverview').setAttribute('aria-pressed',String(!spot));
      qs('#cityStreet').classList.toggle('active',spot?.id==='market');qs('#cityStreet').setAttribute('aria-pressed',String(spot?.id==='market'));
      all('[data-city-ref]').forEach(card=>card.classList.toggle('active',!!spot&&card.dataset.cityRef===spot.id));
      revealActiveCitySource();
    },
    onError:error=>{console.error('Model 3D '+config.title,error);if(state.cityScene===sceneKey)qs('#cityStatus').textContent='Nie udało się wczytać modelu. Wróć do atlasu i spróbuj ponownie.'}
  });
  try{
    await explorer.open();
    if(requestSerial===state.cityRequestSerial&&state.cityScene===sceneKey&&explorer.ready){
      qs('#cityView').classList.remove('loading-scene');
      if(spotId)explorer.focusSpot(spotId);
    }
  }catch(error){console.error('Widok 3D '+config.title,error);if(requestSerial===state.cityRequestSerial&&state.cityScene===sceneKey)qs('#cityStatus').textContent='Widok 3D wymaga przeglądarki z WebGL.'}
}
function closeCity(){
  if(!state.cityActive)return;
  state.cityRequestSerial++;
  state.cityActive=false;
  if(document.fullscreenElement===qs('#cityView'))document.exitFullscreen?.();
  activeCityExplorer()?.close();
  if(renderer){
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label','Przestrzenny relief pięciu kontynentów świata Mushoku Tensei; przeciągnij, aby obrócić');
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    renderer.toneMappingExposure=1.18;
    renderer.shadowMap.enabled=false;
    const w=wrap.clientWidth,h=wrap.clientHeight;
    if(camera&&w&&h){camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}
  }
  if(controls)controls.enabled=true;
  atlas.classList.remove('city-mode');
  qs('#cityView').classList.add('hidden');
  qs('#cityView').classList.remove('loading-scene');
  qs('#cityView').setAttribute('aria-hidden','true');
  state.cityScene=null;
  state.cityReturnSpot=null;
}
function returnToSharia(){
  const spot=state.cityScene==='interior'?state.cityReturnSpot:null;
  state.cityReturnSpot=null;
  enterCity('sharia',spot);
}
function wireCity(){
  qs('#cityEnter')?.addEventListener('click',()=>enterCity('sharia'));
  qs('#millisEnter')?.addEventListener('click',()=>enterCity('millis'));
  qs('#demonEnter')?.addEventListener('click',()=>enterCity('demon'));
  qs('#cityEnterPlace')?.addEventListener('click',()=>enterCity('sharia'));
  qs('#millisEnterPlace')?.addEventListener('click',()=>enterCity('millis'));
  qs('#demonEnterPlace')?.addEventListener('click',()=>enterCity('demon'));
  qs('#demonRegionEnter')?.addEventListener('click',()=>enterCity('demon'));
  qs('#cityGoSharia')?.addEventListener('click',returnToSharia);
  qs('#cityGoMillis')?.addEventListener('click',()=>enterCity('millis'));
  qs('#cityGoDemon')?.addEventListener('click',()=>enterCity('demon'));
  qs('#cityEnterInterior')?.addEventListener('click',()=>{
    if(state.cityScene==='demon'){enterCity('rikaris');return}
    if(state.cityScene==='rikaris'){enterCity('demon','rikaris');return}
    if(state.cityScene==='sharia')state.cityReturnSpot=state.citySpot;
    enterCity('interior',state.cityScene==='sharia'?interiorDestinations[state.citySpot]:null);
  });
  qs('#cityBack')?.addEventListener('click',()=>state.cityScene==='interior'?returnToSharia():state.cityScene==='rikaris'?enterCity('demon','rikaris'):closeCity());
  qs('#cityOverview')?.addEventListener('click',()=>activeCityExplorer()?.home());
  qs('#cityStreet')?.addEventListener('click',()=>activeCityExplorer()?.street());
  qs('#cityImmersive')?.addEventListener('click',()=>setCityImmersive(!qs('#cityView').classList.contains('city-immersive')));
  qs('#cityFullscreen')?.addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else qs('#cityView').requestFullscreen?.()});
  qs('#cityReferencePanel')?.addEventListener('toggle',revealActiveCitySource);
}
function setCityImmersive(enabled){
  qs('#cityView').classList.toggle('city-immersive',enabled);
  qs('#cityImmersive').setAttribute('aria-pressed',String(enabled));
  qs('#cityImmersive').textContent=enabled?'POKAŻ PANELE':'UKRYJ PANELE';
}
function wireRegions(){renderRegionIndex();qs('#regionIndexToggle').addEventListener('click',()=>{const el=qs('#regionIndex'),collapsed=el.classList.toggle('collapsed');qs('#regionIndexToggle').setAttribute('aria-expanded',String(!collapsed))});qs('#regionList').addEventListener('click',e=>{const btn=e.target.closest('[data-region]');if(btn)enterRegion(btn.dataset.region)});qs('#regionBack').addEventListener('click',()=>exitRegion());qs('#regionGuideToggle').addEventListener('click',()=>{const compact=qs('#regionGuide').classList.toggle('compact');qs('#regionGuideToggle').setAttribute('aria-expanded',String(!compact))});qs('#regionPrev').addEventListener('click',()=>shiftRegion(-1));qs('#regionNext').addEventListener('click',()=>shiftRegion(1));qs('#regionLandmarks').addEventListener('click',e=>{const btn=e.target.closest('[data-place]');if(btn)selectPlace(btn.dataset.place,true)})}
function wireUI(){all('.season-nav button').forEach(b=>b.addEventListener('click',()=>setSeason(b.dataset.season)));qs('#prevEvent').addEventListener('click',()=>stepEvent(-1));qs('#nextEvent').addEventListener('click',()=>stepEvent(1));qs('#closePanel').addEventListener('click',closePlace);qs('#searchToggle').addEventListener('click',()=>toggleSearch());qs('#closeSearch').addEventListener('click',()=>toggleSearch(false));qs('#searchInput').addEventListener('input',updateSearch);qs('#searchResults').addEventListener('click',e=>{const btn=e.target.closest('[data-place]');if(btn){selectPlace(btn.dataset.place,true);toggleSearch(false)}});qs('#infoToggle').addEventListener('click',()=>info(true));qs('#closeInfo').addEventListener('click',()=>info(false));qs('#infoPanel').addEventListener('click',e=>{if(e.target.id==='infoPanel')info(false)});qs('#view3d').addEventListener('click',()=>setMode('3d'));qs('#view2d').addEventListener('click',()=>setMode('map'));qs('#zoomIn').addEventListener('click',()=>{if(mapActive())zoomMap(1.24);else{camera.position.sub(controls.target).multiplyScalar(.82).add(controls.target);controls.update()}});qs('#zoomOut').addEventListener('click',()=>{if(mapActive())zoomMap(1/1.24);else{camera.position.sub(controls.target).multiplyScalar(1.2).add(controls.target);controls.update()}});qs('#reset').addEventListener('click',()=>{closePlace();if(mapActive())fitMap();else tweenCamera(cameraHome(),new THREE.Vector3())});document.addEventListener('keydown',e=>{if(state.cityActive){if(e.key==='Escape'){e.preventDefault();if(document.fullscreenElement)document.exitFullscreen?.();else closeCity()}return}if(e.key==='Escape'){info(false);toggleSearch(false);closePlace()}if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();toggleSearch(true)}if(e.key==='ArrowRight'&&document.activeElement.tagName!=='INPUT')stepEvent(1);if(e.key==='ArrowLeft'&&document.activeElement.tagName!=='INPUT')stepEvent(-1)})}

async function main(){wireUI();wireCity();wireMap();wireRegions();makeMapPins();drawMapRoutes();updateJourney();qs('#loading').classList.add('done');try{initScene();await loadModel();makeRoutes();makePins();state.ready=true;requestAnimationFrame(animate)}catch(err){console.error('Nie udało się uruchomić sceny 3D',err);qs('#poster').style.opacity='1';qs('#glmap').style.display='none';qs('#view3d').disabled=true}}
main();
