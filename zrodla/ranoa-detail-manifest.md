# Ranoa — nowa geometria i kamery

Eksport: `outputs/mushoku-atlas/wnetrza/ranoa-uniwersytet.glb`.
Blender: `outputs/mushoku-atlas/wnetrza/Ranoa_Uniwersytet_Wnetrze_3D.blend`.
Wszystkie współrzędne poniżej są w **glTF / Three.js, Y up**.

| Marker | Pozycja | Kamera | Cel kamery |
|---|---|---|---|
| ranoa_library | `[-56,1.75,8]` | `[-58,7.4,20]` | `[-56,3.2,-5]` |
| ranoa_library_gallery | `[-56,5.8,-15.8]` | `[-56,6.4,-15]` | `[-56,2.7,6]` |
| ranoa_refectory | `[28,1.75,-41]` | `[21,9,-25]` | `[28,4,-49]` |
| ranoa_research_entry | `[82,1.75,46]` | `[76,12,59]` | `[83,10,31]` |
| ranoa_research_stair | `[101,6.3,32]` | `[117,17,47]` | `[100,8,32]` |
| ranoa_nanahoshi | `[82,10.95,34]` | `[79,20,52]` | `[82,11,30]` |
| ranoa_nanahoshi_store | `[70.5,10.95,33]` | `[65,16,48]` | `[71,11,33]` |
| ranoa_nanahoshi_experiment | `[82,10.95,32]` | `[82,17,49]` | `[82,11,32]` |
| ranoa_nanahoshi_room | `[93,10.95,28]` | `[103,17,45]` | `[93,11,28]` |
| ranoa_zanoba | `[82,1.75,5]` | `[79,7,19]` | `[82,2,0]` |
| ranoa_cliff | `[82,1.75,-27]` | `[79,8,-10]` | `[82,2,-30]` |

Pełna panorama: kamera `[-101,133,123]`, cel `[12,2,-12]`. Scena rozciąga się X około -72…97, Z około -60…44. Dotychczasowy krużganek i aula pozostają w tych samych współrzędnych.

## Treści i granice rekonstrukcji

- Biblioteka: osobny dwupiętrowy gmach. Stoliki przy wejściu, regały dalej, galeria wokół otwartego środka, schody, biurko strażnika, książki z barwnymi grzbietami. Wnętrze i odrębność budynku potwierdza autor: https://ncode.syosetu.com/n9669bk/77/ . Droga do biblioteki w tej scenie jest skrócona; tekst mówi o ponad 10 minutach od gmachu zajęć.
- Stołówka: osobny trzypiętrowy budynek w formie otwartego przekroju; trzy poziomy stołów, zastawa, ławy, schody i zaplecze. Liczba pięter i osobny budynek: https://ncode.syosetu.com/n9669bk/77/ . Liczby stołów i usytuowanie przekroju są scenografią.
- Nanahoshi: [rozdział 78 tekstu autora](https://ncode.syosetu.com/n9669bk/87/) umieszcza jej trzy połączone pokoje na końcu **trzeciego piętra gmachu badawczego**. Model pokazuje dwa niższe piętra, schody w bocznej wieży oraz górny przekrój pracowni z magazynem, eksperymentownią i prywatnym pokojem. Bryła wieży, dokładny układ mebli i kręgów są rekonstrukcją. [Oficjalny opis odcinka 10 sezonu 2](https://mushokutensei.jp/story/2-10/) potwierdza badania nad przywołaniem.
- Zanoba: stoły pracy, części lalki, figurki, narzędzia i mniejszy stół Julie. https://ncode.syosetu.com/n9669bk/108/ i https://ncode.syosetu.com/n9669bk/115/ . Dokładny adres pracowni nie jest podany.
- Cliff: książki, rysunki i rozłożone magiczne narzędzia w osobnym pokoju badań nad klątwą. https://ncode.syosetu.com/n9669bk/108/ . Wygląd przedmiotów i układ wyposażenia zrekonstruowano.

Wszystkie elementy geometrii są autorskie, utworzone lokalnie w Blenderze. Model nie zawiera pikseli z anime ani wyciągniętych zasobów produkcyjnych. Górne płaszczyzny dachu i część ścian usunięto celowo dla zwiedzania przekroju. Pomiędzy oddzielnymi gmachami zaznaczono skrócone dojścia.

Rendery: `ranoa-wnetrze-podglad.png`, `ranoa-kruzganek.png`, `ranoa-sala.png`, `ranoa-biblioteka.png`, `ranoa-stolowka.png`, `ranoa-nanahoshi.png`, `ranoa-zanoba.png`, `ranoa-cliff.png`.
