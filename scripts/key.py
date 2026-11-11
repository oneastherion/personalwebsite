# Chroma-key a magenta-backed image or video into transparent WebP frames.
# usage: python3 scripts/key.py <input> <outdir> [--frames N] [--width W]
import sys, os, subprocess, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
args = sys.argv[3:]
N = int(args[args.index('--frames') + 1]) if '--frames' in args else 0
W = int(args[args.index('--width') + 1]) if '--width' in args else 900
os.makedirs(out, exist_ok=True)

def key(img):
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # magenta-ness: red and blue high, green low
    m = np.minimum(r, b) - g
    alpha = np.clip(1 - (m - 60) / 80, 0, 1)  # m>140 -> 0, m<60 -> 1
    # despill: pull magenta fringe toward neutral
    spill = np.clip(np.minimum(r, b) - g, 0, None) * (1 - alpha) * 0 + np.clip(np.minimum(r, b) - g - 20, 0, None)
    a[..., 0] -= spill * 0.5
    a[..., 2] -= spill * 0.5
    rgba = np.dstack([np.clip(a, 0, 255), alpha * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    h = round(im.height * W / im.width)
    return im.resize((W, h), Image.LANCZOS)

if src.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
    key(Image.open(src)).save(os.path.join(out, 'still.webp'), quality=88, method=6)
else:
    tmp = os.path.join(out, '_raw'); os.makedirs(tmp, exist_ok=True)
    vf = f'fps={N}/5' if N else 'fps=24'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', vf, os.path.join(tmp, 'f%03d.png')], check=True)
    files = sorted(os.listdir(tmp))
    for i, f in enumerate(files):
        key(Image.open(os.path.join(tmp, f))).save(os.path.join(out, f'{i:03d}.webp'), quality=82, method=4)
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    print(len(files), 'frames')
