// Provisional (29/10): pantalla + sensor, mismos tonos que IconSbUnit. Falta el de Figma.
export default function IconSbDevices({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="13" height="9" rx="1.5" fill="var(--icon-secondary, #9CA3AF)"/>
      <rect x="7.5" y="13" width="2" height="4" fill="var(--icon-secondary, #9CA3AF)"/>
      <rect x="5" y="17" width="7" height="2" rx="1" fill="var(--icon-secondary, #9CA3AF)"/>
      <rect x="16.5" y="8" width="5.5" height="12" rx="2.75" fill="var(--icon-primary, white)"/>
      <circle cx="19.25" cy="11.5" r="1" fill="var(--icon-accent, #0B0F12)"/>
    </svg>
  );
}
