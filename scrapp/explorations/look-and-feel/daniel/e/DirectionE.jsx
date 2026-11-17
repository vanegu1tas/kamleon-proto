import { useState } from 'react';
import { BARE } from '../../../../components/DeviceFrame';
import TweakPanel from '../../../../components/TweakPanel';
import ScreenTabs from '../../../../components/ScreenTabs';
import CompareToday from '../../../../components/CompareToday';
import ScoreE from './ScoreE';
import PinE from './PinE';
import HomeE from './HomeE';
import RosterE from './RosterE';
import WizardE from './WizardE';
import { CLUBS } from './clubs';

/**
 * Dirección E · Escenario (17/11). Ficha en docs/scrapp/look-and-feel.md. Mismo esqueleto que las otras
 * (pestañas, engranaje por pantalla). Detrás de todo, el agua de semitono (opciones comunes Agua · altura,
 * intensidad, velocidad, y Movimiento lento / quieto); encima, paneles negros translúcidos. Cambian de estructura
 * la Home (panel abajo), Elegir jugador (panel lateral o completo), el PIN (panel centrado) y el Score (número sin caja + banda).
 */
const SCREEN_KEY = 'look-and-feel:e:screen';
const SCREENS = [
  { value: 'home', label: 'Home' },
  { value: 'roster', label: 'Elegir jugador' },
  { value: 'pin', label: 'PIN' },
  { value: 'score', label: 'Score' },
  { value: 'wizard', label: 'Wizard' },
];
const CLUB_OPTS = Object.entries(CLUBS).map(([value, c]) => ({ value, label: c.label }));

export default function DirectionE() {
  const [screen, setScreenState] = useState(() => { try { return localStorage.getItem(SCREEN_KEY) || 'home'; } catch { return 'home'; } });
  const [cmp, setCmp] = useState(false);   // Comparar con hoy (CompareToday)
  const setScreen = v => { setScreenState(v); try { localStorage.setItem(SCREEN_KEY, v); } catch { /* solo comodidad */ } };
  const [shape, setShape] = useState('wave');
  const [height, setHeight] = useState('mid');
  const [strength, setStrength] = useState('soft');
  const [speed, setSpeed] = useState('calm');
  const [motion, setMotion] = useState('slow');
  const [panels, setPanels] = useState('none');
  const [clubKey, setClubKey] = useState('arsenal');
  const [panel, setPanel] = useState('float');
  const [networks, setNetworks] = useState('6');
  const [scroll, setScroll] = useState('fade');
  const layout = 'center';   // solo el gauge (Daniel, 17/11): la disposición Escenario sale del menú
  const [behind, setBehind] = useState('water');
  const [gauge, setGauge] = useState('fino');
  const [compare, setCompare] = useState('yes');
  const [continueMode, setContinueMode] = useState('button');
  const [result, setResult] = useState('ok');

  const club = CLUBS[clubKey];
  const common = { clubKey, club, motion, panels, water: { shape, height, strength, speed } };
  const screenGroups = {
    roster: [{ id: 'panel', label: 'Disposición', value: panel, onChange: setPanel, options: [{ value: 'float', label: 'Tarjetas flotando' }, { value: 'circles', label: 'Círculos' }, { value: 'side', label: 'Panel lateral' }, { value: 'full', label: 'Panel completo' }] }],
    wizard: [
      { id: 'networks', label: 'Redes', value: networks, onChange: setNetworks, options: [{ value: '6', label: '6' }, { value: '20', label: '20' }] },
      { id: 'scroll', label: 'Scroll', value: scroll, onChange: setScroll, options: [{ value: 'fade', label: 'Difuminado' }, { value: 'bar', label: 'Barra' }] },
    ],
    score: [
      { id: 'gauge', label: 'Gauge', value: gauge, onChange: setGauge, options: [{ value: 'fino', label: 'Fino' }, { value: 'actual', label: 'Actual' }] },
      { id: 'behind', label: 'Detrás del número', value: behind, onChange: setBehind, options: [{ value: 'water', label: 'Esfera de agua' }, { value: 'soft', label: 'Degradado suave' }, { value: 'gradient', label: 'Degradado' }] },
      { id: 'compare', label: 'Comparación', value: compare, onChange: setCompare, options: [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }] },
    ],
    pin: [
      { id: 'continue', label: 'Continue', value: continueMode, onChange: setContinueMode, options: [{ value: 'button', label: 'Botón' }, { value: 'auto', label: 'Automático' }] },
      { id: 'result', label: 'PIN', value: result, onChange: setResult, options: [{ value: 'ok', label: 'Correcto' }, { value: 'wrong', label: 'Incorrecto' }] },
    ],
  };
  const commonGroups = [
    { id: 'shape', label: 'Agua · forma', value: shape, onChange: setShape, options: [{ value: 'wave', label: 'Ola abajo' }, { value: 'sphere', label: 'Esfera que se esparce' }], defaultClosed: true },
    { id: 'height', label: 'Agua · altura / tamaño', value: height, onChange: setHeight, options: [{ value: 'low', label: 'Baja' }, { value: 'mid', label: 'Media' }, { value: 'high', label: 'Alta' }], defaultClosed: true },
    { id: 'strength', label: 'Agua · intensidad', value: strength, onChange: setStrength, options: [{ value: 'faint', label: 'Muy suave' }, { value: 'soft', label: 'Suave' }, { value: 'more', label: 'Marcada' }], defaultClosed: true },
    { id: 'speed', label: 'Agua · velocidad', value: speed, onChange: setSpeed, options: [{ value: 'slow', label: 'Lenta' }, { value: 'calm', label: 'Tranquila' }, { value: 'lively', label: 'Viva' }], defaultClosed: true },
    { id: 'panels', label: 'Paneles', value: panels, onChange: setPanels, options: [{ value: 'none', label: 'Sin paneles' }, { value: 'on', label: 'Con paneles' }], defaultClosed: true },
    { id: 'motion', label: 'Movimiento', value: motion, onChange: setMotion, options: [{ value: 'slow', label: 'Se mueve lento' }, { value: 'still', label: 'Quieto' }], defaultClosed: true },
    { id: 'club', label: 'Club', value: clubKey, onChange: setClubKey, options: CLUB_OPTS, defaultClosed: true },
  ];
  const groups = [...(screenGroups[screen] ?? []), ...commonGroups];
  const screenLabel = SCREENS.find(s => s.value === screen)?.label;

  return (
    <>
      <CompareToday on={cmp} screen={screen} label="E · Escenario">
        {screen === 'home' && <HomeE {...common} />}
        {screen === 'roster' && <RosterE {...common} panel={panel} />}
        {screen === 'pin' && <PinE {...common} continueMode={continueMode} result={result} />}
        {screen === 'score' && <ScoreE {...common} layout={layout} behind={behind} gauge={gauge} compare={compare === 'yes'} />}
        {screen === 'wizard' && <WizardE {...common} networks={networks} scroll={scroll} />}
      </CompareToday>
      {!BARE && <ScreenTabs value={screen} onChange={setScreen} options={SCREENS} comparing={cmp} onCompare={() => setCmp(v => !v)} />}
      <TweakPanel title={`E · ${screenLabel}`} groups={groups} />
    </>
  );
}
