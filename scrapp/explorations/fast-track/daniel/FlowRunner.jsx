import { useState, useRef, useEffect, useCallback } from 'react';
import DeviceFrame from '../../../components/DeviceFrame';
import RosterScreen from './screens/RosterScreen';
import ReadyScreen from './screens/ReadyScreen';
import TrackingScreen from './screens/TrackingScreen';
import FlushScreen from './screens/FlushScreen';
import Exploration5, { scoreToAngle5, getZoneIndex5, GAUGE_START } from '../../../screens/Exploration5';
import { ROSTERS, STAFF_MEMBER, PAGE_SIZES } from './data/rosters';

const TRACKING_DURATION = 3000; // demo: análisis simulado
const FLUSH_DURATION    = 4000; // demo: "a minute" real acortado para probar

// Fast Track · exploración de Daniel. Arrancó el 15/10 como copia del flujo actual
// (flow/FlowRunner.jsx + screens/flow/); lo que cambie en esta carpeta no afecta a "Flujo actual".
//
// Flujo: Plantilla → Ready → análisis → score → flush → Plantilla. Sin elegir equipo ni PIN
// (los equipos pro no lo usan). Tocar el QR cuenta como escanearlo y lleva a Ready con un staff.
// RFID e invitado no se simulan aquí: en esta exploración solo importa la plantilla.
//
// qrMode: 'corner' (QR fijo en la esquina) | 'tab' (Staff como pestaña). Ver RosterScreen.
const panelLabel = { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4 };

function optionStyle(active) {
  return {
    padding: '7px 12px', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
    fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
    background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
    color: active ? 'white' : 'rgba(255,255,255,0.55)',
  };
}

export default function FastTrackFlow({ qrMode = 'corner' }) {
  const [rosterKey, setRosterKey] = useState('nfl');
  const [pageSize, setPageSize]   = useState(20);
  const players = ROSTERS[rosterKey].players;

  const [step, setStep]     = useState('roster');
  const [person, setPerson] = useState(null);

  const [displayScore, setDisplayScore] = useState(0);
  const [animAngle, setAnimAngle]       = useState(null);
  const [glowZoneIdx, setGlowZoneIdx]   = useState(null);
  const [textStage, setTextStage]       = useState(null);
  const rafRef = useRef(null);

  const handleScoreTimeout = useCallback(() => setStep('flush'), []);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStep('roster');
    setPerson(null);
    setDisplayScore(0);
    setAnimAngle(null);
    setGlowZoneIdx(null);
    setTextStage(null);
  }, []);

  function ready(p) {
    setPerson(p);
    setStep('ready');
  }

  function playScore() {
    const targetScore = Math.floor(Math.random() * 101);
    const targetAngle = scoreToAngle5(targetScore);
    const targetZoneIdx = getZoneIndex5(targetScore);
    const duration = 2200;

    setDisplayScore(0);
    setAnimAngle(GAUGE_START);
    setGlowZoneIdx(null);
    setTextStage(null);

    let glowTriggered = false;
    setTimeout(() => {
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / duration, 1);
        const ease = Math.sin(p * Math.PI / 2);
        setAnimAngle(GAUGE_START + ease * (targetAngle - GAUGE_START));
        setDisplayScore(Math.round(ease * targetScore));

        if (!glowTriggered && p >= 0.85) {
          glowTriggered = true;
          setGlowZoneIdx(targetZoneIdx);
          setTextStage('you-are');
          setTimeout(() => setTextStage('full'), 250);
        }

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setAnimAngle(targetAngle);
          setDisplayScore(targetScore);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 300);
  }

  // Tracking → Score (auto, simula el tiempo de análisis)
  useEffect(() => {
    if (step === 'tracking') {
      const t = setTimeout(() => {
        setStep('score');
        playScore();
      }, TRACKING_DURATION);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Flush → Plantilla (auto)
  useEffect(() => {
    if (step === 'flush') {
      const t = setTimeout(reset, FLUSH_DURATION);
      return () => clearTimeout(t);
    }
  }, [step, reset]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  let screen;
  switch (step) {
    case 'roster':
      screen = (
        <RosterScreen
          key={`${rosterKey}-${pageSize}`}
          players={players}
          pageSize={pageSize}
          qrMode={qrMode}
          onSelect={ready}
          onScanQr={() => ready(STAFF_MEMBER)}
        />
      );
      break;
    case 'ready':
      screen = <ReadyScreen person={person} onNotYou={reset} onSimulateFlow={() => setStep('tracking')} />;
      break;
    case 'tracking':
      screen = <TrackingScreen />;
      break;
    case 'score':
      screen = (
        <Exploration5
          score={displayScore}
          animAngle={animAngle}
          glowZoneIdx={glowZoneIdx}
          textStage={textStage}
          onTimeout={handleScoreTimeout}
        />
      );
      break;
    case 'flush':
      screen = <FlushScreen />;
      break;
    default:
      screen = null;
  }

  return (
    <>
      <DeviceFrame>{screen}</DeviceFrame>

      {/* Control de la demo (fuera de la pantalla): qué plantilla y cuántos por página */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 100,
        display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 14px',
        background: 'rgba(18,22,28,0.92)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12,
        fontFamily: 'var(--font-family-primary)',
      }}>
        <span style={panelLabel}>Plantilla de prueba</span>
        {Object.entries(ROSTERS).map(([key, r]) => (
          <button key={key} onClick={() => { setRosterKey(key); reset(); }} style={optionStyle(rosterKey === key)}>
            {r.label}
          </button>
        ))}

        <span style={{ ...panelLabel, marginTop: 10 }}>Por página</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {PAGE_SIZES.map(n => (
            <button key={n} onClick={() => { setPageSize(n); reset(); }} style={{ ...optionStyle(pageSize === n), flex: 1, textAlign: 'center' }}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
