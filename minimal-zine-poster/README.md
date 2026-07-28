# Minimal Zine Poster

Turn a theme, sentence, object, mood, article idea, or photo into a quiet minimal zine-style editorial poster — and generate the image.

Compiles each request into a sparse vertical paper poster: aged-paper canvas, 70–90% negative space, one small imageable subject, serif/typewriter/monospaced type, one clearly visible high-chroma accent, and xerox/riso/halftone/letterpress defects. Japanese/Korean indie-zine mood.

## Setup

Image generation uses Gemini 3 Pro Image and reads `GEMINI_API_KEY` from the environment:

```bash
export GEMINI_API_KEY=...   # https://aistudio.google.com/apikey
```

Add it to your shell profile to persist. Without the key the skill still compiles and returns the prompt, and says generation was skipped.

Requires `curl`, `jq`, and `base64`.

## Usage

```text
/minimal-zine-poster a poster about a rainy secondhand bookshop
```

Also accepts a sentence, an object, a mood, an article draft, or a reference image.

Images are written to `./zine-posters/` in the working directory. Override with `ZINE_OUTDIR`, the model with `ZINE_MODEL`, and the aspect ratio with `ZINE_ASPECT`.

The script can be run directly:

```bash
scripts/generate.sh "<compiled prompt>" [output-name]
```

## Output

1. The generated poster
2. The final image-generation prompt
3. The variation recipe and a one-line interpretation note

## Notes

The style has two characteristic failure modes, and most of the skill's rules exist to prevent them: **density creep** (the poster fills up and stops being a poster) and **accent washout** (the model reads "minimal, aged, muted" and desaturates the one color carrying the image). Hence the numeric ratios for negative space and cluster size, and the banned-wording list around the color anchor.

The API has no `3:5` aspect ratio, which is what the style calls for. The script defaults to `9:16` (0.5625) as the nearest supported tall ratio; `4:5` reads too square.

## Attribution

Adapted from [LiamGvchi/gc-minimal-zine-poster](https://github.com/LiamGvchi/gc-minimal-zine-poster) (MIT), originally a Codex skill. See [`NOTICE-liamgvchi.md`](../NOTICE-liamgvchi.md) for changes made on adoption.
