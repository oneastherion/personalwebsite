// Chapter art. Same drawing style as the helm: flat planes, hard edges, no shadows.
// Elements marked data-rise / data-sink / data-drift are moved by transform in Scenes.

function crenels(x0, x1, y, w, h, gap) {
  let d = ''
  for (let x = x0; x < x1; x += w + gap) d += `M${x} ${y} h${w} v${-h} h${-w} Z `
  return d
}

export function HallArt() {
  return (
    <svg className="art art--hall" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <path d="M0 240 V80 H1440 V240 Z" fill="#101317" />
      <path d={crenels(0, 1440, 80, 56, 30, 40)} fill="#101317" />
      <path d="M0 122 H1440" stroke="#EFEBE3" strokeOpacity="0.12" strokeWidth="1.5" />
      <path d="M0 170 H1440" stroke="#EFEBE3" strokeOpacity="0.12" strokeWidth="1.5" />
      <path d="M560 240 V160 Q560 112 640 112 Q720 112 720 160 V240 Z" fill="#0A0C0F" />
      <g data-drift="torch">
        <rect x="788" y="128" width="8" height="40" fill="#2B3037" />
        <path d="M792 70 C 776 96 770 112 782 128 L802 128 C 814 112 808 96 792 70 Z" fill="#F4903F" />
        <path d="M792 94 C 785 108 784 116 788 126 L796 126 C 800 116 799 108 792 94 Z" fill="#FFD08A" />
      </g>
    </svg>
  )
}

export function FirstLightArt() {
  return (
    <svg className="art art--light" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g data-rise="sun">
        <circle cx="1040" cy="240" r="64" fill="#FFD9A0" />
      </g>
      <path d="M0 360 V250 H1440 V360 Z" fill="#12172A" opacity="0.0" />
      <g data-sink="ramparts">
        <path d="M0 360 V260 H1440 V360 Z" fill="#12172A" />
        <path d={crenels(0, 1440, 260, 44, 26, 34)} fill="#12172A" />
        <path d="M120 260 V200 H168 V176 H216 V200 H264 V260 Z" fill="#0D1122" />
        <path d="M1180 260 V210 H1230 V184 H1280 V210 H1330 V260 Z" fill="#0D1122" />
      </g>
    </svg>
  )
}

export function ThinAirArt() {
  const cloud = (y, o, seed) => {
    // Drawn 100 px wider than the frame on both sides so the drift never shows an edge.
    let d = `M-100 ${y + 120} V${y + 40}`
    const bumps = 10
    for (let i = 0; i < bumps; i++) {
      const x0 = -100 + (1640 / bumps) * i
      const x1 = -100 + (1640 / bumps) * (i + 1)
      const h = 22 + ((i * seed) % 5) * 11
      d += ` Q${(x0 + x1) / 2} ${y + 40 - h} ${x1} ${y + 40}`
    }
    return d + ` V${y + 120} Z`
  }
  return (
    <svg className="art art--air" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <path d="M0 170 L1440 250" stroke="#F4F8FB" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <path d="M0 182 L1440 266" stroke="#F4F8FB" strokeOpacity="0.2" strokeWidth="1.5" fill="none" />
      <g data-drift="far">
        <path d={cloud(250, 0.1, 3)} fill="#CFE3F0" opacity="0.14" />
      </g>
      <g data-drift="mid">
        <path d={cloud(330, 0.2, 2)} fill="#CFE3F0" opacity="0.2" />
      </g>
      <g data-drift="near">
        <path d={cloud(410, 0.3, 4)} fill="#F4F8FB" opacity="0.26" />
      </g>
    </svg>
  )
}

export function OrbitArt() {
  return (
    <svg className="art art--orbit" viewBox="0 0 1440 480" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g data-rise="limb">
        <ellipse cx="720" cy="1100" rx="1500" ry="760" fill="#0E3F66" />
        <path d="M-780 1100 A1500 760 0 0 1 2220 1100" fill="none" stroke="#7FD6E8" strokeWidth="3" opacity="0.8" />
        <path d="M-600 1098 A1380 700 0 0 1 2040 1098" fill="none" stroke="#7FD6E8" strokeWidth="1.5" opacity="0.28" />
        <path d="M120 470 Q 260 420 400 450 Q 520 478 600 520 L 100 560 Z" fill="#1C6A5E" opacity="0.8" />
        <path d="M860 438 Q 1000 392 1160 424 Q 1280 450 1340 500 L 840 520 Z" fill="#1C6A5E" opacity="0.8" />
      </g>
    </svg>
  )
}

// Deterministic sparse star field so server and client agree.
function prng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}
export const STARS = (() => {
  const r = prng(20260101)
  return Array.from({ length: 140 }, () => ({
    x: +(r() * 100).toFixed(2),
    y: +(r() * 100).toFixed(2),
    r: +(0.5 + r() * r() * 1.3).toFixed(2),
    o: +(0.35 + r() * 0.65).toFixed(2),
  }))
})()

export function StarsSvg() {
  return (
    <svg className="stars-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g data-rise="stars">
        {STARS.map((s, i) => (
          <circle key={i} cx={+(s.x * 14.4).toFixed(1)} cy={+(s.y * 9).toFixed(1)} r={s.r} fill="#EAF1F5" opacity={s.o} />
        ))}
      </g>
    </svg>
  )
}
