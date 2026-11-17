import { useState } from 'react';
import { BARE } from '../../../../components/DeviceFrame';
import TweakPanel from '../../../../components/TweakPanel';
import ScreenTabs from '../../../../components/ScreenTabs';
import CompareToday from '../../../../components/CompareToday';
import ScoreA from './ScoreA';
import PinA from './PinA';
import HomeA from './HomeA';
import RosterA from './RosterA';
import WizardA from './WizardA';
import { CLUBS } from './clubs';

/**
 * Dirección A · Kamleon evolucionado (17/11). Ficha en docs/scrapp/look-and-feel.md.
 * Todas las pantallas de la A con el mismo juego de estilos (A.module.css). La pantalla se elige en las pestañas de
 * debajo del dispositivo (Daniel, 17/11: con 6 pantallas, todas las opciones juntas serían un caos); el engranaje
 * enseña primero las opciones de esa pantalla y al final las comunes (fondo, club), plegadas, que se mantienen al
 * cambiar de pantalla.
 */
const SCREEN_KEY = 'look-and-feel:a:screen';
const SCREENS = [
  { value: 'home', label: 'Home' },
  { value: 'roster', label: 'Elegir jugador' },
  { value: 'pin', label: 'PIN' },
  { value: 'score', label: 'Score' },
  { value: 'wizard', label: 'Wizard' },
];
const LIGHTS = [{ value: 'flat', label: 'Liso' }, { value: 'top', label: '1 · Luz arriba' }, { value: 'spot', label: '2 · Foco' }];
const STRENGTH = [{ value: 'soft', label: 'Suave' }, { value: 'more', label: 'Marcada' }];
const CLUB_OPTS = Object.entries(CLUBS).map(([value, c]) => ({ value, label: c.label }));

export default function DirectionA() {
  const [screen, setScreenState] = useState(() => { try { return localStorage.getItem(SCREEN_KEY) || 'home'; } catch { return 'home'; } });
  const [cmp, setCmp] = useState(false);   // Comparar con hoy (CompareToday)
  const setScreen = v => { setScreenState(v); try { localStorage.setItem(SCREEN_KEY, v); } catch { /* solo comodidad */ } };
  const [light, setLight] = useState('top');
  const [strength, setStrength] = useState('soft');
  const [clubKey, setClubKey] = useState('arsenal');
  const cards = 'fill';   // tarjetas siempre con relleno (Daniel, 17/11); sale del menú
  const [scroll, setScroll] = useState('fade');
  const [beam, setBeam] = useState('turquoise');
  const [beamCount, setBeamCount] = useState('2');
  const [gauge, setGauge] = useState('actual');
  const [compare, setCompare] = useState('yes');
  const [continueMode, setContinueMode] = useState('button');
  const [result, setResult] = useState('ok');

  const common = { light, strength, clubKey, club: CLUBS[clubKey] };
  // Tarjetas (borde o relleno) solo donde se nota: Elegir jugador y Wizard (Daniel, 17/11)
  const screenGroups = {
    home: [{ id: 'beam', label: 'Brillo Log in', value: beam, onChange: setBeam, options: [{ value: 'none', label: 'Sin luz' }, { value: 'white', label: 'Blanca' }, { value: 'turquoise', label: 'Turquesa' }] },
      { id: 'beamCount', label: 'Luces', value: beamCount, onChange: setBeamCount, options: [{ value: '1', label: '1' }, { value: '2', label: '2' }] }],
    roster: [],
    wizard: [{ id: 'scroll', label: 'Scroll', value: scroll, onChange: setScroll, options: [{ value: 'fade', label: 'Difuminado' }, { value: 'bar', label: 'Barra' }] }],
    score: [
      { id: 'gauge', label: 'Gauge', value: gauge, onChange: setGauge, options: [{ value: 'actual', label: 'Actual' }, { value: 'fino', label: 'Fino' }] },
      { id: 'compare', label: 'Comparación', value: compare, onChange: setCompare, options: [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }] },
    ],
    pin: [
      { id: 'continue', label: 'Continue', value: continueMode, onChange: setContinueMode, options: [{ value: 'button', label: 'Botón' }, { value: 'auto', label: 'Automático' }] },
      { id: 'result', label: 'PIN', value: result, onChange: setResult, options: [{ value: 'ok', label: 'Correcto' }, { value: 'wrong', label: 'Incorrecto' }] },
    ],
  };
  // comunes a todas las pantallas de la A: al final y plegadas (plegadas siguen enseñando el valor)
  const commonGroups = [
    { id: 'light', label: 'Fondo', value: light, onChange: setLight, options: LIGHTS, defaultClosed: true },
    { id: 'strength', label: 'Intensidad', value: strength, onChange: setStrength, options: STRENGTH, defaultClosed: true },
    { id: 'club', label: 'Club', value: clubKey, onChange: setClubKey, options: CLUB_OPTS, defaultClosed: true },
  ];
  const groups = [...(screenGroups[screen] ?? []), ...commonGroups];
  const screenLabel = SCREENS.find(s => s.value === screen)?.label;

  return (
    <>
      <CompareToday on={cmp} screen={screen} label="A · Kamleon evolucionado">
        {screen === 'home' && <HomeA {...common} beam={beam} beamCount={beamCount} />}
        {screen === 'roster' && <RosterA {...common} cards={cards} />}
        {screen === 'pin' && <PinA {...common} continueMode={continueMode} result={result} />}
        {screen === 'score' && <ScoreA {...common} gauge={gauge} compare={compare === 'yes'} />}
        {screen === 'wizard' && <WizardA {...common} cards={cards} scroll={scroll} />}
      </CompareToday>
      {!BARE && <ScreenTabs value={screen} onChange={setScreen} options={SCREENS} comparing={cmp} onCompare={() => setCmp(v => !v)} />}
      <TweakPanel title={`A · ${screenLabel}`} groups={groups} />
    </>
  );
}
