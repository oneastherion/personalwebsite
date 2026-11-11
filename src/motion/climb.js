// The climb: every scroll-linked effect on the page. Loaded after hydration, never in the way of content.
// Hygiene: only transform, opacity and SVG attributes (d, fill, fill-opacity) are animated.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import Lenis from 'lenis'
import { presets } from './presets.js'
import { PATHS } from '../components/Helm.jsx'
import { altitudeReadout } from './altitude.js'

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin)

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

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

function skyLayers() {
  const layer = (env) => $(`.sky__layer[data-sky="${env}"]`)
  const ramps = [
    ['atmosphere', '#thin-air'],
    ['orbit', '#orbit'],
    ['deep', '#deep-space'],
  ]
  ramps.forEach(([env, trigger], i) => {
    const preset = presets[i === 0 ? 'ascent' : i === 1 ? 'orbit' : 'drift']
    gsap.fromTo(
      layer(env),
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger, start: 'top 92%', end: 'top 28%', scrub: preset.scrub },
      },
    )
  })
}

function signature() {
  const stageWrap = $('.stage-wrap')
  if (!stageWrap) return
  const P = PATHS
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: stageWrap, start: 'top top', end: 'bottom bottom', scrub: presets.forge.scrub },
  })
  gsap.set(['.sp-b', '.sp-c'], { autoAlpha: 0 })
  const d = presets.forge.distance[1]

  // Words: the hero hands over to the hall, entry by entry. All of it is plain text at rest.
  tl.to('.sp-a', { autoAlpha: 0, y: -d, duration: 0.07 }, 0.1)
  tl.fromTo('.sp-b', { autoAlpha: 0, y: d }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.18)
  tl.to('.sp-b', { autoAlpha: 0, y: -d, duration: 0.07 }, 0.36)
  tl.fromTo('.sp-c', { autoAlpha: 0, y: d }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.44)
  tl.to('.sp-c', { autoAlpha: 0, y: -d, duration: 0.07 }, 0.68)

  // The helm comes apart: crest and bars first, the glow in the slit goes out.
  tl.to('[data-part=rivets]', { y: -18, opacity: 0, duration: 0.12 }, 0.14)
  tl.to('[data-part=bars]', { opacity: 0, duration: 0.12 }, 0.18)
  tl.to('#glow', { opacity: 0, duration: 0.1 }, 0.3)

  // Silhouette, facet and slit morph together: helm to helmet, slit to visor.
  const m = { duration: 0.38, ease: 'power1.inOut' }
  tl.to('#shell', { morphSVG: { shape: P.helmet.shell }, fill: '#E8EDF1', ...m }, 0.34)
  tl.to('#shade', { morphSVG: { shape: P.helmet.shade }, fillOpacity: 0.18, ...m }, 0.34)
  tl.to('#visor', { morphSVG: { shape: P.helmet.visor }, ...m }, 0.34)
  tl.to('#visorClipPath', { morphSVG: { shape: P.helmet.visor }, ...m }, 0.34)

  // The visor lights up and mirrors the next chapter.
  tl.fromTo('#reflect', { opacity: 0, y: 60 }, { opacity: 1, y: -6, duration: 0.3 }, 0.58)
  tl.to('#ports', { opacity: 1, duration: 0.12 }, 0.66)
  tl.fromTo('#collar', { opacity: 0, y: -22 }, { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.76)

  // The helmet takes the centre of the screen as the words leave.
  const mobile = window.matchMedia('(max-width: 899px)').matches
  tl.to(
    '.helm-live',
    {
      x: () => {
        const r = $('.helm-live').getBoundingClientRect()
        const cx = r.left - gsap.getProperty('.helm-live', 'x') + r.width / 2
        return window.innerWidth / 2 - cx - (mobile ? 0 : 66)
      },
      scale: mobile ? 1.5 : 1.08,
      transformOrigin: mobile ? '50% 0%' : '50% 50%',
      ease: 'power2.inOut',
      duration: 0.22,
    },
    0.72,
  )
  tl.to({}, { duration: 0.05 }, 0.98)

  // The sky leaves the forge for first light over the same stretch.
  tl.fromTo('.sky__layer[data-sky="dawn"]', { opacity: 0 }, { opacity: 1, duration: 0.55 }, 0.4)

  // Weight on arrival: the helm settles once, firmly, when the page loads.
  if (window.scrollY < 4) {
    gsap.from('.helm-live', { y: -presets.forge.distance[1], duration: presets.forge.duration + 0.15, ease: presets.forge.settle })
  }
}

