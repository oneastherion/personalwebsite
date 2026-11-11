#!/usr/bin/env bash
# Extract, crop and chroma-key a magenta clip into transparent WebP frames for the canvas flipbook.
# usage: scripts/frames.sh <clip.mp4> <outdir> <fps> <width>
set -euo pipefail
clip="$1"; out="$2"; fps="$3"; width="$4"
work="$(mktemp -d)"
ffmpeg -v error -y -i "$clip" -vf "fps=${fps},crop=iw*0.56:ih:iw*0.22:0" "$work/f%03d.png"
python3 scripts/key_frames.py "$work" "$out" "$width"
