import { hero, hall, firstLight, thinAir, orbit, patches, deepSpace, site, sections } from '../content.js'
import { Sky, Cluster, Rail, Ctas } from './Chrome.jsx'
import { PatchProvider, Patch } from './Patches.jsx'

// Giant type that stands behind the figure. One word per stop of the climb.
export const GIANT = [
  { id: 'chronicle', word: 'Chronicle' },
  { id: 'arsenal', word: 'Arsenal' },
  { id: 'campaigns', word: 'Campaigns' },
  { id: 'astherion', word: 'Astherion' },
  { id: 'frontier', word: 'Frontier' },
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
        <img className="figure__poster" src="/hero/idle/000.webp" srcSet="/hero/idle-s/000.webp 440w, /hero/idle/000.webp 760w" sizes="(max-width: 899px) 440px, 760px" width="760" height="505" alt="" fetchpriority="high" />
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

            <section id="chronicle" className="chapter env-forge" aria-labelledby="chronicle-h">
              <div className="copy">
                <h2 id="chronicle-h" className="chapter__title">
                  {sections.chronicle.title}
                </h2>
                <p className="chapter__sub">{sections.chronicle.sub}</p>
                {hall.entries.map((e) => (
                  <HallEntry key={e.org} e={e} />
                ))}
                <article className="entry">
                  <h3 className="entry__org">{firstLight.org}</h3>
                  <p className="entry__role">{firstLight.role}</p>
                  <p className="mono entry__dates">
                    {firstLight.dates}, {firstLight.place}
                  </p>
                </article>
                <article className="entry">
                  <h3 className="entry__org">{thinAir.org}</h3>
                  <p className="entry__role">
                    {thinAir.role}. {thinAir.contract}.
                  </p>
                  <p className="mono entry__dates">
                    {thinAir.dates}, {thinAir.place}
                  </p>
                </article>
              </div>
            </section>

            <section id="arsenal" className="chapter env-dawn" aria-labelledby="arsenal-h">
              <div className="copy">
                <h2 id="arsenal-h" className="chapter__title">
                  {sections.arsenal.title}
                </h2>
                <p className="chapter__sub">{sections.arsenal.sub}</p>
                <dl className="skills skills--arsenal">
                  {deepSpace.skills.map((s) => (
                    <div key={s.group}>
                      <dt>{s.group}</dt>
                      <dd>{s.items}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section id="campaigns" className="chapter env-atmosphere" aria-labelledby="campaigns-h">
              <div className="copy copy--wide">
                <h2 id="campaigns-h" className="chapter__title">
                  {sections.campaigns.title}
                </h2>
                <p className="chapter__sub">{sections.campaigns.sub}</p>
                <div className="campaign">
                  <h3 className="entry__org">{firstLight.org}</h3>
                  <div className="prose">
                    {firstLight.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    <p className="tools">{firstLight.tools}</p>
                  </div>
                </div>
                <div className="campaign">
                  <h3 className="entry__org">{thinAir.org}</h3>
                  <div className="prose">
                    {thinAir.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    <p className="tools">{thinAir.tools}</p>
                  </div>
                </div>
                <div className="patches patches--five">
                  <Patch patch={patches.utsw} preset="ascent" className="drift" />
                  <Patch patch={patches.abbott} preset="ascent" className="drift" />
                  <Patch patch={patches.thermal} preset="ascent" className="drift" />
                  <Patch patch={patches.cnn} preset="ascent" className="drift" />
                  <Patch patch={patches.wavy} preset="ascent" className="drift" />
                </div>
              </div>
            </section>

            <section id="astherion" className="chapter env-orbit" aria-labelledby="astherion-h">
              <div className="copy copy--wide">
                <h2 id="astherion-h" className="chapter__title">
                  {sections.astherion.title}
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
                <div className="patches">
                  <Patch patch={patches.astherion} preset="orbit" className="drift" />
                </div>
              </div>
            </section>

            <section id="frontier" className="chapter env-deep" aria-labelledby="frontier-h">
              <div className="copy copy--wide">
                <h2 id="frontier-h" className="chapter__title" data-split>
                  {sections.frontier.title}
                </h2>
                <p className="lead lead--big">{deepSpace.line}</p>
                <img className="still-astro" src="/hero/morph/183.webp" width="760" height="505" alt="" loading="lazy" />
                <div id="contact" className="contact">
                  <p>
                    <a className="mail" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </p>
                  <Ctas />
                  <p className="loc">{site.location}</p>
                </div>
                <footer className="foot">
                  <p>{deepSpace.footer}</p>
                </footer>
              </div>
            </section>
          </div>
        </main>
      </PatchProvider>
    </>
  )
}
