// Lightweight star field: one draw call, DPR capped at 2, paused offscreen, static SVG fallback underneath.
export function start(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, powerPreference: 'low-power' })
  if (!gl) return
  const vs = `attribute vec3 a; uniform float t; uniform vec2 r; varying float o;
    void main(){ float tw = 0.82 + 0.18*sin(t*0.6 + a.x*40.0 + a.y*70.0);
      o = tw; gl_PointSize = a.z * (r.y/900.0) * 2.0; gl_Position = vec4(a.xy*2.0-1.0, 0.0, 1.0); }`
  const fs = `precision mediump float; varying float o; void main(){ vec2 c = gl_PointCoord-0.5; float d = smoothstep(0.5,0.1,length(c)); gl_FragColor = vec4(0.92,0.95,0.97,1.0)*d*o; }`
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
  const p = gl.createProgram()
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return
  const n = 140
  const data = new Float32Array(n * 3)
  let s = 20260101
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
  for (let i = 0; i < n; i++) { data[i * 3] = rnd(); data[i * 3 + 1] = rnd(); data[i * 3 + 2] = 1.5 + rnd() * rnd() * 3 }
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
  gl.useProgram(p); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  const ut = gl.getUniformLocation(p, 't'); const ur = gl.getUniformLocation(p, 'r')
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h) }
    gl.uniform2f(ur, w, h)
  }
  let raf = 0, visible = false
  const frame = (ts) => { size(); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(ut, ts / 1000); gl.drawArrays(gl.POINTS, 0, n); raf = visible ? requestAnimationFrame(frame) : 0 }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame) }).observe(canvas)
  canvas.classList.add('is-on')
  canvas.previousElementSibling?.classList.add('is-hidden')
}
