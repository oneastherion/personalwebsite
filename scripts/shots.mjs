// Screenshots + console errors. Usage: node scripts/shots.mjs <outDir> [base]
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
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }))
const sizes = { m: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, d: { width: 1440, height: 900, deviceScaleFactor: 1 } }
const errors = []
for (const [sk, vp] of Object.entries(sizes)) {
  for (const motion of ['on', 'still']) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: motion === 'still' ? 'reduce' : 'no-preference' })
    const page = await ctx.newPage()
    page.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`${sk}/${motion} ${m.type()}: ${m.text()}`))
    page.on('pageerror', (e) => errors.push(`${sk}/${motion} pageerror: ${e.message}`))
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    const vh = vp.height
    const points = motion === 'on'
      ? ['hall', 'first-light', 'thin-air', 'orbit', 'deep-space'].length && [0, 0.8, 1.6, 2.4, 3.0]
      : []
    if (motion === 'on') {
      // stage wrap = 1 + (2.2 | 2.6) screens; sample the scrub, then each chapter
      const stageH = await page.evaluate(() => document.querySelector('.stage-wrap').offsetHeight - innerHeight)
      for (const f of [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1]) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(stageH * f))
        await page.waitForTimeout(900)
        await page.screenshot({ path: `${out}/${sk}-${motion}-stage-${String(Math.round(f * 100)).padStart(3, '0')}.png` })
      }
    }
    for (const id of ['first-light', 'thin-air', 'orbit', 'deep-space']) {
      await page.evaluate((id) => { const el = document.getElementById(id); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 40) }, id)
      await page.waitForTimeout(900)
      await page.screenshot({ path: `${out}/${sk}-${motion}-${id}.png` })
      await page.evaluate((id) => { const el = document.getElementById(id); window.scrollTo(0, el.getBoundingClientRect().bottom + scrollY - innerHeight) }, id)
      await page.waitForTimeout(900)
      await page.screenshot({ path: `${out}/${sk}-${motion}-${id}-end.png` })
    }
    if (motion === 'still') {
      await page.evaluate(() => scrollTo(0, 0))
      await page.waitForTimeout(300)
      await page.screenshot({ path: `${out}/${sk}-still-top.png` })
    }
    // astherion page
    const p2 = await ctx.newPage()
    p2.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`${sk}/${motion} astherion ${m.type()}: ${m.text()}`))
    p2.on('pageerror', (e) => errors.push(`${sk}/${motion} astherion pageerror: ${e.message}`))
    await p2.goto(base + '/astherion/', { waitUntil: 'networkidle' })
    await p2.waitForTimeout(700)
    await p2.screenshot({ path: `${out}/${sk}-${motion}-astherion.png`, fullPage: true })
    await ctx.close()
  }
}
await browser.close()
server?.kill()
console.log(errors.length ? errors.join('\n') : 'no console errors')
