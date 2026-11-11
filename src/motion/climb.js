// The climb: every scroll-linked effect on the page. Loaded after hydration, never in the way of content.
// Layers: a WebGL particle field (embers -> dust -> streaks -> stars), giant type behind the figure,
// and the figure itself: AI video cut out of a magenta backdrop, played as a frame flipbook on a canvas.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { presets } from './presets.js'
import { altitudeReadout } from './altitude.js'
import { Flipbook } from './flipbook.js'
import { startParticles } from './particles.js'

gsap.registerPlugin(ScrollTrigger)

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

// Story order. `morph` is the slice of the knight-to-astronaut clip each chapter scrubs through.
const STOPS = [
  { id: 'top', sky: 'forge', morph: [0, 0], giant: 'chronicle' },
  // the knight holds through the story so far
  { id: 'chronicle', sky: 'forge', morph: [0, 0], giant: 'chronicle' },
  // knight -> graduate as the arsenal is laid out
  { id: 'arsenal', sky: 'dawn', morph: [0, 1 / 3], giant: 'arsenal' },
  // graduate -> scientist through the campaigns
  { id: 'campaigns', sky: 'atmosphere', morph: [1 / 3, 2 / 3], giant: 'campaigns' },
  // scientist -> astronaut for Astherion
  { id: 'astherion', sky: 'orbit', morph: [2 / 3, 1], giant: 'astherion' },
  { id: 'frontier', sky: 'deep', morph: [1, 1], giant: 'frontier' },
]

function smoothScroll() {
  const lenis = new Lenis({ duration: 1.1, anchors: true, syncTouch: false })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  window.addEventListener('patch-panel', (e) => (e.detail.open ? lenis.stop() : lenis.start()))
  return lenis
}

function progressLine() {
  const bar = $('.progress__bar')
  if (!bar) return
  const set = gsap.quickSetter(bar, 'scaleX')
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => set(s.progress) })
}

// One number for "how far up are we": 0 at the top, 5 at deep space. Everything reads it.
function storyClock(onChange) {
  const story = { value: 0 }
  STOPS.forEach((stop, i) => {
    if (i === 0) return
    ScrollTrigger.create({
      trigger: `#${stop.id}`,
      start: 'top 85%',
      end: 'top 15%',
      onUpdate: (s) => {
        story.value = i - 1 + s.progress
        onChange(story.value)
      },
      onLeaveBack: () => {
        story.value = i - 1
        onChange(story.value)
      },
    })
  })
  return story
}

function skyLayers(story) {
  const layers = Object.fromEntries($$('.sky__layer').map((el) => [el.dataset.sky, el]))
  const order = ['forge', 'dawn', 'atmosphere', 'orbit', 'deep']
  const set = order.map((k) => gsap.quickSetter(layers[k], 'opacity'))
  return (v) => {
    // v: 0..5 story clock. Chapter i (1..5) is fully lit at v = i.
    const s = Math.max(0, v - 1)
    order.forEach((_, k) => {
      if (k === 0) return
      set[k](Math.min(1, Math.max(0, s - (k - 1))))
    })
  }
}

function giantType() {
  const words = $$('.giant__word')
  let active = 'chronicle'
  gsap.set(words, { autoAlpha: 0, yPercent: 0 })
  gsap.set('[data-giant="chronicle"]', { autoAlpha: 1 })
  const show = (id, dir) => {
    if (id === active) return
    const out = $('[data-giant="' + active + '"]')
    const inn = $('[data-giant="' + id + '"]')
    const p = presets.ascent
    gsap.to(out, { yPercent: dir > 0 ? -35 : 35, autoAlpha: 0, duration: p.duration * 0.6, ease: 'power2.in', overwrite: true })
    gsap.fromTo(inn, { yPercent: dir > 0 ? 35 : -35, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: p.duration, delay: p.duration * 0.35, ease: 'power3.out', overwrite: true })
    active = id
  }
  STOPS.forEach((stop, i) => {
    if (i === 0) return
    ScrollTrigger.create({
      trigger: '#' + stop.id,
      start: 'top 55%',
      onEnter: () => show(stop.giant, 1),
      onLeaveBack: () => show(STOPS[i - 1].giant, -1),
    })
  })
}

