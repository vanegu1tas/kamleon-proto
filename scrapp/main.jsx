import { createRoot } from 'react-dom/client';
import { useState, useRef, useEffect } from 'react';

// Shared foundations
import '../design-system/tokens/fonts.css';
import '../design-system/tokens/colors.css';
import '../design-system/tokens/semantic-colors.css';
import '../design-system/tokens/tokens.css';

// Scrapp-specific tokens (overrides web typography scale)
import './tokens/typography.css';

import DeviceFrame from './components/DeviceFrame';
import Exploration1, { scoreToAngle, GAUGE_START, getZoneIndex } from './screens/Exploration1';
import Exploration2, { scoreToX as scoreToXE2, BAR_X as E2_BAR_X } from './screens/Exploration2';
import Exploration4, { scoreToRotation4, ROTATION_START as E4_ROT_START } from './screens/Exploration4';
import Exploration5, { scoreToAngle5, getZoneIndex5 } from './screens/Exploration5';

const EXPLORATIONS = [
  { id: 1, label: 'Exploration 1' },
  { id: 2, label: 'Exploration 2' },
  { id: 4, label: 'Exploration 4' },
  { id: 5, label: 'Exploration 5' },
];

function App() {
  const [exploration, setExploration] = useState(1);
  const [menuOpen, setMenuOpen]       = useState(false);
  const menuRef = useRef(null);
  const [targetScore, setTargetScore] = useState(75);
  const [displayScore, setDisplayScore] = useState(0);
  const [animAngle, setAnimAngle]     = useState(null);
  const [animX, setAnimX]             = useState(null);
  const [animRot4, setAnimRot4]       = useState(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [glowZoneIdx, setGlowZoneIdx] = useState(null);
  const [pointerStyle, setPointerStyle] = useState('puck');
  const [textStage, setTextStage]     = useState(null); // null | 'you-are' | 'full'
  const [coloredText, setColoredText]   = useState(true);
  const [textLayout, setTextLayout]     = useState('sequential');
  const [zoneShape, setZoneShape]       = useState('default');
  const [timerStyle, setTimerStyle]     = useState('default');
  const [breathe, setBreathe]           = useState(true);
  const rafRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  function play() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const targetAngle = exploration === 5 ? scoreToAngle5(targetScore) : scoreToAngle(targetScore);
    const targetX     = scoreToXE2(targetScore);
    const targetRot4  = scoreToRotation4(targetScore);
    const duration    = 2200;

    setDisplayScore(0);
    setAnimAngle(GAUGE_START);
    setAnimX(E2_BAR_X);
    setAnimRot4(E4_ROT_START);
    setGlowZoneIdx(null);
    setTextStage(null);
    setIsPlaying(true);

    const targetZoneIdx = exploration === 5 ? getZoneIndex5(targetScore) : getZoneIndex(targetScore);
    let glowTriggered = false;

    setTimeout(() => {
      const t0 = performance.now();

      function step(now) {
        const p    = Math.min((now - t0) / duration, 1);
        const ease = Math.sin(p * Math.PI / 2);
        setAnimAngle(GAUGE_START + ease * (targetAngle - GAUGE_START));
        setAnimX(E2_BAR_X + ease * (targetX - E2_BAR_X));
        setAnimRot4(E4_ROT_START + ease * (targetRot4 - E4_ROT_START));
        setDisplayScore(Math.round(ease * targetScore));

        if (!glowTriggered && p >= 0.85) {
          glowTriggered = true;
          setGlowZoneIdx(targetZoneIdx);
          if (exploration === 1 || exploration === 5) {
            setTextStage('you-are');
            setTimeout(() => setTextStage('full'), 250);
          }
        }

        if (p < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setAnimAngle(targetAngle);
          setAnimX(targetX);
          setAnimRot4(targetRot4);
          setDisplayScore(targetScore);
          setIsPlaying(false);
          if (exploration === 2 || exploration === 4) {
            setTimeout(() => setTextStage('full'), 400);
          }
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }, 300);
  }

  function handleSlider(e) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(false);
    setTargetScore(Number(e.target.value));
    setDisplayScore(0);
    setAnimAngle(null);
    setAnimX(null);
    setAnimRot4(null);
    setGlowZoneIdx(null);
    setTextStage(null);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#070a0d' }}>
      <DeviceFrame>
        {exploration === 1 && <Exploration1 score={displayScore} animAngle={animAngle} glowZoneIdx={glowZoneIdx} textStage={textStage} />}
        {exploration === 2 && <Exploration2 score={displayScore} animX={animX} glowZoneIdx={glowZoneIdx} textStage={textStage} />}
        {exploration === 4 && <Exploration4 score={displayScore} animRot={animRot4} glowZoneIdx={glowZoneIdx} textStage={textStage} pointerStyle={pointerStyle} />}
        {exploration === 5 && <Exploration5 score={displayScore} animAngle={animAngle} glowZoneIdx={glowZoneIdx} textStage={textStage} coloredText={coloredText} textLayout={textLayout} zoneShape={zoneShape} timerStyle={timerStyle} breathe={breathe} />}
      </DeviceFrame>

      {/* Exploration switcher — top left */}
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
            padding: '8px 0',
            minWidth: 180,
            backdropFilter: 'blur(12px)',
          }}>
            {EXPLORATIONS.map(exp => (
              <button
                key={exp.id}
                onClick={() => {
                  if (rafRef.current) cancelAnimationFrame(rafRef.current);
                  setExploration(exp.id);
                  setMenuOpen(false);
                  setIsPlaying(false);
                  setDisplayScore(0);
                  setAnimAngle(null);
                  setAnimX(null);
                  setAnimRot4(null);
                  setGlowZoneIdx(null);
                  setTextStage(null);
                }}
                style={{
                  width: '100%', padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${exploration === exp.id ? '#00D8CC' : 'rgba(255,255,255,0.25)'}`,
                  background: exploration === exp.id ? '#00D8CC' : 'transparent',
                  boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {exploration === exp.id && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0b0f12' }} />
                  )}
                </span>
                <span style={{
                  fontFamily: 'var(--font-family-primary)', fontSize: 14,
                  color: exploration === exp.id ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: exploration === exp.id ? 500 : 400,
                }}>
                  {exp.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating control panel */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 14,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        backdropFilter: 'blur(12px)',
        minWidth: 220,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-family-primary)', fontSize: 12 }}>Target score</span>
          <span style={{ color: '#00D8CC', fontFamily: 'var(--font-family-primary)', fontSize: 16, fontWeight: 600 }}>
            {targetScore}%
          </span>
        </div>
        <input
          type="range" min={0} max={100} value={targetScore}
          onChange={handleSlider}
          style={{ width: '100%', accentColor: '#00D8CC', cursor: 'pointer' }}
        />
        {exploration === 4 && (
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-family-primary)', fontSize: 12, marginBottom: 8 }}>
              Pointer style
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['puck', 'Rectangle'], ['triangle', 'Triangle']].map(([s, label]) => (
                <button key={s} onClick={() => setPointerStyle(s)} style={{
                  flex: 1, padding: '7px 0',
                  background: pointerStyle === s ? 'white' : 'rgba(255,255,255,0.08)',
                  color: pointerStyle === s ? '#0b0f12' : 'rgba(255,255,255,0.5)',
                  border: 'none', borderRadius: 7, cursor: 'pointer',
                  fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 500,
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {exploration === 5 && (
          <>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-family-primary)', fontSize: 12, marginBottom: 8 }}>
                Text color
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['color', 'Color'], ['white', 'White']].map(([s, label]) => (
                  <button key={s} onClick={() => setColoredText(s === 'color')} style={{
                    flex: 1, padding: '7px 0',
                    background: (s === 'color') === coloredText ? 'white' : 'rgba(255,255,255,0.08)',
                    color: (s === 'color') === coloredText ? '#0b0f12' : 'rgba(255,255,255,0.5)',
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 500,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-family-primary)', fontSize: 12, marginBottom: 8 }}>
                Text layout
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['sequential', 'Sequential'], ['stacked', 'Stacked']].map(([s, label]) => (
                  <button key={s} onClick={() => setTextLayout(s)} style={{
                    flex: 1, padding: '7px 0',
                    background: textLayout === s ? 'white' : 'rgba(255,255,255,0.08)',
                    color: textLayout === s ? '#0b0f12' : 'rgba(255,255,255,0.5)',
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 500,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-family-primary)', fontSize: 12, marginBottom: 8 }}>
                Zone style
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['default', 'Option A'], ['round', 'Option B']].map(([s, label]) => (
                  <button key={s} onClick={() => setZoneShape(s)} style={{
                    flex: 1, padding: '7px 0',
                    background: zoneShape === s ? 'white' : 'rgba(255,255,255,0.08)',
                    color: zoneShape === s ? '#0b0f12' : 'rgba(255,255,255,0.5)',
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 500,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-family-primary)', fontSize: 12, marginBottom: 8 }}>
                Breathe
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['on', 'On'], ['off', 'Off']].map(([s, label]) => (
                  <button key={s} onClick={() => setBreathe(s === 'on')} style={{
                    flex: 1, padding: '7px 0',
                    background: (s === 'on') === breathe ? 'white' : 'rgba(255,255,255,0.08)',
                    color: (s === 'on') === breathe ? '#0b0f12' : 'rgba(255,255,255,0.5)',
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 500,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-family-primary)', fontSize: 12, marginBottom: 8 }}>
                Timer style
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['default', 'Timer A'], ['alt', 'Timer B']].map(([s, label]) => (
                  <button key={s} onClick={() => setTimerStyle(s)} style={{
                    flex: 1, padding: '7px 0',
                    background: timerStyle === s ? 'white' : 'rgba(255,255,255,0.08)',
                    color: timerStyle === s ? '#0b0f12' : 'rgba(255,255,255,0.5)',
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 500,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={play}
          disabled={isPlaying}
          style={{
            background: isPlaying ? 'rgba(255,255,255,0.08)' : 'white',
            color: '#0b0f12',
            border: 'none',
            borderRadius: 8,
            padding: '9px 0',
            fontFamily: 'var(--font-family-primary)',
            fontSize: 14,
            fontWeight: 600,
            cursor: isPlaying ? 'default' : 'pointer',
            opacity: isPlaying ? 0.5 : 1,
            transition: 'opacity 0.2s',
            width: '100%',
          }}
        >
          {isPlaying ? 'Playing…' : '▶  Play'}
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
