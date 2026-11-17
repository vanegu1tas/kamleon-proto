import LogoKamleon from '../../../../../design-system/icons/LogoKamleon';
import base from './C.module.css';

/**
 * Marco común de las pantallas de la C: halo de agua que respira y puntos del mandala (en C.module.css, en
 * .screen), tarjetas de vidrio (o relleno) y la cabecera con el escudo del club y KAMLEON®. El color del halo
 * llega como variable CSS (--c-halo) desde DirectionC.
 */
export default function ScreenC({ cards, club, header = true, back = false, headerRight = null, className = '', onClick, children }) {
  const cls = [base.screen, cards === 'fill' ? base.cardsFill : '', className].join(' ');
  return (
    <div className={cls} onClick={onClick}>
      {header && (
        <header className={base.header}>
          <div className={base.headerLeft}>
            {/* volver (Daniel, 17/11): p. ej. a la lista de equipos si se entró en el que no era */}
            {back && (
              <button className={base.backBtn} aria-label="Back">
                <svg width="14" height="24" viewBox="0 0 14 24" fill="none" aria-hidden="true">
                  <path d="M12 2L2 12l10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <img className={base.clubLogo} src={club.logo} alt={club.label} />
          </div>
          <div className={base.headerRight}>
            {headerRight}
            <LogoKamleon width={120} height={22} color="#A39E97" />
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
