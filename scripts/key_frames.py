# Chroma-key every PNG in a folder (magenta backdrop) into transparent WebP frames.
import sys, os, numpy as np
from PIL import Image
src, out, W = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(out, exist_ok=True)
files = sorted(f for f in os.listdir(src) if f.endswith('.png'))
for i, f in enumerate(files):
    a = np.asarray(Image.open(os.path.join(src, f)).convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    alpha = np.clip(1 - (m - 60) / 80, 0, 1)
    spill = np.clip(m - 20, 0, None)
    a[..., 0] -= spill * 0.5
    a[..., 2] -= spill * 0.5
    im = Image.fromarray(np.dstack([np.clip(a, 0, 255), alpha * 255]).astype(np.uint8), 'RGBA')
    im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
    im.save(os.path.join(out, f'{i:03d}.webp'), quality=80, method=5)
print(len(files), 'frames ->', out)
