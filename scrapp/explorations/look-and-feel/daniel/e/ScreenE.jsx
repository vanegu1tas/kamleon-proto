import LogoKamleon from '../../../../../design-system/icons/LogoKamleon';
import Stage from './Stage';
import base from './E.module.css';

/**
 * Marco común de las pantallas de la E: el escenario detrás (Stage: agua de semitono), la
 * cabecera con volver (opcional), el escudo y KAMLEON®, y encima el contenido de cada pantalla.
 */
export default function ScreenE({ panels = 'none', water, motion = 'slow', stagePosition = 'center', neutral = false, logoBottom = false, cards, club, header = true, back = false, className = '', onClick, children }) {
  const cls = [base.screen, cards === 'fill' ? base.cardsFill : '', className].join(' ');
  return (
    // panels 'none' (Daniel, 17/11): sin cajas grandes; lo negro translúcido solo en las piezas que se tocan (E.module.css)
    <div className={cls} onClick={onClick} data-panels={panels}>
      <Stage water={{ ...water, center: stagePosition === 'left' ? [0.3, 0.5] : [0.5, 0.5] }} motion={motion} neutral={neutral} />
      {header && (
        <header className={base.header}>
          <div className={base.headerLeft}>
            {back && (
              <button className={base.backBtn} aria-label="Back">
                <svg width="14" height="24" viewBox="0 0 14 24" fill="none" aria-hidden="true">
                  <path d="M12 2L2 12l10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <img className={base.clubLogo} src={club.logo} alt={club.label} />
          </div>
          {!logoBottom && <LogoKamleon width={120} height={22} color="#9A9A9A" />}
        </header>
      )}
      {/* con un panel lateral a la derecha, KAMLEON® baja a la esquina de abajo a la izquierda */}
      {header && logoBottom && <div className={base.logoBottom}><LogoKamleon width={120} height={22} color="#9A9A9A" /></div>}
      {children}
    </div>
  );
}
