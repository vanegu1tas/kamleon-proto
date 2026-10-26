import { useState, useRef, useEffect, useCallback } from 'react';
import DeviceFrame from '../../../../components/DeviceFrame';
import RosterScreen from './RosterScreen';
import ReadyScreen from './ReadyScreen';
import TeamBackground from './TeamBackground';
import TweakPanel from '../../../../components/TweakPanel';
import TrackingScreen from '../screens/TrackingScreen';
import FlushScreen from '../screens/FlushScreen';
import Exploration5, { scoreToAngle5, getZoneIndex5, GAUGE_START } from '../../../../screens/Exploration5';
import { ROSTERS as BASE_ROSTERS, STAFF_MEMBER, teamRoster } from '../data/rosters';
import { TEAMS } from './theme';
import styles from './FlowRunner.module.css';

const TRACKING_DURATION = 9200;   // 22/10: para ver la animación del mandala 4 veces (ciclo de 2,23 s; antes 3000)
const FLUSH_DURATION    = 4000;
const LEAVE_MS          = 420;   // T3: cuánto sigue la plantilla debajo mientras la foto vuela

// Fast Track · Ficha (22/10): la 07 con la celda tipo ficha de la referencia (ver
// RosterScreen). Por defecto en 7 × 4. Lo que sigue es lo de la 07:
// Fast Track · primer release (22/10). Copia de la Pulida con lo que pidió el cliente: 30 por
// pantalla, fotos grandes, dorsal en azul y apellido debajo, Staff arriba a la derecha con el QR en
// grande y flechas en vez de pestañas. Las columnas (6, 7 u 8) quedan en el panel para decidir.

// Color del dorsal. El cliente lo pidió "en azul"; el DS no tiene azul, así que es un valor propio
// (claro, para que se lea sobre el fondo del equipo). Turquesa y blanco, para comparar.
const NUMBER_COLORS = {
  blue:  { label: 'Azul',     value: '#4da3ff' },
  turq:  { label: 'Turquesa', value: 'var(--color-turquoise-51)' },
  white: { label: 'Blanco',   value: '#ffffff' },
};
// Rejilla columnas × filas (22/10). El cliente pidió 30; 7×4 y 7×5 para ver si con 7 columnas
// respira más (Daniel: con 7 × 5 de 30 quedaban pegadas al borde).
const LAYOUTS = {
  '6x5': { cols: 6, rows: 5 },
  '7x4': { cols: 7, rows: 4 },
  '7x5': { cols: 7, rows: 5 },
  '8x4': { cols: 8, rows: 4 },
};

// Plantillas de esta exploración: Big pasa a ser la plantilla completa, todos los dorsales del 0 al
// 99 (22/10). Se arma con los jugadores de la NFL de prueba (90) repitiendo nombres y fotos para
// los 10 dorsales que esa no tiene; los datos compartidos (data/rosters.js) no se tocan.
const FULL = Array.from({ length: 100 }, (_, n) => {
  const base = BASE_ROSTERS.nfl.players;
  return { ...base[n % base.length], id: `full${n}`, number: n };
});
const ROSTERS = { ...BASE_ROSTERS, full: { label: 'Completa · 100', players: FULL } };

const QUERY   = new URLSearchParams(window.location.search);
const CAPTURE = QUERY.has('capture');

