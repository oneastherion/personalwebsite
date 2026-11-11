// Live altitude readout. Each chapter's altitude is exact when that chapter is centred on screen.
// Chapter 1 is 0 m at the top of the page. Text updates at most 10 times a second.
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { chapters } from '../content.js'

const $$ = (s) => [...document.querySelectorAll(s)]

export function formatAltitude(m) {
  if (m >= 100000) return `${Math.round(m / 1000).toLocaleString('en-US')} km`
  const r = m >= 10000 ? Math.round(m / 100) * 100 : Math.round(m / 10) * 10
  return `${r.toLocaleString('en-US')} m`
}

export function altitudeReadout() {
  const nodes = $$('[data-altitude]')
  const stops = $$('[data-stop]')
  let anchors = []
  const measure = () => {
    const vh = window.innerHeight
    const max = document.documentElement.scrollHeight - vh
    anchors = chapters.map((c, i) => {
      if (i === 0) return 0
      const el = document.getElementById(c.id)
      const top = el.getBoundingClientRect().top + window.scrollY
      return Math.min(max, Math.max(0, top + el.offsetHeight / 2 - vh / 2))
    })
  }
  measure()
  ScrollTrigger.addEventListener('refresh', measure)
  let last = 0
  let lastText = ''
  const update = (force) => {
    const now = performance.now()
    if (!force && now - last < 100) return
    last = now
    const y = window.scrollY
    let i = 0
    for (let k = 0; k < anchors.length; k++) if (y >= anchors[k]) i = k
    const next = chapters[i + 1]
    const span = next ? anchors[i + 1] - anchors[i] : 0
    const t = next && span > 0 ? Math.min(1, (y - anchors[i]) / span) : 0
    const v = chapters[i].alt + (next ? (next.alt - chapters[i].alt) * (i < 2 ? t : Math.pow(t, 2.2)) : 0)
    const text = formatAltitude(v)
    if (text !== lastText) {
      lastText = text
      nodes.forEach((n) => (n.textContent = text))
    }
    const cur = t > 0.5 && next ? i + 1 : i
    stops.forEach((st) => st.setAttribute('aria-current', String(st.dataset.stop === chapters[cur].id)))
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: () => update(false) })
  update(true)
}
