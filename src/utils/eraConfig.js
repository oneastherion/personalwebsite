export const eras = {
  medieval: {
    name: 'Medieval',
    bg: '#0d0b08',
    primary: '#1a1410',
    accent: '#c9a84c',
    text: '#e8dcc8',
    textMuted: 'rgba(232, 220, 200, 0.6)',
    headingFont: 'Cinzel, serif',
    particleColor: '#c9a84c',
    particleSecondary: '#ff6b35',
  },
  renaissance: {
    name: 'Renaissance',
    bg: '#12101a',
    primary: '#1a1520',
    accent: '#b8860b',
    text: '#d4c5a0',
    textMuted: 'rgba(212, 197, 160, 0.6)',
    headingFont: 'Cinzel, serif',
    particleColor: '#b8860b',
    particleSecondary: '#8b7355',
  },
  medical: {
    name: 'Medical',
    bg: '#060d18',
    primary: '#0a1628',
    accent: '#4fc3f7',
    text: '#e0e8f0',
    textMuted: 'rgba(224, 232, 240, 0.6)',
    headingFont: 'Space Grotesk, sans-serif',
    particleColor: '#4fc3f7',
    particleSecondary: '#1a73e8',
  },
  space: {
    name: 'Space',
    bg: '#02020a',
    primary: '#050510',
    accent: '#7c4dff',
    text: '#e8e0ff',
    textMuted: 'rgba(232, 224, 255, 0.6)',
    headingFont: 'Space Grotesk, sans-serif',
    particleColor: '#7c4dff',
    particleSecondary: '#e8e0ff',
  },
}

// Map scroll progress (0-1) to an era
export function getEraAtProgress(progress) {
  if (progress < 0.2) return 'medieval'
  if (progress < 0.4) return 'renaissance'
  if (progress < 0.7) return 'medical'
  return 'space'
}

// Interpolate between two hex colors
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
}

function lerpColor(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t)
}

// Get interpolated era values at any scroll position
export function getInterpolatedEra(progress) {
  const eraKeys = ['medieval', 'renaissance', 'medical', 'space']
  const boundaries = [0, 0.25, 0.55, 0.8]

  let fromIdx = 0
  for (let i = boundaries.length - 1; i >= 0; i--) {
    if (progress >= boundaries[i]) {
      fromIdx = i
      break
    }
  }

  const toIdx = Math.min(fromIdx + 1, eraKeys.length - 1)
  const fromBound = boundaries[fromIdx]
  const toBound = fromIdx < boundaries.length - 1 ? boundaries[toIdx] : 1
  const localT = toBound > fromBound ? Math.min((progress - fromBound) / (toBound - fromBound), 1) : 0

  const from = eras[eraKeys[fromIdx]]
  const to = eras[eraKeys[toIdx]]

  return {
    bg: lerpColor(from.bg, to.bg, localT),
    accent: lerpColor(from.accent, to.accent, localT),
    text: lerpColor(from.text, to.text, localT),
    primary: lerpColor(from.primary, to.primary, localT),
    particleColor: lerpColor(from.particleColor, to.particleColor, localT),
    particleSecondary: lerpColor(from.particleSecondary, to.particleSecondary, localT),
    eraName: from.name,
    headingFont: localT > 0.5 ? to.headingFont : from.headingFont,
  }
}

// Section definitions with their era assignments
export const sections = [
  { id: 'hero', label: '', era: 'medieval', numeral: '' },
  { id: 'about', label: 'The Chronicle', era: 'medieval', numeral: 'I' },
  { id: 'skills', label: 'The Arsenal', era: 'renaissance', numeral: 'II' },
  { id: 'projects', label: 'The Campaigns', era: 'medical', numeral: 'III' },
  { id: 'astherion', label: 'The Empire', era: 'medical', numeral: 'IV' },
  { id: 'future', label: 'The Next Frontier', era: 'space', numeral: 'V' },
  { id: 'contact', label: 'Send a Raven', era: 'space', numeral: 'VI' },
]
