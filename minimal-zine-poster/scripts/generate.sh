#!/usr/bin/env bash
# Generate a tall zine poster from a compiled prompt via Gemini 3 Pro Image.
# Usage: generate.sh "<prompt>" [output-name]
# Requires: GEMINI_API_KEY, curl, jq, base64
set -euo pipefail

MODEL="${ZINE_MODEL:-gemini-3-pro-image-preview}"
OUTDIR="${ZINE_OUTDIR:-./zine-posters}"
# The API has no 3:5 option. 9:16 (0.5625) is the closest supported tall ratio
# to the 3:5 (0.6) the style calls for; 4:5 reads too square for this poster.
ASPECT="${ZINE_ASPECT:-9:16}"

if [ $# -lt 1 ] || [ -z "${1:-}" ]; then
  echo "usage: generate.sh \"<prompt>\" [output-name]" >&2
  exit 2
fi

if [ -z "${GEMINI_API_KEY:-}" ]; then
  cat >&2 <<'EOF'
GEMINI_API_KEY is not set — image generation skipped.

Set it with:
  export GEMINI_API_KEY=...        # https://aistudio.google.com/apikey

Return the compiled prompt and recipe to the user, and say generation was skipped.
EOF
  exit 3
fi

for bin in curl jq base64; do
  command -v "$bin" >/dev/null 2>&1 || { echo "missing required binary: $bin" >&2; exit 4; }
done

PROMPT="$1"
NAME="${2:-poster}"
# Slugify: lowercase, non-alphanumerics to hyphens, collapse runs, trim.
# Bracket expressions + [[:alnum:]] keep this portable to BSD sed (macOS),
# which does not support \+ or \w.
SLUG=$(printf '%s' "$NAME" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -e 's/[^[:alnum:]]/-/g' -e 's/--*/-/g' -e 's/^-//' -e 's/-$//')
[ -n "$SLUG" ] || SLUG="poster"

mkdir -p "$OUTDIR"

REQ=$(jq -n --arg p "$PROMPT" --arg a "$ASPECT" '{
  contents: [{ parts: [{ text: $p }] }],
  generationConfig: {
    responseModalities: ["IMAGE"],
    imageConfig: { aspectRatio: $a }
  }
}')

RESP=$(curl -sS -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$REQ")

ERR=$(printf '%s' "$RESP" | jq -r '.error.message // empty')
if [ -n "$ERR" ]; then
  echo "Gemini API error: $ERR" >&2
  exit 5
fi

PART=$(printf '%s' "$RESP" | jq -c '
  [.candidates[]?.content.parts[]? | select(.inlineData?.data)] | first // empty')
B64=$(printf '%s' "$PART" | jq -r '.inlineData.data // empty')

if [ -z "$B64" ]; then
  BLOCK=$(printf '%s' "$RESP" | jq -r '
    .candidates[0].finishReason // .promptFeedback.blockReason // "unknown"')
  echo "No image returned (reason: $BLOCK). Prompt may have been filtered." >&2
  exit 6
fi

# The model may return JPEG or PNG regardless of what was asked — take the
# extension from the reported mimeType so the file is not mislabeled.
MIME=$(printf '%s' "$PART" | jq -r '.inlineData.mimeType // "image/png"')
case "$MIME" in
  image/jpeg|image/jpg) EXT=jpg ;;
  image/webp)           EXT=webp ;;
  *)                    EXT=png ;;
esac

# Avoid clobbering an earlier poster of the same name.
OUT="$OUTDIR/$SLUG.$EXT"
n=2
while [ -e "$OUT" ]; do
  OUT="$OUTDIR/$SLUG-$n.$EXT"
  n=$((n + 1))
done

printf '%s' "$B64" | base64 --decode > "$OUT"

# base64 decode can succeed on truncated input; verify the file is non-empty.
if [ ! -s "$OUT" ]; then
  echo "Decoded image is empty: $OUT" >&2
  rm -f "$OUT"
  exit 7
fi

# Resolve to an absolute path for the markdown embed.
printf '%s\n' "$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
