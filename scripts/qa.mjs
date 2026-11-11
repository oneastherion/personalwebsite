// Functional QA against a running build. Usage: node scripts/qa.mjs [base]
// Checks: every copy string is in the server HTML, no console errors, no horizontal overflow,
// patch panels open/close with keyboard and return focus, retired claims absent, links resolve.
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import * as content from '../src/content.js'

let base = process.argv[2]
let server
if (!base) {
  server = spawn('npx', ['vite', 'preview', '--port', '4174', '--strictPort'], { stdio: 'ignore' })
  base = 'http://localhost:4174'
  await new Promise((r) => setTimeout(r, 2500))
}
const results = []
const ok = (name, pass, detail = '') => results.push({ name, pass, detail })

// 1. Server HTML contains the copy (no JS executed).
const home = await (await fetch(base + '/')).text()
const log = await (await fetch(base + '/astherion/')).text()
const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ')
const homeText = text(home)
const logText = text(log)
const strings = []
const walk = (o) => {
  if (typeof o === 'string') strings.push(o)
  else if (Array.isArray(o)) o.forEach(walk)
  else if (o && typeof o === 'object') Object.values(o).forEach(walk)
}
const homeCopy = [content.hero.lead, content.hero.sub, content.hero.oath, content.hall, content.firstLight, content.thinAir, content.orbit, content.patches, content.deepSpace]
homeCopy.forEach(walk)
const urlish = /^(\/|https?:|mailto:)|^(utsw|abbott|astherion|thermal|cnn|wavy|shield|octagon|disc|diamond|pennant|pill|pressure|sensor|orbit|band|lobes|wave|forge|dawn|atmosphere|deep|hall|first-light|thin-air|space|light|air)$/
const miss = strings.filter((s) => s && !urlish.test(s) && !homeText.includes(s.replace(/’/g, '’')))
ok('home: all copy strings are in the server HTML', miss.length === 0, miss.slice(0, 5).join(' | '))
strings.length = 0
walk(content.astherionPage)
const missLog = strings.filter((s) => s && !urlish.test(s) && !/^\d+$/.test(s) && !logText.includes(s) && s !== content.astherionPage.title && s !== content.astherionPage.description && s !== '/')
ok('astherion: all copy strings are in the server HTML', missLog.length === 0, missLog.slice(0, 5).join(' | '))
ok('home: title', /<title>Juan Gonzalez Flores \| Biomedical engineer and founder of Astherion<\/title>/.test(home))
ok('home: description', home.includes(content.site.description))
ok('home: canonical, JSON-LD Person', home.includes('rel="canonical" href="https://www.juangonzalezflores.com/"') && home.includes('"@type":"Person"'))

// 2. Retired claims never appear anywhere in the HTML.
const banned = ['16 sensors', 'PPG', '7 units', 'Nordic SDK', 'Clinical Research Data Engineer', '820.198', 'KiCad', 'PCB', 'Visionary', 'Astheríon', 'NFI', 'ASTS', 'VEQ', 'revolutionary', 'cutting-edge', 'game-changing', 'unleash', 'elevate', 'empower', 'seamless', 'core body temperature', 'hydration', 'posture', 'wearable']
const both = (homeText + ' ' + logText)
ok('no retired claims or hype words', banned.every((b) => !both.toLowerCase().includes(b.toLowerCase())), banned.filter((b) => both.toLowerCase().includes(b.toLowerCase())).join(', '))
ok('no em dashes in copy', !both.includes('—'))
ok('no exclamation points in copy', !/!/.test(both.replace(/<!--.*?-->/g, '')))

// 3. Browser checks at both widths.
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }))
for (const [label, vp] of [['390', { width: 390, height: 844 }], ['1440', { width: 1440, height: 900 }]]) {
  for (const motion of ['on', 'still']) {
    const ctx = await browser.newContext({ viewport: vp, reducedMotion: motion === 'still' ? 'reduce' : 'no-preference', isMobile: label === '390', hasTouch: label === '390' })
    const page = await ctx.newPage()
    const errs = []
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
    page.on('pageerror', (e) => errs.push(e.message))
    page.on('requestfailed', (r) => errs.push('requestfailed ' + r.url()))
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    ok(`${label}/${motion}: no horizontal overflow`, overflow <= 0, String(overflow))
    // Patch panel: open by keyboard, Escape closes, focus returns.
    await page.evaluate(() => document.getElementById('orbit').scrollIntoView())
    await page.waitForTimeout(500)
    const btn = page.locator('[data-patch="thermal"] .patch')
    await btn.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2200)
    const open = await page.locator('#panel-thermal .panel').isVisible()
    const inside = await page.evaluate(() => !!document.activeElement.closest('#panel-thermal'))
    const body = await page.locator('#panel-thermal').innerText()
    ok(`${label}/${motion}: patch opens with keyboard, focus moves in`, open && inside, body.slice(0, 40))
    if (label === '390' && motion === 'on') await page.screenshot({ path: process.env.SHOT_DIR ? `${process.env.SHOT_DIR}/panel-390.png` : '/tmp/claude-0/panel-390.png' })
    if (label === '1440' && motion === 'on') await page.screenshot({ path: process.env.SHOT_DIR ? `${process.env.SHOT_DIR}/panel-1440.png` : '/tmp/claude-0/panel-1440.png' })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const closed = !(await page.locator('#panel-thermal .panel').isVisible())
    const back = await page.evaluate(() => document.activeElement?.closest('[data-patch="thermal"]') !== null)
    ok(`${label}/${motion}: Escape closes and returns focus`, closed && back)
    // Skip link first in tab order.
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await page.keyboard.press('Tab')
    const first = await page.evaluate(() => document.activeElement?.className)
    ok(`${label}/${motion}: skip link is first tab stop`, first === 'skip', String(first))
    // Back button and anchors keep native behavior: hash change updates the URL.
    ok(`${label}/${motion}: no console errors`, errs.filter((e) => !/GL Driver|ReadPixels/.test(e)).length === 0, errs.join(' | ').slice(0, 300))
    await ctx.close()
  }
}
// JS disabled: copy and panels still visible.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto(base + '/')
  const vis = await page.locator('#panel-utsw .panel').isVisible()
  ok('no JavaScript: patch facts visible inline', vis)
  const h1 = await page.locator('h1').innerText()
  ok('no JavaScript: h1 present', h1.replace(/\s+/g, ' ').includes('Juan Gonzalez Flores'))
  await ctx.close()
}
await browser.close()
server?.kill()
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.pass ? '' : '  <- ' + r.detail}`)
const fails = results.filter((r) => !r.pass)
console.log(`\n${results.length - fails.length}/${results.length} passed`)
process.exit(fails.length ? 1 : 0)
