#!/usr/bin/env node
/**
 * npm run ds:compare — ¿dicen lo mismo Figma y el código?
 *
 * Compara design-system/figma-snapshot.json (la foto de Figma) con los tokens y
 * componentes del repo. No toca nada: solo informa.
 *
 * La foto la regenera Claude leyendo Figma con el Desktop Bridge abierto.
 * Si la foto está vieja, este comando compara contra un pasado: mira la fecha.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

// Color solo si la salida va a una terminal de verdad. Si se redirige a un
// archivo o se pipea, sale limpio. NO_COLOR es la convención para apagarlo.
const conColor = process.stdout.isTTY && !process.env.NO_COLOR;
const C = new Proxy({
  rojo: '31', ambar: '33', verde: '32', azul: '36', gris: '90', fuerte: '1',
}, { get: (t, k) => (txt) => conColor ? `\x1b[${t[k]}m${txt}\x1b[0m` : String(txt) });
const leer = p => readFileSync(join(raiz, p), 'utf8');

const foto = JSON.parse(leer('design-system/figma-snapshot.json'));
const mapa = JSON.parse(leer('design-system/figma-map.json'));

// ── Leer los tokens del CSS ────────────────────────────────────────────────
// Resuelve var(--x) en cadena para poder comparar valores finales con Figma.
const cssCrudo = ['colors', 'semantic-colors', 'tokens', 'typography']
  .map(f => leer(`design-system/tokens/${f}.css`)).join('\n');

const declarados = {};
for (const [, nombre, valor] of cssCrudo.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
  declarados[nombre] = valor.trim();
}
function resolver(valor, prof = 0) {
  if (prof > 8 || typeof valor !== 'string') return valor;
  const m = valor.match(/^var\((--[a-z0-9-]+)\)$/);
  if (!m) return valor;
  const dentro = declarados[m[1]];
  return dentro === undefined ? valor : resolver(dentro, prof + 1);
}
const tokens = Object.fromEntries(
  Object.entries(declarados).map(([k, v]) => [k, resolver(v)])
);

// ── Normalizar valores para poder compararlos ──────────────────────────────
function norm(v) {
  if (v === undefined || v === null) return null;
  let s = String(v).trim().toLowerCase();
  s = s.replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/, '#$1$1$2$2$3$3');   // #abc → #aabbcc
  s = s.replace(/\s*\/\s*/, '/');                                          // #fff / 0.05
  s = s.replace(/px$/, '');
  const rgba = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgba) {
    const [, r, g, b, a] = rgba;
    const hex = '#' + [r, g, b].map(n => (+n).toString(16).padStart(2, '0')).join('');
    return a !== undefined && +a < 1 ? `${hex}/${(+a).toFixed(2)}` : hex;
  }
  return s;
}
const igual = (a, b) => norm(a) === norm(b);


