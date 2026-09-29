/**
 * Builds a shallow relief from the finished 2D cartographic plate.
 *
 * Coordinate contract with the atlas: a point (mapX,mapY) on the 1441 x 1024
 * reference map is (x,z) = ((mapX - 720.5) / 10, (mapY - 512) / 10).
 * The supplied bitmap may have a different pixel resolution; its full image
 * is mapped onto the same 144.1 x 102.4 world rectangle.
 */
export async function createCartographicTerrain(THREE, imageUrl) {
  const SEG_X = 180;
  const SEG_Y = 128;
  const NX = SEG_X + 1;
  const NY = SEG_Y + 1;
  const MAP_W = 1441;
  const MAP_H = 1024;
  const WORLD_W = 144.1;
  const WORLD_H = 102.4;

  const texture = await new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(imageUrl, resolve, undefined, reject);
  });
  if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;

  const geometry = new THREE.PlaneGeometry(WORLD_W, WORLD_H, SEG_X, SEG_Y);
  geometry.rotateX(-Math.PI / 2);
  const elevations = new Float32Array(NX * NY);

  // The image may be opened from a file:// URL. If its pixels are unavailable
  // to canvas, keep the exact textured map flat rather than inventing relief.
  try {
    const canvas = document.createElement('canvas');
    canvas.width = NX;
    canvas.height = NY;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('2D canvas unavailable');
    context.drawImage(texture.image, 0, 0, NX, NY);
    const pixels = context.getImageData(0, 0, NX, NY).data;
    const landRaw = new Uint8Array(NX * NY);
    const warmInk = new Float32Array(NX * NY);

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const smoothstep = (a, b, v) => {
      const t = clamp01((v - a) / (b - a));
      return t * t * (3 - 2 * t);
    };
    const at = (x, y) => y * NX + x;

    for (let y = 0; y < NY; y++) {
      for (let x = 0; x < NX; x++) {
        const i = at(x, y);
        const p = i * 4;
        const r = pixels[p];
        const g = pixels[p + 1];
        const b = pixels[p + 2];
        // Cream/ocher earth is warmer than the pale blue sea. Dark green trees
        // have a separate signature. The 6-cell margin discards the printed
        // decorative frame so it cannot become a false raised continent.
        const warmEarth = r - g > 10 && r - b > 13;
        const greenForest = r < 185 && g > 35 && g - b > 12 && g >= r - 10;
        landRaw[i] = x >= 6 && y >= 6 && x < NX - 6 && y < NY - 6 &&
          (warmEarth || greenForest) ? 1 : 0;
        const darkness = clamp01((165 - (r * .30 + g * .59 + b * .11)) / 115);
        const brown = smoothstep(4, 20, r - g) * smoothstep(8, 28, r - b);
        warmInk[i] = darkness * brown;
      }
    }

    // Majority filtering removes individual ink flecks and wave hatching. A
    // continuous score (rather than a hard shoreline step) makes a low,
    // sculpted coast while the original bitmap still owns the exact outline.
    const land = new Float32Array(NX * NY);
    const ridge = new Float32Array(NX * NY);
    for (let y = 1; y < NY - 1; y++) {
      for (let x = 1; x < NX - 1; x++) {
        let count = 0;
        let ink = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const j = at(x + ox, y + oy);
            count += landRaw[j];
            ink += warmInk[j];
          }
        }
        const i = at(x, y);
        land[i] = count / 9;
        ridge[i] = ink / 9;
      }
    }

    // Some paper stains in the open sea share the ocher land palette. Keep
    // only the connected components containing the five known continents;
    // otherwise those stains would turn into invented islands in the relief.
    const occupied = new Uint8Array(NX * NY);
    const labels = new Int32Array(NX * NY);
    labels.fill(-1);
    for (let i = 0; i < occupied.length; i++) occupied[i] = land[i] >= 5 / 9 ? 1 : 0;
    let componentCount = 0;
    const stack = [];
    for (let y = 0; y < NY; y++) {
      for (let x = 0; x < NX; x++) {
        const start = at(x, y);
        if (!occupied[start] || labels[start] !== -1) continue;
        labels[start] = componentCount;
        stack.push(start);
        while (stack.length) {
          const current = stack.pop();
          const cx = current % NX;
          const cy = (current - cx) / NX;
          const neighbors = [
            cx > 0 ? current - 1 : -1,
            cx < SEG_X ? current + 1 : -1,
            cy > 0 ? current - NX : -1,
            cy < SEG_Y ? current + NX : -1,
          ];
          for (const next of neighbors) {
            if (next < 0 || !occupied[next] || labels[next] !== -1) continue;
            labels[next] = componentCount;
            stack.push(next);
          }
        }
        componentCount++;
      }
    }
    const continentSeeds = [
      [400, 360],  // Central
      [1200, 300], // Demon
      [250, 760],  // Begaritt
      [1220, 730], // Millis
      [900, 115],  // Heaven
    ];
    const selected = new Set();
    for (const [mapX, mapY] of continentSeeds) {
      const sx = Math.round(mapX / MAP_W * SEG_X);
      const sy = Math.round(mapY / MAP_H * SEG_Y);
      for (let radius = 0; radius <= 5; radius++) {
        let found = false;
        for (let dy = -radius; dy <= radius && !found; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const x = sx + dx;
            const y = sy + dy;
            if (x < 0 || x >= NX || y < 0 || y >= NY) continue;
            const component = labels[at(x, y)];
            if (component >= 0) {
              selected.add(component);
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
    }
    for (let i = 0; i < land.length; i++) {
      if (!selected.has(labels[i])) {
        land[i] = 0;
        ridge[i] = 0;
      }
    }

    for (let y = 0; y < NY; y++) {
      for (let x = 0; x < NX; x++) {
        const i = at(x, y);
        const mapX = x / SEG_X * MAP_W;
        const mapY = y / SEG_Y * MAP_H;
        const earth = smoothstep(.31, .76, land[i]);
        // A broad elevated terrace marks the Heaven Continent. Its height is
        // applied only where the bitmap actually shows land.
        const heaven = smoothstep(738, 800, mapX) *
          (1 - smoothstep(990, 1035, mapX)) *
          smoothstep(45, 78, mapY) *
          (1 - smoothstep(140, 190, mapY));
        const mountain = smoothstep(.12, .55, ridge[i]) *
          smoothstep(.56, .88, land[i]);
        elevations[i] = earth * (.48 + mountain * .92 + heaven * 1.08);
      }
    }

    const position = geometry.attributes.position;
    for (let i = 0; i < elevations.length; i++) {
      position.setY(i, elevations[i]);
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Unlit material retains the engraved plate's original colors. Gentle
    // vertex modulation reveals slopes without recoloring the geography.
    const normals = geometry.attributes.normal;
    const tints = new Float32Array(elevations.length * 3);
    for (let i = 0; i < elevations.length; i++) {
      const towardLight = clamp01(
        normals.getX(i) * -.32 + normals.getY(i) * .86 + normals.getZ(i) * -.39
      );
      const shade = Math.min(1, .88 + .12 * towardLight);
      tints[i * 3] = shade;
      tints[i * 3 + 1] = shade;
      tints[i * 3 + 2] = shade;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(tints, 3));
  } catch (error) {
    // The texture itself loaded, so a flat but fully usable atlas is better
    // than hiding the map because canvas cannot inspect local-file pixels.
    console.warn('Cartographic relief unavailable; using flat map.', error);
  }

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    vertexColors: geometry.hasAttribute('color'),
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'Mushoku Tensei — cartographic terrain';
  mesh.frustumCulled = false;
  mesh.userData.mapWidth = MAP_W;
  mesh.userData.mapHeight = MAP_H;
  mesh.userData.mapPixelToWorld = (mapX, mapY) => ({
    x: (mapX - 720.5) / 10,
    z: (mapY - 512) / 10,
  });
  mesh.userData.heightAtMapPixel = (mapX, mapY) => {
    const gx = Math.max(0, Math.min(SEG_X, mapX / MAP_W * SEG_X));
    const gy = Math.max(0, Math.min(SEG_Y, mapY / MAP_H * SEG_Y));
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const x1 = Math.min(SEG_X, x0 + 1);
    const y1 = Math.min(SEG_Y, y0 + 1);
    const tx = gx - x0;
    const ty = gy - y0;
    const h00 = elevations[y0 * NX + x0];
    const h10 = elevations[y0 * NX + x1];
    const h01 = elevations[y1 * NX + x0];
    const h11 = elevations[y1 * NX + x1];
    return (h00 * (1 - tx) + h10 * tx) * (1 - ty) +
      (h01 * (1 - tx) + h11 * tx) * ty;
  };
  return mesh;
}
