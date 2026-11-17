// Copia para el vídeo (13/11) de explorations/fast-track/daniel/dorsal: Dallas por defecto, sin panel de
// ajustes, sin el botón naranja de simulación (sigue ahí, invisible, para poder avanzar) y score fijo en 75.
import { useState, useRef, useEffect, useCallback } from 'react';
import DeviceFrame from '../../../../components/DeviceFrame';
import TouchIndicator from '../TouchIndicator';
import RosterScreen from './RosterScreen';
import ReadyScreen from './ReadyScreen';
import TeamBackground from './TeamBackground';
import TrackingScreen from '../../../fast-track/daniel/screens/TrackingScreen';
import FlushScreen from '../../../fast-track/daniel/screens/FlushScreen';
// El score del vídeo 1 (13/11): solo OPTIMAL RANGE en blanco, Stacked, Option B, Timer B, fondo #101218
import Exploration5, { scoreToAngle5, getZoneIndex5, GAUGE_START } from '../ScoreVideo';
import { ROSTERS, STAFF_MEMBER, teamRoster } from '../../../fast-track/daniel/data/rosters';
import { TEAMS, ACCENTS } from './theme';
import styles from './FlowRunner.module.css';

// Vídeo (13/11): score → Flush (más corto) → vuelve la plantilla; la grabación espera a esta marca, que se pone
// cuando la plantilla ya ha vuelto a entrar
const markDone = () => { document.body.dataset.videoDone = '1'; };
const DONE_AFTER_ROSTER_MS = 1500;
const READY_MS = 3200;          // vídeo: Ready antes del Tracking. 2500 + 700 del viaje del logo de la 08, para que los dos vídeos vayan a la vez (13/11)
const TRACKING_DURATION = 3000;
const FLUSH_DURATION    = 2500;   // vídeo (Daniel, 13/11): más corto (antes 4000)
const LEAVE_MS          = 420;   // T3: cuánto sigue la plantilla debajo mientras la foto vuela

// Fast Track · Dorsal grande (17/10). Copia de la pulida con la celda que Daniel exploró en Figma
// (Scrapp explorations 2029:2815): apellido en arco, dorsal enorme y foto pequeña en su esquina.
// Pensada para 20 por página en 7 columnas, así que no hay selector de página ni de columnas.

// Plantilla de prueba con apellidos largos (17/10), para ver cómo se ajustan al arco
const LONG_NAMES = ['Alexander-Arnold', 'Oxlade-Chamberlain', 'Hernández-Ruiz', 'Lewandowski', 'Smith-Njigba', 'Ward-Prowse'];
const DEMO_ROSTERS = {
  ...ROSTERS,
  long: {
    label: 'Apellidos largos',
    players: ROSTERS.nfl.players.map((p, i) => (i < LONG_NAMES.length ? { ...p, name: `${p.name.split(' ')[0]} ${LONG_NAMES[i]}`, short: LONG_NAMES[i] } : p)),
  },
};

const QUERY   = new URLSearchParams(window.location.search);
const CAPTURE = QUERY.has('capture');

export default function VideoDallasDorsal() {
  const [rosterKey, setRosterKey] = useState(DEMO_ROSTERS[QUERY.get('roster')] ? QUERY.get('roster') : 'nfl');
  const [teamKey, setTeamKey]     = useState(TEAMS[QUERY.get('team')] ? QUERY.get('team') : 'dallas');
  // fondo del neutro, como en la 07 (22/10): A · Grafito por defecto, B · Luz para comparar
  const [neutralKey, setNeutralKey] = useState(QUERY.get('neutral') === 'glow' ? 'glow' : 'graphite');
  const [accentKey, setAccentKey] = useState(QUERY.get('accent') === 'kamleon' ? 'kamleon' : 'white');   // acento blanco (vídeo, Daniel 13/11)
  const players = teamRoster(DEMO_ROSTERS[rosterKey].players, teamKey);   // fotos según el equipo (22/10)

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
    const targetScore = 75 /* fijo para el vídeo (13/11) */;
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

  // Vídeo: al acabar el contador, Flush (función fija: el score reinicia el contador si cambia onTimeout)
  const toFlush = useCallback(() => setStep('flush'), []);
  const flushedRef = useRef(false);
  useEffect(() => {
    if (step === 'flush') { flushedRef.current = true; return; }
    if (step !== 'roster' || !flushedRef.current) return;
    const t = setTimeout(markDone, DONE_AFTER_ROSTER_MS);
    return () => clearTimeout(t);
  }, [step]);

  // Vídeo (Daniel, 13/11): en Ready el Tracking arranca solo tras un momento, sin tocar el botón de simulación
  useEffect(() => {
    if (step !== 'ready') return;
    const t = setTimeout(() => setStep('tracking'), READY_MS);
    return () => clearTimeout(t);
  }, [step]);

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
      key={rosterKey}
      players={players}
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
      <TeamBackground color={TEAMS[teamKey].color} neutral={teamKey === 'kamleon' ? neutralKey : null} className={`${styles.bg} ${onTeam ? '' : styles.bgHidden}`} />
      {/* El logo del equipo es parte del fondo: quieto entre plantilla y Ready, fuera en el Score */}
      {TEAMS[teamKey].logo && (
        <span
          className={`${styles.teamLogo} ${onTeam ? '' : styles.bgHidden}`}
          style={{ '--team-logo': `url("${TEAMS[teamKey].logo}")` }}
          aria-hidden="true"
        />
      )}

      {(step === 'roster' || showRosterBehind) && roster}
      {/* Un solo logo para plantilla y Ready, fuera de las dos: no se mueve en ninguna transición */}
      {onTeam && <span className={styles.logo}>KAMLEON®</span>}

      {step === 'ready' && (
        <ReadyScreen ref={readyRef} person={person} from={from} onNotYou={notYou} onSimulateFlow={() => setStep('tracking')} />
      )}

      {/* T6: el flujo entra fundiéndose sobre el fondo del equipo */}
      {step === 'tracking' && <div className={`${styles.fadeIn} ${styles.overBg}`}><TrackingScreen /></div>}
      {step === 'score' && (
        <div className={styles.fadeIn}>
          <Exploration5 score={displayScore} animAngle={animAngle} glowZoneIdx={glowZoneIdx} textStage={textStage} coloredText textLayout="stacked" zoneShape="round" timerStyle="alt" onTimeout={toFlush} />
        </div>
      )}
      {step === 'flush' && <div className={`${styles.fadeIn} ${styles.overBg}`}><FlushScreen /></div>}
    </div>
  );

  if (CAPTURE) return screen;

  return (
    <>
      <DeviceFrame>{screen}</DeviceFrame>
      <TouchIndicator />

    </>
  );
}

