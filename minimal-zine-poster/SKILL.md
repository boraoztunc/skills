---
name: minimal-zine-poster
description: Compile a theme, sentence, object, mood, article idea, or photo into a quiet Japanese/Korean zine-style editorial poster — tall aged paper, large negative space, one small image anchor, experimental typography, one high-chroma accent, print/scan defects — then generate the image. Use when asked for a zine poster, a minimal editorial poster, a paper-texture poster, a riso/xerox/letterpress poster, cover art for an essay or newsletter, or a poster "in that quiet Japanese zine style."
---

# Minimal Zine Poster

Turn the user's content into a compiled image prompt, then generate the image from it.

Two failure modes dominate this style, and every rule below exists to prevent one of them:

- **Density creep** — the poster fills up and stops being a poster. Guarded by the negative-space and cluster-size ratios.
- **Accent washout** — the model reads "minimal, aged, muted" and desaturates the one color that carries the image. Guarded by the Color Engine and the banned-wording list.

## Prompt Compiler

Compile only what becomes pixels. Every prompt must answer these nine questions, in this order.

1. **Canvas** — What is the output frame and base surface?
   - Tall vertical paper poster; full-frame aged paper; no border, no mockup.
   - Describe the surface, not the dimensions. The aspect ratio is set through the API, not the prompt text.

2. **Attention geometry** — Where does the eye go, and how much is empty?
   - 70–90% plain paper. One visual cluster occupying 8–25%. Placed center, upper-middle, lower-middle, lower-left, or upper-right. Never edge-hugging.

3. **Image anchor** — What is the one imageable subject?
   - Convert the theme into a single object, fragment, photo crop, specimen, cutout, silhouette, old printed illustration, texture window, or small conceptual relation. One idea, not a scene.

4. **Anchor treatment** — What material process makes the anchor belong to the paper?
   - Grayscale photos and paper fragments may take low contrast, photocopy softness, torn edge, halftone, scanline, risograph grain, xerox wear, ink bleed, or slight misregistration.
   - Never apply low saturation or low contrast to the color anchor.

5. **Typography** — How does text behave visually?
   - Small serif, typewriter, or monospaced type. One short readable phrase. Optional tiny date/location/weather and a signature. Semi-legible microtext or fragmented letters. Text may drift, press against the image edge, blur, or misregister.

6. **Color logic** — What is the accent strategy?
   - See Color Engine below.

7. **Reproduction texture** — What print/scan process defines the whole image?
   - Flat orthographic scanned-paper appearance; matte absorbent paper; diffuse light; low-to-medium contrast; no hard shadow; no 3D depth.

8. **Emotional temperature** — What should the viewer feel before identifying the object?
   - Quiet, poetic, nostalgic, sparse, diary-like, archival, distant, memory-like. Japanese/Korean indie zine or minimal editorial.

9. **Hard avoids** — See Negative Constraints.

## Color Engine

One visibly saturated, opaque chromatic ink anchor. Everything else is paper, gray, and black.

- Word it concretely: `fully saturated cobalt-blue risograph ink`, `opaque ultramarine cutout`, `vivid pear-green flat silhouette`, `clean tomato-red printed block`.
- Prefer cobalt or ultramarine. Rotate through cyan, violet, magenta-pink, lemon yellow, pear green, orange, tomato red.
- The high-chroma area occupies roughly 0.8–2.5% of the canvas, or 15–35% of the visual cluster. It must survive being viewed as a thumbnail.
- Color can carry the subject itself. Prefer a colored tree, fruit, shell, flower, geometric cutout, window, or poster fragment over a gray object with one colored registration tick. Do not automatically reduce the accent to a dot or a hairline.
- Keep paper, grayscale photo, microtext, and secondary marks subdued. Preserve saturation in the anchor even while adding grain, halftone, ink bleed, or misregistration.
- Apply `low contrast` and `muted grayscale` only to paper, photos, and secondary ink — never to the whole image.
- One main hue per image. A tiny second hue is allowed only if it supports the subject and doesn't make the poster read as commercial.

**Banned wording** unless the user explicitly asks for monochrome, muted, or pastel output: `near-monochrome`, `no strong accent`, `pale accent`, `muted accent`, `faded accent`, `pastel accent`.

For batches: at least 60% of images must use a colored subject, cutout, or block. The rest may use dots, hairlines, or colored type for rhythm.

## Variation Engine

Before writing the prompt, pick one from each axis. Randomness must change visual grammar, not just position. If recent outputs used the same layout or anchor, choose differently.

**Layout family** — center-fragment · lower-left-float · upper-right-block · dual-panel · irregular-cutout · type-led · dot-orbit · single-specimen

