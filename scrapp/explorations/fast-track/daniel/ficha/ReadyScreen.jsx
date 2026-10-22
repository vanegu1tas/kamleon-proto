import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import styles from './ReadyScreen.module.css';
import SimulateButton from '../../../../components/SimulateButton';
import Avatar from './Avatar';
import { DOT_PATHS } from '../../../../components/LogoDots';

const TIMEOUT_S = 15;
const FLY_MS = 400;
const BACK_MS = 350;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EXIT_MS = 300;     // paso a Tracking: lo de Ready se apaga
const TRAVEL_MS = 700;   // paso a Tracking, "Logo viaja": el logo va a su sitio en Tracking
// Dónde está el símbolo en Tracking (PulseStatusScreen, 1280 × 800): 300 px, centrado en x, con su
// centro en y = TRACKING_LOGO_Y. Medido en la pantalla; si Tracking cambia, cambiar aquí.
const TRACKING_LOGO = { cx: 640, cy: 329, size: 300 };
const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Ready de la Ficha: la foto es un rectángulo como el de la ficha, no un círculo. Sin fondo propio (el del equipo va detrás).
 *
 * T3: la foto vuela desde su sitio en la plantilla (`from`, en coordenadas de la pantalla) hasta el
 *     centro y crece; después aparecen el saludo, la frase y el logo que respira. "‹ Back" arriba a la derecha.
 * T4: ref.leave() hace el camino contrario y avisa al terminar (para "‹ Back" y el tiempo de espera, que corre sin contador a la vista).
 * Con "reducir movimiento" no vuela: aparece con un fundido.
 */
const ReadyScreen = forwardRef(function ReadyScreen({ person, from, listening = 'logo', onNotYou, onSimulateFlow }, ref) {
  const photoRef = useRef(null);
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const [leaving, setLeaving] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [left, setLeft] = useState(TIMEOUT_S);

  // Delta entre el sitio final de la foto y el de la plantilla, para animar con transform (FLIP)
  function deltaFromRoster() {
    const el = photoRef.current;
    if (!el || !from) return null;
    const x = el.offsetLeft + el.offsetParent.offsetLeft;
    const y = el.offsetTop + el.offsetParent.offsetTop;
    const s = from.h / el.offsetHeight;   // misma proporción que en la ficha: escala uniforme
    return `translate(${from.x - x}px, ${from.y - y}px) scale(${s})`;
  }

  useLayoutEffect(() => {
    const d = deltaFromRoster();
    if (!d || REDUCED) return;
    photoRef.current.animate(
      [{ transform: d }, { transform: 'none' }],
      { duration: FLY_MS, easing: EASE, fill: 'backwards' },
    );
  }, []);

  useImperativeHandle(ref, () => ({
    leave(done) {
      setLeaving(true);
      const d = deltaFromRoster();
      if (!d || REDUCED) { setTimeout(done, 200); return; }
      photoRef.current
        .animate([{ transform: 'none' }, { transform: d }], { duration: BACK_MS, easing: EASE, fill: 'forwards' })
        .finished.then(done, done);
    },

    // Paso a Tracking (22/10). "fade": todo se apaga y después entra Tracking. "travel": todo se
    // apaga menos el logo, que crece y se va al sitio del de Tracking; al llegar, entra Tracking
    exit(mode, done) {
      if (exiting) return;
      setExiting(mode);
      const el = logoRef.current;
      if (mode !== 'travel' || !el || REDUCED) { setTimeout(done, EXIT_MS); return; }
      const root = rootRef.current.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = root.width / 1280;   // sin el scale() del marco
      const cx = (r.left - root.left + r.width / 2) / k;
      const cy = (r.top - root.top + r.height / 2) / k;
      const now = getComputedStyle(el).transform;   // donde iba de su respiración
      el.style.animation = 'none';
      // Tracking arranca cerrado y a tamaño 1: el logo llega así para que no brinque
      const s = TRACKING_LOGO.size / parseFloat(getComputedStyle(el).width);   // un <svg> no tiene offsetWidth
      el.animate(
        [
          { transform: now === 'none' ? 'none' : now, opacity: 1 },
          { transform: `translate(${TRACKING_LOGO.cx - cx}px, ${TRACKING_LOGO.cy - cy}px) scale(${s})`, opacity: 1 },
        ],
        { duration: TRAVEL_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
      ).finished.then(done, done);
    },
  }));

  useEffect(() => {
    if (leaving || exiting) return;
    if (left <= 0) { onNotYou(); return; }
    const t = setTimeout(() => setLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, leaving, exiting, onNotYou]);

  return (
    <div ref={rootRef} className={`${styles.screen} ${leaving ? styles.leaving : ''} ${exiting ? styles.exiting : ''} ${exiting === 'fade' ? styles.exitFade : ''} ${listening === 'ring' ? styles.ringBreath : ''}`}>
      <div className={styles.content}>
        {/* Ficha (22/10): la foto conserva la forma de la ficha (rectángulo con las mismas esquinas y
            la misma proporción) y lleva el dorsal encima, como en la ficha. Vuela todo junto: el
            vuelo solo crece, no cambia de forma */}
        <div
          ref={photoRef} className={styles.photoWrap}
          style={from ? { aspectRatio: `${from.w} / ${from.h}` } : undefined}
        >
          <Avatar person={person} className={styles.photo} initialsClassName={styles.initials} />
          {person.number != null && <span className={styles.badge}>{person.number}</span>}
        </div>
        {/* Layout (22/10): dos grupos. Quién eres (foto + saludo, juntos) y qué hacer (frase + logo
            que respira, juntos), separados por más aire que el que hay dentro de cada grupo */}
        <div className={styles.texts}>
          <h1 className={styles.greeting}>Hi, {person.short}</h1>
          <div className={styles.action}>
            <p className={styles.instruction}>Start to pee whenever you're ready</p>
            {/* "Escuchando" (22/10): el símbolo de Kamleon, pequeño y respirando. Es el mismo que gira
                y late en Tracking: más adelante uno puede convertirse en el otro */}
            {listening === 'logo' && (
              <svg ref={logoRef} className={styles.listening} viewBox="0 0 600 599" aria-hidden="true">
                {DOT_PATHS.map((d, i) => <path key={i} d={d} />)}
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Critique 22/10: la acción principal es orinar, no salir. El escape es un "‹ Back" discreto
          arriba a la derecha (donde está Staff en la plantilla) y el tiempo de espera corre por
          detrás, sin contador a la vista */}
      <button className={styles.back} onClick={onNotYou}>‹ Back</button>

      {/* Solo de la demo: abajo, fuera de la jerarquía de la pantalla */}
      <div className={styles.sim}>
        <SimulateButton label="Simulate flow detected" onClick={onSimulateFlow} />
      </div>
    </div>
  );
});

export default ReadyScreen;