function ascentScenes() {
  const a = presets.ascent
  // First light: ramparts sink, the sun rises.
  gsap.fromTo('[data-sink=ramparts]', { y: -a.distance[0] }, { y: a.distance[1] + 40, ease: 'none', scrollTrigger: { trigger: '#first-light', start: 'top bottom', end: 'bottom top', scrub: a.scrub } })
  gsap.fromTo('[data-rise=sun]', { y: a.distance[1] }, { y: -a.distance[1] - 60, ease: 'none', scrollTrigger: { trigger: '#first-light', start: 'top bottom', end: 'bottom top', scrub: a.scrub } })
  // Thin air: three cloud layers drift sideways, only while on screen.
  const speeds = { far: 90, mid: 60, near: 40 }
  Object.entries(speeds).forEach(([k, secs]) => {
    const tween = gsap.fromTo(`[data-drift=${k}]`, { x: -60 }, { x: 60, duration: secs / 4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true })
    ScrollTrigger.create({ trigger: '#thin-air', start: 'top bottom', end: 'bottom top', onToggle: (s) => tween.paused(!s.isActive) })
  })
  // Torch flicker in the hall is a slow, weighty loop, not a pulse.
  const torch = gsap.to('[data-drift=torch]', { y: -3, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true })
  ScrollTrigger.create({ trigger: '#hall', start: 'top bottom', end: 'bottom top', onToggle: (s) => torch.paused(!s.isActive) })
}

function orbitScenes() {
  const o = presets.orbit
  gsap.fromTo('[data-rise=limb]', { y: o.distance[1] }, { y: -40, ease: 'none', scrollTrigger: { trigger: '#orbit', start: 'top bottom', end: 'bottom bottom', scrub: o.scrub } })
  // Patches drift in low gravity while on screen.
  $$('.drift > .patch').forEach((el, i) => {
    const t = gsap.to(el, { y: i % 2 ? 6 : -6, x: i % 2 ? -3 : 3, duration: o.loop[0] / 2 + i, ease: o.ease, yoyo: true, repeat: -1, paused: true })
    ScrollTrigger.create({ trigger: '#orbit', start: 'top bottom', end: 'bottom top', onToggle: (s) => t.paused(!s.isActive) })
  })
}

async function spaceScenes() {
  const dr = presets.drift
  gsap.fromTo('[data-rise=stars]', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '#deep-space', start: 'top bottom', end: 'bottom top', scrub: dr.scrub } })
  const h = $('#deep-space [data-split]')
  if (h) {
    const [{ SplitText }] = await Promise.all([import('gsap/SplitText')])
    gsap.registerPlugin(SplitText)
    const split = new SplitText(h, { type: 'chars', charsClass: 'ch' })
    split.chars.forEach((c) => (c.style.display = 'inline-block'))
    // Letters start spread by up to 120 px and settle into the word as the chapter arrives.
    gsap.fromTo(
      split.chars,
      { x: () => gsap.utils.random(-dr.distance[0], dr.distance[0]), y: () => gsap.utils.random(-dr.distance[0] * 0.6, dr.distance[0] * 0.6), rotate: () => gsap.utils.random(-14, 14) },
      { x: 0, y: 0, rotate: 0, ease: 'power2.out', stagger: 0.02, scrollTrigger: { trigger: '#deep-space', start: 'top 70%', end: 'top 20%', scrub: dr.scrub } },
    )
  }
  const canvas = $('.stars-gl')
  if (canvas) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (entries.some((e) => e.isIntersecting)) {
          obs.disconnect()
          import('./stars-gl.js').then((m) => { m.start(canvas); gsap.fromTo(canvas, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '#deep-space', start: 'top bottom', end: 'bottom top', scrub: dr.scrub } }) }).catch(() => {})
        }
      },
      { rootMargin: '600px' },
    )
    io.observe(canvas)
  }
}

export function start(page) {
  smoothScroll()
  progressLine()
  if (page === 'astherion') {
    altitudeFixed()
    ScrollTrigger.refresh()
    return
  }
  skyLayers()
  signature()
  ascentScenes()
  orbitScenes()
  spaceScenes()
  altitudeReadout()
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh())
}

function altitudeFixed() {
  // Astherion log: the stages draw their spine in as you read. Orbit preset.
  const o = presets.orbit
  $$('.stage-item').forEach((el) => {
    const t = el.querySelector('.ticks')
    if (t) gsap.fromTo(t, { opacity: 0.2 }, { opacity: 1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 40%', scrub: o.scrub } })
  })
  gsap.fromTo('[data-rise=stars]', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: o.scrub } })
}
