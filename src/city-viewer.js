import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// These markers are placed on named objects exported with the Blender scene.
// Their texts describe locations from the story; the geometry is a fan
// reconstruction from published anime frames, not an official game model.
export const SHARIA_SPOTS = [
  {
    id: 'university', node: 'city_university', name: 'Uniwersytet Magii w Ranoa',
    description: 'Wschodnią część Sharii zajmuje rozległy kampus: gmach główny, sześć bloków dydaktycznych, akademiki, biblioteka, stołówka i plac ćwiczeń.',
    cameraOffset: [0,0,0], cameraPosition:[87,60,48], lookAt:[36,17,-26], fallback: [34,17.6,-22]
  },
  {
    id: 'greyrat', node: 'city_greyrat_house', name: 'Dom rodziny Greyratów',
    description: 'Posiadłość z ogrodem stoi na skraju dzielnicy mieszkalnej. Autor opisuje około półgodzinny spacer na uczelnię; dokładna ulica i kierunek domu nie są ustalone.',
    cameraOffset: [0,0,0], cameraPosition:[-14,23,75], lookAt:[-45,5,39], fallback: [-45,5.409,39]
  },
  {
    id:'magic-guild',node:'city_magic_guild',name:'Gildia Magii — centrum',
    description:'Siedziba Gildii Magii wyznacza środek Sharii. Jej budynek wzniesiono z cegły odpornej na magię; stąd rozchodzą się główne dzielnice.',
    cameraOffset:[0,0,0],cameraPosition:[22,27,26],lookAt:[0,8,-10],fallback:[0,6.07,-10]
  },
  {
    id:'campus-square',node:'city_campus_square',name:'Plac Frau Claudii',
    description:'Aleja wejściowa dochodzi do placu z pomnikiem Frau Claudii — założycielki i pierwszej rektorki uczelni. Tutaj droga rozdziela się na trzy części.',
    cameraOffset:[0,0,0],cameraPosition:[49,22,4],lookAt:[34,10,-10.6],fallback:[34,9.3,-10.6]
  },
  {
    id:'research-wing',node:'city_research_wing',name:'Gmach badawczy Nanahoshi',
    description:'Na końcu trzeciego piętra skrzydła badawczego Nanahoshi ma trzy połączone pokoje. Smukła wieża schodowa jest rekonstrukcją drogi do pracowni; stąd można wejść do wnętrza.',
    cameraOffset:[0,0,0],cameraPosition:[106,34,-63],lookAt:[75,14,-31],fallback:[75,14,-31]
  },
  {
    id:'library',node:'city_library',name:'Biblioteka Ranoa',
    description:'Osobny dwupiętrowy budynek w odległej części kampusu. Według autora dojście z gmachu zajęć trwa ponad dziesięć minut. Wnętrze można zwiedzić w scenie uczelni.',
    cameraOffset:[0,0,0],cameraPosition:[95,31,-27],lookAt:[68,11,-52],fallback:[68,11.73,-52]
  },
  {
    id:'dorms',node:'city_dorms',name:'Akademiki studentów',
    description:'Pięciopiętrowe akademiki mają czerwone dachy, liczne okna, balkony i suszącą się odzież. Po drugiej stronie osi wejścia stoi gmach kadry z niebieskim dachem.',
    cameraOffset:[0,0,0],cameraPosition:[-14,36,-3],lookAt:[6,17,-29],fallback:[6,16.73,-29]
  },
  {
    id:'cafeteria',node:'city_cafeteria',name:'Stołówka Ranoa',
    description:'Osobny trzypiętrowy gmach obsługuje studentów uczelni. Jego wnętrze z długimi stołami i ławami jest dostępne w scenie wnętrz.',
    cameraOffset:[0,0,0],cameraPosition:[83,24,10],lookAt:[66,12,-13],fallback:[66,12.73,-13]
  },
  {
    id:'training',node:'city_training_ground',name:'Pole ćwiczeń magii',
    description:'Otwarty teren do zajęć i pojedynków leży przy gmachach dydaktycznych. Tarcze, ślady ćwiczeń i magazyn wyposażenia tworzą rekonstrukcję tej przestrzeni.',
    cameraOffset:[0,0,0],cameraPosition:[80,30,-85],lookAt:[65,9,-65.5],fallback:[65,8.6,-65.5]
  },
  {
    id:'neris',node:'city_neris_workshop',name:'Warsztaty Neris — zachód',
    description:'Zachodnia dzielnica skupia wytwórców magicznych przedmiotów wokół pracowni Neris. W modelu są stoły rzemieślnicze, składy i warsztaty.',
    cameraOffset:[0,0,0],cameraPosition:[-66,22,18],lookAt:[-41,5,-12],fallback:[-41,4.312,-12]
  },
  {
    id:'trade',node:'city_trade_guild',name:'Gildia Handlowa — północ',
    description:'Północna część miasta skupia handel i magazyny. Stragany, skrzynie, wozy i zaplecza kupieckie otaczają Gildię Handlową.',
    cameraOffset:[0,0,0],cameraPosition:[-25,29,-18],lookAt:[0,8,-49],fallback:[0,6.17,-49]
  },
  {
    id:'south-inns',node:'city_south_inns',name:'Zajazdy — południe',
    description:'Południowe kwartały przyjmują podróżnych i poszukiwaczy przygód. Podwórza zajazdów, stajnie i wozy są scenografią opartą na funkcji tej dzielnicy.',
    cameraOffset:[0,0,0],cameraPosition:[45,26,69],lookAt:[21,7,40],fallback:[21,6.362,40]
  },
  {
    id: 'gate', node: 'city_gate', name: 'Brama i dzielnice Sharii',
    description: 'Wjazd prowadzi przez południowe dzielnice ku Gildii Magii i wschodniemu kampusowi. Dokładny plan bram, murów i ulic jest rekonstrukcją.',
    cameraOffset: [0,18,55], fallback: [0,3.8,65]
  },
  {
    id: 'market', node: 'city_market', name: 'Ulice Sharii',
    description: 'Zwarta zabudowa, stragany i drogi miasta tworzą przestrzeń do swobodnego oglądania. Ich dokładny plan nie został pokazany w anime.',
    cameraOffset: [16,7,19], fallback: [0,2.8,4]
  }
];

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const SHARIA_ROUTE = [
  [34,9,-14],[34,9,-10.6],[38,9,-7.7],[26,4,-3],[14,1.3,0],[0,1.2,4],
  [-13,1.2,8],[-23,1.2,27],[-27,1.2,42],[-30,1.2,54],[-45,1.2,54],[-45,1.3,48]
];
const ROUTE_SPOT = {
  id: 'route', name: 'Droga z uczelni do domu Greyratów',
  description: 'Trasa prowadzi ze wschodniego kampusu przez centrum ku oddalonej posiadłości. W tekście autora spacer trwa około 30 minut; przebieg ulic i skala modelu są interpretacją.'
};
const FREE_CAMERA_SPOT = {
  id: 'free-camera', name: 'Swobodna kamera',
  description: 'Obróć scenę, przybliż kółkiem lub poruszaj się klawiszami W A S D. Wybierz miejsce, aby rozpocząć nowy przelot.'
};

