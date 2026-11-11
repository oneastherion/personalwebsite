// All copy lives here. Facts only. See the brief: no retired claims, no Astherion IP, no Abbott detail.

export const site = {
  name: 'Juan Gonzalez Flores',
  fullName: 'Juan A. Gonzalez Flores',
  url: 'https://www.juangonzalezflores.com',
  email: 'juan.gonzalezflores101@gmail.com',
  linkedin: 'https://www.linkedin.com/in/juangonzalezflores',
  resume: '/juan-gonzalez-flores-resume.pdf',
  location: 'San Francisco Bay Area, CA',
  title: 'Juan Gonzalez Flores | Biomedical engineer and founder of Astherion',
  description:
    'Biomedical engineer who builds and validates physiological sensing hardware: firmware, test methods and clinical data. Founder and lead engineer of Astherion.',
}

export const hero = {
  lead: 'I’m a biomedical engineer. I build and validate physiological sensing hardware.',
  sub: 'Founder and lead engineer of Astherion.',
  oath: 'From the discipline of the oath to the frontier of space.',
  image:
    'Illustration of a knight’s great helm that turns into a spacesuit helmet as you scroll. The eye slit opens into a reflective visor.',
}

export const chapters = [
  { id: 'hall', env: 'forge', label: 'The hall', altitude: '0 m', alt: 0 },
  { id: 'first-light', env: 'dawn', label: 'First light', altitude: '3,000 m', alt: 3000 },
  { id: 'thin-air', env: 'atmosphere', label: 'Thin air', altitude: '12,000 m', alt: 12000 },
  { id: 'orbit', env: 'orbit', label: 'Orbit', altitude: '408 km', alt: 408000 },
  { id: 'deep-space', env: 'deep', label: 'Deep space', altitude: '384,000 km', alt: 384000000 },
]

export const hall = {
  title: 'The hall',
  sub: 'Where I learned the craft',
  entries: [
    {
      org: 'Sherwin-Williams',
      place: 'Garland, TX',
      role: 'Project and process engineering co-op',
      dates: 'Jan to May 2023',
      text: 'I ran Design of Experiments across 8 process parameters. Output consistency improved about 15%.',
    },
    {
      org: 'The University of Texas at Dallas',
      place: '',
      role: 'B.S. Biomedical Engineering',
      dates: 'Dec 2024',
      text: '',
    },
    {
      org: 'Tarrant County College',
      place: '',
      role: 'A.S. Chemistry',
      dates: 'May 2021',
      text: 'Cornerstone Honors, Dean’s List.',
    },
  ],
}

export const firstLight = {
  title: 'First light',
  org: 'UT Southwestern Medical Center',
  place: 'Dallas, TX',
  role: 'Research Technician',
  dates: 'Mar 2025 to Jan 2026',
  paragraphs: [
    'I acquired real-time hemodynamic data in the operating room during 30+ cardiac surgeries for a Phase 3 trial.',
    'Back at the desk I built the tools that made the data usable: MATLAB code that processes 200+ Epic records a day, and a MATLAB and Python pipeline that cut dataset turnaround from 4–8 hours to 1–2 hours.',
  ],
  tools: 'MATLAB, Python, clinical data acquisition',
}

export const thinAir = {
  title: 'Thin air',
  org: 'Abbott Diabetes Care',
  place: 'Alameda, CA',
  role: 'Complaint Investigations Technician',
  contract: 'Contract via Talent Solutions',
  dates: 'Feb 2026 to present',
  paragraphs: [
    'I do hands-on electronic test and failure analysis on returned glucose sensors, meters and test strips, under FDA 21 CFR Part 820 (QMSR) and ISO 13485.',
  ],
  tools: 'Failure analysis, test methods and V&V, ISO 13485',
}

export const orbit = {
  title: 'Orbit',
  org: 'Astherion, Inc.',
  role: 'Founder and lead engineer',
  dates: 'Jun 2025 to present',
  note: 'Incorporated Oct 2025',
  lead: 'Astherion is building a sensor-integrated performance garment. I’m the sole engineer across firmware, the iOS app and the backend.',
  outcomes: [
    '4 IMUs and 10 temperature probes on an nRF52840 sensor hub.',
    '21 logged bench runs to bring up the alpha hardware.',
    'Fault-tolerant firmware, with the companion iOS app and backend held to 9,206 passing tests.',
    'A 5-unit alpha batch is in build for a supervised pilot cohort.',
  ],
  buildLog: { label: 'Read the build log', href: '/astherion/' },
}

