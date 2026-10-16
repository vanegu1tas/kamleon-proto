import { useState, useRef, useEffect, useCallback } from 'react';
import DeviceFrame from '../../../../components/DeviceFrame';
import RosterScreen from './RosterScreen';
import ReadyScreen from './ReadyScreen';
import TeamBackground from './TeamBackground';
import TrackingScreen from '../screens/TrackingScreen';
import FlushScreen from '../screens/FlushScreen';
import Exploration5, { scoreToAngle5, getZoneIndex5, GAUGE_START } from '../../../../screens/Exploration5';
import { ROSTERS, STAFF_MEMBER, PAGE_SIZES } from '../data/rosters';
import { TEAMS, ACCENTS } from './theme';
import styles from './FlowRunner.module.css';

const TRACKING_DURATION = 3000;
const FLUSH_DURATION    = 4000;
const LEAVE_MS          = 420;   // T3: cuánto sigue la plantilla debajo mientras la foto vuela

// Fast Track · versión pulida (16/10). Parte de la exploración 4 "Pestañas + Staff arriba" y le
// suma el tema del equipo y las transiciones T1–T6 (lista en docs/scrapp/fast-track.md).
// Las otras exploraciones se quedan como estaban, de referencia.

const QUERY   = new URLSearchParams(window.location.search);
const CAPTURE = QUERY.has('capture');

