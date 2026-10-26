import { useState } from 'react';
import styles from './Keyboard.module.css';

/**
 * Teclado en pantalla del wizard actual. En Figma es el de iPad (modo oscuro); se emula
 * su disposición. El ancho de cada tecla es el de Figma (`w`, en px del marco de 479).
 */
const ROWS = [
  [{ id: 'tab', label: 'tab', w: 41, fn: true }, ...'qwertyuiop'.split('').map(c => ({ ch: c })),
    { id: 'delete', label: 'delete', w: 41, fn: true, right: true }],
  [{ id: 'caps', label: 'caps lock', w: 55, fn: true }, ...'asdfghjkl'.split('').map(c => ({ ch: c })),
    { id: 'return', label: 'return', w: 66, fn: true, right: true }],
  [{ id: 'shift', label: 'shift', w: 72, fn: true }, ...'zxcvbnm'.split('').map(c => ({ ch: c })),
    { ch: ',' }, { ch: '.' }, { id: 'shift', label: 'shift', w: 49, fn: true, right: true }],
  [{ id: 'none', label: '', w: 33, fn: true }, { id: 'none', label: '.?123', w: 33, fn: true },
    { id: 'none', label: '', w: 33, fn: true }, { ch: ' ', label: '', w: 243 },
    { id: 'none', label: '.?123', w: 49, fn: true, right: true }, { id: 'return', label: '', w: 49, fn: true, right: true }],
];

export default function Keyboard({ onKey, onDelete, onDone }) {
  const [shift, setShift] = useState(false);
  const [caps, setCaps]   = useState(false);
  const upper = shift || caps;

  function press(key) {
    if (key.ch !== undefined) {
      onKey(upper ? key.ch.toUpperCase() : key.ch);
      setShift(false);
    } else if (key.id === 'delete') onDelete();
    else if (key.id === 'return') onDone();
    else if (key.id === 'shift') setShift(s => !s);
    else if (key.id === 'caps') setCaps(c => !c);
  }

  return (
    <div className={styles.keyboard}>
      <div className={styles.suggestions}>
        <span>“The”</span><span>They</span><span>There</span>
      </div>
      {ROWS.map((row, r) => (
        <div key={r} className={styles.row}>
          {row.map((key, i) => (
            <button key={i}
              className={`${styles.key} ${key.fn ? styles.fn : ''} ${key.right ? styles.right : ''}`}
              style={{ flexGrow: key.w ?? 32 }}
              onClick={() => press(key)}>
              {key.label ?? (upper ? key.ch.toUpperCase() : key.ch)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
