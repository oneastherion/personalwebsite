# Character Evolution — AI Image Generation Guide

## Overview
You need **25 transparent PNG images** — one base figure + 24 equipment layers.
All images must share the **same pose, perspective, and dimensions** so they
stack perfectly on top of each other.

## Critical Requirements
- **Dimensions**: 512 x 1280 px (tall portrait, 2:5 ratio)
- **Background**: Fully transparent (PNG with alpha)
- **Pose**: Standing front-facing, arms slightly away from body, feet shoulder-width
- **Perspective**: Straight on, slight low-angle for heroic feel
- **Style**: Dark, cinematic, photorealistic. Think movie poster / concept art
- **Lighting**: Dramatic side-lighting from upper left. Dark shadows.
- **Subject**: Male figure, athletic build, ~25-30 years old

---

## BASE IMAGE (always visible)

### `/public/character/base.png`
**Prompt:**
> Full body portrait of a young athletic male figure standing in a neutral pose,
> arms slightly away from sides, wearing simple dark fitted underclothes (dark
> gray/black base layer), front-facing, dramatic cinematic side lighting from
> upper left, dark moody atmosphere, photorealistic, transparent background,
> concept art style, 512x1280

---

## KNIGHT ERA — `/public/character/knight/`

Each layer shows ONLY the specific piece of equipment (transparent everywhere else).
The piece must be positioned exactly where it would appear on the base figure.

### 1. `tunic.png` (scroll 2%)
> Medieval leather tunic/gambeson layer only, worn over torso and upper thighs,
> dark brown leather with subtle stitching, positioned on male torso, cinematic
> lighting, transparent background, isolated clothing item, 512x1280

### 2. `chainmail.png` (scroll 5%)
> Medieval chainmail shirt layer only, silver/steel interlocking rings covering
> torso and upper arms, worn over tunic, metallic sheen, positioned on male
> torso, transparent background, isolated armor piece, 512x1280

### 3. `chestplate.png` (scroll 8%)
> Medieval steel chest plate with gold cross emblem in center, front armor
> only covering chest and abdomen, dark steel with gold trim, positioned on
> male torso front, transparent background, isolated armor piece, 512x1280

### 4. `pauldrons.png` (scroll 10%)
> Pair of medieval steel shoulder pauldrons/spaulders, dark steel with gold
> edge trim, positioned on both shoulders, transparent background, isolated
> armor pieces, 512x1280

### 5. `gauntlets.png` (scroll 13%)
> Pair of medieval steel gauntlets/arm guards, dark steel with gold trim at
> wrist, covering forearms and hands, positioned on both arms, transparent
> background, isolated armor pieces, 512x1280

### 6. `greaves.png` (scroll 16%)
> Medieval steel leg armor — greaves and cuisses covering shins and thighs,
> dark steel with gold knee caps, positioned on both legs, transparent
> background, isolated armor pieces, 512x1280

### 7. `helmet.png` (scroll 19%)
> Medieval great helm / crusader helmet, dark steel with gold crest ridge on
> top and gold nose guard, narrow eye slit, positioned on head, transparent
> background, isolated armor piece, 512x1280

### 8. `shield.png` (scroll 22%)
> Medieval kite shield held in left hand, dark steel with gold rim and gold
> diamond emblem in center, positioned at left side of body, transparent
> background, isolated item, 512x1280

### 9. `sword.png` (scroll 24%)
> Medieval longsword held in right hand, polished steel blade, gold crossguard,
> leather-wrapped grip, gold pommel, positioned at right side of body pointing
> slightly upward, transparent background, isolated weapon, 512x1280

### 10. `cape.png` (scroll 26%)
> Dark crimson/burgundy medieval cape flowing from shoulders, gold clasp at
> collar, draped behind the body, dramatic fabric flow, positioned behind
> figure, transparent background, isolated item, 512x1280

---

## SCHOLAR ERA — `/public/character/scholar/`

Knight layers disappear at 30% scroll. Scholar layers appear.

### 11. `robes.png` (scroll 30%)
> Full Renaissance scholar robes, deep purple/dark indigo with gold sash belt
> at waist, high collar, flowing fabric reaching below knees, covering full
> body over base layer, transparent background, isolated clothing, 512x1280

### 12. `cap.png` (scroll 34%)
> Renaissance scholar beret/cap, dark purple/indigo with gold tassel, positioned
> on head, transparent background, isolated headwear, 512x1280

### 13. `book.png` (scroll 37%)
> Leather-bound ancient book held open in left hand, aged pages, gold spine
> detailing, positioned at left side of body, transparent background, isolated
> item, 512x1280

