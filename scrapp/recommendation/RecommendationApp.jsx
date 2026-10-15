import { useCallback, useState } from 'react';
import DeviceFrame from '../components/DeviceFrame';
import StartScreen from './screens/StartScreen';
import ScoreScreen from './screens/ScoreScreen';
import RecommendationScreen from './screens/RecommendationScreen';
import Countdown from './components/Countdown';
import LogoKamleon from '../../design-system/icons/LogoKamleon';
import RangeMenu from './components/RangeMenu';
import { ZONES } from './gauge';
import styles from './RecommendationApp.module.css';

// Demo del Recommendation Engine (fase 0). Entrada aparte de la scrapp interna: el link se
// comparte con business y de ahí con el cliente, así que acá no aparece el menú de
// explorations ni los flujos internos.
//
// Por defecto el score cae en "dehydrated", que es el caso que interesa para la
// recomendación: si el jugador ya está hidratado no hay nada que recomendarle.
const DEFAULT_ZONE = 'dehydrated';

// Un solo contador para las dos pantallas: arranca al aparecer el score y no se reinicia al
// pasar a la recomendación — desde el punto de vista del jugador es el mismo tiempo frente a
// la unidad, no dos turnos.
const TOTAL_SECONDS = 12;
const SWITCH_AT     = 7;    // segundos restantes cuando el score se va y entra la recomendación
                            // → 5 s de score y 7 s de recomendación. El score no necesita más:
                            // su animación dura 2,2 s y lo que sobra se siente como una espera.
const EXIT_MS       = 750;  // lo que tarda el número en llegar a la esquina (igual que en su CSS;
                            // el arco se apaga antes, en 600 ms)

// El botón de volver solo aparece si se llega desde el microsite de la scrapp (la card de Tareas
// añade ?from=tasks). El link que tiene business no lo lleva, así que ellos no ven nada nuestro.
const FROM = new URLSearchParams(window.location.search).get('from');
const BACK = FROM === 'tasks' ? { href: './#/tasks', label: 'Tareas' } : null;

export default function RecommendationApp() {
  const [screen, setScreen]   = useState('start');
  const [zoneKey, setZoneKey] = useState(DEFAULT_ZONE);
  const [exiting, setExiting] = useState(false);
  const score = ZONES.find(z => z.key === zoneKey)?.sample ?? 48;

  const handleTick = useCallback(remaining => {
    if (remaining <= SWITCH_AT) {
      setExiting(prev => {
        if (!prev) setTimeout(() => setScreen('reco'), EXIT_MS);
        return true;
      });
    }
  }, []);

  function startRun(key = zoneKey) {
    setZoneKey(key);
    setExiting(false);
    setScreen('score');
  }

  return (
    <>
      <DeviceFrame>
        <div className={styles.stage}>
          {screen === 'start' && <StartScreen onStart={() => startRun()} />}
          {screen === 'score' && <ScoreScreen key={zoneKey} score={score} exiting={exiting} />}
          {screen === 'reco'  && <RecommendationScreen score={score} />}

          {/* El logo es fijo: se mantiene igual entre pantallas y no entra con ninguna
              animación — es la marca de la unidad, no parte del contenido. */}
          {screen !== 'start' && (
            <div className={styles.logo}><LogoKamleon width={180} height={33} /></div>
          )}

          {/* Vive fuera de las pantallas: es el mismo contador de principio a fin. */}
          {screen !== 'start' && (
            <Countdown
              key={`cd-${zoneKey}`}
              seconds={TOTAL_SECONDS}
              onTick={handleTick}
              onFinish={() => { setExiting(false); setScreen('start'); }}
            />
          )}
        </div>
      </DeviceFrame>

      {/* Mismo botón y mismo sitio que el "‹ Scrapp" del microsite (hub/Hub.module.css .back) */}
      {BACK && <a className={styles.back} href={BACK.href}>‹ {BACK.label}</a>}

      {/* Control de la demo: no se ve en la pantalla de la unidad, es para quien presenta.
          Con el botón de volver arriba, baja para no taparlo (igual que el menú del visor). */}
      {screen !== 'start' && (
        <RangeMenu value={zoneKey} onChange={startRun} onRestart={() => setScreen('start')} top={BACK ? 72 : undefined} />
      )}
    </>
  );
}
