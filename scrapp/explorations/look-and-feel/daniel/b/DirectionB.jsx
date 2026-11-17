import { useState } from 'react';
import { BARE } from '../../../../components/DeviceFrame';
import TweakPanel from '../../../../components/TweakPanel';
import ScreenTabs from '../../../../components/ScreenTabs';
import CompareToday from '../../../../components/CompareToday';
import ScoreB from './ScoreB';
import PinB from './PinB';
import HomeB from './HomeB';
import RosterB from './RosterB';
import WizardB from './WizardB';
import { CLUBS } from './clubs';

/**
 * Dirección B · Instrumento (17/11). Ficha en docs/scrapp/look-and-feel.md. Mismo esqueleto que la C (pantallas,
 * pestañas, engranaje por pantalla, Elegir jugador con 30 y modo dorsal) con su juego de estilos (B.module.css).
 * Score: disposición "Centrado" (la de siempre) o "Instrumento" (gauge a la izquierda, estado y tres métricas que se
 * llenan a la derecha); Daniel, 17/11: lo importante es el estilo, el gauge de siempre se queda para comparar.
 */
const SCREEN_KEY = 'look-and-feel:b:screen';
const SCREENS = [
  { value: 'home', label: 'Home' },
  { value: 'roster', label: 'Elegir jugador' },
  { value: 'pin', label: 'PIN' },
  { value: 'score', label: 'Score' },
  { value: 'wizard', label: 'Wizard' },
];
const CARDS = [{ value: 'tone', label: 'Tono' }, { value: 'fill', label: 'Tinte' }];
const CLUB_OPTS = Object.entries(CLUBS).map(([value, c]) => ({ value, label: c.label }));

export default function DirectionB() {
  const [screen, setScreenState] = useState(() => { try { return localStorage.getItem(SCREEN_KEY) || 'home'; } catch { return 'home'; } });
  const [cmp, setCmp] = useState(false);   // Comparar con hoy (CompareToday)
  const setScreen = v => { setScreenState(v); try { localStorage.setItem(SCREEN_KEY, v); } catch { /* solo comodidad */ } };
  const [clubKey, setClubKey] = useState('arsenal');
  const [cards, setCards] = useState('tone');
  const [perPage, setPerPage] = useState('30');
  const [networks, setNetworks] = useState('6');
  const [scroll, setScroll] = useState('fade');
  const [gauge, setGauge] = useState('actual');
  const [layout, setLayout] = useState('instrument');
  const [compare, setCompare] = useState('yes');
  const [result, setResult] = useState('ok');

  const club = CLUBS[clubKey];
  const common = { clubKey, club };
  const cardsGroup = { id: 'cards', label: 'Tarjetas', value: cards, onChange: setCards, options: CARDS };
  const screenGroups = {
    roster: [
      { id: 'perPage', label: 'Por página', value: perPage, onChange: setPerPage, options: [{ value: '20', label: '20' }, { value: '30', label: '30' }] },
      cardsGroup,
    ],
    wizard: [cardsGroup, { id: 'networks', label: 'Redes', value: networks, onChange: setNetworks, options: [{ value: '6', label: '6' }, { value: '20', label: '20' }] },
      { id: 'scroll', label: 'Scroll', value: scroll, onChange: setScroll, options: [{ value: 'fade', label: 'Difuminado' }, { value: 'bar', label: 'Barra' }] }],
    score: [
      { id: 'layout', label: 'Disposición', value: layout, onChange: setLayout, options: [{ value: 'center', label: 'Centrado' }, { value: 'instrument', label: 'Instrumento' }] },
      { id: 'gauge', label: 'Gauge', value: gauge, onChange: setGauge, options: [{ value: 'actual', label: 'Actual' }, { value: 'fino', label: 'Fino' }] },
      { id: 'compare', label: 'Comparación', value: compare, onChange: setCompare, options: [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }] },
    ],
    pin: [
      { id: 'result', label: 'PIN', value: result, onChange: setResult, options: [{ value: 'ok', label: 'Correcto' }, { value: 'wrong', label: 'Incorrecto' }] },
    ],
  };
  const commonGroups = [
    { id: 'club', label: 'Club', value: clubKey, onChange: setClubKey, options: CLUB_OPTS, defaultClosed: true },
  ];
  const groups = [...(screenGroups[screen] ?? []), ...commonGroups];
  const screenLabel = SCREENS.find(s => s.value === screen)?.label;

  return (
    <>
      <CompareToday on={cmp} screen={screen} label="B · Instrumento">
          {screen === 'home' && <HomeB {...common} />}
          {screen === 'roster' && <RosterB {...common} cards={cards} perPage={perPage} />}
          {screen === 'pin' && <PinB {...common} continueMode="auto" result={result} /* B: siempre automático (Daniel, 17/11) */ />}
          {screen === 'score' && <ScoreB {...common} gauge={gauge} layout={layout} compare={compare === 'yes'} />}
          {screen === 'wizard' && <WizardB {...common} cards={cards} networks={networks} scroll={scroll} />}
      </CompareToday>
      {!BARE && <ScreenTabs value={screen} onChange={setScreen} options={SCREENS} comparing={cmp} onCompare={() => setCmp(v => !v)} />}
      <TweakPanel title={`B · ${screenLabel}`} groups={groups} />
    </>
  );
}
