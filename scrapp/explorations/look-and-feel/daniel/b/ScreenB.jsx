import LogoKamleon from '../../../../../design-system/icons/LogoKamleon';
import base from './B.module.css';

/**
 * Marco común de las pantallas de la B: fondo tintado (en B.module.css, .screen), tarjetas de tono (o tinte) y la
 * cabecera con el escudo del club y KAMLEON®.
 */
export default function ScreenB({ cards, club, header = true, back = false, className = '', onClick, children }) {
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
          <LogoKamleon width={120} height={22} color="#8A97A0" />
        </header>
      )}
      {children}
    </div>
  );
}
