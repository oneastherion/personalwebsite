// Draws transparent WebP frame sequences to a canvas: a looping clip, or a clip scrubbed by scroll.
// Frames are cut from AI video shot on flat magenta and keyed to alpha (scripts/frames.sh).

export const CLIPS = {
  idle: { dir: 'idle', count: 62, fps: 12 },
  morph: { dir: 'morph', count: 184, fps: 12 },
}

const small = () => window.matchMedia('(max-width: 899px)').matches
const pad = (n) => String(n).padStart(3, '0')

export function frameUrl(clip, i, sm = small()) {
  const c = CLIPS[clip]
  return `/hero/${c.dir}${sm ? '-s' : ''}/${pad(i)}.webp`
}

export class Flipbook {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.sets = {}
    this.current = null
    this.size()
    this._ro = new ResizeObserver(() => {
      this.size()
      this.redraw()
    })
    this._ro.observe(canvas)
  }

  size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = this.canvas.getBoundingClientRect()
    this.w = Math.max(1, Math.round(r.width * dpr))
    this.h = Math.max(1, Math.round(r.height * dpr))
    if (this.canvas.width !== this.w || this.canvas.height !== this.h) {
      this.canvas.width = this.w
      this.canvas.height = this.h
    }
  }

  // Load a clip. Resolves when the first frame is decoded; the rest stream in behind it.
  load(clip, { eager = false } = {}) {
    if (this.sets[clip]) return this.sets[clip].ready
    const c = CLIPS[clip]
    const frames = new Array(c.count)
    const set = { frames, loaded: 0 }
    const one = (i) =>
      new Promise((res) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => {
          frames[i] = img
          set.loaded++
          res()
        }
        img.onerror = () => res()
        img.src = frameUrl(clip, i)
      })
    set.ready = one(0).then(async () => {
      const rest = Array.from({ length: c.count - 1 }, (_, k) => k + 1)
      const run = async () => {
        // a few at a time so the network stays free for everything else
        for (let k = 0; k < rest.length; k += 6) await Promise.all(rest.slice(k, k + 6).map(one))
      }
      if (eager) await run()
      else run()
    })
    this.sets[clip] = set
    return set.ready
  }

  // Draw frame i of a clip, falling back to the nearest loaded frame.
  draw(clip, i) {
    const set = this.sets[clip]
    if (!set) return
    let img = set.frames[i]
    if (!img) {
      for (let d = 1; d < set.frames.length && !img; d++) img = set.frames[i - d] || set.frames[i + d]
    }
    if (!img) return
    this.current = { clip, i }
    const { w, h, ctx } = this
    const s = Math.min(w / img.naturalWidth, h / img.naturalHeight)
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    ctx.clearRect(0, 0, w, h)
    // anchor to the bottom so the figure stands on the frame edge
    ctx.drawImage(img, (w - dw) / 2, h - dh, dw, dh)
  }

  redraw() {
    if (this.current) this.draw(this.current.clip, this.current.i)
  }

  // Loop a clip in real time until stop() is called.
  loop(clip) {
    this.stop()
    const fps = CLIPS[clip].fps
    const count = CLIPS[clip].count
    let start = 0
    const tick = (t) => {
      if (!start) start = t
      const i = Math.floor(((t - start) / 1000) * fps) % count
      if (!this.current || this.current.clip !== clip || this.current.i !== i) this.draw(clip, i)
      this._raf = requestAnimationFrame(tick)
    }
    this._raf = requestAnimationFrame(tick)
    this.looping = clip
  }

  stop() {
    cancelAnimationFrame(this._raf)
    this.looping = null
  }

  scrub(clip, progress) {
    this.stop()
    const n = CLIPS[clip].count
    const i = Math.max(0, Math.min(n - 1, Math.round(progress * (n - 1))))
    if (!this.current || this.current.clip !== clip || this.current.i !== i) this.draw(clip, i)
  }
}
