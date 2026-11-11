// The particle field behind the whole page. One WebGL draw call.
// Scroll progress morphs it: rising forge embers -> drifting dawn dust -> streaks falling past
// as we climb through the air -> a still, sparse star field with depth parallax.
// DPR capped at 2, paused when the tab is hidden.

const VS = `
attribute vec4 a;          // x, y in [0,1], z depth in [0,1], w random
uniform float t;           // seconds
uniform float p;           // page progress 0..1
uniform vec2 res;
uniform vec2 mouse;        // -1..1, eased
uniform float scrollY;     // px scrolled, for parallax
varying float vAlpha;
varying vec3 vColor;
varying float vStreak;

float band(float x, float a, float b, float c, float d) {
  return smoothstep(a, b, x) * (1.0 - smoothstep(c, d, x));
}

void main() {
  float z = mix(0.25, 1.0, a.z);          // 1 = near
  float r = a.w;

  float ember = 1.0 - smoothstep(0.20, 0.30, p);
  float dust  = band(p, 0.20, 0.30, 0.40, 0.50);
  float climb = band(p, 0.40, 0.50, 0.60, 0.70);
  float star  = smoothstep(0.60, 0.72, p);

  // embers rise and sway, faster when near
  float ey = fract(a.y + t * (0.025 + 0.06 * r) * z);
  float ex = a.x + sin(t * (0.6 + r) + r * 40.0) * 0.012 * z;
  // dust drifts slowly sideways
  float dy = fract(a.y + t * 0.004 * z);
  float dx = fract(a.x + t * (0.006 + 0.01 * r) * z);
  // climbing: everything falls past us, fast, as streaks
  float cy = fract(a.y - t * (0.25 + 0.5 * r) * z);
  float cx = a.x;
  // stars: fixed, with depth parallax against the scroll
  float sy = fract(a.y + scrollY * 0.00004 * z);
  float sx = a.x;

  float w = ember + dust + climb + star + 1e-4;
  float x = (ex * ember + dx * dust + cx * climb + sx * star) / w;
  float y = (ey * ember + dy * dust + cy * climb + sy * star) / w;

  vec2 pos = vec2(x, y) * 2.0 - 1.0;
  pos += mouse * 0.03 * z;                 // nearer particles move more
  gl_Position = vec4(pos, 0.0, 1.0);

  float dpr = res.y / 900.0;
  float size = (1.0 + 2.6 * z * z) * (0.6 + r);
  size *= mix(1.0, 1.6, ember) * mix(1.0, 0.7, star);
  gl_PointSize = size * dpr * 1.6;

  vec3 cEmber = mix(vec3(1.0, 0.45, 0.12), vec3(1.0, 0.78, 0.45), r);
  vec3 cDust  = vec3(1.0, 0.86, 0.70);
  vec3 cClimb = vec3(0.85, 0.93, 1.0);
  vec3 cStar  = mix(vec3(0.85, 0.92, 1.0), vec3(1.0, 0.95, 0.85), step(0.85, r));
  vColor = (cEmber * ember + cDust * dust + cClimb * climb + cStar * star) / w;

  // embers flicker and fade as they rise; stars twinkle a little; few stars are bright
  float flicker = 0.65 + 0.35 * sin(t * (3.0 + 6.0 * r) + r * 90.0);
  float fadeTop = 1.0 - smoothstep(0.7, 1.0, ey);
  float aEmber = flicker * fadeTop * (0.35 + 0.65 * z);
  float aDust  = 0.25 * z;
  float aClimb = 0.35 * z;
  float aStar  = (0.25 + 0.75 * pow(r, 3.0)) * (0.85 + 0.15 * sin(t * 0.8 + r * 50.0));
  // keep the star field sparse: hide most particles in space
  aStar *= step(0.55, fract(r * 7.31));
  vAlpha = (aEmber * ember + aDust * dust + aClimb * climb + aStar * star) / w;
  vStreak = climb / w;
}
`

const FS = `
precision mediump float;
varying float vAlpha;
varying vec3 vColor;
varying float vStreak;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  // streaks: stretch the point vertically while climbing
  c.x *= mix(1.0, 3.5, vStreak);
  c.y *= mix(1.0, 0.35, vStreak);
  float d = length(c);
  float core = smoothstep(0.5, 0.0, d);
  float glow = core * core;
  gl_FragColor = vec4(vColor * glow * vAlpha, glow * vAlpha);
}
`

export function startParticles(canvas, { count } = {}) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' })
  if (!gl) return null
  const sh = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s))
    return s
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const n = count || (window.innerWidth < 900 ? 700 : 1600)
  const data = new Float32Array(n * 4)
  let seed = 7
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
  for (let i = 0; i < n; i++) {
    data[i * 4] = rnd()
    data[i * 4 + 1] = rnd()
    data[i * 4 + 2] = rnd() * rnd()
    data[i * 4 + 3] = rnd()
  }
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'a')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE)

  const U = (name) => gl.getUniformLocation(prog, name)
  const u = { t: U('t'), p: U('p'), res: U('res'), mouse: U('mouse'), scrollY: U('scrollY') }

  const state = { progress: 0, mx: 0, my: 0, tx: 0, ty: 0 }
  const onMove = (e) => {
    state.tx = (e.clientX / window.innerWidth) * 2 - 1
    state.ty = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
    gl.uniform2f(u.res, w, h)
  }
  let raf = 0
  const frame = (ts) => {
    size()
    state.mx += (state.tx - state.mx) * 0.04
    state.my += (state.ty - state.my) * 0.04
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform1f(u.t, ts / 1000)
    gl.uniform1f(u.p, state.progress)
    gl.uniform2f(u.mouse, state.mx, state.my)
    gl.uniform1f(u.scrollY, window.scrollY)
    gl.drawArrays(gl.POINTS, 0, n)
    raf = requestAnimationFrame(frame)
  }
  const vis = () => {
    cancelAnimationFrame(raf)
    if (!document.hidden) raf = requestAnimationFrame(frame)
  }
  document.addEventListener('visibilitychange', vis)
  vis()
  canvas.classList.add('is-on')
  return {
    set progress(v) {
      state.progress = v
    },
  }
}
