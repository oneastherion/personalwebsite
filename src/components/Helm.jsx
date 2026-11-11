// Great helm that turns into an EVA helmet. One SVG, one drawing style:
// flat planes, hard facets, 1.5 px outline. The morph runs on `d`, `fill` and `opacity` only.
// Initial markup is the helm (progress 0). HelmetStill is the finished helmet for the still diptych.

export const PATHS = {
  helm: {
    shell:
      'M204 110 L396 110 Q410 110 412 124 L440 540 Q441 560 424 566 L300 584 L176 566 Q159 560 160 540 L188 124 Q190 110 204 110 Z',
    shade:
      'M300 110 L396 110 Q410 110 412 124 L440 540 Q441 560 424 566 L300 584 Z',
    slit: 'M212 284 L388 284 Q392 284 392 288 L392 298 Q392 302 388 302 L212 302 Q208 302 208 298 L208 288 Q208 284 212 284 Z',
  },
  helmet: {
    shell:
      'M300 96 C430 96 478 190 478 300 L478 430 C478 520 410 560 300 560 C190 560 122 520 122 430 L122 300 C122 190 170 96 300 96 Z',
    shade: 'M300 96 C430 96 478 190 478 300 L478 430 C478 520 410 560 300 560 Z',
    visor:
      'M190 262 C190 210 236 182 300 182 C364 182 410 210 410 262 L410 378 C410 440 364 472 300 472 C236 472 190 440 190 378 Z',
  },
}

const INK = '#EFEBE3'

function Rivets() {
  const xs = [214, 246, 278, 322, 354, 386]
  return (
    <g data-part="rivets">
      <path d="M190 150 L410 150" stroke={INK} strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
      {xs.map((x) => (
        <circle key={x} cx={x} cy="130" r="4" fill="#9AA3AD" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      ))}
    </g>
  )
}

function Bars() {
  const holes = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) holes.push([346 + c * 20, 380 + r * 24])
  return (
    <g data-part="bars">
      <path d="M290 302 L310 302 L313 520 L287 520 Z" fill="#838C97" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      {holes.map(([x, y]) => (
        <circle key={x + '-' + y} cx={x} cy={y} r="4.5" fill="#14171B" />
      ))}
    </g>
  )
}

export function VisorScene() {
  // Mirrored copy of the next chapter (First light), clipped to the visor.
  return (
    <g>
      <use href="#dawn-scene" x="130" y="150" width="340" height="340" />
      <path d="M200 250 L270 200 L300 200 L215 330 Z" fill="#fff" opacity="0.14" />
    </g>
  )
}

export function DawnSceneDefs() {
  // Shared by the visor reflection and the First light chapter art. 340 x 340 box.
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2742" />
          <stop offset="0.55" stopColor="#4A5F93" />
          <stop offset="0.8" stopColor="#E9A56A" />
          <stop offset="1" stopColor="#FFA057" />
        </linearGradient>
        <g id="dawn-scene">
          <rect width="340" height="340" fill="url(#dawnSky)" />
          <circle cx="226" cy="236" r="34" fill="#FFD9A0" />
          <path
            d="M0 262 L0 340 L340 340 L340 270 L318 270 L318 254 L302 254 L302 270 L284 270 L284 254 L268 254 L268 270 L60 270 L60 246 L44 246 L44 262 L28 262 L28 246 L12 246 L12 262 Z"
            fill="#12172A"
          />
          <path d="M96 340 L96 286 L112 286 L112 276 L128 276 L128 286 L144 286 L144 340 Z" fill="#0D1122" />
        </g>
      </defs>
    </svg>
  )
}

export default function Helm({ className = '' }) {
  return (
    <svg
      className={`helm ${className}`}
      viewBox="0 0 600 720"
      width="600"
      height="720"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="visorClip">
          <path id="visorClipPath" d={PATHS.helm.slit} />
        </clipPath>
      </defs>
      <g id="helm-all">
        {/* collar docks in when the helm becomes a helmet */}
        <g id="collar" opacity="0">
          <rect x="146" y="546" width="308" height="56" rx="18" fill="#C9D2DA" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
          <rect x="146" y="566" width="308" height="8" fill="#F4903F" />
        </g>
        <path id="shell" d={PATHS.helm.shell} fill="#6E7782" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
        <path id="shade" d={PATHS.helm.shade} fill="#14171B" fillOpacity="0.32" />
        <Rivets />
        <Bars />
        {/* side ports appear on the helmet */}
        <g id="ports" opacity="0">
          <rect x="100" y="304" width="30" height="56" rx="12" fill="#F4903F" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
          <rect x="470" y="304" width="30" height="56" rx="12" fill="#F4903F" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
        </g>
        <path id="visor" d={PATHS.helm.slit} fill="#0A0D12" stroke="#1B1F26" strokeWidth="2" />
        <g clipPath="url(#visorClip)">
          <g id="reflect" opacity="0">
            <VisorScene />
          </g>
        </g>
        <rect id="glow" x="216" y="291" width="168" height="3" rx="1.5" fill="#F4903F" />
      </g>
    </svg>
  )
}

export function HelmetStill({ className = '' }) {
  return (
    <svg className={`helm helm--still ${className}`} viewBox="0 0 600 720" width="600" height="720" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="visorClipStill">
          <path d={PATHS.helmet.visor} />
        </clipPath>
      </defs>
      <rect x="146" y="546" width="308" height="56" rx="18" fill="#C9D2DA" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      <rect x="146" y="566" width="308" height="8" fill="#F4903F" />
      <path d={PATHS.helmet.shell} fill="#E8EDF1" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      <path d={PATHS.helmet.shade} fill="#14171B" fillOpacity="0.18" />
      <rect x="100" y="304" width="30" height="56" rx="12" fill="#F4903F" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      <rect x="470" y="304" width="30" height="56" rx="12" fill="#F4903F" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      <path d={PATHS.helmet.visor} fill="#0A0D12" stroke="#1B1F26" strokeWidth="2" />
      <g clipPath="url(#visorClipStill)">
        <VisorScene />
      </g>
    </svg>
  )
}

export function HelmStill({ className = '' }) {
  return (
    <svg className={`helm helm--still ${className}`} viewBox="0 0 600 720" width="600" height="720" aria-hidden="true" focusable="false">
      <path d={PATHS.helm.shell} fill="#6E7782" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      <path d={PATHS.helm.shade} fill="#14171B" fillOpacity="0.32" />
      <Rivets />
      <Bars />
      <path d={PATHS.helm.slit} fill="#0A0D12" stroke="#1B1F26" strokeWidth="2" />
      <rect x="216" y="291" width="168" height="3" rx="1.5" fill="#F4903F" />
    </svg>
  )
}
