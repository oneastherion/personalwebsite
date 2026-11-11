// Screenshots of every chapter at 390 and 1440, motion on and still, plus console errors.
// Usage: node scripts/shots.mjs <outDir> [base]
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
const out = process.argv[2] || 'shots'
mkdirSync(out, { recursive: true })
let base = process.argv[3]
let server
if (!base) {
  server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
  base = 'http://localhost:4173'
  await new Promise((r) => setTimeout(r, 2500))
}
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] })
const sizes = { m: { width: 390, height: 844, mobile: true }, d: { width: 1440, height: 900, mobile: false } }
const ids = ['chronicle', 'arsenal', 'campaigns', 'astherion', 'frontier']
const errors = []
const only = process.env.ONLY // e.g. "d-on"
for (const [sk, vp] of Object.entries(sizes)) {
  for (const motion of ['on', 'still']) {
    if (only && !only.split(',').includes(`${sk}-${motion}`)) continue
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile, reducedMotion: motion === 'still' ? 'reduce' : 'no-preference' })
    const page = await ctx.newPage()
    page.on('console', (m) => m.type() === 'error' && errors.push(`${sk}/${motion}: ${m.text()}`))
    page.on('pageerror', (e) => errors.push(`${sk}/${motion} pageerror: ${e.message}`))
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2200)
    await page.screenshot({ path: `${out}/${sk}-${motion}-0-top.png` })
    let n = 1
    for (const id of ids) {
      for (const at of motion === 'on' ? [0.15, 0.55] : [0]) {
        await page.evaluate(([id, at]) => {
          const el = document.getElementById(id)
          const top = el.getBoundingClientRect().top + scrollY
          window.scrollTo(0, top + el.offsetHeight * at - (at ? innerHeight * 0.3 : 0))
        }, [id, at])
        await page.waitForTimeout(1600)
        await page.screenshot({ path: `${out}/${sk}-${motion}-${n}-${id}-${Math.round(at * 100)}.png` })
      }
      n++
    }
    const p2 = await ctx.newPage()
    p2.on('pageerror', (e) => errors.push(`${sk}/${motion} astherion pageerror: ${e.message}`))
    await p2.goto(base + '/astherion/', { waitUntil: 'networkidle' })
    await p2.waitForTimeout(1200)
    await p2.screenshot({ path: `${out}/${sk}-${motion}-9-astherion.png` })
    await ctx.close()
  }
}
await browser.close()
server?.kill()
console.log(errors.length ? errors.join('\n') : 'no console errors')
