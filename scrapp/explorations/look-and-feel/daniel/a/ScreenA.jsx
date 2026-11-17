import LogoKamleon from '../../../../../design-system/icons/LogoKamleon';
import base from './A.module.css';

/**
 * Marco común de todas las pantallas de la A: fondo (liso / luz arriba / foco), intensidad, tarjetas (borde o
 * relleno) y la cabecera con el escudo del club a la izquierda y KAMLEON® a la derecha.
 */
export default function ScreenA({ light, strength, cards, club, header = true, back = false, className = '', onClick, children }) {
  const cls = [
    base.screen,
    base[light] ?? '',
    strength === 'more' ? base.more : '',
    cards === 'fill' ? base.cardsFill : '',
    className,
  ].join(' ');
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
          <LogoKamleon width={120} height={22} color="#9E9E9E" />
        </header>
      )}
      {children}
    </div>
  );
}
