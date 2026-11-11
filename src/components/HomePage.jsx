import { hero, hall, firstLight, thinAir, orbit, patches, deepSpace, site } from '../content.js'
import { Sky, Cluster, Rail, Ctas } from './Chrome.jsx'
import { PatchProvider, Patch } from './Patches.jsx'

// Giant type that stands behind the figure. One word per stop of the climb.
export const GIANT = [
  { id: 'top', word: 'Knight' },
  { id: 'hall', word: 'Scholar' },
  { id: 'first-light', word: 'Scientist' },
  { id: 'orbit', word: 'Astronaut' },
]

function Role({ org, role, place, dates, contract }) {
  return (
    <dl className="role">
      <div>
        <dt className="vh">Employer</dt>
        <dd className="role__org">{org}</dd>
      </div>
      <div>
        <dt className="vh">Role</dt>
        <dd className="role__title">{role}</dd>
      </div>
      {contract && (
        <div>
          <dt className="vh">Contract</dt>
          <dd>{contract}</dd>
        </div>
      )}
      <div>
        <dt className="vh">Dates</dt>
        <dd className="mono">{dates}</dd>
      </div>
      {place && (
        <div>
          <dt className="vh">Location</dt>
          <dd>{place}</dd>
        </div>
      )}
    </dl>
  )
}

function HallEntry({ e }) {
  return (
    <article className="entry">
      <h3 className="entry__org">{e.org}</h3>
      <p className="entry__role">{e.role}</p>
      <p className="mono entry__dates">
        {e.dates}
        {e.place ? `, ${e.place}` : ''}
      </p>
      {e.text && <p>{e.text}</p>}
    </article>
  )
}

function Stage() {
  return (
    <div className="stage" aria-hidden="true">
      <div className="sun" />
      <div className="giant">
        {GIANT.map((g, i) => (
          <span key={g.id} className="giant__word" data-giant={g.id} style={{ '--len': g.word.length }} data-first={i === 0 || undefined}>
            {g.word}
          </span>
        ))}
      </div>
      <div className="figure">
        <img className="figure__poster" src="/hero/idle/000.webp" srcSet="/hero/idle-s/000.webp 420w, /hero/idle/000.webp 720w" sizes="(max-width: 899px) 420px, 720px" width="720" height="735" alt="" fetchpriority="high" />
        <canvas className="figure__canvas" />
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Sky />
      <canvas className="particles" aria-hidden="true" />
      <Cluster />
      <Rail />
      <PatchProvider>
        <main id="main" tabIndex={-1}>
          <div className="track">
            <Stage />

            <section id="top" className="hero env-forge" aria-labelledby="name-h">
              <div className="copy copy--hero">
                <p className="kicker mono">{site.location}</p>
                <h1 id="name-h" className="display">
                  Juan Gonzalez
                  <br />
                  Flores
                </h1>
                <p className="lead">{hero.lead}</p>
                <p className="sub">{hero.sub}</p>
                <Ctas />
                <p className="oath">{hero.oath}</p>
                <p className="vh">{hero.image}</p>
              </div>
            </section>

            <section id="hall" className="chapter env-forge" aria-labelledby="hall-h">
              <div className="copy">
                <h2 id="hall-h" className="chapter__title">
                  {hall.title}
                </h2>
                <p className="chapter__sub">{hall.sub}</p>
                {hall.entries.map((e) => (
                  <HallEntry key={e.org} e={e} />
                ))}
              </div>
            </section>

            <section id="first-light" className="chapter env-dawn" aria-labelledby="light-h">
              <div className="copy">
                <h2 id="light-h" className="chapter__title">
                  {firstLight.title}
                </h2>
                <Role {...firstLight} />
                <div className="prose">
                  {firstLight.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  <p className="tools">{firstLight.tools}</p>
                </div>
                <div className="patches">
                  <Patch patch={patches.utsw} preset="ascent" />
                </div>
              </div>
            </section>

            <section id="thin-air" className="chapter env-atmosphere" aria-labelledby="air-h">
              <div className="copy">
                <h2 id="air-h" className="chapter__title">
                  {thinAir.title}
                </h2>
                <Role {...thinAir} />
                <div className="prose">
                  {thinAir.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  <p className="tools">{thinAir.tools}</p>
                </div>
                <div className="patches">
                  <Patch patch={patches.abbott} preset="ascent" />
                </div>
              </div>
            </section>

            <section id="orbit" className="chapter env-orbit" aria-labelledby="orbit-h">
              <div className="copy copy--wide">
                <h2 id="orbit-h" className="chapter__title">
                  {orbit.title}
                </h2>
                <Role org={orbit.org} role={orbit.role} dates={`${orbit.dates}. ${orbit.note}`} />
                <div className="prose">
                  <p>{orbit.lead}</p>
                  <ul className="outcomes">
                    {orbit.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                  <p>
                    <a className="btn" href={orbit.buildLog.href}>
                      {orbit.buildLog.label}
                    </a>
                  </p>
                </div>
                <div className="patches patches--four">
                  <Patch patch={patches.astherion} preset="orbit" className="drift" />
                  <Patch patch={patches.thermal} preset="orbit" className="drift" />
                  <Patch patch={patches.cnn} preset="orbit" className="drift" />
                  <Patch patch={patches.wavy} preset="orbit" className="drift" />
                </div>
              </div>
            </section>

            <section id="deep-space" className="chapter env-deep" aria-labelledby="space-h">
              <div className="copy copy--wide">
                <h2 id="space-h" className="chapter__title" data-split>
                  {deepSpace.title}
                </h2>
                <p className="lead lead--big">{deepSpace.line}</p>
                <img className="still-astro" src="/hero/morph/183.webp" width="640" height="654" alt="" loading="lazy" />
                <div className="deep-grid">
                  <div>
                    <h3 className="sec">What I work with</h3>
                    <dl className="skills">
                      {deepSpace.skills.map((s) => (
                        <div key={s.group}>
                          <dt>{s.group}</dt>
                          <dd>{s.items}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div id="contact">
                    <h3 className="sec">Contact</h3>
                    <p>
                      <a className="mail" href={`mailto:${site.email}`}>
                        {site.email}
                      </a>
                    </p>
                    <Ctas />
                    <p className="loc">{site.location}</p>
                  </div>
                </div>
                <footer className="foot">
                  <p>{deepSpace.footer}</p>
                  <p>Character video generated with AI from original stills, keyed and scrubbed frame by frame.</p>
                </footer>
              </div>
            </section>
          </div>
        </main>
      </PatchProvider>
    </>
  )
}
