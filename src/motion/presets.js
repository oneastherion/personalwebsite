// The only four motion presets in the site. Every animation names one of these.
// Weight changes with altitude: short firm travel at the bottom, long soft travel at the top.
export const presets = {
  forge: {
    distance: [8, 24], // px of travel
    duration: 0.35,
    ease: 'power4.out',
    settle: 'back.out(1.4)',
    scrub: 0.15,
    spring: { type: 'spring', stiffness: 520, damping: 40, mass: 1.2 },
  },
  ascent: {
    distance: [48, 96],
    duration: 0.8,
    ease: 'power2.out',
    scrub: 0.5,
    spring: { type: 'spring', stiffness: 220, damping: 28, mass: 1 },
  },
  orbit: {
    distance: [120, 240],
    duration: 1.4,
    ease: 'sine.inOut',
    scrub: 1,
    loop: [12, 16], // seconds, slow drift
    spring: { type: 'spring', stiffness: 90, damping: 18, mass: 1 },
  },
  drift: {
    distance: [120, 320],
    duration: 2.2,
    ease: 'sine.inOut',
    scrub: 1.6,
    loop: [14, 20],
    spring: { type: 'spring', stiffness: 40, damping: 12, mass: 1.2 },
  },
}

export const chapterPreset = { hall: 'forge', light: 'ascent', air: 'ascent', orbit: 'orbit', space: 'drift' }
