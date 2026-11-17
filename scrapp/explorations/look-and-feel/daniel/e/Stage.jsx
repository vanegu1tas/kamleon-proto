import { useEffect, useRef } from 'react';
import styles from './Stage.module.css';

/**
 * Escenario de la E (17/11). Agua de semitono detrás de la interfaz en todas las pantallas: puntitos diminutos
 * (rejilla de 8 px, el radio de cada punto sigue a la luz) que forman olas abajo; al entrar en la pantalla el agua
 * sube, y luego dos olas viajan en sentidos contrarios y unos destellos recorren la superficie. Turquesa → azul.
 * Forma (Daniel, 17/11): 'wave' = ola abajo · 'sphere' = esfera que se esparce desde el centro (como una gota).
 * Ajustes (engranaje): height (altura del agua, o tamaño de la esfera), strength (intensidad), speed (velocidad), motion 'still' (quieta).
 * dim → más apagado (PIN) · neutral → gris (Score). Resolución completa: los puntos son de 2–3 px.
 */
export default function Stage({ neutral = false, dim = false, motion = 'slow', water = {} }) {
  return (
    <div className={styles.stage} aria-hidden="true">
      <Shader neutral={neutral} dim={dim} still={motion === 'still'} {...WATER_PRESETS(water)} />
    </div>
  );
}

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const COMMON = `
precision mediump float;
uniform vec2 res; uniform float t; uniform float gain; uniform float neutral; uniform float u_h; uniform float u_s; uniform float u_shape; uniform vec2 u_c; uniform vec3 u_tint; uniform float u_useTint;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 4; k++){ v += a*n(p); p *= 2.03; a *= 0.5; } return v; }
vec3 grey(vec3 c){ float l = dot(c, vec3(0.3, 0.5, 0.2)); return mix(c, vec3(l), neutral); }
`;

// Agua de semitono. Suave (Daniel, 17/11: estaba muy fuerte) y viva. u_h = altura, u_s = intensidad, u_v = velocidad.
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const WATER_PRESETS = ({ height = 'mid', strength = 'soft', speed = 'calm', shape = 'wave', center = [0.5, 0.5], tint = null }) => ({
  tint: tint ? hex(tint) : null,
  shape: shape === 'sphere' ? 1 : 0,
  c: center,
  h: { low: 0.2, mid: 0.3, high: 0.42 }[height],
  k: { faint: 0.6, soft: 1.0, more: 1.6 }[strength],
  v: { slow: 0.5, calm: 1.0, lively: 1.8 }[speed],
});
const WATER = COMMON + `
void main(){
  vec2 uv = gl_FragCoord.xy / res;
  float rise = smoothstep(0.0, 1.8, t);
  float level = u_h + 0.045*sin(uv.x*4.0 - t*0.7) + 0.025*sin(uv.x*9.0 + t*1.1) + 0.05*(fbm(vec2(uv.x*2.5 - t*0.12, t*0.1)) - 0.5);
  level *= rise;
  float light = smoothstep(level, level - 0.36, uv.y);
  if (u_shape > 0.5) {
    // esfera que se esparce: una gota que se abre desde el centro (1,8 s) y luego respira; borde ondulado y
    // anillos que viajan hacia fuera, como cuando cae una gota en el agua
    vec2 q = (gl_FragCoord.xy - u_c*res) / res.y;
    float d = length(q);
    float ang = atan(q.y, q.x);
    float R = (0.16 + u_h) * (0.15 + 0.85*rise) + 0.02*sin(t*0.5) + 0.03*(fbm(vec2(ang*1.5, t*0.15)) - 0.5);
    light = smoothstep(R, R - 0.30, d);
    light *= 0.75 + 0.25*sin(d*28.0 - t*1.6);                  // anillos hacia fuera
  }
  float shimmer = fbm(uv*vec2(7.0, 4.0) + vec2(t*0.22, -t*0.08));   // destellos que viajan
  light *= 0.55 + 0.45*shimmer;
  float cell = 8.0;
  vec2 g = gl_FragCoord.xy / cell;
  g.x += 0.5 * mod(floor(g.y), 2.0);
  vec2 f = fract(g) - 0.5;
  float r = 0.40 * light;
  float dotm = smoothstep(r, r - 0.12, length(f));
  vec3 water = mix(vec3(0.07, 0.30, 0.55), vec3(0.18, 0.84, 0.80), smoothstep(0.0, 1.0, uv.x + 0.3*sin(t*0.15)));
  if (u_useTint > 0.5) water = u_tint;                         // Score: el color de la zona
  vec3 col = (water * (0.02 + 0.10*light*light) + water * dotm * (0.14 + 0.32*light)) * u_s;
  gl_FragColor = vec4(grey(col) * gain, 1.0);
}`;

function Shader({ neutral, dim, still, h, k, v, shape, c: center, tint }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const gl = c.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return undefined;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, WATER));
    gl.linkProgram(prog); gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = name => gl.getUniformLocation(prog, name);
    gl.uniform2f(u('res'), c.width, c.height);
    gl.uniform1f(u('gain'), neutral ? 0.6 : dim ? 0.55 : 1.0);
    gl.uniform1f(u('neutral'), neutral ? 1 : 0);
    gl.uniform1f(u('u_h'), h);
    gl.uniform1f(u('u_s'), k);
    gl.uniform1f(u('u_shape'), shape);
    gl.uniform2f(u('u_c'), center[0], center[1]);
    gl.uniform1f(u('u_useTint'), tint ? 1 : 0);
    if (tint) gl.uniform3f(u('u_tint'), ...tint);
    let raf; const t0 = performance.now();
    const draw = now => {
      // la velocidad escala el tiempo del agua; la subida del principio va siempre a su ritmo (1,8 s)
      const secs = (now - t0) / 1000;
      gl.uniform1f(u('t'), still ? 6 : (secs < 1.8 ? secs : 1.8 + (secs - 1.8) * v));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [neutral, dim, still, h, k, v, shape, center[0], center[1], tint?.join()]);
  return <canvas ref={ref} className={styles.shader} width="1280" height="800" />;
}
