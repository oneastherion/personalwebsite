#!/usr/bin/env bash
# Stitch the persona transition clips (knight -> scholar -> scientist -> astronaut) into one
# numbered, keyed WebP sequence that the scroll scrubs through. Prints the frame count.
# usage: scripts/build-morph.sh <fps> clip1.mp4 clip2.mp4 clip3.mp4
set -euo pipefail
fps="$1"; shift
for size in 760 440; do
  suffix=""; [ "$size" = "440" ] && suffix="-s"
  out="public/hero/morph${suffix}"
  find "$out" -name '*.webp' -delete 2>/dev/null || true
  mkdir -p "$out"
  n=0; k=0
  for clip in "$@"; do
    tmp="$(mktemp -d)"
    scripts/frames.sh "$clip" "$tmp" "$fps" "$size" >/dev/null
    first=1
    for f in $(ls "$tmp"/*.webp | sort); do
      # each clip starts on the previous clip's last frame: skip the duplicate
      if [ "$k" -gt 0 ] && [ "$first" = 1 ]; then first=0; continue; fi
      first=0
      mv "$f" "$out/$(printf '%03d' "$n").webp"
      n=$((n + 1))
    done
    k=$((k + 1))
  done
  echo "$out: $n frames"
done