export class CityExplorer {
  constructor({ host, hotspots, markers, renderer, title = 'Sharia', spots = SHARIA_SPOTS, modelUrl = SHARIA_MODEL_URL,
    route = SHARIA_ROUTE, routeSpot = ROUTE_SPOT, routeLabel = 'PRZELEĆ: UCZELNIA → DOM', routeEndSpot = 'greyrat',
    overviewScale = 0.36, background = 0xa3c4d3, skyZenith = 0x77a8c4, skyHorizon = 0xdce7e7, anchorLift = 2.8,
    entryCamera = null, entryTarget = null, interior = false, heavyScene = false,
    maxFlightArc = 20, routeCameraHeight = 39, onSpotChange, onError }) {
    this.host = host;
    this.hotspots = hotspots;
    this.markers = markers;
    this.sharedRenderer = renderer;
    this.title = title;
    this.spots = spots;
    this.modelUrl = modelUrl;
    this.routePoints = route;
    this.routeSpot = routeSpot;
    this.routeLabel = routeLabel;
    this.routeEndSpot = routeEndSpot;
    this.overviewScale = overviewScale;
    this.background = background;
    this.skyZenith = skyZenith;
    this.skyHorizon = skyHorizon;
    this.anchorLift = anchorLift;
    this.entryCamera = entryCamera;
    this.entryTarget = entryTarget;
    this.interior = interior;
    this.heavyScene = heavyScene;
    this.maxFlightArc = maxFlightArc;
    this.routeCameraHeight = routeCameraHeight;
    this.onSpotChange = onSpotChange;
    this.onError = onError;
    this.active = false;
    this.ready = false;
    this.loading = null;
    this.pressed = new Set();
    this.lastFrameTime = performance.now();
    this.anchorPositions = new Map();
    this.bounds = new THREE.Box3();
    this.radius = 75;
    this.tween = null;
    this.tour = null;
    this.frame = null;
    this.openSerial = 0;
    this.occluders = [];
    this.lastOcclusionCheck = 0;
    this.occlusionCamera = new THREE.Vector3(Infinity, Infinity, Infinity);
    this.occlusionDirection = new THREE.Vector3();
    this.viewDirection = new THREE.Vector3();
    this.markerOccluded = new Map();
    this.collisionRaycaster = new THREE.Raycaster();
    this.occlusionRaycaster = new THREE.Raycaster();
    this.rayBoxPoint = new THREE.Vector3();
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this._onKeyDown = e => {
      if (!this.active || e.altKey || e.ctrlKey || e.metaKey ||
          /INPUT|TEXTAREA/.test(document.activeElement?.tagName || '') ||
          document.activeElement?.isContentEditable) return;
      if (/^[wasd]$/i.test(e.key)) {
        this.interruptMotion();
        this.pressed.add(e.key.toLowerCase());
      }
    };
    this._onKeyUp = e => this.pressed.delete(e.key.toLowerCase());
    this._onBlur = () => this.pressed.clear();
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);
  }

  init() {
    if (this.renderer) return;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.background);
    this.scene.fog = new THREE.FogExp2(this.background, 0.00075);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms:{
        zenith:{value:new THREE.Color(this.skyZenith)},
        horizon:{value:new THREE.Color(this.skyHorizon)},
        sunDirection:{value:new THREE.Vector3(-0.46,0.58,0.32).normalize()}
      },
      vertexShader:'varying vec3 skyDirection; void main(){ skyDirection=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader:'uniform vec3 zenith; uniform vec3 horizon; uniform vec3 sunDirection; varying vec3 skyDirection; void main(){ vec3 d=normalize(skyDirection); float t=smoothstep(-0.20,0.74,d.y); vec3 c=mix(horizon,zenith,t); float glow=pow(max(dot(d,sunDirection),0.0),20.0); float disc=pow(max(dot(d,sunDirection),0.0),220.0); c+=vec3(1.0,0.77,0.47)*(glow*0.10+disc*0.16); float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453); c+=(grain-0.5)*0.002; gl_FragColor=vec4(c,1.0); }',
      side:THREE.BackSide,depthWrite:false,depthTest:false,fog:false
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(460,32,20),skyMaterial);
    this.sky.renderOrder=-100;
    this.sky.frustumCulled=false;
    this.scene.add(this.sky);
    this.camera = new THREE.PerspectiveCamera(44, 1, 0.25, 800);
    this.camera.position.set(85, 70, 115);
    this.renderer = this.sharedRenderer || new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, this.heavyScene ? 1.5 : 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.domElement.setAttribute('aria-label', `Przestrzenny model 3D: ${this.title}; przeciągnij, aby obrócić`);
    this.host.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.minPolarAngle = 0.08;
    this.controls.maxPolarAngle = Math.PI * (this.interior ? 0.497 : 0.485);
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = this.interior ? 2.8 : 5;
    this.controls.maxDistance = 300;
    this.controls.target.set(0, 5, 0);
    this.controls.update();
    this.controls.addEventListener('start', () => this.interruptMotion());

    const hemi = new THREE.HemisphereLight(0xd9edfa, 0x736d59, 1.25);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe5be, 1.9);
    this.sunOffset = new THREE.Vector3(-60, 110, 32);
    sun.position.copy(this.sunOffset);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const shadowReach = this.heavyScene ? 92 : 125;
    Object.assign(sun.shadow.camera, { left: -shadowReach, right: shadowReach,
      top: shadowReach, bottom: -shadowReach, near: 1, far: 270 });
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.025;
    this.sun = sun;
    this.sunTarget = sun.target;
    this.scene.add(sun, this.sunTarget);
    const rim = new THREE.DirectionalLight(0xbeddf0, 0.45);
    rim.position.set(30, 60, -65);
    this.scene.add(rim);
    new ResizeObserver(() => this.resize()).observe(this.host);
    this.host.addEventListener('dblclick', e => this.focusAtPointer(e));
    this.renderer.domElement.addEventListener('pointerdown', () => this.interruptMotion());
    this.renderer.domElement.addEventListener('wheel', () => this.interruptMotion(), { passive: true });
    this.hotspots.addEventListener('click', e => {
      if (!this.active) return;
      if (e.target.closest('[data-city-route]')) { this.route(); return; }
      const button = e.target.closest('[data-city-spot]');
      if (button) this.focusSpot(button.dataset.citySpot);
    });
    this.markers.addEventListener('click', e => {
      if (!this.active) return;
      const button = e.target.closest('[data-city-spot]');
      if (button) this.focusSpot(button.dataset.citySpot);
    });
  }

  async open() {
    const serial = ++this.openSerial;
    this.init();
    this.active = true;
    this.host.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute('aria-label', `Przestrzenny model 3D: ${this.title}; przeciągnij, aby obrócić`);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, this.heavyScene ? 1.5 : 1.75));
    this.renderer.toneMappingExposure = 1.04;
    this.renderer.shadowMap.enabled = true;
    this.controls.enabled = true;
    this.resize();
    if (!this.ready) {
      try {
        this.loading ||= new GLTFLoader().loadAsync(this.modelUrl);
        const gltf = await this.loading;
        if (!this.active || serial !== this.openSerial) return;
        this.model = gltf.scene;
        this.scene.add(this.model);
        let meshCount = 0;
        this.model.traverse(object => { if (object.isMesh) meshCount++; });
        this.meshCount = meshCount;
        this.model.traverse(object => {
          if (object.isMesh) {
            object.castShadow = !this.heavyScene ||
              /^(01 · KONTYNENT|Kshirishka|Rikaris · Gildia|Rikaris · dom i warsztat|Rikaris · dom wykuty|Dom rodziny Migurdów)/.test(object.name) ||
              (object.name.startsWith('Wen Port') && /dach|ściany/.test(object.name));
            object.receiveShadow = true;
            if (object.material?.map) object.material.map.anisotropy = 8;
          }
        });
        this.model.updateMatrixWorld(true);
        this.occluders = [];
        this.model.traverse(object => {
          if (object.isMesh && object.visible && !object.material?.transparent) {
            this.occluders.push({ mesh: object, box: new THREE.Box3().setFromObject(object) });
          }
        });
        if (this.routePoints?.length) this.makeRoute();
        this.bounds.setFromObject(this.model);
        this.center = this.bounds.getCenter(new THREE.Vector3());
        this.radius = clamp(this.bounds.getSize(new THREE.Vector3()).length() * 0.38, 36, 125);
        this.controls.maxDistance = this.radius * 4.5;
        for (const spot of this.spots) {
          const object = this.model.getObjectByName(spot.node);
          const position = object ? object.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(...spot.fallback);
          position.y += this.anchorLift;
          this.anchorPositions.set(spot.id, position);
        }
        this.makeHotspots();
        this.home(false);
        this.ready = true;
      } catch (error) {
        if (serial === this.openSerial) {
          this.loading = null;
          this.onError?.(error);
        }
        return;
      }
    } else {
      this.makeHotspots();
      this.home(false);
    }
    if (!this.active || serial !== this.openSerial) return;
    this.lastFrameTime = performance.now();
    this.lastOcclusionCheck = 0;
    if (this.frame === null) this.render();
  }

  close() {
    this.openSerial++;
    this.active = false;
    if (this.controls) this.controls.enabled = false;
    this.pressed.clear();
    this.tween = null;
    this.tour = null;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  resize() {
    if (!this.active || !this.renderer || !this.host.clientWidth || !this.host.clientHeight) return;
    const w = this.host.clientWidth, h = this.host.clientHeight;
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.7 ? 56 : w / h < 1 ? 49 : 44;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.lastOcclusionCheck = 0;
  }

  interruptMotion() {
    if (!this.active || (!this.tween && !this.tour)) return;
    this.tween = null;
    this.tour = null;
    if (this.routeVisual) this.routeVisual.visible = false;
    this.hotspots.querySelector('[data-city-route]')?.setAttribute('aria-pressed', 'false');
    for (const button of [...this.hotspots.querySelectorAll('[data-city-spot]'),
      ...this.markers.querySelectorAll('[data-city-spot]')]) {
      button.classList.remove('active');
      if (button.parentElement === this.hotspots) button.setAttribute('aria-pressed', 'false');
    }
    this.onSpotChange?.(FREE_CAMERA_SPOT);
  }

  raycastBetween(from, to, raycaster, extra = 0) {
    if (!this.occluders.length) return null;
    const delta = to.clone().sub(from);
    const distance = delta.length();
    if (distance < 0.001) return null;
    raycaster.set(from, delta.divideScalar(distance));
    raycaster.near = 0.02;
    raycaster.far = distance + extra;
    const limitSquared = raycaster.far * raycaster.far;
    const candidates = [];
    for (const { mesh, box } of this.occluders) {
      const point = raycaster.ray.intersectBox(box, this.rayBoxPoint);
      if (point && point.distanceToSquared(from) <= limitSquared) candidates.push(mesh);
    }
    return candidates.length ? raycaster.intersectObjects(candidates, false)[0] || null : null;
  }

  makeHotspots() {
    this.hotspots.innerHTML = (this.routePoints?.length ? `<button class="city-route-button" data-city-route type="button" aria-pressed="false"><span>↗</span><strong>${this.routeLabel}</strong></button>` : '') + this.spots.map((spot, index) =>
      `<button class="city-hotspot" data-city-spot="${spot.id}" type="button" aria-label="Pokaż: ${spot.name}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${spot.name}</strong></button>`
    ).join('');
    this.markers.innerHTML = this.spots.map((spot, index) =>
      `<button class="city-marker" data-city-spot="${spot.id}" type="button" tabindex="-1" title="${spot.name}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${spot.name}</strong></button>`
    ).join('');
  }

  makeRoute() {
    this.routeCurve = new THREE.CatmullRomCurve3(
      this.routePoints.map(point => point.length===3 ? new THREE.Vector3(...point) : new THREE.Vector3(point[0], 1.7, point[1])), false, 'centripetal'
    );
    const geometry = new THREE.TubeGeometry(this.routeCurve, 200, 0.24, 6, false);
    const material = new THREE.MeshBasicMaterial({ color: 0xf2c776, transparent: true, opacity: 0.88 });
    this.routeVisual = new THREE.Mesh(geometry, material);
    this.routeVisual.visible = false;
    this.routeVisual.renderOrder = 4;
    this.scene.add(this.routeVisual);
  }

  routePose(t) {
    const point = this.routeCurve.getPoint(t);
    const next = this.routeCurve.getPoint(Math.min(t + 0.075, 1));
    const tangent = this.routeCurve.getTangent(t).setY(0).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x);
    const camera = point.clone().addScaledVector(tangent, -30).addScaledVector(side, 6);
    camera.y = Math.max(this.routeCameraHeight, point.y + 30);
    return { camera, target: new THREE.Vector3(next.x, next.y + 4, next.z) };
  }

  route() {
    if (!this.ready || !this.routeCurve) return;
    this.tween = null;
    this.routeVisual.visible = true;
    const entrance = this.routePose(0);
    this.tour = { start: performance.now(),
      duration: clamp(7000 + this.routeCurve.getLength() * 38, 10000, 22000),
      introDuration: clamp(700 + this.camera.position.distanceTo(entrance.camera) * 7, 1600, 3500),
      fromCamera: this.camera.position.clone(),
      fromTarget: this.controls.target.clone() };
    const button = this.hotspots.querySelector('[data-city-route]');
    if (button) button.setAttribute('aria-pressed', 'true');
    for (const hotspot of [...this.hotspots.querySelectorAll('[data-city-spot]'), ...this.markers.querySelectorAll('[data-city-spot]')]) {
      hotspot.classList.remove('active');
      if (hotspot.parentElement === this.hotspots) hotspot.setAttribute('aria-pressed', 'false');
    }
    this.onSpotChange?.(this.routeSpot);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.tour = null;
      this.focusSpot(this.routeEndSpot);
    }
  }

  home(animated = true) {
    if (!this.center) return;
    this.tour = null;
    if (this.routeVisual) this.routeVisual.visible = false;
    this.hotspots.querySelector('[data-city-route]')?.setAttribute('aria-pressed', 'false');
    if (this.entryCamera && this.entryTarget) {
      this.moveTo(new THREE.Vector3(...this.entryCamera), new THREE.Vector3(...this.entryTarget), animated);
      for (const button of [...this.hotspots.querySelectorAll('[data-city-spot]'), ...this.markers.querySelectorAll('[data-city-spot]')]) {
        button.classList.remove('active');
        if (button.parentElement === this.hotspots) button.setAttribute('aria-pressed', 'false');
      }
      this.onSpotChange?.(null);
      return;
    }
    const center = this.center.clone();
    center.y = 8;
    const size = this.bounds.getSize(new THREE.Vector3());
    const halfWidth = Math.hypot(size.x, size.z) * this.overviewScale;
    const hFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(this.camera.fov) * 0.5) * this.camera.aspect);
    const distance = clamp(Math.max(halfWidth / Math.tan(hFov * 0.5), size.y / Math.tan(THREE.MathUtils.degToRad(this.camera.fov) * 0.5)) * 1.03, this.radius * 1.4, this.radius * 4);
    const camera = center.clone().add(new THREE.Vector3(0.72, 1.08, 0.9).normalize().multiplyScalar(distance));
    this.moveTo(camera, center, animated);
    for (const button of [...this.hotspots.querySelectorAll('[data-city-spot]'), ...this.markers.querySelectorAll('[data-city-spot]')]) {
      button.classList.remove('active');
      if (button.parentElement === this.hotspots) button.setAttribute('aria-pressed', 'false');
    }
    this.onSpotChange?.(null);
  }

  focusSpot(id) {
    if (id === 'market') { this.street(); return; }
    this.tour = null;
    if (this.routeVisual) this.routeVisual.visible = false;
    this.hotspots.querySelector('[data-city-route]')?.setAttribute('aria-pressed', 'false');
    const spot = this.spots.find(item => item.id === id);
    const position = this.anchorPositions.get(id);
    if (!spot || !position) return;
    const target = spot.lookAt ? new THREE.Vector3(...spot.lookAt) : position.clone();
    const offset = new THREE.Vector3(...spot.cameraOffset);
    const camera = spot.cameraPosition ? new THREE.Vector3(...spot.cameraPosition) : target.clone().add(offset);
    this.moveTo(camera, target, true);
    for (const button of [...this.hotspots.querySelectorAll('[data-city-spot]'), ...this.markers.querySelectorAll('[data-city-spot]')]) {
      button.classList.toggle('active', button.dataset.citySpot === id);
      if (button.parentElement === this.hotspots) button.setAttribute('aria-pressed', String(button.dataset.citySpot === id));
    }
    this.onSpotChange?.(spot);
  }

  street() {
    if (!this.controls) return;
    this.tour = null;
    if (this.routeVisual) this.routeVisual.visible = false;
    this.hotspots.querySelector('[data-city-route]')?.setAttribute('aria-pressed', 'false');
    const gate = this.anchorPositions.get('gate') || new THREE.Vector3(0, 4, 48);
    const market = this.anchorPositions.get('market') || new THREE.Vector3(0, 3, 4);
    const camera = new THREE.Vector3(gate.x, 4.8, gate.z - 8);
    const target = new THREE.Vector3(market.x, 4.2, market.z);
    this.moveTo(camera, target, true);
    for (const button of [...this.hotspots.querySelectorAll('[data-city-spot]'), ...this.markers.querySelectorAll('[data-city-spot]')]) {
      button.classList.toggle('active', button.dataset.citySpot === 'market');
      if (button.parentElement === this.hotspots) button.setAttribute('aria-pressed', String(button.dataset.citySpot === 'market'));
    }
    this.onSpotChange?.(this.spots.find(spot => spot.id === 'market'));
  }

  moveTo(camera, target, animated) {
    if (!this.controls) return;
    this.tour = null;
    if (!animated || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.camera.position.copy(camera);
      this.controls.target.copy(target);
      this.controls.update();
      this.tween = null;
      this.lastOcclusionCheck = 0;
      return;
    }
    const cameraTravel = this.camera.position.distanceTo(camera);
    const travel = Math.max(cameraTravel, this.controls.target.distanceTo(target));
    const blocked = this.raycastBetween(this.camera.position, camera, this.collisionRaycaster);
    const arcHeight = Math.min(this.maxFlightArc,
      Math.max(Math.max(0, (cameraTravel - 12) * 0.16), blocked ? cameraTravel * 0.3 : 0));
    this.tween = {
      start: performance.now(), duration: clamp(650 + travel * 13, 900, 2600),
      arcHeight,
      fromCamera: this.camera.position.clone(), fromTarget: this.controls.target.clone(),
      toCamera: camera.clone(), toTarget: target.clone()
    };
  }

  focusAtPointer(event) {
    if (!this.active || !this.model) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObject(this.model, true)[0];
    if (!hit) return;
    const approach = this.camera.position.clone().sub(hit.point);
    const distance = clamp(approach.length() * 0.42, this.interior ? 2.8 : 5, 16);
    const destination = hit.point.clone().add(approach.setLength(distance));
    this.moveTo(destination, hit.point, true);
    this.onSpotChange?.(null);
  }

  moveWithKeys(dt) {
    if (!this.pressed.size) return;
    const forward = this.controls.target.clone().sub(this.camera.position);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(-forward.z, 0, forward.x);
    const move = new THREE.Vector3();
    if (this.pressed.has('w')) move.add(forward);
    if (this.pressed.has('s')) move.sub(forward);
    if (this.pressed.has('d')) move.add(right);
    if (this.pressed.has('a')) move.sub(right);
    if (!move.lengthSq()) return;
    const cameraDistance = this.camera.position.distanceTo(this.controls.target);
    const speed = this.interior ? 3.8 : clamp(cameraDistance * 0.32, 3.8, 13);
    move.normalize().multiplyScalar(dt * speed);
    const nextCamera = this.camera.position.clone().add(move);
    const obstacle = this.raycastBetween(this.camera.position, nextCamera,
      this.collisionRaycaster, 0.65);
    if (obstacle && obstacle.distance < move.length() + 0.65) {
      const allowed = Math.max(0, obstacle.distance - 0.65);
      move.multiplyScalar(Math.min(1, allowed / move.length()));
    }
    if (move.lengthSq() < 1e-8) return;
    this.controls.target.add(move);
    this.camera.position.add(move);
  }

  positionHotspots(now) {
    const width = this.host.clientWidth, height = this.host.clientHeight;
    this.camera.getWorldDirection(this.viewDirection);
    const cameraMoved = this.camera.position.distanceToSquared(this.occlusionCamera) > 0.12 ||
      this.viewDirection.dot(this.occlusionDirection) < 0.9995;
    if (this.lastOcclusionCheck === 0 ||
        (cameraMoved && now - this.lastOcclusionCheck > 220)) {
      this.lastOcclusionCheck = now;
      this.occlusionCamera.copy(this.camera.position);
      this.occlusionDirection.copy(this.viewDirection);
      for (const button of this.markers.querySelectorAll('[data-city-spot]')) {
        const id = button.dataset.citySpot;
        const anchor = this.anchorPositions.get(id);
        if (!anchor) continue;
        const projected = anchor.clone().project(this.camera);
        if (projected.z <= -1 || projected.z >= 1 || Math.abs(projected.x) >= 1.1 ||
            Math.abs(projected.y) >= 1.1) continue;
        const distance = this.camera.position.distanceTo(anchor);
        const hit = this.raycastBetween(this.camera.position, anchor,
          this.occlusionRaycaster);
        this.markerOccluded.set(id,
          Boolean(hit && hit.distance < distance - Math.max(2, distance * 0.07)));
      }
    }
    for (const button of this.markers.querySelectorAll('[data-city-spot]')) {
      const point = this.anchorPositions.get(button.dataset.citySpot)?.clone();
      if (!point) continue;
      point.project(this.camera);
      const visible = point.z > -1 && point.z < 1 && Math.abs(point.x) < 0.91 &&
        Math.abs(point.y) < 0.84 &&
        (!this.markerOccluded.get(button.dataset.citySpot) || button.classList.contains('active'));
      button.hidden = !visible;
      if (visible) {
        button.style.left = `${(point.x + 1) * width * 0.5}px`;
        button.style.top = `${(1 - point.y) * height * 0.5}px`;
      }
    }
  }

  render() {
    if (!this.active || !this.renderer) return;
    this.frame = requestAnimationFrame(() => this.render());
    const now = performance.now();
    const motion = this.tour ? 'tour' : this.tween ? 'flight' : this.pressed.size ? 'walk' : 'idle';
    if (this.host.dataset.cameraMotion !== motion) this.host.dataset.cameraMotion = motion;
    if (this.tour) {
      const elapsed = now - this.tour.start;
      const t = clamp((elapsed - this.tour.introDuration) / this.tour.duration, 0, 1);
      const { camera: routeCamera, target: routeTarget } = this.routePose(t);
      if (elapsed < this.tour.introDuration) {
        const k = clamp(elapsed / this.tour.introDuration, 0, 1);
        const ease = k * k * (3 - 2 * k);
        this.camera.position.copy(this.tour.fromCamera).lerp(routeCamera, ease);
        this.camera.position.y += Math.sin(Math.PI * ease) ** 2 * this.maxFlightArc;
        this.controls.target.copy(this.tour.fromTarget).lerp(routeTarget, ease);
      } else {
        this.camera.position.copy(routeCamera);
        this.controls.target.copy(routeTarget);
        if (t >= 1) this.focusSpot(this.routeEndSpot);
      }
    }
    if (this.tween) {
      const t = clamp((now - this.tween.start) / this.tween.duration, 0, 1);
      const eased = t * t * (3 - 2 * t);
      this.camera.position.copy(this.tween.fromCamera).lerp(this.tween.toCamera, eased);
      this.camera.position.y += Math.sin(Math.PI * eased) ** 2 * this.tween.arcHeight;
      this.controls.target.copy(this.tween.fromTarget).lerp(this.tween.toTarget, eased);
      if (t === 1) this.tween = null;
    }
    this.moveWithKeys(Math.min((now-this.lastFrameTime)/1000,0.05));
    this.lastFrameTime=now;
    this.controls.update();
    this.camera.position.y = Math.max(this.camera.position.y, 0.75);
    this.sunTarget.position.copy(this.controls.target);
    this.sun.position.copy(this.controls.target).add(this.sunOffset);
    this.sunTarget.updateMatrixWorld();
    this.sky.position.copy(this.camera.position);
    this.positionHotspots(now);
    this.renderer.render(this.scene, this.camera);
  }
}
