// Subsets the self-hosted fonts to the glyphs the site uses. Output is committed in public/fonts.
import subsetFont from 'subset-font'
import { readFileSync, writeFileSync } from 'node:fs'
const text = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°±–’‘“”…×·−→©'
const jobs = [
  ['node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2', 'public/fonts/bricolage-var.woff2'],
  ['node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', 'public/fonts/jbmono-400.woff2'],
  ['node_modules/@fontsource-variable/big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2', 'public/fonts/shoulders-var.woff2'],
]
for (const [src, out] of jobs) {
  const buf = await subsetFont(readFileSync(src), text, { targetFormat: 'woff2', noLayoutClosure: true, ...(src.includes('bricolage') ? { variationAxes: { wght: { min: 300, max: 800 }, wdth: { min: 75, max: 100 } } } : {}) })
  writeFileSync(out, buf)
  console.log(out, (buf.length / 1024).toFixed(1) + ' KB')
}
