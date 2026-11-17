import { useEffect, useRef } from 'react';
import { teamBase, cssRgb, hexToRgb } from './theme';

// Fondo vivo con el color del equipo: el mismo ruido de la landing, en versión ligera para el
// hardware de la unidad (pensado para portarse a un ShaderEffect de Qt Quick):
//   · 3 capas de ruido en vez de 5
//   · se calcula a media resolución y se escala (¼ de los píxeles)
//   · movimiento muy lento
//   · sin WebGL o con "reducir movimiento" queda el color base plano (la reserva si Qt no da)
//
// Neutro (22/10, a prueba): el color de Kamleon es casi negro y × TEAM_MIX quedaba negro plano, sin
// vetas. Dos opciones (`neutral`):
//   graphite  A · el gris oscuro del DS (--color-grey-11) como base, sin mezclar con negro
//   glow      B · el mismo grafito + un resplandor turquesa muy suave que entra por abajo a la
//             derecha y se mueve lento

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  uniform vec2  u_res;
  uniform float u_time;
  uniform vec3  u_base;   // color del equipo ya mezclado con negro (o el grafito del neutro)
  uniform float u_glow;   // 1 = resplandor turquesa (neutro B)

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t = u_time * 0.06;
    vec2 q = vec2(fbm(uv * 1.3 + t * 0.4), fbm(uv * 1.3 + vec2(3.7, 1.9) + t * 0.35));
    float n = fbm(uv * 1.1 + q * 0.55 + t * 0.22);
    // vetas: del base hacia un poco más oscuro y un poco más claro, sin salirse del rango oscuro
    vec3 col = mix(u_base * 0.55, u_base * 1.35, smoothstep(0.25, 0.85, n));
    // resplandor: desde abajo a la derecha, deriva despacio y lo rompen las mismas vetas
    vec2 c = vec2(0.88 + 0.06 * sin(u_time * 0.05), 0.10 + 0.06 * cos(u_time * 0.04));
    vec2 d = (uv - c) * vec2(u_res.x / u_res.y, 1.0);
    float g = exp(-dot(d, d) * 2.2) * (0.55 + 0.45 * n);
    col += vec3(0.184, 0.835, 0.796) * g * 0.16 * u_glow;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const RESOLUTION = 0.5;

// Grafito del neutro: --color-grey-11
const GRAPHITE = '#161d24';

export default function TeamBackground({ color, neutral = null, className }) {
  const canvasRef = useRef(null);
  const base = neutral ? hexToRgb(GRAPHITE) : teamBase(color);
  const baseRef = useRef(base);
  baseRef.current = base;
  const glowRef = useRef(0);
  glowRef.current = neutral === 'glow' ? 1 : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uBase = gl.getUniformLocation(prog, 'u_base');
    const uGlow = gl.getUniformLocation(prog, 'u_glow');

    // clientWidth no cambia con el scale() del marco: siempre 1280 × 800
    canvas.width = Math.round(canvas.clientWidth * RESOLUTION);
    canvas.height = Math.round(canvas.clientHeight * RESOLUTION);
    gl.viewport(0, 0, canvas.width, canvas.height);

    let raf, start = performance.now();
    function frame(now) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform3fv(uBase, baseRef.current);
      gl.uniform1f(uGlow, glowRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      // el color base también va en CSS: es lo que se ve sin WebGL, y la transición entre equipos
      style={{ background: cssRgb(base) }}
    />
  );
}
