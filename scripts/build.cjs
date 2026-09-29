const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const dependencyPath = process.env.MUSHOKU_DEPENDENCY_PATH;
const esbuild = dependencyPath
  ? require(path.join(dependencyPath, 'esbuild'))
  : require('esbuild');
const modules = dependencyPath || path.join(root, 'node_modules');
const three = path.join(modules, 'three');
const source = path.join(root, 'src');
const entry = path.join(source, 'viewer.js');
const url = file => JSON.stringify('./' + file);
const resolver = {
  name: 'mushoku-resolver',
  setup(build) {
    build.onResolve({ filter: /.*/ }, args => {
      const request = args.path;
      let resolved;
      if (request === 'three') resolved = path.join(three, 'build', 'three.module.js');
      else if (request.startsWith('three/addons/'))
        resolved = path.join(three, 'examples', 'jsm', request.slice('three/addons/'.length));
      else if (request.startsWith('.'))
        resolved = path.resolve(args.importer ? path.dirname(args.importer) : source, request);
      else if (path.isAbsolute(request)) resolved = request;
      else throw new Error(`Unresolved import: ${request} from ${args.importer}`);
      return { path: resolved, namespace: 'mushoku-files' };
    });
    build.onLoad({ filter: /.*/, namespace: 'mushoku-files' }, args =>
      ({ contents: fs.readFileSync(args.path, 'utf8'), loader: 'js' }));
  }
};

esbuild.build({
  stdin: { contents: fs.readFileSync(entry, 'utf8'), resolveDir: source,
    sourcefile: entry, loader: 'js' },
  outfile: path.join(root, 'bundle.js'),
  plugins: [resolver],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  define: {
    MAP_TEXTURE_URL: url('mapa-kartograficzna.png'),
    MAP_LABELS_URL: url('mapa-etykiety.svg'),
    MAP_DETAILS_URL: url('mapa-szczegoly.svg'),
    SHARIA_MODEL_URL: url('miasta/sharia.glb'),
    MILLIS_MODEL_URL: url('miasta/millishion.glb'),
    RANOA_INTERIOR_MODEL_URL: url('wnetrza/ranoa-uniwersytet.glb'),
    DEMON_MODEL_URL: url('regiony/kontynent-demonow.glb')
  }
}).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
