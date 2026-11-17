import { useState, useRef, useEffect } from 'react';
import DeviceFrame from '../../../components/DeviceFrame';
import TrackingScreen from '../../fast-track/daniel/screens/TrackingScreen';
import Exploration5, { scoreToAngle5, getZoneIndex5, GAUGE_START } from './ScoreVideo';
import styles from './FlowRunner.module.css';

// Vídeo para la presentación (13/11). El tramo Tracking → Score de Fast Track (el mandala de la 07, 3 s, y el
// mismo paso al score con fundido) con el score final de #/score/5 (Daniel, 13/11): Text color = Color,
// Text layout = Stacked, Zone style = Option B, Timer = Timer B (Breathe sin tocar: On).
// El score va fijo para que el vídeo salga siempre igual: ?score=75 por defecto. Clic en la pantalla = repetir.
// Se graba con ?bare=1 (solo la pantalla). El Tracking se importa sin tocarlo; el score es una copia (ScoreVideo.jsx).

const QUERY = new URLSearchParams(window.location.search);
const SCORE = Math.max(0, Math.min(100, Number(QUERY.get('score') ?? 75)));
const TRACKING_DURATION = 3000;
const SCORE_MS = 2200;
// Transición A (Daniel, 13/11): fundido cruzado. El Tracking se desvanece y crece un poco mientras el score
// aparece debajo, a la vez, sin hueco en negro
const CROSSFADE_MS = 800;
const TRACKING_OUT_MS = 500; // el mandala se va antes de que acabe de entrar el score (= .crossOut)
// El vídeo acaba cuando termina el contador (Daniel, 13/11): la grabación espera a esta marca. Función fija
// (fuera del componente): Exploration5 reinicia el contador si cambia onTimeout
const markDone = () => { document.body.dataset.videoDone = '1'; };

export default function VideoFlow() {
  const [run, setRun] = useState(0);
  const [step, setStep] = useState('tracking');
  const [trackingOut, setTrackingOut] = useState(false); // el Tracking sigue encima mientras se desvanece
  const [displayScore, setDisplayScore] = useState(0);
  const [animAngle, setAnimAngle] = useState(null);
  const [glowZoneIdx, setGlowZoneIdx] = useState(null);
  const [textStage, setTextStage] = useState(null);
  const rafRef = useRef(null);

  function playScore() {
    const targetAngle = scoreToAngle5(SCORE);
    const targetZoneIdx = getZoneIndex5(SCORE);
    setDisplayScore(0);
    setAnimAngle(GAUGE_START);
    setGlowZoneIdx(null);
    setTextStage(null);
    let glowTriggered = false;
    setTimeout(() => {
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / SCORE_MS, 1);
        const ease = Math.sin(p * Math.PI / 2);
        setAnimAngle(GAUGE_START + ease * (targetAngle - GAUGE_START));
        setDisplayScore(Math.round(ease * SCORE));
        if (!glowTriggered && p >= 0.85) {
          glowTriggered = true;
          setGlowZoneIdx(targetZoneIdx);
          setTextStage('you-are');
          setTimeout(() => setTextStage('full'), 250);
        }
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
        else { setAnimAngle(targetAngle); setDisplayScore(SCORE); }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, CROSSFADE_MS); // el número no arranca hasta que el mandala se ha ido (13/11: si no, el 0 y los puntos se pisaban)
  }

  useEffect(() => {
    delete document.body.dataset.videoDone;
    setStep('tracking');
    setTrackingOut(false);
    let t2;
    const t = setTimeout(() => {
      setStep('score'); setTrackingOut(true); playScore();
      t2 = setTimeout(() => setTrackingOut(false), TRACKING_OUT_MS);
    }, TRACKING_DURATION);
    return () => { clearTimeout(t); clearTimeout(t2); cancelAnimationFrame(rafRef.current); };
  }, [run]);

  return (
    <DeviceFrame>
      <div className={styles.stage} onClick={() => setRun(r => r + 1)}>
        {step === 'score' && (
          <div key={`s${run}`} className={styles.crossIn}>
            <Exploration5
              score={displayScore} animAngle={animAngle} glowZoneIdx={glowZoneIdx} textStage={textStage}
              coloredText textLayout="stacked" zoneShape="round" timerStyle="alt"
              onTimeout={markDone}
            />
          </div>
        )}
        {(step === 'tracking' || trackingOut) && (
          <div key={`t${run}`} className={`${trackingOut ? styles.crossOut : styles.fadeIn} ${styles.noBg}`}><TrackingScreen /></div>
        )}
      </div>
    </DeviceFrame>
  );
}
