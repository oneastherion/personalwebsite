// Package the home page as a self-contained Claude artifact for phone previews.
// One HTML page with the JS and CSS inlined, Google Fonts in place of the self-hosted subsets
// (the artifact sandbox only loads fonts from Google), and the desktop frame sets as published files.
// Output: dist-artifact/index.html plus dist-artifact/files.json (published path -> source path).
import { build } from 'vite'
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { site } from '../src/content.js'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'dist-artifact')
rmSync(out, { recursive: true, force: true })

const define = { 'import.meta.env.VITE_ONE_SIZE': '"1"' }
await build({
  root,
  logLevel: 'warn',
  define,
  base: './',
  build: { outDir: path.join(out, 'client'), emptyOutDir: true, cssCodeSplit: false, rollupOptions: { output: { inlineDynamicImports: true } } },
})
await build({ root, logLevel: 'warn', define, build: { ssr: 'src/entry-server.jsx', outDir: path.join(out, 'ssr'), emptyOutDir: true } })
const { render } = await import(pathToFileURL(path.join(out, 'ssr/entry-server.js')).href)

const assets = path.join(out, 'client/assets')
const js = readdirSync(assets).filter((f) => f.endsWith('.js')).map((f) => readFileSync(path.join(assets, f), 'utf8'))
let css = readdirSync(assets).filter((f) => f.endsWith('.css')).map((f) => readFileSync(path.join(assets, f), 'utf8')).join('\n')
// swap the self-hosted families for the same families from Google Fonts
css = css
  .replace(/@font-face\{font-family:(Bricolage|Shoulders|JetBrains Mono);[^}]*\}/g, '')
  .replace(/"?Bricolage"?,/g, '"Bricolage Grotesque",')
  .replace(/"?Shoulders"?,/g, '"Big Shoulders Display","Big Shoulders",')
const body = render('home').replace(/"\/hero\//g, '"hero/').replace(/ \/hero\//g, ' hero/').replace(/ (srcset|sizes)="[^"]*"/gi, '')
const safe = (s) => s.replace(/<\/script/gi, '<\\/script')

const html = `<title>Juan Gonzalez Flores</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap">
<script>
(function () {
  var d = document.documentElement
  d.classList.add('js')
  var pref = 'on'
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) pref = 'off'
    var s = localStorage.getItem('motion')
    if (s === 'off' || s === 'on') pref = s
  } catch (e) {}
  d.setAttribute('data-motion', pref === 'off' ? 'still' : 'on')
})()
</script>
<style>
:root { color-scheme: dark; }
${css}
</style>
<div id="root" data-page="home">${body}</div>
<script type="module">
${safe(js.join('\n'))}
</script>
`
writeFileSync(path.join(out, 'index.html'), html)

const files = {}
for (const clip of ['idle', 'morph']) {
  for (const f of readdirSync(path.join(root, 'public/hero', clip))) files[`hero/${clip}/${f}`] = path.join('public/hero', clip, f)
}
writeFileSync(path.join(out, 'files.json'), JSON.stringify(files))
console.log('artifact page', (html.length / 1024).toFixed(0) + ' KB,', Object.keys(files).length, 'files', site.name)
