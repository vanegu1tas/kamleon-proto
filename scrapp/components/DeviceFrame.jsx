import { useRef, useEffect, useState } from 'react';
import styles from './DeviceFrame.module.css';
import deviceImg from '../assets/device-frame.png';

// ?bare=1 (13/11, para grabar vídeo): solo la pantalla, 1280×800 exactos arriba a la izquierda, sin marco ni escala
export const BARE = new URLSearchParams(window.location.search).get('bare') === '1';

export default function DeviceFrame({ children }) {
  if (BARE) return <div className={styles.bare}><div className={styles.canvas}>{children}</div></div>;
  return <FramedDevice>{children}</FramedDevice>;
}

function FramedDevice({ children }) {
  const screenRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const s = Math.min(width / 1280, height / 800);
        if (s > 0) setScale(s);
      }
    });
    if (screenRef.current) observer.observe(screenRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.viewport}>
      <div className={styles.device}>
        {/* Screen content behind the frame */}
        <div className={styles.screen} ref={screenRef}>
          <div className={styles.canvas} style={{ transform: `scale(${scale})` }}>
            {children}
          </div>
        </div>
        {/* Device frame on top (transparent hole lets content show through) */}
        <img className={styles.frame} src={deviceImg} alt="" draggable={false} />
      </div>
    </div>
  );
}
