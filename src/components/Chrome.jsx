import { useEffect, useState } from 'react'
import { chapters, site } from '../content.js'

export function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      {chapters.map((c) => (
        <div key={c.id} className={`sky__layer env-${c.env}`} data-sky={c.env} />
      ))}
      
    </div>
  )
}

export function MotionToggle() {
  const [on, setOn] = useState(null)
  useEffect(() => setOn(document.documentElement.getAttribute('data-motion') === 'on'), [])
  const flip = () => {
    const next = on ? 'off' : 'on'
    try {
      localStorage.setItem('motion', next)
    } catch (e) {}
    window.location.reload()
  }
  return (
    <button type="button" className="cluster__btn" aria-pressed={on === null ? undefined : on} onClick={flip}>
      {on === null ? 'Motion' : on ? 'Motion: on' : 'Motion: off'}
    </button>
  )
}

export function Cluster({ altitude = '0 m' }) {
  return (
    <header className="cluster">
      <span className="cluster__alt" aria-hidden="true">
        <span data-altitude>{altitude}</span>
      </span>
      <nav className="cluster__links" aria-label="Contact">
        <a href={`mailto:${site.email}`}>Email</a>
        <a href={site.resume} download>
          Resume
        </a>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </nav>
      <MotionToggle />
      <div className="progress" aria-hidden="true">
        <div className="progress__bar" />
      </div>
    </header>
  )
}

export function Rail() {
  return (
    <nav className="rail" aria-label="Altitude">
      <p className="rail__now" aria-hidden="true">
        <span data-altitude>0 m</span>
      </p>
      <ol>
        {chapters.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`} data-stop={c.id}>
              <span className="rail__alt">{c.altitude}</span>
              <span className="rail__name">{c.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Ctas({ className = '' }) {
  return (
    <p className={`ctas ${className}`}>
      <a className="btn btn--solid" href={site.resume} download>
        Download resume
      </a>
      <a className="btn" href={`mailto:${site.email}`}>
        Email me
      </a>
      <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
    </p>
  )
}
