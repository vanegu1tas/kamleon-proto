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
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
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

// ── Informe ────────────────────────────────────────────────────────────────
const dias = Math.round((Date.now() - new Date(foto.generado)) / 86400000);
const bloque = (titulo, items, pista) => {
  if (!items.length) return;
  info.push(`\n  ${titulo}`);
  if (pista) info.push(`  ${pista}`);
  items.forEach(i => info.push(`    · ${i}`));
};

console.log(`\n  Design System · Figma ↔ código`);
console.log(`  Foto de Figma: ${foto.generado}${dias > 7 ? `  ⚠ hace ${dias} días, pídele a Claude que la regenere` : dias > 0 ? `  (hace ${dias} d)` : '  (hoy)'}`);

bloque('NO COINCIDEN', distinto, 'Alguien cambió un valor en un lado y no en el otro.');
bloque('FALTAN EN CÓDIGO', faltaCodigo, 'Están en Figma y no tienen equivalente programado.');
bloque('SIN MAPEAR', sinMapear, 'Nuevos en Figma. Añádelos a figma-map.json o márcalos como sin equivalente.');
bloque('SOBRAN EN CÓDIGO', sobraCodigo, 'Existen en el repo y no están en Figma ni justificados.');

const total = distinto.length + faltaCodigo.length + sinMapear.length + sobraCodigo.length;
if (total === 0) console.log(`\n  ✓ Todo cuadra.\n`);
else { console.log(info.join('\n')); console.log(`\n  ${total} cosas que mirar.\n`); }

process.exit(0);
