import { useState, useEffect, useRef } from 'react';
import DeviceFrame from '../../components/DeviceFrame';
import RingLoader from '../../components/RingLoader';
import SimulateButton from '../../components/SimulateButton';
import Keyboard from './Keyboard';
import UnitKeyboard from './UnitKeyboard';
import styles from './Wizard.module.css';

/**
 * Wizard actual (set up / instalación), emulado de Figma "Screen App"
 * (qr65pwQqo9hJT6MgfU2OLj, página "-- Review document"). Es la referencia: no se toca.
 *
 * Los marcos de Figma miden 479 × 299; aquí todo va × 2,673 para la pantalla de 1280 × 800.
 *
 * Recorrido:
 *   home → language → network ─ Ethernet ─────────────────────────────────→ ip
 *                             └ Wifi → searching → wifi → password → connecting → ip
 *   ip ─ Manual IP → manual ─┐
 *      └ Automatic (DHCP) ───┴→ configuring ─→ connected
 *                                        └ (falla) → error ─ Try again → configuring
 *   connected → unit (Unit ID) → verifying (5 frases bajo el mismo loader) → installed
 *                 ├ paso 1: cartucho no detectado → cartridge (sin botón; sigue al poner el cartucho)
 *                 ├ paso 4: no llega agua         → failed ─ Try again → verifying desde el paso 1
 *                 └ paso 5: no funciona bien      → failed ─ Try again → verifying desde el paso 1
 * Los fallos se fuerzan con los botones SIM.
 */

const SEARCH_DURATION  = 2500; // demo: búsqueda de redes
const CONNECT_DURATION = 2000; // demo: conexión a la wifi
const CONFIG_DURATION  = 4000; // demo: conexión a la red con la IP elegida (da tiempo a tocar el SIM)
const CONNECTED_PAUSE  = 2500; // demo: cuánto se ve "Connected" antes de verificar
const VERIFY_STEP      = 3000; // demo: cada frase de la verificación

// Verificación: mismo loader y título "Verifying"; cambia la frase. `fail` = el fallo que puede
// salir en ese paso (se fuerza con el SIM).
const VERIFY_STEPS = [
  { text: 'The S-Urinal will be ready in under a minute.', fail: 'cartridge' },
  { text: 'Cartridge successfully detected.' },
  { text: 'A water flush will be performed.' },
  { text: 'Activating the waterflush.',     fail: 'water' },
  { text: 'Ensuring proper functionality.', fail: 'function' },
];

const FAILURES = {
  water:    { sim: 'Simulate no water',       text: 'Water not detected, please ensure the water supply is functioning.' },
  function: { sim: 'Simulate test failure',   text: 'The cartridge cannot guarantee proper functionality.' },
};

const LANGUAGES = ['English', 'Español', 'Català', 'Deutsch', 'Português', '汉语'];

// Orden y candados tal como están en Figma (solo las tres últimas llevan candado).
const NETWORKS = [
  { name: 'MOVISTAR_PLUS_5G' },
  { name: 'MIWIFI_5G_REFp' },
  { name: 'DIRECT-31-HP OfficeJet Pro 7740' },
  { name: 'MiFibra-09F3',  locked: true },
  { name: 'MOVISTAR_1978', locked: true },
  { name: 'MOVISTAR_87B0', locked: true },
];

const BACK = {
  language: 'home',
  network:  'language',
  wifi:     'network',
  password: 'wifi',
  ip:       'network',
  manual:   'ip',
  unit:     'ip',
};

const IP_FIELDS = ['Device IP Adress', 'Subnet Mask', 'Gateway'];