// ── 0 · Qué cambió en Figma desde la última foto guardada en git ───────────
// Sin declarar nada en ninguna parte: la foto anterior ya dice qué había.
// Es lo que caza el trabajo de otra persona — variantes nuevas incluidas.
const cambiosFigma = [];
let fotoAnterior = null;
try {
  fotoAnterior = JSON.parse(execSync(
    'git show HEAD:design-system/figma-snapshot.json',
    { cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  ));
} catch { /* primera vez, o sin git */ }

function comparar(antes, ahora, ruta = []) {
  const donde = ruta.join(' › ');
  if (Array.isArray(antes) || Array.isArray(ahora)) {
    const a = (antes || []).join(', '), b = (ahora || []).join(', ');
    if (a !== b) cambiosFigma.push(`${donde}\n      antes  ${a || '—'}\n      ahora  ${b || '—'}`);
    return;
  }
  const objeto = v => v && typeof v === 'object';
  if (objeto(antes) && objeto(ahora)) {
    for (const k of new Set([...Object.keys(antes), ...Object.keys(ahora)])) {
      if (k.startsWith('_')) continue;
      if (!(k in antes))  { cambiosFigma.push(`${[...ruta, k].join(' › ')}  ← NUEVO`); continue; }
      if (!(k in ahora))  { cambiosFigma.push(`${[...ruta, k].join(' › ')}  ← YA NO ESTÁ`); continue; }
      comparar(antes[k], ahora[k], [...ruta, k]);
    }
    return;
  }
  if (String(antes) !== String(ahora))
    cambiosFigma.push(`${donde}\n      antes  ${antes}\n      ahora  ${ahora}`);
}
if (fotoAnterior) {
  for (const seccion of ['variables', 'estilosDeTexto', 'estilosDeEfecto', 'componentes'])
    comparar(fotoAnterior[seccion] || {}, foto[seccion] || {}, [seccion]);
}

// ── Recolectar hallazgos ───────────────────────────────────────────────────
const distinto = [], faltaCodigo = [], sinMapear = [], sobraCodigo = [], info = [];

// 1 · Colores semánticos, por el mapa de nombres
const sem = foto.variables['Semantic Colors'] || {};
const excusadosFigma = { ...mapa.sinEquivalenteEnCodigo };
for (const [nombreFigma, valorFigma] of Object.entries(sem)) {
  const varCss = mapa.colores[nombreFigma];
  if (!varCss) {
    if (!excusadosFigma[nombreFigma]) sinMapear.push(`color · ${nombreFigma} = ${valorFigma}`);
    continue;
  }
  if (!(varCss in tokens)) { faltaCodigo.push(`${nombreFigma} → ${varCss} (no existe)`); continue; }
  if (!igual(valorFigma, tokens[varCss]))
    distinto.push(`${nombreFigma}\n      Figma  ${valorFigma}\n      código ${tokens[varCss]}  (${varCss})`);
}

// 2 · Radios, tamaños e interlineados: se emparejan por regla
const porRegla = [
  ['Border Radius',     n => `--${n}`],
  ['Global Typography', n => n.startsWith('Font Size/')   ? `--font-size-${n.split('/')[1]}`
                            : n.startsWith('Line Height/') ? `--line-height-${n.split('/')[1]}`
                            : null],
];
for (const [coleccion, aCss] of porRegla) {
  for (const [nombre, valor] of Object.entries(foto.variables[coleccion] || {})) {
    const varCss = aCss(nombre);
    if (!varCss) continue;
    if (!(varCss in tokens)) { faltaCodigo.push(`${nombre} → ${varCss} (no existe)`); continue; }
    if (!igual(valor, tokens[varCss]))
      distinto.push(`${nombre}\n      Figma  ${valor}\n      código ${tokens[varCss]}  (${varCss})`);
  }
}

// 3 · Estilos de efecto
const sombras = leer('design-system/tokens/tokens.css');
for (const [nombreFigma, capas] of Object.entries(foto.estilosDeEfecto || {})) {
  const varCss = mapa.efectos[nombreFigma];
  if (!varCss) { sinMapear.push(`efecto · ${nombreFigma}`); continue; }
  if (!sombras.includes(varCss)) faltaCodigo.push(`${nombreFigma} → ${varCss} (no existe)`);
}

// 4 · Estilos de texto
const clases = leer('design-system/tokens/text-styles.css');
for (const nombreFigma of Object.keys(foto.estilosDeTexto || {})) {
  const clase = mapa.estilosDeTexto[nombreFigma];
  if (!clase) { sinMapear.push(`texto · ${nombreFigma}`); continue; }
  if (!clases.includes(`.${clase}`)) faltaCodigo.push(`${nombreFigma} → .${clase} (no existe)`);
}

// 5 · Componentes
const carpeta = join(raiz, 'design-system/components');
const enCodigo = new Set(
  existsSync(carpeta) ? readdirSync(carpeta, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name) : []
);
const excusadosComp = { ...mapa.componentesSoloEnFigma };
for (const nombreFigma of Object.keys(foto.componentes || {})) {
  const comp = mapa.componentes[nombreFigma];
  if (!comp) {
    if (!excusadosComp[nombreFigma]) sinMapear.push(`componente · ${nombreFigma}  ← NUEVO EN FIGMA`);
    continue;
  }
  if (!enCodigo.has(comp)) faltaCodigo.push(`${nombreFigma} → ${comp}/ (carpeta no existe)`);
}
const mapeados = new Set(Object.values(mapa.componentes));
const excusadosCodigo = new Set(Object.keys(mapa.componentesSoloEnCodigo));
for (const comp of enCodigo)
  if (!mapeados.has(comp) && !excusadosCodigo.has(comp))
    sobraCodigo.push(`${comp}/  (en código, sin pareja en Figma ni excusa en el mapa)`);

// ── ¿Está abierto el puente con Figma? ────────────────────────────────────
// Solo para poder decirte si puedes hacer algo al respecto. El comando no
// habla con él: ese canal es interno de la herramienta y no está documentado.
async function puenteAbierto() {
  for (const puerto of [9225, 9223, 9224, 9226, 9227]) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 300);
      const r = await fetch(`http://localhost:${puerto}/health`, { signal: ctrl.signal });
      clearTimeout(t);
      if (r.ok) { const j = await r.json(); return (j.connectedClients ?? j.clients ?? 0) > 0; }
    } catch { /* ese puerto no */ }
  }
  return false;
}

