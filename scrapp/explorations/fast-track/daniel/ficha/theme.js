// Tema por equipo. El equipo solo da su color principal; todo lo demás sale de reglas fijas para que
// funcione con cualquier color:
//   · el fondo es el color del equipo mezclado con negro → siempre oscuro, el texto blanco siempre se lee
//   · superficies, bordes y textos secundarios son blanco translúcido → se tiñen solos del fondo
//   · el Score no lleva el color del equipo (sus zonas rojo/amarillo/verde significan algo)
//
// Colores aproximados de cada club, solo para probar la regla.

// Logo del equipo (22/10, como en Dorsal grande): SVG del club en blanco, usado como máscara
// (FlowRunner.module.css → .teamLogo). Los archivos son los de la 06.
import dallasLogo from '../dorsal/logos/dallas.svg';
import arsenalLogo from '../dorsal/logos/arsenal.svg';

export const TEAMS = {
  kamleon:    { label: 'Kamleon (neutro)', color: '#0b0f12' },
  // plate: la placa del dorsal en la franja "Placa", si no es el color del club (23/10, Daniel: en
  // Dallas blanca con el número en negro)
  dallas:     { label: 'Dallas Cowboys',   color: '#003594', logo: dallasLogo, plate: { bg: '#ffffff', ink: '#000000' } },
  arsenal:    { label: 'Arsenal',          color: '#EF0107', logo: arsenalLogo },
  astonVilla: { label: 'Aston Villa',      color: '#670E36' },
  gilVicente: { label: 'Gil Vicente',      color: '#C8102E' },
};

// Cuánto color del equipo entra en el fondo (el resto es negro). 0.32 deja reconocer el equipo y
// mantiene el contraste del blanco por encima de 7:1 con los cuatro clientes.
export const TEAM_MIX = 0.32;

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => v / 255);
}

// El fondo base (el mismo que verá Qt si no puede con el shader): color del equipo × TEAM_MIX
export function teamBase(hex) {
  return hexToRgb(hex).map(c => c * TEAM_MIX);
}

export function cssRgb([r, g, b]) {
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

export const ACCENTS = {
  kamleon: { label: 'Turquesa', value: 'var(--color-turquoise-51)', onAccent: '#000000' },
  white:   { label: 'Blanco',   value: '#ffffff',                  onAccent: '#000000' },
};
