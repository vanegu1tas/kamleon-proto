import { useState } from 'react';
import { BARE } from '../../../../components/DeviceFrame';
import TweakPanel from '../../../../components/TweakPanel';
import ScreenTabs from '../../../../components/ScreenTabs';
import CompareToday from '../../../../components/CompareToday';
import ScoreC from './ScoreC';
import PinC from './PinC';
import HomeC from './HomeC';
import RosterC from './RosterC';
import WizardC from './WizardC';
import { CLUBS } from './clubs';

/**
 * Dirección C · Calma (17/11). Ficha en docs/scrapp/look-and-feel.md. Mismo esqueleto que la A (pantallas,
 * pestañas, engranaje por pantalla) con su juego de estilos (C.module.css). Elegir jugador cambia de estructura:
 * plantilla con fotos o "What's your number?" para comparar. El Score entra con el gauge fino.
 */
const SCREEN_KEY = 'look-and-feel:c:screen';
const SCREENS = [
  { value: 'home', label: 'Home' },
  { value: 'roster', label: 'Elegir jugador' },
  { value: 'pin', label: 'PIN' },
  { value: 'score', label: 'Score' },
  { value: 'wizard', label: 'Wizard' },
];
const CARDS = [{ value: 'glass', label: 'Vidrio' }, { value: 'fill', label: 'Relleno' }];
// Halo (Daniel, 17/11): el tono solo cambia el halo del centro, no el fondo ni los textos (que quedan como el original).
// Gris verdoso por defecto; Verde Kamleon (muy verde) y Cálido (el original) para comparar; club y agua como antes.
const HALOS = [
  { value: 'sage', label: 'Gris verdoso' }, { value: 'green', label: 'Verde Kamleon' }, { value: 'warm', label: 'Cálido' },
  { value: 'club', label: 'Color del club' }, { value: 'water', label: 'Agua' },
];
const HALO_COLOR = { sage: '#2A3331', green: '#1C3B38', warm: '#3A332C', water: '#0F4A47' };
// Fondo y textos (exploración de tonos, 17/11; se conserva como opción aparte del halo): Original (por defecto),
// gris verdoso o verde Kamleon en el fondo, los textos y el blanco del botón. El Score sigue en gris neutro.
const TONES = [{ value: 'warm', label: 'Original' }, { value: 'sage', label: 'Gris verdoso' }, { value: 'green', label: 'Verde Kamleon' }];
const TONE_VARS = {
  warm: {},
  sage: { '--c-tone-bg': '#111413', '--c-tone-text-3': '#636A68', '--c-tone-text-2': '#9DA4A2', '--c-tone-text': '#F2F5F4', '--c-tone-primary': '#EFF3F2' },
  green: { '--c-tone-bg': '#0D1312', '--c-tone-text-3': '#5C6B69', '--c-tone-text-2': '#93A3A0', '--c-tone-text': '#F0F6F5', '--c-tone-primary': '#EAF6F4' },
};
const SCORE_HALO = '#262626';
const SCORE_BG = '#111111';
const CLUB_OPTS = Object.entries(CLUBS).map(([value, c]) => ({ value, label: c.label }));