// ── Informe ────────────────────────────────────────────────────────────────
const dias = Math.round((Date.now() - new Date(foto.generado)) / 86400000);
const bloque = (titulo, items, pista, color) => {
  if (!items.length) return;
  info.push(`\n  ${color(titulo)}`);
  if (pista) info.push(`  ${C.gris(pista)}`);
  items.forEach(i => info.push(`    ${color('·')} ${i}`));
};

console.log(`\n  ${C.fuerte('Design System')} ${C.gris('· Figma ↔ código')}`);

const edad = dias <= 0 ? C.verde('hoy')
           : dias <= 7 ? C.gris(`hace ${dias} d`)
           : C.ambar(`📸 hace ${dias} días`);
console.log(`  Foto de Figma: ${foto.generado}  ${edad}`);

if (dias > 3) {
  const abierto = await puenteAbierto();
  console.log(abierto
    ? `  ${C.azul('El Desktop Bridge está abierto')} ${C.gris('→ pídele a Claude que saque la foto del DS')}`
    : `  ${C.gris('Para regenerarla: abre el Desktop Bridge en Figma y pídesela a Claude')}`);
}

bloque('CAMBIÓ EN FIGMA', cambiosFigma,
  'Lo que alguien tocó desde la última foto guardada. Incluye variantes nuevas.', C.azul);
bloque('NO COINCIDEN', distinto,
  'Un valor cambió en un lado y no en el otro.', C.rojo);
bloque('FALTAN EN CÓDIGO', faltaCodigo,
  'Están en Figma y no tienen equivalente programado.', C.rojo);
bloque('SIN MAPEAR', sinMapear,
  'Nuevos en Figma. Añádelos a figma-map.json o márcalos como sin equivalente.', C.ambar);
bloque('SOBRAN EN CÓDIGO', sobraCodigo,
  'Existen en el repo y no están en Figma ni justificados.', C.ambar);

const total = cambiosFigma.length + distinto.length + faltaCodigo.length + sinMapear.length + sobraCodigo.length;
if (total === 0) {
  // Una foto vieja no da derecho a decir que todo cuadra: la comparación sería
  // contra un pasado. Es el fallo silencioso más fácil de cometer aquí.
  console.log(dias > 7
    ? `\n  ${C.ambar('📸 Nada que reportar')} ${C.gris(`— pero la foto es de hace ${dias} días, así que esto no prueba gran cosa.`)}\n`
    : `\n  ${C.verde('✅ Todo cuadra.')}\n`);
} else {
  console.log(info.join('\n'));
  const urgentes = distinto.length + faltaCodigo.length;
  console.log(`\n  ${C.fuerte(total)} cosa${total === 1 ? '' : 's'} que mirar${urgentes ? C.rojo(`, ${urgentes} desalineada${urgentes === 1 ? '' : 's'}`) : ''}.\n`);
}

process.exit(0);