export default function WizardRunner() {
  const [step, setStep]         = useState('home');
  const [network, setNetwork]   = useState(null);
  const [password, setPassword] = useState('');
  const [verifyStep, setVerifyStep] = useState(0);
  const [failure, setFailure]   = useState(null);
  const [unitId, setUnitId]     = useState('');

  const verify = (from = 0) => { setVerifyStep(from); setStep('verifying'); };

  useEffect(() => {
    if (step === 'searching') {
      const t = setTimeout(() => setStep('wifi'), SEARCH_DURATION);
      return () => clearTimeout(t);
    }
    if (step === 'connecting') {
      const t = setTimeout(() => setStep('ip'), CONNECT_DURATION);
      return () => clearTimeout(t);
    }
    if (step === 'configuring') {
      const t = setTimeout(() => setStep('connected'), CONFIG_DURATION);
      return () => clearTimeout(t);
    }
    if (step === 'connected') {
      const t = setTimeout(() => setStep('unit'), CONNECTED_PAUSE);
      return () => clearTimeout(t);
    }
    if (step === 'verifying') {
      const last = verifyStep === VERIFY_STEPS.length - 1;
      const t = setTimeout(() => last ? setStep('installed') : setVerifyStep(verifyStep + 1), VERIFY_STEP);
      return () => clearTimeout(t);
    }
  }, [step, verifyStep]);

  const back = BACK[step] && (() => setStep(BACK[step]));

  let screen;
  switch (step) {
    case 'home':
      screen = (
        <div className={styles.screen}>
          <h1 className={styles.welcome}>Welcome to the S-Urinal installation wizard</h1>
          <button className={styles.pill} onClick={() => setStep('language')}>Get started</button>
        </div>
      );
      break;
    case 'language':
      screen = (
        <ListScreen title="Select the language" onBack={back}
          items={LANGUAGES.map(l => ({ label: l }))}
          onSelect={() => setStep('network')} />
      );
      break;
    case 'network':
      screen = (
        <ListScreen title="Connect the S-Urinal" onBack={back}
          items={[{ label: 'Ethernet', id: 'ethernet' }, { label: 'Wireless (Wifi)', id: 'wifi' }]}
          onSelect={item => setStep(item.id === 'wifi' ? 'searching' : 'ip')} />
      );
      break;
    case 'searching':
      screen = (
        <StatusScreen title="Searching for networks" text="This may take a few seconds." />
      );
      break;
    case 'wifi':
      screen = (
        <ListScreen title="Select the WIFI network" onBack={back}
          items={NETWORKS.map(n => ({ label: n.name, locked: n.locked }))}
          onSelect={item => { setNetwork(item.label); setPassword(''); setStep('password'); }} />
      );
      break;
    case 'password':
    case 'connecting':
      screen = (
        <PasswordScreen network={network} password={password} onChange={setPassword}
          connecting={step === 'connecting'}
          onBack={back}
          onContinue={() => setStep('connecting')} />
      );
      break;
    case 'ip':
      screen = (
        <ListScreen title="Select your IP configuration" onBack={back}
          items={[{ label: 'Manual IP', id: 'manual' }, { label: 'Automatic (DHCP)', id: 'dhcp' }]}
          onSelect={item => setStep(item.id === 'manual' ? 'manual' : 'configuring')} />
      );
      break;
    case 'manual':
      // En Figma solo está con 0.0.0.0; cómo se edita cada campo no sale, así que no se edita.
      screen = (
        <div className={styles.screen}>
          <Header title="Manual IP configuration" onBack={back} />
          <div className={styles.listBox}>
            <ul className={styles.list}>
              {IP_FIELDS.map(label => (
                <li key={label}>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>{label}</span>
                    <span>0.0.0.0</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button className={styles.pill} onClick={() => setStep('configuring')}>Connect</button>
        </div>
      );
      break;
    case 'configuring':
      screen = (
        <StatusScreen title="Connecting" text="The S-Urinal is connecting to the network.">
          <div className={styles.sim}>
            <SimulateButton label="Simulate connection error" onClick={() => setStep('error')} />
          </div>
        </StatusScreen>
      );
      break;
    case 'connected':
      screen = <StatusScreen icon="done" title="Connected" text="Successfully connected to the network." />;
      break;
    case 'unit':
      screen = (
        <UnitIdScreen value={unitId} onChange={setUnitId} onBack={back}
          onContinue={() => verify(0)} />
      );
      break;
    case 'verifying': {
      const { text, fail } = VERIFY_STEPS[verifyStep];
      screen = (
        <StatusScreen title="Verifying" text={text}>
          {fail && (
            <div className={styles.sim}>
              <SimulateButton
                label={fail === 'cartridge' ? 'Simulate no cartridge' : FAILURES[fail].sim}
                onClick={() => {
                  if (fail === 'cartridge') return setStep('cartridge');
                  setFailure(fail);
                  setStep('failed');
                }} />
            </div>
          )}
        </StatusScreen>
      );
      break;
    }
    case 'cartridge':
      // En Figma no tiene botón: se entiende que sigue sola al detectar el cartucho.
      screen = (
        <StatusScreen icon="error" title="Cartridge not detected" text="Install or check the cartridge connection.">
          <div className={styles.sim}>
            <SimulateButton label="Simulate cartridge inserted" onClick={() => verify(1)} />
          </div>
        </StatusScreen>
      );
      break;
    case 'failed':
      screen = (
        <StatusScreen icon="error" raised title="Installation failed" text={FAILURES[failure].text}>
          <button className={`${styles.pill} ${styles.pillRaised}`} onClick={() => verify(0)}>Try again</button>
        </StatusScreen>
      );
      break;
    case 'installed':
      screen = <StatusScreen icon="done" title="Installation Completed" text="The S-Urinal will restart and be ready for use." />;
      break;
    case 'error':
      screen = (
        <StatusScreen icon="error" title="Connection error" text="Check network connection and try again.">
          <button className={`${styles.pill} ${styles.pillLow}`} onClick={() => setStep('configuring')}>Try again</button>
        </StatusScreen>
      );
      break;
    default:
      screen = null;
  }

  return <DeviceFrame>{screen}</DeviceFrame>;
}

// Pantalla de estado: loader, check (done) o triángulo rojo (error); título y una línea debajo.
// `raised`: con mensaje largo + botón (Installation failed) todo sube 28 px de Figma.
function StatusScreen({ icon = 'loader', title, text, raised, children }) {
  const done = icon === 'done';
  return (
    <div className={`${styles.screen} ${raised ? styles.raised : ''}`}>
      {icon === 'loader' && <div className={styles.loader}><RingLoader size={305} /></div>}
      {done && (
        <svg className={styles.icon} width="1280" height="800" viewBox="0 0 1280 800" fill="none">
          <path d="M582 329L628 375L698 285" stroke="var(--color-turquoise-51)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {icon === 'error' && (
        <svg className={styles.icon} width="1280" height="800" viewBox="0 0 1280 800" fill="none"
          stroke="#fc664e" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
          <path d="M616 208Q640 168 664 208L777 412Q797 458 747 458H533Q483 458 503 412Z" />
          <path d="M640 302V378" />
          <circle cx="640" cy="408" r="3" fill="#fc664e" />
        </svg>
      )}
      <p className={`${styles.loaderTitle} ${done ? styles.loaderTitleDone : ''} ${icon === 'error' ? styles.loaderTitleError : ''}`}>{title}</p>
      <p className={`${styles.loaderText} ${done ? styles.loaderTextDone : ''}`}>{text}</p>
      {children}
    </div>
  );
}

function Header({ title, onBack }) {
  return (
    <>
      {onBack && (
        <button className={styles.back} onClick={onBack} aria-label="Back">
          <svg width="20" height="34" viewBox="0 0 20 34" fill="none">
            <path d="M17 3L3 17L17 31" stroke="#fafafa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <h2 className={styles.title}>{title}</h2>
    </>
  );
}

// Lista en caja redondeada: se ven 3 filas como máximo; si hay más, se desplaza
// y aparece la barra de la derecha (gris con el tramo turquesa).
function ListScreen({ title, onBack, items, onSelect }) {
  const listRef = useRef(null);
  const [scroll, setScroll] = useState({ top: 0, ratio: 1 });
  const scrollable = items.length > 3;

  useEffect(() => {
    const el = listRef.current;
    if (el) setScroll({ top: 0, ratio: el.clientHeight / el.scrollHeight });
  }, [items.length]);

  function handleScroll(e) {
    const el = e.currentTarget;
    setScroll({ top: el.scrollTop / el.scrollHeight, ratio: el.clientHeight / el.scrollHeight });
  }

  return (
    <div className={styles.screen}>
      <Header title={title} onBack={onBack} />
      <div className={`${styles.listBox} ${items.length <= 2 ? styles.listBoxShort : ''}`}>
        <ul className={styles.list} ref={listRef} onScroll={handleScroll}>
          {items.map(item => (
            <li key={item.label}>
              <button className={styles.row} onClick={() => onSelect(item)}>
                <span>{item.label}</span>
                {item.locked && <LockIcon />}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {scrollable && (
        <div className={styles.scrollTrack}>
          <div className={styles.scrollThumb}
            style={{ top: `${scroll.top * 100}%`, height: `${scroll.ratio * 100}%` }} />
        </div>
      )}
    </div>
  );
}

// Unit ID: no está en Figma; sale de la foto de producción del brief (Wizard v2, pantalla 05).
// Producción usa aquí otro teclado (blanco, con números y "Close"). Qué hay tras cerrar el
// teclado no se ve en la foto: se supone un Continue como en la contraseña.
function UnitIdScreen({ value, onChange, onBack, onContinue }) {
  const [keyboardOpen, setKeyboardOpen] = useState(true);

  return (
    <div className={styles.screen}>
      <Header title="Please input unit ID" onBack={onBack} />

      <div className={`${styles.field} ${styles.fieldUnit}`} onClick={() => setKeyboardOpen(true)}>
        <span className={styles.fieldNetwork}>Unit ID:</span>
        <span className={styles.fieldValueLeft}>
          {value}
          {keyboardOpen && <span className={styles.caret}>|</span>}
        </span>
      </div>

      {keyboardOpen ? (
        <UnitKeyboard
          onKey={ch => onChange(value + ch)}
          onDelete={() => onChange(value.slice(0, -1))}
          onClose={() => setKeyboardOpen(false)} />
      ) : (
        <button className={styles.pill} disabled={!value} onClick={onContinue}>Continue</button>
      )}
    </div>
  );
}

function PasswordScreen({ network, password, onChange, connecting, onBack, onContinue }) {
  const [keyboardOpen, setKeyboardOpen] = useState(true);
  const [visible, setVisible] = useState(false);
  const shown = visible ? password : '•'.repeat(password.length);

  return (
    <div className={styles.screen}>
      <Header title="Introduce the password" onBack={onBack} />

      <div className={`${styles.field} ${keyboardOpen ? styles.fieldTyping : ''}`}
        onClick={() => !connecting && setKeyboardOpen(true)}>
        <span className={styles.fieldNetwork}>{network}</span>
        <span className={styles.fieldValue}>
          {shown}
          {keyboardOpen && <span className={styles.caret}>|</span>}
        </span>
        <button className={styles.eye} aria-label="Show password"
          onClick={e => { e.stopPropagation(); setVisible(v => !v); }}>
          <EyeIcon />
        </button>
      </div>

      {keyboardOpen ? (
        <Keyboard
          onKey={ch => onChange(password + ch)}
          onDelete={() => onChange(password.slice(0, -1))}
          onDone={() => setKeyboardOpen(false)} />
      ) : (
        <button className={`${styles.pill} ${connecting ? styles.pillBusy : ''}`}
          disabled={connecting || !password} onClick={onContinue}>
          {connecting ? <span className={styles.spinner} /> : 'Continue'}
        </button>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg className={styles.lock} width="19" height="19" viewBox="0 0 16 16" fill="#fafafa">
      <path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-6A1.5 1.5 0 0 1 3.5 7H4Zm2 0h4V5a2 2 0 1 0-4 0v2Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#808285" strokeWidth="2">
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
