/**
 * Bundle smoke test — guards against import cycles in the flattened FESM output.
 *
 * Jest resolves each module separately, so a cycle between two library files stays
 * invisible to the unit suite. Once ng-packagr flattens everything into a single
 * ESM module, the cycle forces an evaluation order and a symbol can be read before
 * its declaration — a TDZ ReferenceError that only consumers evaluating the whole
 * module (Vitest, SSR, plain `import`) ever hit.
 *
 * `@angular/compiler` is imported first because the package ships partial-compiled
 * declarations; without it the graph fails on a JIT fallback before we reach any
 * ps-helix code.
 */
import '@angular/compiler';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const BUNDLE = resolve('dist/ps-helix/fesm2022/ps-helix.mjs');

let bundle;
try {
  bundle = await import(pathToFileURL(BUNDLE).href);
} catch (error) {
  console.error(`✖ ${BUNDLE} failed to evaluate.`);
  console.error(`  ${error.name}: ${error.message}`);
  if (error instanceof ReferenceError) {
    console.error('  Likely an import cycle between two library files — check that');
    console.error('  deprecated aliases live in the same file as the symbol they alias.');
  }
  process.exit(1);
}

const undefinedExports = Object.keys(bundle).filter(name => bundle[name] === undefined);
if (undefinedExports.length > 0) {
  console.error('✖ Public exports resolved to undefined (partially initialised cycle):');
  undefinedExports.forEach(name => console.error(`  - ${name}`));
  process.exit(1);
}

console.log(`✔ Bundle evaluates cleanly — ${Object.keys(bundle).length} public exports resolved.`);
