const SIZE = 21;

// Patrón fijo (no es un QR real, es decorativo) con los 3 finder squares
// típicos de un QR en las esquinas, como en la captura.
function finderOn(x, y, cx, cy) {
  const lx = x - cx, ly = y - cy;
  const ring = Math.min(lx, ly, 6 - lx, 6 - ly);
  return ring === 0 || ring === 2;
}

function cellOn(x, y) {
  const corners = [[0, 0], [SIZE - 7, 0], [0, SIZE - 7]];
  for (const [cx, cy] of corners) {
    if (x >= cx && x < cx + 7 && y >= cy && y < cy + 7) {
      return finderOn(x, y, cx, cy);
    }
  }
  // relleno pseudo-aleatorio determinístico
  return ((x * 928371 + y * 12923 + x * y) % 5) < 2;
}

export default function QrPlaceholder({ size = 120, color = 'var(--color-turquoise-51)' }) {
  const cell = size / SIZE;
  const cells = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (cellOn(x, y)) {
        cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color} />);
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells}
    </svg>
  );
}