### 14. `compass.png` (scroll 40%)
> Ornate brass/gold navigational compass or astrolabe held in right hand,
> intricate mechanical details, warm golden glow, positioned at right side
> of body, transparent background, isolated item, 512x1280

---

## ENGINEER ERA — `/public/character/engineer/`

Scholar layers disappear at 46% scroll. Engineer layers appear.

### 15. `labcoat.png` (scroll 46%)
> Modern white lab coat, clean professional cut, slightly open in front,
> breast pocket, covering full body over base layer, subtle blue-white
> lighting, transparent background, isolated clothing, 512x1280

### 16. `glasses.png` (scroll 50%)
> Modern slim-frame glasses with subtle blue-tinted lenses, clinical/tech
> aesthetic, positioned on face, transparent background, isolated eyewear,
> 512x1280

### 17. `stethoscope.png` (scroll 54%)
> Medical stethoscope draped around neck, metallic chest piece hanging at
> mid-chest, clinical blue tubing, positioned around neck area, transparent
> background, isolated item, 512x1280

### 18. `tablet.png` (scroll 58%)
> Modern medical data tablet held in right hand, screen glowing soft blue
> with medical data/waveforms visible, dark frame, positioned at right
> side of body, transparent background, isolated item, 512x1280

---

## ASTRONAUT ERA — `/public/character/astronaut/`

Engineer layers disappear at 68% scroll. Astronaut layers appear.

### 19. `suit.png` (scroll 68%)
> Full advanced space suit (think near-future, sleek design), matte white/light
> gray with dark purple/violet accent lines, covering full body including legs
> and boots, neck ring visible, transparent background, isolated suit, 512x1280

### 20. `chestmodule.png` (scroll 74%)
> Futuristic chest-mounted control module/HUD panel, dark with glowing purple
> indicator lights and data readouts, positioned on upper chest, transparent
> background, isolated tech piece, 512x1280

### 21. `armmodules.png` (scroll 78%)
> Pair of futuristic arm-mounted tech modules, dark with purple accent glow,
> bulky tech bracers on both forearms, positioned on both arms, transparent
> background, isolated tech pieces, 512x1280

### 22. `helmet.png` (scroll 82%)
> Futuristic space helmet dome, white/silver outer shell, clear or tinted
> visor area, positioned on head with neck ring connection, transparent
> background, isolated helmet, 512x1280

### 23. `visor.png` (scroll 86%)
> Glowing purple/violet visor overlay for space helmet, semi-transparent
> reflective surface with subtle HUD elements, positioned over face area,
> purple light glow emanating, transparent background, isolated visor, 512x1280

### 24. `backpack.png` (scroll 90%)
> Futuristic life support backpack, white/gray with purple accent lights,
> mounted behind upper body, visible tube connections, positioned behind
> figure, transparent background, isolated equipment, 512x1280

---

## Generation Tips

### For Midjourney:
Add `--ar 2:5 --style raw --s 250` to all prompts.
Add `isolated on transparent background` or use the `/describe` + remove bg workflow.
You may need to remove backgrounds in post using remove.bg or Photoshop.

### For DALL-E / ChatGPT:
Request transparent PNG output. Specify "isolated item on transparent background."

### For Flux / Stable Diffusion:
Use an img2img workflow with the base figure as input for consistent positioning.
Use ControlNet Pose to lock the figure position across all generations.

### Consistency Tips:
1. Generate the **base figure first** — this sets your pose/angle
2. Use the base figure as **reference/input** for all equipment layers
3. Every layer must match the SAME body proportions and position
4. Test layers by opening them in Figma/Photoshop and stacking them
5. Fine-tune positioning in CSS if needed (the component supports offset adjustments)

---

## File Structure
```
public/
  character/
    base.png                    ← Base figure
    knight/
      tunic.png
      chainmail.png
      chestplate.png
      pauldrons.png
      gauntlets.png
      greaves.png
      helmet.png
      shield.png
      sword.png
      cape.png
    scholar/
      robes.png
      cap.png
      book.png
      compass.png
    engineer/
      labcoat.png
      glasses.png
      stethoscope.png
      tablet.png
    astronaut/
      suit.png
      chestmodule.png
      armmodules.png
      helmet.png
      visor.png
      backpack.png
```

## Quick Start
1. Generate the images using the prompts above
2. Save them as PNGs (512x1280, transparent background)
3. Place them in the correct directories
4. Refresh the site — layers will appear automatically
5. The placeholder labels will be replaced by your images
