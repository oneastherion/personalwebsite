// Prerender: build the client, build the server entry, render every page into static HTML.
import { build } from 'vite'
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { site, astherionPage } from '../src/content.js'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')

await build({ root, logLevel: 'warn' })
await build({ root, logLevel: 'warn', build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr', emptyOutDir: true, rollupOptions: { output: { format: 'esm' } } } })

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const template = readFileSync(path.join(dist, 'index.html'), 'utf8')

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  alternateName: site.fullName,
  jobTitle: 'Founder and Lead Engineer',
  description: site.description,
  url: site.url + '/',
  email: site.email,
  worksFor: { '@type': 'Organization', name: 'Astherion, Inc.' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'The University of Texas at Dallas' },
  address: { '@type': 'PostalAddress', addressRegion: 'CA', addressCountry: 'US' },
  sameAs: [site.linkedin],
}

const pages = [
  { key: 'home', out: 'index.html', url: site.url + '/', title: site.title, description: site.description, ld: person },
  {
    key: 'astherion', out: 'astherion/index.html', url: site.url + '/astherion/', title: astherionPage.title, description: astherionPage.description,
    ld: { '@context': 'https://schema.org', '@type': 'WebPage', name: astherionPage.h1, url: site.url + '/astherion/', description: astherionPage.description, author: { '@type': 'Person', name: site.name }, about: { '@type': 'Organization', name: 'Astherion, Inc.' } },
  },
]
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
for (const p of pages) {
  const head = [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${p.url}" />`,
    `<meta name="theme-color" content="#021520" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${p.url}" />`,
    `<meta property="og:image" content="${site.url}/og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(p.ld)}</script>`,
  ].join('\n    ')
  const html = template
    .replace('<!--head-outlet-->', head)
    .replace('<!--page-outlet-->', p.key)
    .replace('<!--ssr-outlet-->', render(p.key))
  const file = path.join(dist, p.out)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, html)
}

writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${p.url}</loc></url>`).join('\n')}\n</urlset>\n`.replace('sitemap.org/schemas/sitemap/0.9', 'sitemaps.org/schemas/sitemap/0.9'),
)
rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
if (!existsSync(path.join(dist, 'juan-gonzalez-flores-resume.pdf'))) console.warn('\nWARNING: public/juan-gonzalez-flores-resume.pdf is missing. The resume link will 404 until you commit the PDF.\n')
console.log('prerendered', pages.map((p) => p.out).join(', '))
