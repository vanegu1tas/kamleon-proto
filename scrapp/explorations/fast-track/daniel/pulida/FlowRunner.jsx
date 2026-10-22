import { useState, useRef, useEffect, useCallback } from 'react';
import DeviceFrame from '../../../../components/DeviceFrame';
import RosterScreen from './RosterScreen';
import ReadyScreen from './ReadyScreen';
import TeamBackground from './TeamBackground';
import TweakPanel from '../../../../components/TweakPanel';
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

// Celda del jugador (16/10, tras la critique): dónde va el dorsal sin quitarle peso a la cara
const CELLS = {
  actual:   'Actual',
  parche:   'A · Parche',
  camiseta: 'B · Camiseta',
};

const QUERY   = new URLSearchParams(window.location.search);
const CAPTURE = QUERY.has('capture');

export default function FastTrackPolished() {
  const [rosterKey, setRosterKey] = useState(ROSTERS[QUERY.get('roster')] ? QUERY.get('roster') : 'nfl');
  const [pageSize, setPageSize]   = useState(QUERY.get('page') === '30' ? 30 : 20);
  const [denseCols, setDenseCols] = useState(QUERY.get('cols') === '6' ? 6 : 8);
  const [teamKey, setTeamKey]     = useState(TEAMS[QUERY.get('team')] ? QUERY.get('team') : 'dallas');
  const [accentKey, setAccentKey] = useState(QUERY.get('accent') === 'white' ? 'white' : 'kamleon');
  const [cellKey, setCellKey]     = useState(CELLS[QUERY.get('cell')] ? QUERY.get('cell') : 'actual');
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
    // 'returning' no se cierra con reloj: lo cierra notYou cuando la foto termina de volver. (Con
    // reloj, a los 320 ms la foto aún volaba —tarda 350— y la plantilla pasaba un instante a
    // 'leaving': se apagaba y volvía a salir, el parpadeo del 17/10.)
    if (rosterPhase !== 'enter') return;
    const t = setTimeout(() => setRosterPhase('idle'), 650);
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
      setRosterPhase('idle');
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
      cell={cellKey}
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
      {/* Un solo logo para plantilla y Ready, fuera de las dos: no se mueve en ninguna transición */}
      {onTeam && <span className={styles.logo}>KAMLEON®</span>}

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

      {/* Mismo panel que Dorsal grande (TweakPanel), con los ajustes de esta exploración */}
      <TweakPanel
        title="Pulida"
        groups={[
          {
            // neutro arriba a fila entera; los equipos debajo, 2 y 2, lisas, con el LED del color del equipo
            id: 'team', label: 'Equipo', value: teamKey, onChange: setTeamKey,
            control: 'keycaps', labelInCap: true, flat: true, keyHeight: 36,
            options: Object.entries(TEAMS).map(([k, t]) => ({
              value: k,
              label: k === 'kamleon' ? 'Neutro' : t.label.replace(' Cowboys', ''),
              led: k === 'kamleon' ? undefined : t.color,
              wide: k === 'kamleon',
            })),
          },
          {
            id: 'accent', label: 'Acento', value: accentKey, onChange: setAccentKey, control: 'keycaps',
            options: Object.entries(ACCENTS).map(([k, a]) => ({ value: k, label: a.label, dot: a.value })),
          },
          {
            id: 'cell', label: 'Celda', value: cellKey, onChange: setCellKey,
            control: 'keycaps', columns: 3, stretch: true,
            options: [
              { value: 'actual',   label: 'Actual',   cap: '—' },
              { value: 'parche',   label: 'Parche',   cap: 'A' },
              { value: 'camiseta', label: 'Camiseta', cap: 'B' },
            ],
          },
          {
            id: 'roster', label: 'Plantilla', value: rosterKey, onChange: k => { setRosterKey(k); reset(); },
            control: 'keycaps', columns: 3,
            options: [
              { value: 'small',    label: 'Small',  cap: ROSTERS.small.players.length },
              { value: 'football', label: 'Medium', cap: ROSTERS.football.players.length },
              { value: 'nfl',      label: 'Big',    cap: ROSTERS.nfl.players.length },
            ],
          },
          {
            id: 'page', label: 'Por página', value: pageSize, onChange: n => { setPageSize(n); reset(); },
            control: 'keycaps', labelInCap: true, slot: true,   // las dos en un mismo hueco, como Celda
            options: PAGE_SIZES.map(n => ({ value: n, label: String(n) })),
          },
          // las columnas solo cambian algo con 30 por página
          ...(pageSize === 30 ? [{
            id: 'cols', label: 'Columnas', value: denseCols, onChange: setDenseCols,
            control: 'keycaps', labelInCap: true,
            options: [6, 8].map(n => ({ value: n, label: String(n) })),
          }] : []),
        ]}
      />
    </>
  );
}
