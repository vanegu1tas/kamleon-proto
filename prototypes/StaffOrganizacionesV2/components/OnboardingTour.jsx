import { useState, useEffect, useLayoutEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../../design-system/components/Button/Button';
import { TOUR_STEPS } from './tourSteps';
import styles from './OnboardingTour.module.css';

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function seenKey(role) {
  return `kamleon_tour_seen_${role}`;
}

// ─── Spotlight: recorta el overlay oscuro sobre el elemento real ──

function useTargetRect(selector, beforeShow) {
  // Guardamos también a qué selector corresponde el rect. React no garantiza que el
  // reset a null (en el layout effect de abajo) se vea reflejado antes de que otro
  // efecto del mismo componente lea el valor "viejo" — así que en vez de confiar en
  // el timing, el hook devuelve null explícitamente si el rect que tiene guardado no
  // es el del selector actual, sin importar el orden en que corran los efectos.
  const [state, setState] = useState({ rect: null, selector: null });

  useLayoutEffect(() => {
    if (!selector) { setState({ rect: null, selector }); return; }

    let attempts = 0;
    let raf;
    let cancelled = false;

    // En mobile/tablet el target puede vivir detrás de una navegación (p. ej. "entrar"
    // a un centro/equipo antes de ver su "+"). beforeShow dispara esa navegación.
    beforeShow?.();

    function measure() {
      if (cancelled) return;
      const el = document.querySelector(selector);
      // El target puede existir en el DOM pero oculto vía CSS (display:none en el panel
      // de detalle en mobile/tablet) — eso da un rect con width/height en 0, no un `el`
      // nulo. Hay que seguir reintentando hasta que tenga tamaño real, no solo hasta que exista.
      const r = el ? el.getBoundingClientRect() : null;
      if (r && r.width > 0 && r.height > 0) {
        setState({ rect: r, selector });
      } else if (attempts < 30) {
        attempts += 1;
        raf = requestAnimationFrame(measure);
      }
    }

    // Tanto el slide de pantalla completa (cambio de rol/paso) como el slide del panel
    // de detalle (mobile/tablet) animan con transform durante ~220-300ms. Medir en medio
    // de esas transiciones da coordenadas corridas o directamente fuera de la pantalla.
    // Se espera a que terminen antes de medir una sola vez, en vez de adivinar cuándo
    // "se ve estable" frame a frame.
    const settleTimer = setTimeout(measure, 350);

    function onResize() {
      const el = document.querySelector(selector);
      if (el) setState({ rect: el.getBoundingClientRect(), selector });
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      clearTimeout(settleTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [selector, beforeShow]);

  return state.selector === selector ? state.rect : null;
}

function SpotlightCard({ rect, stepIndex, stepCount, title, body, isFirst, isLast, onBack, onNext, onSkip }) {
  const cardRef = useRef(null);
  const [cardPos, setCardPos] = useState(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    const gap = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!rect) {
      setCardPos({ top: vh / 2 - cardRect.height / 2, left: vw / 2 - cardRect.width / 2 });
      return;
    }

    let top = rect.bottom + gap;
    if (top + cardRect.height > vh - 16) top = rect.top - cardRect.height - gap;
    top = Math.max(16, Math.min(top, vh - cardRect.height - 16));

    let left = rect.left;
    left = Math.max(16, Math.min(left, vw - cardRect.width - 16));

    setCardPos({ top, left });
  }, [rect, stepIndex]);

  return (
    <>
      {rect ? (
        <div
          className={styles.spotlightHole}
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
        />
      ) : (
        <div className={styles.dimFull} />
      )}

      <div
        ref={cardRef}
        className={styles.tooltipCard}
        style={cardPos ? { top: cardPos.top, left: cardPos.left, opacity: 1 } : { top: -9999, left: -9999, opacity: 0 }}
      >
        <span className={styles.stepCount}>{stepIndex + 1} of {stepCount}</span>
        <h3 className={styles.tooltipTitle}>{title}</h3>
        <p className={styles.tooltipBody}>{body}</p>
        <div className={styles.tooltipActions}>
          {!isFirst ? (
            <button className={styles.backLink} onClick={onBack}>
              <ArrowLeftIcon /> Back
            </button>
          ) : <span />}
          <div className={styles.tooltipActionsRight}>
            <button className={styles.skipLink} onClick={onSkip}>Skip</button>
            <Button variant="primary" size="s" onClick={onNext}>{isLast ? 'Get started' : 'Next'}</Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Welcome modal ──────────────────────────────────────

function WelcomeModal({ title, body, onSkip, onStart }) {
  return (
    <div className={styles.welcomeOverlay}>
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeArt}>
          <div className={styles.welcomeArtCircle} />
        </div>
        <div className={styles.welcomeBody}>
          <h2 className={styles.welcomeTitle}>{title}</h2>
          <p className={styles.welcomeText}>{body}</p>
          <div className={styles.welcomeActions}>
            <button className={styles.skipLink} onClick={onSkip}>Skip</button>
            <Button variant="primary" size="s" onClick={onStart}>Take a tour</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────
// Uso: <OnboardingTour ref={tourRef} role={role} userName={user.name} orgName={org.name} />
// El padre puede disparar una repetición manual (menú del avatar → "Take a tour")
// llamando a tourRef.current.replay(), que saltea el modal de bienvenida.

const OnboardingTour = forwardRef(function OnboardingTour({ role, userName, orgName }, ref) {
  const config = TOUR_STEPS[role];
  const [phase, setPhase]         = useState('closed'); // closed | welcome | spotlight
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setPhase('closed');
    setStepIndex(0);
    if (!config) return;
    if (!localStorage.getItem(seenKey(role))) {
      setPhase('welcome');
    }
  }, [role, config]);

  const markSeen = useCallback(() => {
    localStorage.setItem(seenKey(role), '1');
  }, [role]);

  function closeTour() {
    markSeen();
    setPhase('closed');
  }

  function startSpotlight() {
    setStepIndex(0);
    setPhase('spotlight');
  }

  useImperativeHandle(ref, () => ({
    // Repite el tour saltando directo al spotlight (sin welcome) — comportamiento final del botón "Take a tour".
    replay() {
      if (!config) return;
      startSpotlight();
    },
    // Repite el tour completo, empezando otra vez por el welcome — solo para probar mientras se ajustan
    // animaciones/copys. Borra el flag de "ya visto" en localStorage.
    restart() {
      if (!config) return;
      localStorage.removeItem(seenKey(role));
      setStepIndex(0);
      setPhase('welcome');
    },
  }), [config, role]);

  const steps = config?.steps ?? [];
  const step = steps[stepIndex];
  const rect = useTargetRect(step?.target ?? null, step?.beforeShow);

  // El contenido visible de la tarjeta se queda en el paso anterior hasta que la posición
  // del nuevo paso ya está lista (rect resuelto) — así el texto y la posición cambian
  // siempre juntos, nunca el texto solo mientras la tarjeta sigue apuntando al lugar viejo.
  const [displayed, setDisplayed] = useState(() => ({ step, stepIndex, rect }));

  useEffect(() => {
    const ready = !step?.target || rect;
    if (ready) setDisplayed({ step, stepIndex, rect });
  }, [step, stepIndex, rect]);

  if (!config || phase === 'closed') return null;

  return createPortal(
    phase === 'welcome' ? (
      <WelcomeModal
        title={config.welcome.title(userName)}
        body={config.welcome.body(orgName)}
        onSkip={closeTour}
        onStart={startSpotlight}
      />
    ) : (
      <div className={styles.spotlightOverlay}>
        <SpotlightCard
          rect={displayed.rect}
          stepIndex={displayed.stepIndex}
          stepCount={steps.length}
          title={displayed.step.title}
          body={displayed.step.body}
          isFirst={displayed.stepIndex === 0}
          isLast={displayed.stepIndex === steps.length - 1}
          onBack={() => setStepIndex(i => Math.max(0, i - 1))}
          onNext={() => {
            if (stepIndex === steps.length - 1) closeTour();
            else setStepIndex(i => i + 1);
          }}
          onSkip={closeTour}
        />
      </div>
    ),
    document.body
  );
});

export default OnboardingTour;
