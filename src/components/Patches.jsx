import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { presets } from '../motion/presets.js'

// Framer Motion powers the patch open: the panel springs out of the patch it belongs to.
// `m` is the 6 KB core. The animation features load after idle so they stay out of the critical path.
const loadFeatures = () =>
  new Promise((resolve) => {
    const go = () => import('../motion/features.js').then((mod) => resolve(mod.default))
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 2500 })
    else setTimeout(go, 600)
  })

const Ctx = createContext(null)

export function PatchProvider({ children }) {
  const [open, setOpen] = useState(null)
  const lastTrigger = useRef(null)
  const openPatch = useCallback((id, el) => {
    lastTrigger.current = el
    setOpen(id)
  }, [])
  const close = useCallback(() => {
    setOpen(null)
    const el = lastTrigger.current
    if (el) setTimeout(() => el.focus(), 0)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('panel-open', open !== null)
    window.dispatchEvent(new CustomEvent('patch-panel', { detail: { open: open !== null } }))
  }, [open])
  return (
    <LazyMotion features={loadFeatures}>
      <Ctx.Provider value={{ open, openPatch, close }}>{children}</Ctx.Provider>
    </LazyMotion>
  )
}

const SHAPES = {
  shield: 'M60 6 L108 20 V62 C108 90 84 108 60 116 C36 108 12 90 12 62 V20 Z',
  octagon: 'M38 6 H82 L114 38 V82 L82 114 H38 L6 82 V38 Z',
  disc: 'M60 6 A54 54 0 1 1 59.99 6 Z',
  diamond: 'M60 4 L116 60 L60 116 L4 60 Z',
  pennant: 'M10 24 Q10 10 24 10 H96 Q110 10 110 24 V84 L60 112 L10 84 Z',
  pill: 'M34 30 H86 A30 30 0 0 1 86 90 H34 A30 30 0 0 1 34 30 Z',
}

function Emblem({ type }) {
  const p = { fill: 'none', stroke: 'var(--accent)', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'pressure':
      return <path {...p} d="M24 72 H38 L44 44 Q49 36 54 52 L60 80 L65 62 Q70 58 74 72 H96" />
    case 'sensor':
      return (
        <g {...p}>
          <circle cx="60" cy="48" r="15" />
          <rect x="51" y="68" width="18" height="30" rx="3" />
          <circle cx="60" cy="48" r="4" fill="var(--accent)" />
        </g>
      )
    case 'orbit':
      return (
        <g {...p}>
          <ellipse cx="60" cy="60" rx="36" ry="12" transform="rotate(-22 60 60)" />
          <circle cx="60" cy="60" r="9" fill="var(--accent)" />
          <circle cx="90" cy="46" r="3" fill="var(--accent)" />
        </g>
      )
    case 'band':
      return (
        <g {...p}>
          <path d="M22 60 H98" strokeWidth="1.5" />
          <path d="M22 46 H98 M22 74 H98" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M22 94 C36 28 50 36 58 58 C64 72 74 56 82 60 C88 62 92 60 98 60" />
        </g>
      )
    case 'lobes':
      return (
        <g {...p}>
          <path d="M56 38 C40 38 28 58 30 84 C31 94 44 94 50 86 C54 78 56 62 56 38 Z" />
          <path d="M64 38 C80 38 92 58 90 84 C89 94 76 94 70 86 C66 78 64 62 64 38 Z" />
          <path d="M60 24 V52" />
        </g>
      )
    case 'wave':
      return <path {...p} d="M18 60 q8 -28 16 0 t16 0 t16 0 t16 0 t16 0" />
    default:
      return null
  }
}

function Badge({ shape, emblem }) {
  const d = SHAPES[shape]
  return (
    <svg className="badge" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <path d={d} fill="var(--surf)" stroke="var(--ink)" strokeOpacity="0.55" strokeWidth="2" />
      <path
        d={d}
        transform="translate(60 60) scale(0.84) translate(-60 -60)"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.75"
      />
      <Emblem type={emblem} />
    </svg>
  )
}

function motionIsOn() {
  return typeof document !== 'undefined' && document.documentElement.getAttribute('data-motion') === 'on'
}

export function Patch({ patch, preset = 'ascent', className = '' }) {
  const { open, openPatch, close } = useContext(Ctx)
  const btn = useRef(null)
  const panel = useRef(null)
  const isOpen = open === patch.id
  const [from, setFrom] = useState({ x: 0, y: 0, s: 0.3 })
  const [animate, setAnimate] = useState(false)
  const spring = presets[preset].spring

  const onOpen = () => {
    const r = btn.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    setFrom({ x: cx - window.innerWidth / 2, y: cy - window.innerHeight / 2, s: 0.25 })
    setAnimate(motionIsOn())
    openPatch(patch.id, btn.current)
  }

  useEffect(() => {
    if (!isOpen) return
    const el = panel.current
    const focusables = () => el.querySelectorAll('a[href], button:not([disabled])')
    focusables()[0]?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'Tab') {
        const f = focusables()
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <div className={`patch-slot ${className}`} data-patch={patch.id}>
      <button
        ref={btn}
        type="button"
        className="patch"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={`panel-${patch.id}`}
        onClick={onOpen}
      >
        <Badge shape={patch.shape} emblem={patch.emblem} />
        <span className="patch__name">{patch.name}</span>
        <span className="patch__hint">Open the facts</span>
      </button>

      <div className="panel-wrap" id={`panel-${patch.id}`} hidden={!isOpen} data-open={isOpen}>
        <div className="panel-scrim" onClick={close} aria-hidden="true" />
        <m.div
          key={String(isOpen)}
          ref={panel}
          className="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`h-${patch.id}`}
          initial={isOpen && animate ? { opacity: 0, x: from.x, y: from.y, scale: from.s } : false}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={animate ? spring : { duration: 0 }}
        >
          <PanelBody patch={patch} onClose={close} />
        </m.div>
      </div>
    </div>
  )
}

function PanelBody({ patch, onClose }) {
  return (
    <>
      <h3 id={`h-${patch.id}`} className="panel__title">
        {patch.name}
      </h3>
      <p className="panel__kicker">{patch.kicker}</p>
      <ul className="panel__facts">
        {patch.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      {patch.link && (
        <a className="btn btn--ghost" href={patch.link.href}>
          {patch.link.label}
        </a>
      )}
      <button type="button" className="panel__close" onClick={onClose}>
        Close
      </button>
    </>
  )
}
