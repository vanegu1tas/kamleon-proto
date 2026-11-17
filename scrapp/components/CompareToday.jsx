import { useEffect, useState } from 'react';
import DeviceFrame from './DeviceFrame';
import HomeScreen from '../screens/flow/HomeScreen';
import ChooseAvatarScreen from '../screens/flow/ChooseAvatarScreen';
import PinEntryScreen from '../screens/flow/PinEntryScreen';
import Exploration5, { getZoneIndex5 } from '../screens/Exploration5';
import { ListScreen, NETWORKS } from '../screens/wizard/WizardRunner';
import { AVATARS } from '../data/mockFlowData';
import styles from './CompareToday.module.css';

/**
 * Comparar con hoy (andamiaje del microsite, 17/11). Para Look & feel: con el botón "Comparar con hoy" de las
 * pestañas, la pantalla de la exploración sale al lado de la misma pantalla de la scrapp actual (Producción →
 * Flujo actual), primero la actual. Apagado, es un DeviceFrame normal.
 *
 *   <CompareToday on={cmp} screen="score" label="A · Kamleon evolucionado">{pantalla}</CompareToday>
 */
const noop = () => {};
const TODAY_SCORE = 75;

function TodayScreen({ screen }) {
  if (screen === 'home') return <HomeScreen onLogin={noop} onSimulateQr={noop} onSimulateRfid={noop} onGuest={noop} />;
  if (screen === 'roster') return <ChooseAvatarScreen onSelect={noop} onClose={noop} />;
  if (screen === 'pin') return <PinEntryScreen avatar={AVATARS[0]} onComplete={noop} onBack={noop} onClose={noop} />;
  if (screen === 'score') return <Exploration5 score={TODAY_SCORE} glowZoneIdx={getZoneIndex5(TODAY_SCORE)} textStage="full" />;
  if (screen === 'wizard') return <ListScreen title="Select the WIFI network" onBack={noop} items={NETWORKS.map(n => ({ label: n.name, locked: n.locked }))} onSelect={noop} />;
  return null;
}

function useScale() {
  const calc = () => Math.min((window.innerWidth - 120) / 2 / 1280, (window.innerHeight - 220) / 800);
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const on = () => setScale(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return scale;
}

function Pane({ title, scale, children }) {
  return (
    <figure className={styles.pane}>
      <figcaption className={styles.caption}>{title}</figcaption>
      <div className={styles.window} style={{ width: 1280 * scale, height: 800 * scale }}>
        <div className={styles.canvas} style={{ transform: `scale(${scale})` }}>{children}</div>
      </div>
    </figure>
  );
}

export default function CompareToday({ on, screen, label, children }) {
  const scale = useScale();
  if (!on) return <DeviceFrame>{children}</DeviceFrame>;
  return (
    <div className={styles.view}>
      <Pane title="Hoy" scale={scale}><TodayScreen screen={screen} /></Pane>
      <Pane title={label} scale={scale}>{children}</Pane>
    </div>
  );
}
