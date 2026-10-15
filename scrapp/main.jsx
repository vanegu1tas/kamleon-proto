import { createRoot } from 'react-dom/client';
import { useState, useRef, useEffect } from 'react';

// Shared foundations
import '../design-system/tokens/fonts.css';
import '../design-system/tokens/colors.css';
import '../design-system/tokens/semantic-colors.css';
import '../design-system/tokens/tokens.css';

// Scrapp-specific tokens (overrides web typography scale)
import './tokens/typography.css';

import Hub, { Section } from './hub/Hub';
import { findEntry, findSection } from './hub/entries';

// Rutas por hash para que funcione igual en local y en GitHub Pages:
//   #/                      → índice del microsite
//   #/<sección>             → cards de esa sección (production | tasks)
//   #/<entrada>/<item>      → un flujo o una exploración (ver hub/entries.jsx)
function parseHash() {
  const [entryId, itemId] = window.location.hash.replace(/^#\/?/, '').split('/');
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

  const section = entryId ? findSection(entryId) : null;
  if (section) return <Section section={section} />;

  const found = entryId ? findEntry(entryId) : null;
  const item  = found?.entry.items?.find(i => i.id === itemId) ?? found?.entry.items?.[0];
  if (!found || !item) return <Hub />;

  // key: al cambiar de item el flujo arranca de cero, no hereda el estado del anterior
  return <Viewer key={`${found.entry.id}/${item.id}`} section={found.section} entry={found.entry} item={item} />;
}

function Viewer({ section, entry, item }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {item.render()}

      {/* Menú del visor — arriba a la izquierda: volver al índice y cambiar de item */}
      <div ref={menuRef} style={{ position: 'fixed', top: 20, left: 20, zIndex: 100 }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          style={{
            width: 40, height: 40,
            background: menuOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect y="0"  width="18" height="2" rx="1" fill="rgba(255,255,255,0.7)" />
            <rect y="6"  width="18" height="2" rx="1" fill="rgba(255,255,255,0.7)" />
            <rect y="12" width="18" height="2" rx="1" fill="rgba(255,255,255,0.7)" />
          </svg>
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', top: 48, left: 0,
            background: 'rgba(18,22,28,0.92)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: '8px',
            minWidth: 220,
            backdropFilter: 'blur(12px)',
          }}>
            <a
              href={`#/${section.id}`}
              style={{
                display: 'block', padding: '8px 12px',
                fontFamily: 'var(--font-family-primary)', fontSize: 13, fontWeight: 500,
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
              }}
            >
              ← {section.title}
            </a>

            <div style={{
              padding: '8px 12px 4px',
              fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              {entry.title}
            </div>

            {entry.items.map(i => {
              const active = i.id === item.id;
              return (
                <a
                  key={i.id}
                  href={`#/${entry.id}/${i.id}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                    display: 'flex', alignItems: 'center', gap: 12,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${active ? '#00D8CC' : 'rgba(255,255,255,0.25)'}`,
                    background: active ? '#00D8CC' : 'transparent',
                    boxSizing: 'border-box',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0b0f12' }} />
                    )}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-family-primary)', fontSize: 14,
                    color: active ? 'white' : 'rgba(255,255,255,0.5)',
                    fontWeight: active ? 500 : 400,
                  }}>
                    {i.label}
                  </span>
                  {i.author && (
                    <span style={{
                      marginLeft: 'auto',
                      fontFamily: 'var(--font-family-primary)', fontSize: 12,
                      color: 'rgba(255,255,255,0.35)',
                    }}>
                      {i.author}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