export default function FastTrackFicha() {
  const [rosterKey, setRosterKey] = useState(ROSTERS[QUERY.get('roster')] ? QUERY.get('roster') : 'full');
  const [layoutKey, setLayoutKey] = useState(LAYOUTS[QUERY.get('grid')] ? QUERY.get('grid') : '8x4');   // 8 × 4: la única con ≥ 30 y fichas más altas que anchas (22/10)
  const [listenKey, setListenKey] = useState(QUERY.get('listen') === 'ring' ? 'ring' : 'logo');   // "escuchando" en Ready: el logo bajo la frase (22/10)
  const [transKey, setTransKey]   = useState(QUERY.get('trans') === 'fade' ? 'fade' : 'travel');   // paso a Tracking (22/10)
  const [stripKey, setStripKey]   = useState(['side', 'stack', 'badge', 'overlay', 'plate'].includes(QUERY.get('strip')) ? QUERY.get('strip') : 'badge');   // por defecto, el dorsal sobre la foto (22/10)
  const [teamKey, setTeamKey]     = useState(TEAMS[QUERY.get('team')] ? QUERY.get('team') : 'kamleon');   // por defecto, Neutro (22/10)
  const [numberKey, setNumberKey] = useState(NUMBER_COLORS[QUERY.get('number')] ? QUERY.get('number') : 'white');   // por defecto, blanco (23/10, Daniel; antes el turquesa)
  const [neutralKey, setNeutralKey] = useState(QUERY.get('neutral') === 'glow' ? 'glow' : 'graphite');   // por defecto, A · Grafito (22/10)
  // "Logo viaja" necesita el logo en Ready; con el anillo en la foto, el paso es siempre un fundido
  const trans = listenKey === 'logo' ? transKey : 'fade';
  const players = teamRoster(ROSTERS[rosterKey].players, teamKey);   // fotos según el equipo (22/10)

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

  // Atajo de la demo (22/10): "r" reinicia el flujo desde la plantilla, sin esperar animaciones
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'r' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest?.('input, textarea, [contenteditable]')) return;
      reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reset]);

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

  // --accent: el aro de la foto en Ready (turquesa, como en la Pulida)
  // --plate / --plate-ink: la placa del dorsal en la franja "Placa" (23/10). Por defecto, el color del
  // club con el número en blanco; el equipo puede tener la suya (Dallas: blanca, número negro).
  // Kamleon (neutro) no tiene: su color es casi negro, así que la placa usa su valor por defecto
  const plate = TEAMS[teamKey].plate ?? (teamKey !== 'kamleon' ? { bg: TEAMS[teamKey].color } : {});
  const themeVars = {
    '--number': NUMBER_COLORS[numberKey].value,
    '--accent': 'var(--color-turquoise-51)',
    ...(plate.bg && { '--plate': plate.bg }),
    ...(plate.ink && { '--plate-ink': plate.ink }),
  };
  // Fondo (22/10): en plantilla y Ready, el del equipo. Al detectar flujo (Tracking) no se corta:
  // se va oscureciendo despacio hasta el negro de siempre, y Score y Flush siguen en negro como en
  // la scrapp actual. Así el fondo nuevo solo existe donde se rediseñó y el resto no cambia.
  const onTeam = step === 'roster' || step === 'ready';
  const darkening = step === 'tracking';
  const bgClass = onTeam ? '' : darkening ? styles.bgDarken : styles.bgHidden;

  const roster = (
    <RosterScreen
      key={rosterKey}
      players={players}
      cols={LAYOUTS[layoutKey].cols}
      rows={LAYOUTS[layoutKey].rows}
      strip={stripKey}
      upper={teamKey === 'dallas'}
      darkInk={!!TEAMS[teamKey].plate?.ink}
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
      <TeamBackground color={TEAMS[teamKey].color} neutral={teamKey === 'kamleon' ? neutralKey : null} className={`${styles.bg} ${bgClass}`} />
      {/* El logo del equipo es parte del fondo (como en Dorsal grande): quieto entre plantilla y Ready,
          se apaga con el fondo en Tracking */}
      {TEAMS[teamKey].logo && (
        <span
          className={`${styles.teamLogo} ${bgClass}`}
          style={{ '--team-logo': `url("${TEAMS[teamKey].logo}")` }}
          aria-hidden="true"
        />
      )}

      {(step === 'roster' || showRosterBehind) && roster}
      {/* Un solo logo para plantilla y Ready, fuera de las dos: no se mueve en ninguna transición */}
      {onTeam && <span className={styles.logo}>KAMLEON®</span>}

      {step === 'ready' && (
        <ReadyScreen ref={readyRef} person={person} from={from} listening={listenKey} onNotYou={notYou} onSimulateFlow={() => readyRef.current?.exit(trans, () => setStep('tracking'))} />
      )}

      {/* T6: el flujo entra fundiéndose sobre el fondo del equipo */}
      {/* Paso a Tracking (22/10): con "Logo viaja" el símbolo ya está en su sitio al entrar, así que
          solo entran los textos; con "Fundido", la pantalla entera */}
      {step === 'tracking' && (
        <div className={`${trans === 'travel' ? styles.trackingArrive : styles.fadeIn} ${styles.overBg}`}><TrackingScreen /></div>
      )}
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
        title="Avatars cards"
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
          // fondo del neutro (a prueba, 22/10): solo cuando el equipo es Neutro
          ...(teamKey === 'kamleon' ? [{
            id: 'neutral', label: 'Fondo neutro', value: neutralKey, onChange: setNeutralKey,
            control: 'keycaps', labelInCap: true, slot: true,
            options: [
              { value: 'graphite', label: 'A · Grafito' },
              { value: 'glow',     label: 'B · Luz' },
            ],
          }] : []),
          {
            // la tecla dice cuántos caben por página; debajo, columnas × filas
            id: 'grid', label: 'Rejilla', value: layoutKey, onChange: k => { setLayoutKey(k); setTab(0); },
            control: 'keycaps', columns: 4, stretch: true,
            options: Object.entries(LAYOUTS).map(([k, l]) => ({ value: k, label: `${l.cols} × ${l.rows}`, cap: l.cols * l.rows })),
          },
          {
            id: 'strip', label: 'Franja', value: stripKey, onChange: setStripKey,
            control: 'keycaps', columns: 2, labelInCap: true,
            options: [
              { value: 'badge',   label: 'Dorsal en foto' },
              { value: 'overlay', label: 'Todo en foto' },
              { value: 'stack',   label: 'Apilado' },
              { value: 'side',    label: 'Al lado' },
              { value: 'plate',   label: 'Placa' },
            ],
          },
          {
            id: 'listen', label: 'Escuchando (Ready)', value: listenKey, onChange: setListenKey,
            control: 'keycaps', columns: 2, labelInCap: true,
            options: [
              { value: 'logo', label: 'Logo' },
              { value: 'ring', label: 'Anillo en foto' },
            ],
          },
          {
            id: 'trans', label: 'Paso a Tracking', value: transKey, onChange: setTransKey,
            control: 'keycaps', columns: 2, labelInCap: true,
            options: [
              { value: 'travel', label: 'Logo viaja' },
              { value: 'fade',   label: 'Fundido' },
            ],
          },
          {
            id: 'number', label: 'Dorsal', value: numberKey, onChange: setNumberKey,
            control: 'keycaps', columns: 3, stretch: true,
            options: Object.entries(NUMBER_COLORS).map(([k, c]) => ({ value: k, label: c.label, dot: c.value })),
          },
          {
            id: 'roster', label: 'Plantilla', value: rosterKey, onChange: k => { setRosterKey(k); reset(); },
            control: 'keycaps', columns: 3,
            options: [
              { value: 'small',    label: 'Small',  cap: ROSTERS.small.players.length },
              { value: 'football', label: 'Medium', cap: ROSTERS.football.players.length },
              { value: 'full',     label: 'Big',    cap: ROSTERS.full.players.length },
            ],
          },
        ]}
      />
    </>
  );
}