export default function FastTrackPolished() {
  const [rosterKey, setRosterKey] = useState(ROSTERS[QUERY.get('roster')] ? QUERY.get('roster') : 'nfl');
  const [pageSize, setPageSize]   = useState(QUERY.get('page') === '30' ? 30 : 20);
  const [denseCols, setDenseCols] = useState(QUERY.get('cols') === '6' ? 6 : 8);
  const [teamKey, setTeamKey]     = useState(TEAMS[QUERY.get('team')] ? QUERY.get('team') : 'dallas');
  const [accentKey, setAccentKey] = useState(QUERY.get('accent') === 'white' ? 'white' : 'kamleon');
  const players = ROSTERS[rosterKey].players;

  // step: dónde estamos · rosterPhase: qué transición hace la plantilla
  const [step, setStep]               = useState('roster');
  const [rosterPhase, setRosterPhase] = useState('enter');   // enter | idle | leaving | returning
  const [tab, setTab]                 = useState(0);           // se conserva al ir y volver de Ready
  const [person, setPerson]           = useState(null);
  const [from, setFrom]               = useState(null);
  const [showRosterBehind, setShowRosterBehind] = useState(false);
  const readyRef = useRef(null);

  const [displayScore, setDisplayScore] = useState(0);
  const [animAngle, setAnimAngle]       = useState(null);
  const [glowZoneIdx, setGlowZoneIdx]   = useState(null);
  const [textStage, setTextStage]       = useState(null);
  const rafRef = useRef(null);

  // T1 dura ~0,6 s con la cascada; después la plantilla queda quieta
  useEffect(() => {
    if (rosterPhase !== 'enter' && rosterPhase !== 'returning') return;
    const t = setTimeout(() => setRosterPhase('idle'), rosterPhase === 'enter' ? 650 : 320);
    return () => clearTimeout(t);
  }, [rosterPhase]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStep('roster');
    setRosterPhase('enter');
    setTab(0);
    setPerson(null);
    setFrom(null);
    setShowRosterBehind(false);
    setDisplayScore(0);
    setAnimAngle(null);
    setGlowZoneIdx(null);
    setTextStage(null);
  }, []);

  // T3: tocar una cara → la plantilla se apaga y Ready hace volar la foto
  function ready(p, rect) {
    setPerson(p);
    setFrom(rect);
    setRosterPhase('leaving');
    setShowRosterBehind(true);
    setStep('ready');
    setTimeout(() => setShowRosterBehind(false), LEAVE_MS);
  }

  // T4: "Not you?" o timeout → la foto vuelve a su sitio y la plantilla reaparece
  const notYou = useCallback(() => {
    setRosterPhase('returning');
    setShowRosterBehind(true);
    const done = () => {
      setStep('roster');
      setShowRosterBehind(false);
      setPerson(null);
      setFrom(null);
    };
    if (readyRef.current) readyRef.current.leave(done); else done();
  }, []);

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
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
        else { setAnimAngle(targetAngle); setDisplayScore(targetScore); }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 300);
  }

  useEffect(() => {
    if (step !== 'tracking') return;
    const t = setTimeout(() => { setStep('score'); playScore(); }, TRACKING_DURATION);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 'flush') return;
    const t = setTimeout(reset, FLUSH_DURATION);
    return () => clearTimeout(t);
  }, [step, reset]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const accent = ACCENTS[accentKey];
  const themeVars = { '--accent': accent.value, '--on-accent': accent.onAccent };
  const onTeam = step === 'roster' || step === 'ready';

  const roster = (
    <RosterScreen
      key={`${rosterKey}-${pageSize}`}
      players={players}
      pageSize={pageSize}
      denseCols={denseCols}
      tab={tab}
      onTab={setTab}
      phase={step === 'roster' ? rosterPhase : rosterPhase === 'returning' ? 'returning' : 'leaving'}
      selectedId={step === 'ready' || rosterPhase === 'returning' ? person?.id : null}
      onSelect={ready}
      onScanQr={() => ready(STAFF_MEMBER, null)}
    />
  );

  const screen = (
    <div className={styles.stage} style={themeVars}>
      {/* El fondo del equipo vive debajo de plantilla y Ready, y no se corta entre ellas */}
      <TeamBackground color={TEAMS[teamKey].color} className={`${styles.bg} ${onTeam ? '' : styles.bgHidden}`} />

      {(step === 'roster' || showRosterBehind) && roster}
      {step === 'ready' && (
        <ReadyScreen ref={readyRef} person={person} from={from} onNotYou={notYou} onSimulateFlow={() => setStep('tracking')} />
      )}

      {/* T6: el flujo entra fundiéndose sobre el fondo del equipo */}
      {step === 'tracking' && <div className={styles.fadeIn}><TrackingScreen /></div>}
      {step === 'score' && (
        <div className={styles.fadeIn}>
          <Exploration5 score={displayScore} animAngle={animAngle} glowZoneIdx={glowZoneIdx} textStage={textStage} onTimeout={() => setStep('flush')} />
        </div>
      )}
      {step === 'flush' && <div className={styles.fadeIn}><FlushScreen /></div>}
    </div>
  );

  if (CAPTURE) return screen;

  return (
    <>
      <DeviceFrame>{screen}</DeviceFrame>

      <div className={styles.panel}>
        <Group label="Equipo">
          {Object.entries(TEAMS).map(([k, t]) => (
            <Option key={k} active={teamKey === k} onClick={() => setTeamKey(k)}>
              <span className={styles.swatch} style={{ background: t.color }} />{t.label}
            </Option>
          ))}
        </Group>
        <Group label="Acento" row>
          {Object.entries(ACCENTS).map(([k, a]) => (
            <Option key={k} active={accentKey === k} onClick={() => setAccentKey(k)}>{a.label}</Option>
          ))}
        </Group>
        <Group label="Plantilla de prueba">
          {Object.entries(ROSTERS).map(([k, r]) => (
            <Option key={k} active={rosterKey === k} onClick={() => { setRosterKey(k); reset(); }}>{r.label}</Option>
          ))}
        </Group>
        <Group label="Por página" row>
          {PAGE_SIZES.map(n => (
            <Option key={n} active={pageSize === n} onClick={() => { setPageSize(n); reset(); }}>{n}</Option>
          ))}
        </Group>
        {pageSize === 30 && (
          <Group label="Columnas" row>
            {[6, 8].map(n => <Option key={n} active={denseCols === n} onClick={() => setDenseCols(n)}>{n}</Option>)}
          </Group>
        )}
      </div>
    </>
  );
}

function Group({ label, row, children }) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>{label}</span>
      <div className={row ? styles.row : styles.column}>{children}</div>
    </div>
  );
}

function Option({ active, onClick, children }) {
  return (
    <button className={`${styles.option} ${active ? styles.optionActive : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}
