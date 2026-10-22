import { useState, useRef, useEffect, useCallback } from 'react';
import DeviceFrame from '../../../../components/DeviceFrame';
import RosterScreen from './RosterScreen';
import ReadyScreen from './ReadyScreen';
import TeamBackground from './TeamBackground';
import TweakPanel from '../../../../components/TweakPanel';
import TrackingScreen from '../screens/TrackingScreen';
import FlushScreen from '../screens/FlushScreen';
import Exploration5, { scoreToAngle5, getZoneIndex5, GAUGE_START } from '../../../../screens/Exploration5';
import { ROSTERS, STAFF_MEMBER, teamRoster } from '../data/rosters';
import { TEAMS, ACCENTS } from './theme';
import styles from './FlowRunner.module.css';

const TRACKING_DURATION = 3000;
const FLUSH_DURATION    = 4000;
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

export default function FastTrackDorsal() {
  const [rosterKey, setRosterKey] = useState(DEMO_ROSTERS[QUERY.get('roster')] ? QUERY.get('roster') : 'nfl');
  const [teamKey, setTeamKey]     = useState(TEAMS[QUERY.get('team')] ? QUERY.get('team') : 'dallas');
  // fondo del neutro, como en la 07 (22/10): A · Grafito por defecto, B · Luz para comparar
  const [neutralKey, setNeutralKey] = useState(QUERY.get('neutral') === 'glow' ? 'glow' : 'graphite');
  const [accentKey, setAccentKey] = useState(QUERY.get('accent') === 'white' ? 'white' : 'kamleon');
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

      <TweakPanel
        title="Dorsal grande"
        groups={[
          {
            id: 'team', label: 'Equipo', value: teamKey, onChange: setTeamKey,
            // neutro arriba a fila entera; los equipos debajo, 2 y 2, cada tecla suelta, con el nombre en la tecla
            control: 'keycaps', labelInCap: true, flat: true, keyHeight: 36,
            options: Object.entries(TEAMS).map(([k, t]) => ({
              value: k,
              label: k === 'kamleon' ? 'Neutro' : t.label.replace(' Cowboys', ''),
              // sin punto: el LED de la esquina se enciende con el color del equipo
              // (Neutro con el turquesa por defecto: su color casi negro no alumbraría)
              led: k === 'kamleon' ? undefined : t.color,
              wide: k === 'kamleon',
            })),
          },
          // fondo del neutro: solo cuando el equipo es Neutro
          ...(teamKey === 'kamleon' ? [{
            id: 'neutral', label: 'Fondo neutro', value: neutralKey, onChange: setNeutralKey,
            control: 'keycaps', labelInCap: true, slot: true,
            options: [
              { value: 'graphite', label: 'A · Grafito' },
              { value: 'glow',     label: 'B · Luz' },
            ],
          }] : []),
          {
            id: 'accent', label: 'Acento', value: accentKey, onChange: setAccentKey, control: 'keycaps',
            options: Object.entries(ACCENTS).map(([k, a]) => ({ value: k, label: a.label, dot: a.value })),
          },
          {
            id: 'roster', label: 'Plantilla', value: rosterKey, onChange: k => { setRosterKey(k); reset(); },
            control: 'keycaps', columns: 3,
            options: [
              { value: 'small',    label: 'Small',  cap: DEMO_ROSTERS.small.players.length },
              { value: 'football', label: 'Medium', cap: DEMO_ROSTERS.football.players.length },
              { value: 'nfl',      label: 'Big',    cap: DEMO_ROSTERS.nfl.players.length },
              { value: 'long',     label: 'Apellidos', cap: 'Aa', wide: true },
            ],
          },
        ]}
      />
    </>
  );
}