export default function DirectionC() {
  const [screen, setScreenState] = useState(() => { try { return localStorage.getItem(SCREEN_KEY) || 'home'; } catch { return 'home'; } });
  const [cmp, setCmp] = useState(false);   // Comparar con hoy (CompareToday)
  const setScreen = v => { setScreenState(v); try { localStorage.setItem(SCREEN_KEY, v); } catch { /* solo comodidad */ } };
  const [halo, setHalo] = useState('sage');
  const [tone, setTone] = useState('warm');
  const [clubKey, setClubKey] = useState('arsenal');
  const [cards, setCards] = useState('glass');
  const [rosterMode, setRosterMode] = useState('grid');
  const [perPage, setPerPage] = useState('30');
  const [find, setFind] = useState('bar');
  const [networks, setNetworks] = useState('6');
  const [scroll, setScroll] = useState('fade');
  const [gauge, setGauge] = useState('fino');
  const [compare, setCompare] = useState('sample');
  const [behind, setBehind] = useState('dots');
  const [result, setResult] = useState('ok');

  const club = CLUBS[clubKey];
  const common = { clubKey, club };
  const cardsGroup = { id: 'cards', label: 'Tarjetas', value: cards, onChange: setCards, options: CARDS };
  const screenGroups = {
    roster: [
      { id: 'rosterMode', label: 'Modo', value: rosterMode, onChange: setRosterMode, options: [{ value: 'grid', label: 'Plantilla' }, { value: 'number', label: 'Dorsal' }] },
      { id: 'find', label: 'Buscar por número', value: find, onChange: setFind, options: [{ value: 'bar', label: 'Botón abajo' }, { value: 'search', label: 'Buscador arriba' }] },
      { id: 'perPage', label: 'Por página', value: perPage, onChange: setPerPage, options: [{ value: '20', label: '20' }, { value: '30', label: '30' }] },
      cardsGroup,
    ],
    wizard: [cardsGroup, { id: 'networks', label: 'Redes', value: networks, onChange: setNetworks, options: [{ value: '6', label: '6' }, { value: '20', label: '20' }] },
      { id: 'scroll', label: 'Scroll', value: scroll, onChange: setScroll, options: [{ value: 'fade', label: 'Difuminado' }, { value: 'bar', label: 'Barra' }] }],
    score: [
      { id: 'gauge', label: 'Gauge', value: gauge, onChange: setGauge, options: [{ value: 'fino', label: 'Fino' }, { value: 'actual', label: 'Actual' }] },
      { id: 'behind', label: 'Detrás del número', value: behind, onChange: setBehind, options: [{ value: 'dots', label: 'Puntos · dentro del gauge' }, { value: 'dotsAll', label: 'Puntos · todo el fondo' }, { value: 'soft', label: 'Glow suave' }, { value: 'glow', label: 'Glow' }] },
      { id: 'compare', label: 'Debajo del mensaje', value: compare, onChange: setCompare, options: [{ value: 'sample', label: 'Electrolitos y volumen' }, { value: 'none', label: 'Nada' }] },
    ],
    pin: [
      { id: 'result', label: 'PIN', value: result, onChange: setResult, options: [{ value: 'ok', label: 'Correcto' }, { value: 'wrong', label: 'Incorrecto' }] },
    ],
  };
  const commonGroups = [
    { id: 'tone', label: 'Fondo y textos', value: tone, onChange: setTone, options: TONES, defaultClosed: true },
    { id: 'halo', label: 'Halo', value: halo, onChange: setHalo, options: HALOS, defaultClosed: true },
    { id: 'club', label: 'Club', value: clubKey, onChange: setClubKey, options: CLUB_OPTS, defaultClosed: true },
  ];
  const groups = [...(screenGroups[screen] ?? []), ...commonGroups.filter(g => !(screen === 'score' && g.id === 'halo'))];
  const screenLabel = SCREENS.find(s => s.value === screen)?.label;
  const haloColor = screen === 'score' ? SCORE_HALO : (halo === 'club' ? club.color : HALO_COLOR[halo]);

  return (
    <>
      <CompareToday on={cmp} screen={screen} label="C · Calma">
        <div style={{ '--c-halo': haloColor, ...TONE_VARS[tone], display: 'contents' }}>
          {screen === 'home' && <HomeC {...common} />}
          {screen === 'roster' && <RosterC {...common} cards={cards} mode={rosterMode} perPage={perPage} find={find} />}
          {screen === 'pin' && <PinC {...common} continueMode="auto" result={result} /* C: siempre automático (Daniel, 17/11) */ />}
          {screen === 'score' && <div style={{ '--c-bg-override': SCORE_BG, display: 'contents' }}><ScoreC {...common} gauge={gauge} compare={compare} behind={behind} /></div>}
          {screen === 'wizard' && <WizardC {...common} cards={cards} networks={networks} scroll={scroll} />}
        </div>
      </CompareToday>
      {!BARE && <ScreenTabs value={screen} onChange={setScreen} options={SCREENS} comparing={cmp} onCompare={() => setCmp(v => !v)} />}
      <TweakPanel title={`C · ${screenLabel}`} groups={groups} />
    </>
  );
}
