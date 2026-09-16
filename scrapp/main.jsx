import { createRoot } from 'react-dom/client';
import { useState, useRef, useEffect } from 'react';

// Shared foundations
import '../design-system/tokens/fonts.css';
import '../design-system/tokens/colors.css';
import '../design-system/tokens/semantic-colors.css';
import '../design-system/tokens/tokens.css';

// Scrapp-specific tokens (overrides web typography scale)
import './tokens/typography.css';

import ExplorationsApp from './ExplorationsApp';
import FlowRunner from './flow/FlowRunner';
import FlowRunnerV2 from './flow/FlowRunnerV2';

const EXPLORATIONS = [
  { id: 1, label: 'Exploration 1' },
  { id: 2, label: 'Exploration 2' },
  { id: 4, label: 'Exploration 4' },
  { id: 5, label: 'Exploration 5' },
];

const FLOWS = [
  { id: 'end-user',    label: 'End user' },
  { id: 'end-user-v2', label: 'End user (v2)' },
];

function App() {
  const [mode, setMode]               = useState('explorations'); // 'explorations' | 'flows'
  const [exploration, setExploration] = useState(1);
  const [flowId, setFlowId]           = useState('end-user');
  const [menuOpen, setMenuOpen]       = useState(false);
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

  const items    = mode === 'explorations' ? EXPLORATIONS : FLOWS;
  const activeId = mode === 'explorations' ? exploration : flowId;

  function selectItem(id) {
    if (mode === 'explorations') setExploration(id);
    else setFlowId(id);
    setMenuOpen(false);
  }

  return (
    <>
      {mode === 'explorations'
        ? <ExplorationsApp exploration={exploration} />
        : flowId === 'end-user-v2' ? <FlowRunnerV2 /> : <FlowRunner />}

      {/* Mode + item switcher — top left */}
      <div ref={menuRef} style={{ position: 'fixed', top: 20, left: 20, zIndex: 100 }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
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
            minWidth: 200,
            backdropFilter: 'blur(12px)',
          }}>
            {/* Tabs: Explorations | Flows */}
            <div style={{ display: 'flex', gap: 4, padding: 4, marginBottom: 4 }}>
              {[['explorations', 'Explorations'], ['flows', 'Flows']].map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: '7px 0',
                    background: mode === m ? 'rgba(255,255,255,0.10)' : 'transparent',
                    color: mode === m ? 'white' : 'rgba(255,255,255,0.45)',
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 600,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px 4px' }} />

            {items.map(item => (
              <button
                key={item.id}
                onClick={() => selectItem(item.id)}
                style={{
                  width: '100%', padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${activeId === item.id ? '#00D8CC' : 'rgba(255,255,255,0.25)'}`,
                  background: activeId === item.id ? '#00D8CC' : 'transparent',
                  boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {activeId === item.id && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0b0f12' }} />
                  )}
                </span>
                <span style={{
                  fontFamily: 'var(--font-family-primary)', fontSize: 14,
                  color: activeId === item.id ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: activeId === item.id ? 500 : 400,
                }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