function sunAndFigure(story) {
  // the sun is low and huge in the hall, rises at dawn, and shrinks to a point by orbit
  const sun = $('.sun')
  const fig = $('.figure')
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  tl.fromTo(sun, { yPercent: 20, scale: 1 }, { yPercent: -40, scale: 0.85, duration: 2 })
    .to(sun, { yPercent: -120, scale: 0.18, opacity: 0.9, duration: 2 })
    .to(sun, { opacity: 0, duration: 1 })
  // the figure gets lighter as it climbs: it settles in the forge and floats by deep space
  const fl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  fl.to(fig, { y: 0, duration: 5 })
  return (v) => {
    tl.progress(Math.min(1, v / 5))
    fl.progress(Math.min(1, v / 5))
  }
}

function figure() {
  const canvas = $('.figure__canvas')
  const poster = $('.figure__poster')
  const book = new Flipbook(canvas)
  let mode = 'idle'
  let target = 0
  let shown = 0
  book.load('idle').then(() => {
    book.loop('idle')
    canvas.classList.add('is-on')
    poster.classList.add('is-hidden')
    // the climb clip starts loading once the hero is on screen
    book.load('morph')
  })
  // ease the scrubbed frame toward its target so a flick of the wheel still plays every frame
  gsap.ticker.add(() => {
    if (mode !== 'morph') return
    shown += (target - shown) * 0.22
    book.scrub('morph', shown)
  })
  // in deep space the astronaut floats: a slow low-gravity bob on the finished last frame
  const bob = gsap.to('.figure__canvas', { y: -14, rotate: -0.6, duration: presets.drift.loop[0] / 2, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true })
  const setMode = (m) => {
    if (m === mode) return
    mode = m
    if (m === 'idle') book.loop('idle')
    if (m === 'morph') {
      book.stop()
      shown = target
    }
  }
  return (v) => {
    if (v < 0.02) {
      bob.pause()
      return setMode('idle')
    }
    // map story clock to clip progress, chapter by chapter
    const i = Math.min(5, Math.floor(v) + 1)
    const stop = STOPS[i]
    const local = Math.min(1, v - (i - 1))
    target = stop.morph[0] + (stop.morph[1] - stop.morph[0]) * local
    if (v >= 4.4) bob.play()
    else bob.pause()
    setMode('morph')
  }
}

function drift() {
  const o = presets.orbit
  $$('.drift > .patch').forEach((el, i) => {
    const t = gsap.to(el, { y: i % 2 ? 8 : -8, x: i % 2 ? -4 : 4, rotate: i % 2 ? -2 : 2, duration: o.loop[0] / 2 + i, ease: o.ease, yoyo: true, repeat: -1, paused: true })
    ScrollTrigger.create({ trigger: '#campaigns', start: 'top bottom', end: 'bottom bottom', onToggle: (s) => t.paused(!s.isActive) })
  })
}

async function splitDeep() {
  const h = $('#frontier [data-split]')
  if (!h) return
  const { SplitText } = await import('gsap/SplitText')
  gsap.registerPlugin(SplitText)
  const split = new SplitText(h, { type: 'chars' })
  split.chars.forEach((c) => (c.style.display = 'inline-block'))
  const d = presets.drift
  gsap.fromTo(
    split.chars,
    { x: () => gsap.utils.random(-d.distance[0], d.distance[0]), y: () => gsap.utils.random(-60, 60), rotate: () => gsap.utils.random(-18, 18) },
    { x: 0, y: 0, rotate: 0, ease: 'power2.out', stagger: 0.02, scrollTrigger: { trigger: '#frontier', start: 'top 80%', end: 'top 25%', scrub: d.scrub } },
  )
}

function heroEntrance() {
  if (window.scrollY > 4) return
  // one orchestrated arrival: the sun swells, the giant word rises behind, the figure lands with weight
  const f = presets.forge
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from('.sun', { scale: 0.6, opacity: 0, duration: 1.2 }, 0)
    .from('[data-giant="chronicle"]', { yPercent: 60, duration: 1.0, ease: 'power4.out' }, 0.15)
    .from('.figure', { y: -40, duration: f.duration + 0.25, ease: f.settle }, 0.35)
}

export function start(page) {
  smoothScroll()
  progressLine()
  const pcanvas = $('.particles')
  const field = pcanvas ? startParticles(pcanvas) : null

  if (page === 'astherion') {
    if (field) field.progress = 0.75
    ScrollTrigger.refresh()
    return
  }

  const sky = skyLayers()
  const sun = sunAndFigure()
  const fig = figure()
  storyClock((v) => {
    sky(v)
    sun(v)
    fig(v)
    if (field) field.progress = v / 5
  })
  giantType()
  drift()
  splitDeep()
  heroEntrance()
  altitudeReadout()
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh())
}