**Image anchor** — tiny faded photo · torn-paper clipping · flat silhouette · solid color block · old printed illustration · object specimen · translucent geometric overlay · abstract texture window

**Typography mode** — fragmented floating letters · short phrase pressed against image edge · archive microtext with date/weather · diagonal scattered words · low-contrast gray ghost text · headline-as-object with rough letterpress · text inside a color block · almost textless, one tiny caption

**Texture mode** — xerox softness · risograph grain · letterpress ink bleed · halftone degradation · film grain · scan noise and paper fibers · aged paper mottling · soft motion blur on selected text

**Mood** — quiet · summer · solitude · childhood · seaside · afternoon · night · memory · slight surrealism

## Prompt Shape

Four compact paragraphs:

1. Canvas + paper + negative space + cluster size and location
2. Subject metaphor + anchor type + anchor treatment
3. Typography + accent strategy + print defects
4. Flat-scan mood + avoid-list

In paragraph 3, state the exact hue, its material form, and its approximate visual share.

Decisive beats exhaustive. Say where the anchor sits, how big it is, how the text behaves, what the accent is, how the scan looks. A concrete imageable prompt outperforms a long style essay. Specify exact in-image text only when it earns its place — image models distort long strings.

## Workflow

1. **Parse the content.** Find the core subject, the mood, any exact text supplied, a possible visual metaphor, and the role of any reference image. For an article or complex argument, extract one central imageable idea — do not summarize the thesis. If no text is supplied, invent one short poetic phrase.

2. **Select a recipe.** One pick per Variation Engine axis, then the hue via the Color Engine. Don't default to "tiny photo + blue dots + microtext" unless it genuinely fits. If the recipe gets dense, simplify typography or color treatment first.

3. **Compile the prompt** into the four-paragraph shape.

4. **Generate the image** — see below.

5. **Inspect at thumbnail scale.** If the high-chroma anchor is absent, washed out, or reduced to an imperceptible mark, or if the poster obviously violates the recipe, tighten the prompt and regenerate **once**. Do not loop further; report what's still off instead.

6. **Return** the image and the prompt.

## Generating the Image

Run the bundled script. It writes a PNG and prints the absolute path.

```bash
scripts/generate.sh "<compiled prompt>" [output-name]
```

The script uses Gemini 3 Pro Image and needs `GEMINI_API_KEY` in the environment. It renders 3:5 natively via `aspectRatio`, so do not restate pixel dimensions in the prompt — the canvas paragraph should describe the surface, not the resolution.

Images land in `./zine-posters/` under the current working directory unless the user names a path.

**If the key is missing**, the script exits with a message. Do not treat this as a task failure: return the compiled prompt and the recipe, state plainly that generation was skipped for lack of `GEMINI_API_KEY`, and note it can be set with `export GEMINI_API_KEY=...`. A prompt without an image is a partial result, and should be described as one.

## Negative Constraints

Always avoid:

- Full-bleed subject or scene
- Commercial headline hierarchy, product ad layout, logo lockup, CTA, brand-campaign feeling
- Clean digital UI background
- Glossy paper mockup, heavy paper shadow
- 3D rendering, cinematic lighting, hard shadows, depth of field, neon, cyberpunk
- Cute cartoon, kawaii illustration, anime poster, fashion editorial drama
- Too many objects, stickers, colors, captions, or decorative textures
- High-resolution stock-photo realism
- Long, clean, perfectly readable text blocks

## Output Format

````markdown
![Minimal zine poster](absolute-image-path)

**Prompt**

```text
[final prompt used for generation]
```

**Recipe** — layout / anchor / typography / accent / texture / mood

[one line on how the content was interpreted]
````

## Quality Gate

Before finalizing:

- Was a full recipe chosen — layout, anchor, typography, accent, texture, mood?
- Is the structure materially different from recent outputs?
- Does 70–90% read as bare paper?
- Is the cluster roughly 8–25% of the canvas?
- One visual metaphor, not an illustrated scene?
- Does the anchor carry old-photo, clipping, print, scan, or specimen treatment?
- Is typography part of the composition rather than a label on it?
- One accent strategy only?
- Is the high-chroma anchor visible at thumbnail size, at roughly 0.8–2.5% of canvas?
- Did the prompt avoid the banned weakening words?
- Did it avoid full-bleed, commercial, 3D, neon, cinematic, cartoon, and brand aesthetics?
- Was the image actually generated — or was the skip explained?

## Attribution

Adapted from [LiamGvchi/gc-minimal-zine-poster](https://github.com/LiamGvchi/gc-minimal-zine-poster) (MIT). See `NOTICE-liamgvchi.md` in the repo root for changes made on adoption.