// Patches: each opens to real facts. `shape` and `emblem` pick the drawn art.
export const patches = {
  utsw: {
    id: 'utsw',
    shape: 'shield',
    emblem: 'pressure',
    name: 'UT Southwestern',
    kicker: 'Research Technician, Mar 2025 to Jan 2026',
    facts: [
      'Acquired real-time hemodynamic data in the operating room during 30+ cardiac surgeries for a Phase 3 trial.',
      'Built MATLAB tools that process 200+ Epic records a day and run automated EEG artifact detection across 50+ datasets, cutting manual review about 40%.',
      'Built a MATLAB and Python pipeline that cut dataset turnaround from 4–8 hours to 1–2 hours.',
      'Supported data acquisition and management across multiple research studies.',
    ],
  },
  abbott: {
    id: 'abbott',
    shape: 'octagon',
    emblem: 'sensor',
    name: 'Abbott',
    kicker: 'Complaint Investigations Technician, Feb 2026 to present',
    facts: [
      'Contract via Talent Solutions, Alameda, CA.',
      'Hands-on electronic test and failure analysis on returned glucose sensors, meters and test strips.',
      'Work is done under FDA 21 CFR Part 820 (QMSR) and ISO 13485.',
    ],
  },
  astherion: {
    id: 'astherion',
    shape: 'disc',
    emblem: 'orbit',
    name: 'Astherion',
    kicker: 'Founder and lead engineer, Jun 2025 to present',
    facts: [
      'Incorporated Oct 2025. I’m the sole engineer across firmware, the iOS app and the backend.',
      'First prototype on an ESP32 with optical, motion and temperature sensing, then the sensor hub moved to a Nordic nRF52840 for alpha hardware with 4 IMUs and 10 temperature probes.',
      'Brought up the alpha hardware over 21 logged bench runs.',
      'Fault-tolerant firmware (bounded I/O, sensor health monitoring, test-proven wire format), plus the companion iOS app and backend, held to 9,206 passing tests.',
      'A 5-unit alpha batch is in build for a supervised pilot cohort.',
      'Ascendra One is the hardware, Aetheris is the app and Atlas is the agent.',
    ],
    link: { label: 'Read the build log', href: '/astherion/' },
  },
  thermal: {
    id: 'thermal',
    shape: 'diamond',
    emblem: 'band',
    name: 'Thermal controller',
    kicker: 'Closed-loop control',
    facts: ['Closed-loop thermal controller holding ±0.5 °C for corneal-tissue nanofiber fabrication.'],
  },
  cnn: {
    id: 'cnn',
    shape: 'pennant',
    emblem: 'lobes',
    name: 'Lung volume CNN',
    kicker: 'Convolutional neural network',
    facts: [
      'CNN lung volume estimation with 80–90% accuracy across 150+ datasets, measured against clinician-reviewed ground truth.',
    ],
  },
  wavy: {
    id: 'wavy',
    shape: 'pill',
    emblem: 'wave',
    name: 'Wavy',
    kicker: 'Solo iOS audio app',
    facts: ['Wavy is a solo iOS audio app, in public TestFlight beta.'],
  },
}

export const deepSpace = {
  title: 'Deep space',
  line: 'If you’re building sensing hardware, write to me.',
  skills: [
    { group: 'Firmware', items: 'C/C++, nRF52840, FreeRTOS, BLE' },
    { group: 'Hardware', items: 'Bring-up and debug' },
    { group: 'Quality and test', items: 'Test methods and V&V, failure analysis, ISO 13485, ISO 14971' },
    { group: 'Clinical data', items: 'Acquisition' },
    { group: 'Software', items: 'MATLAB, Python, React Native, TypeScript' },
  ],
  footer: '© 2026 Juan Gonzalez Flores',
}

// The separate Astherion page. Dates only where I have them.
export const astherionPage = {
  title: 'Astherion: how I built it, in order | Juan Gonzalez Flores',
  description:
    'A build log for Astherion, a sensor-integrated performance garment: ESP32 prototype, nRF52840 alpha hardware, 21 bench runs, fault-tolerant firmware, iOS app and backend.',
  h1: 'Building Astherion',
  intro:
    'Astherion is building a sensor-integrated performance garment. I’m the founder and lead engineer, and the sole engineer across firmware, the iOS app and the backend. This is the work in the order I did it.',
  meta: [
    { k: 'Started', v: 'Jun 2025' },
    { k: 'Incorporated', v: 'Oct 2025' },
    { k: 'Role', v: 'Founder and lead engineer' },
  ],
  stages: [
    {
      n: 1,
      title: 'First prototype',
      text: 'The first prototype ran on an ESP32 with optical, motion and temperature sensing.',
      stat: null,
    },
    {
      n: 2,
      title: 'Alpha hardware',
      text: 'I moved the sensor hub to a Nordic nRF52840. The alpha hardware carries 4 IMUs and 10 temperature probes.',
      stat: { value: '4 + 10', unit: 'IMUs and temperature probes' },
    },
    {
      n: 3,
      title: 'Bring-up',
      text: 'I brought up the alpha hardware over 21 logged bench runs.',
      stat: { value: '21', unit: 'logged bench runs', ticks: 21 },
    },
    {
      n: 4,
      title: 'Firmware that tolerates faults',
      text: 'The firmware is built to keep working when parts of the system do not: bounded I/O, sensor health monitoring and a wire format proven by tests.',
      stat: null,
    },
    {
      n: 5,
      title: 'App and backend',
      text: 'I built the companion iOS app and the backend as well. The firmware, app and backend are held to 9,206 passing tests.',
      stat: { value: '9,206', unit: 'passing tests' },
    },
    {
      n: 6,
      title: 'Alpha batch',
      text: 'A 5-unit alpha batch is in build for a supervised pilot cohort. No one is wearing the hardware yet.',
      stat: { value: '5', unit: 'units in build' },
    },
  ],
  names: 'Ascendra One is the hardware, Aetheris is the app and Atlas is the agent.',
  leftOut:
    'This page leaves out sensor placement, construction and firmware internals on purpose.',
  back: { label: 'Back to the climb', href: '/' },
}
