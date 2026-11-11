import { chapters, hero, hall, firstLight, thinAir, orbit, patches, deepSpace, site } from '../content.js'
import Helm, { HelmStill, HelmetStill, DawnSceneDefs } from './Helm.jsx'
import { HallArt, FirstLightArt, ThinAirArt, OrbitArt, StarsSvg } from './Art.jsx'
import { Sky, Cluster, Rail, Ctas } from './Chrome.jsx'
import { PatchProvider, Patch } from './Patches.jsx'

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

export default function HomePage() {
  return (
    <>
      <DawnSceneDefs />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Sky />
      <Cluster />
      <Rail />
      <PatchProvider>
        <main id="main" tabIndex={-1}>
          <div className="stage-wrap">
            <section id="hall" className="chapter env-forge stage" aria-labelledby="hall-h">
              <div className="stage__inner wrap">
                <div className="stage__art">
                  <p className="vh">{hero.image}</p>
                  <div className="helm-live">
                    <Helm />
                  </div>
                  <div className="helm-pair">
                    <HelmStill />
                    <HelmetStill />
                  </div>
                </div>
                <div className="stage__text">
                  <div className="sp sp-a">
                    <h1 className="display">{site.name}</h1>
                    <p className="lead">{hero.lead}</p>
                    <p className="sub">
                      {hero.sub} {site.location}.
                    </p>
                    <p className="oath">{hero.oath}</p>
                    <Ctas />
                  </div>
                  <div className="sp sp-b">
                    <h2 id="hall-h" className="chapter__title">
                      {hall.title}
                    </h2>
                    <p className="chapter__sub">{hall.sub}</p>
                    <HallEntry e={hall.entries[0]} />
                  </div>
                  <div className="sp sp-c">
                    <HallEntry e={hall.entries[1]} />
                    <HallEntry e={hall.entries[2]} />
                  </div>
                </div>
              </div>
              <HallArt />
            </section>
          </div>

          <section id="first-light" className="chapter env-dawn" aria-labelledby="light-h">
            <FirstLightArt />
            <div className="wrap chapter__body">
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
              <div className="patches patches--one">
                <Patch patch={patches.utsw} preset="ascent" />
              </div>
            </div>
          </section>

          <section id="thin-air" className="chapter env-atmosphere" aria-labelledby="air-h">
            <ThinAirArt />
            <div className="wrap chapter__body">
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
              <div className="patches patches--one">
                <Patch patch={patches.abbott} preset="ascent" />
              </div>
            </div>
          </section>

          <section id="orbit" className="chapter env-orbit" aria-labelledby="orbit-h">
            <OrbitArt />
            <div className="wrap chapter__body">
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
                <Patch patch={patches.astherion} preset="orbit" className="drift d1" />
                <Patch patch={patches.thermal} preset="orbit" className="drift d2" />
                <Patch patch={patches.cnn} preset="orbit" className="drift d3" />
                <Patch patch={patches.wavy} preset="orbit" className="drift d4" />
              </div>
            </div>
          </section>

          <section id="deep-space" className="chapter env-deep" aria-labelledby="space-h">
            <StarsSvg />
            <canvas className="stars-gl" aria-hidden="true" />
            <div className="wrap chapter__body">
              <h2 id="space-h" className="chapter__title" data-split>
                {deepSpace.title}
              </h2>
              <p className="lead lead--big">{deepSpace.line}</p>
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
              </footer>
            </div>
          </section>
        </main>
      </PatchProvider>
    </>
  )
}
