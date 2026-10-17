import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';

// Shared foundations
import '../design-system/tokens/fonts.css';
import '../design-system/tokens/colors.css';
import '../design-system/tokens/semantic-colors.css';
import '../design-system/tokens/tokens.css';

// Scrapp-specific tokens (overrides web typography scale)
import './tokens/typography.css';

import Hub, { Section } from './hub/Hub';
import { findEntry, findSection } from './hub/entries';
import JourneyMap from './hub/JourneyMap';
import ItemMenu from './components/ItemMenu';

// Rutas por hash para que funcione igual en local y en GitHub Pages:
//   #/                      → índice del microsite
//   #/<sección>             → cards de esa sección (production | tasks)
//   #/journey/<id>          → journey map (ver hub/journeys.js)
//   #/<entrada>/<item>      → un flujo o una exploración (ver hub/entries.jsx)
// ?capture → modo para pasar una pantalla a Figma (generate_figma_design): sin márgenes, con el
// script de captura de Figma, y la ruta en ?route=… porque la captura usa el # de la URL.
const QUERY   = new URLSearchParams(window.location.search);
const CAPTURE = QUERY.has('capture');
if (CAPTURE) {
  Object.assign(document.body.style, { margin: '0', background: '#000' });
  const script = document.createElement('script');
  script.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
  script.async = true;
  document.head.appendChild(script);
}

function parseHash() {
  const route = CAPTURE && QUERY.get('route') ? QUERY.get('route') : window.location.hash.replace(/^#\/?/, '');
  const [entryId, itemId] = route.split('/');
  return { entryId: entryId || null, itemId: itemId || null };
}

function useHashRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

function App() {
  const { entryId, itemId } = useHashRoute();

  if (entryId === 'journey') return <JourneyMap journeyId={itemId} />;

  const section = entryId ? findSection(entryId) : null;
  if (section) return <Section section={section} />;

  const found = entryId ? findEntry(entryId) : null;
  const item  = found?.entry.items?.find(i => i.id === itemId) ?? found?.entry.items?.[0];
  if (!found || !item) return <Hub />;

  // ?capture → solo la pantalla, sin menú ni flechas: para pasarla a Figma (generate_figma_design)
  if (CAPTURE) return item.render();

  // key: al cambiar de item el flujo arranca de cero, no hereda el estado del anterior
  return <Viewer key={`${found.entry.id}/${item.id}`} section={found.section} entry={found.entry} item={item} />;
}

// Flechas para pasar de una exploración a la siguiente dentro de la misma tarea. Van abajo, en el
// borde del dispositivo (no es pantalla): a los lados chocarían con el panel de control de Score.
function ItemArrows({ entry, item }) {
  const index = entry.items.findIndex(i => i.id === item.id);
  const prev  = entry.items[index - 1];
  const next  = entry.items[index + 1];

  useEffect(() => {
    function onKey(e) {
      // sin robar las flechas a un campo o a un slider de la exploración
      if (e.target.closest('input, select, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowLeft'  && prev) window.location.hash = `#/${entry.id}/${prev.id}`;
      if (e.key === 'ArrowRight' && next) window.location.hash = `#/${entry.id}/${next.id}`;
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entry.id, prev, next]);

  if (entry.items.length < 2) return null;

  const arrow = (target, label, glyph) => {
    const style = {
      width: 32, height: 32, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.12)',
      color: target ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
      textDecoration: 'none', fontSize: 16, lineHeight: 1,
      pointerEvents: target ? 'auto' : 'none',
    };
    return target
      ? <a href={`#/${entry.id}/${target.id}`} aria-label={`${label}: ${target.label}`} title={`${target.label} (${glyph === '‹' ? '←' : '→'})`} style={style}>{glyph}</a>
      : <span aria-hidden="true" style={style}>{glyph}</span>;
  };

  return (
    <nav aria-label="Exploraciones" style={{
      position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 12, padding: 4,
      background: 'rgba(18,22,28,0.85)', border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 999, backdropFilter: 'blur(12px)',
    }}>
      {arrow(prev, 'Anterior', '‹')}
      <span style={{
        minWidth: 40, textAlign: 'center',
        fontFamily: 'var(--font-family-primary)', fontSize: 12, fontVariantNumeric: 'tabular-nums',
        color: 'rgba(255,255,255,0.55)',
      }}>
        {index + 1} / {entry.items.length}
      </span>
      {arrow(next, 'Siguiente', '›')}
    </nav>
  );
}

function Viewer({ section, entry, item }) {
  return (
    <>
      {item.render()}
      <ItemArrows entry={entry} item={item} />

      {/* Arriba a la izquierda: volver a la sección (fuera del menú, siempre a la vista) y, debajo,
          el menú para cambiar de item */}
      {/* Mismo botón y mismo sitio que el "‹ Scrapp" de las páginas del índice (Hub.module.css .back) */}
      <a
        href={`#/${section.id}`}
        style={{
          position: 'fixed', top: 20, left: 24, zIndex: 100,
          padding: '8px 12px',
          border: '1px solid #1c2b38',
          borderRadius: 999,
          background: 'rgba(12,16,22,0.6)',
          fontFamily: 'var(--font-family-primary)', fontSize: 13, fontWeight: 500,
          color: '#5a7d96', textDecoration: 'none',
        }}
      >
        ‹ {section.title}
      </a>

      <div style={{ position: 'fixed', top: 72, left: 20, zIndex: 100 }}>
        <ItemMenu entry={entry} item={item} />
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
