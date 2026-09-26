import { useEffect, useRef } from 'react';

// Mismo shader de fondo que la landing del proyecto (landing.html): ruido fbm lento sobre
// negro azulado con vetas de teal. Acá va dentro de la pantalla de la unidad, así que se
// dibuja al tamaño de su contenedor en vez de al del viewport.

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  uniform vec2  u_res;
  uniform float u_time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                  hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t  = u_time * 0.16;   // el doble que la landing: en una pantalla grande el movimiento se lee más lento

    vec2 q = vec2(
      fbm(uv * 1.4 + t * 0.4),
      fbm(uv * 1.4 + vec2(3.7, 1.9) + t * 0.35)
    );
    float n = fbm(uv * 1.1 + q * 0.55 + t * 0.22);

    vec3 dark    = vec3(0.047, 0.063, 0.086);
    vec3 midteal = vec3(0.035, 0.160, 0.185);
    vec3 deep    = vec3(0.025, 0.035, 0.055);

    vec3 col = mix(deep, mix(dark, midteal, n), smoothstep(0.2, 0.8, n));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderBackground({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return; // sin WebGL se queda el fondo plano del CSS

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');

    function resize() {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let elapsed = 0;
    let lastTs = null;
    let rafId = null;

    function frame(ts) {
      if (lastTs !== null) elapsed += ts - lastTs;
      lastTs = ts;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(frame);
    }

    // Con la pestaña oculta no se dibuja: en una demo que queda abierta horas, esto evita
    // tener la GPU trabajando de fondo.
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        lastTs = null;
      } else {
        rafId = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
