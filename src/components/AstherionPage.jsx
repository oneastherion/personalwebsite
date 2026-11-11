import { astherionPage as a, site } from '../content.js'
import { Sky, Cluster, Ctas } from './Chrome.jsx'
import { StarsSvg } from './Art.jsx'

function Ticks({ n }) {
  return (
    <svg className="ticks" viewBox={`0 0 ${n * 12} 28`} role="img" aria-label={`${n} marks, one per logged bench run`}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${i * 12 + 4} 2 V26`} stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      ))}
    </svg>
  )
}

export default function AstherionPage() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="sky sky--static env-orbit" aria-hidden="true" />
      <Cluster altitude="408 km" />
      <main id="main" tabIndex={-1} className="chapter env-orbit log">
        <StarsSvg />
        <div className="wrap chapter__body">
          <p className="backlink">
            <a href={a.back.href}>{a.back.label}</a>
          </p>
          <h1 className="display display--log">{a.h1}</h1>
          <p className="lead lead--big">{a.intro}</p>
          <dl className="meta">
            {a.meta.map((m) => (
              <div key={m.k}>
                <dt>{m.k}</dt>
                <dd className="mono">{m.v}</dd>
              </div>
            ))}
          </dl>

          <ol className="stages">
            {a.stages.map((s) => (
              <li key={s.n} className="stage-item">
                <span className="stage-item__n mono" aria-hidden="true">
                  {String(s.n).padStart(2, '0')}
                </span>
                <div className="stage-item__body">
                  <h2 className="stage-item__title">{s.title}</h2>
                  <p>{s.text}</p>
                  {s.stat && (
                    <p className="stat">
                      <span className="stat__v mono">{s.stat.value}</span>
                      <span className="stat__u">{s.stat.unit}</span>
                    </p>
                  )}
                  {s.stat && s.stat.ticks && <Ticks n={s.stat.ticks} />}
                </div>
              </li>
            ))}
          </ol>

          <section className="log__end" aria-labelledby="names-h">
            <h2 id="names-h" className="sec">
              Names
            </h2>
            <p>{a.names}</p>
            <h2 className="sec">What this page leaves out</h2>
            <p>{a.leftOut}</p>
            <Ctas />
            <p className="backlink">
              <a href={a.back.href}>{a.back.label}</a>
            </p>
          </section>
          <footer className="foot">
            <p>© 2026 {site.name}</p>
          </footer>
        </div>
      </main>
    </>
  )
}
