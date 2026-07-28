# Skills

Claude Code skills for copywriting, advertising, SEO, design, and more.

Each skill is a self-contained markdown file that gives Claude deep domain knowledge. Drop one into your project and invoke it with a slash command.

## Available Skills

### Writing & Copy

| Skill | Command | What it does |
|-------|---------|-------------|
| [Ogilvy Copywriting](ogilvy/) | `/ogilvy` | David Ogilvy's advertising principles — positioning, headlines, promises, brand voice. |
| [Copywriting](copywriting/) | `/copywriting` | Write marketing copy that is clear, compelling, and drives action. |
| [Copy Editing](copy-editing/) | `/copy-editing` | Systematically improve existing copy through focused editing passes. |
| [Stop Slop](stop-slop/) | `/stop-slop` | Remove AI writing patterns from prose. |

### Design & Frontend

| Skill | Command | What it does |
|-------|---------|-------------|
| [Frontend Design](frontend-design/) | `/frontend-design` | Create distinctive, production-grade frontend interfaces. |
| [Make Interfaces Feel Better](make-interfaces-feel-better/) | `/make-interfaces-feel-better` | Design engineering principles for polished interfaces. |
| [Emil Design Eng](emil-design-eng/) | `/emil-design-eng` | Emil Kowalski's philosophy on UI polish and component design. |
| [Apple Design](apple-design/) | `/apple-design` | Apple's fluid, physical motion & interface design, translated for the web. Vendored from [emilkowalski/skills](https://github.com/emilkowalski/skills). |
| [Web Design Guidelines](web-design-guidelines/) | `/web-design-guidelines` | Review UI code for Web Interface Guidelines compliance. |
| [Vercel React Best Practices](vercel-react-best-practices/) | `/vercel-react-best-practices` | React and Next.js performance optimization from Vercel. |
| [App Store Screenshots](app-store-screenshots/) | `/app-store-screenshots` | Generate App Store screenshots as advertisements with Next.js. |
| [Impeccable](impeccable/) | `/impeccable` | 23-command design suite — craft, shape, critique, audit, polish, animate, colorize, and more. Vendored from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) under Apache-2.0 (see [`impeccable/NOTICE.md`](impeccable/NOTICE.md)). |

### Visual Style & Web Design Craft

Audited subset of [MengTo/Skills](https://github.com/MengTo/Skills) `agent-skills/web-design/` (MIT), plus two skills written for this repo. Upstream ships 77 draft skills; 23 survived audit. Corrections and rejection rationale in [`NOTICE-mengto.md`](NOTICE-mengto.md).

| Skill | Command | What it does |
|-------|---------|-------------|
| [Visual Style Presets](visual-style-presets/) | `/visual-style-presets` | Nine complete style directions (dark glass, dark technical, warm paper, editorial grid, archival book, wireframe…) — surface ladder, accent rule, signature motif. Replaces 19 upstream palette dumps. |
| [Tailwind v4](tailwind-v4/) | `/tailwind-v4` | Tailwind v4 CSS-first config, `@theme` tokens, v3→v4 migration diffs, dynamic class safety. |
| [Beautiful Shadows](beautiful-shadows/) | `/beautiful-shadows` | Three exact layered elevation shadows. Copy-paste, no guessing. |
| [Skeuomorphic UI](skeuomorphic-ui/) | `/skeuomorphic-ui` | Tactile raised/pressed surfaces — gradient borders, stacked inset shadows, embossed text. |
| [Glass Dark UI](glass-dark-ui/) | `/glass-dark-ui` | Dark glassmorphism with readable contrast and masked gradient borders. |
| [Container Lines](container-lines/) | `/container-lines` | Vertical container guides + corner squares aligned to the real content container. |
| [Framed Grid Layout](framed-grid-layout/) | `/framed-grid-layout` | L-bracket corner frames via layered gradients — no extra markup. |
| [Corner Diagonals](corner-diagonals/) | `/corner-diagonals` | Chamfered corners with correct `clip-path` math and inherited inner clipping. |
| [CSS Border Gradient](css-border-gradient/) | `/css-border-gradient` | Gradient borders via double-background and masked pseudo-element. |
| [Progressive Blur](progressive-blur/) | `/progressive-blur` | Layered backdrop-blur gradient ladder with WebKit fallbacks. |
| [Mesh Gradient Dark Blue](mesh-gradient-dark-blue-clean/) | `/mesh-gradient-dark-blue-clean` | Procedural dark-navy mesh atmosphere with a full system recipe. |
| [Liquid Metal Border](liquid-metal-border/) | `/liquid-metal-border` | Animated metallic borders via `metal-fx`. |
| [Beam Glow States](beam-glow-states/) | `/beam-glow-states` | Border-beam loading/active/error states with a11y-safe framing. |
| [Reveal Hover Effect](reveal-hover-effect/) | `/reveal-hover-effect` | Cursor-masked reveal — correct dual masks, settle-then-stop rAF, cold-load handling. |
| [Staggered Word Reveal](staggered-word-reveal/) | `/staggered-word-reveal` | Dependency-free word-split reveal with `aria-label` and reduced-motion. |
| [WebGL Laser](webgl-laser/) | `/webgl-laser` | Raw-WebGL volumetric laser beam — thin core, wide halo, FBM fog. |
| [Thinking Orbs](thinking-orbs/) | `/thinking-orbs` | Animated AI thinking-state orbs with correct state/preset mapping. |
| [Shaders Cursor Ripples](shaders-cursor-ripples/) | `/shaders-cursor-ripples` | Cursor ripple shader over imagery. ⚠️ Paid, non-OSS dependency. |

### Image Generation

| Skill | Command | What it does |
|-------|---------|-------------|
| [Minimal Zine Poster](minimal-zine-poster/) | `/minimal-zine-poster` | Compile a theme into a quiet Japanese/Korean zine poster — aged paper, huge negative space, one high-chroma anchor — and generate the image. Needs `GEMINI_API_KEY`. Adapted from [LiamGvchi/gc-minimal-zine-poster](https://github.com/LiamGvchi/gc-minimal-zine-poster) under MIT (see [`NOTICE-liamgvchi.md`](NOTICE-liamgvchi.md)). |

### Page Types & Product IA

| Skill | Command | What it does |
|-------|---------|-------------|
| [Landing Page](landing-page/) | `/landing-page` | Single-intent landing page IA, layout archetypes, headline formulas, indexing rules. |
| [Pricing Page](pricing-page/) | `/pricing-page` | Value-metric-first pricing IA, plan ceilings, feature grouping, mobile rules. |
| [Product Proof SaaS](product-proof-saas/) | `/product-proof-saas` | Honest AI-product demos — real state models, no faked generation speed. |
| [Operational Enterprise AI](operational-enterprise-ai/) | `/operational-enterprise-ai` | Enterprise-buyer IA — permissions, approval, audit, rollback as a data model. |
| [Documentary Brutalist Agency](documentary-brutalist-agency/) | `/documentary-brutalist-agency` | Editorial agency site — capped parallax, DOM-order rules, real a11y constraints. |
| [Editorial Portfolio Chapters](editorial-portfolio-chapters/) | `/editorial-portfolio-chapters` | Chaptered portfolio with exact grid, easing, and stagger values. |
| [Service Booking Flow](service-booking-flow/) | `/service-booking-flow` | Appointment booking resilience — slot confirmation, stale slots, payment failure, focus return. |

### SEO & Marketing

| Skill | Command | What it does |
|-------|---------|-------------|
| [SEO Audit](seo-audit/) | `/seo-audit` | Identify SEO issues and provide actionable recommendations. |
| [Schema Markup](schema-markup/) | `/schema-markup` | Implement schema.org markup for rich search results. |
| [Programmatic SEO](programmatic-seo/) | `/programmatic-seo` | Build SEO-optimized pages at scale using templates and data. |
| [Content Strategy](content-strategy/) | `/content-strategy` | Plan content that drives traffic, builds authority, and generates leads. |
| [Competitor Alternatives](competitor-alternatives/) | `/competitor-alternatives` | Create competitor comparison pages for SEO and sales enablement. |
| [Page CRO](page-cro/) | `/page-cro` | Analyze marketing pages and improve conversion rates. |
| [Analytics Tracking](analytics-tracking/) | `/analytics-tracking` | Set up tracking that provides actionable insights. |

### Video — HyperFrames

Skills for [HyperFrames](https://github.com/heygen-com/hyperframes) by HeyGen — write HTML, render video. Vendored from `heygen-com/hyperframes` under Apache-2.0 (see [`LICENSE-hyperframes`](LICENSE-hyperframes/)).

| Skill | Command | What it does |
|-------|---------|-------------|
| [HyperFrames](hyperframes/) | `/hyperframes` | Author HTML video compositions, timelines, captions, voiceovers, transitions. |
| [HyperFrames CLI](hyperframes-cli/) | `/hyperframes-cli` | Dev loop: init, lint, inspect, preview, render, doctor. |
| [HyperFrames Media](hyperframes-media/) | `/hyperframes-media` | Asset preprocessing — TTS, transcription, background removal. |
| [HyperFrames Registry](hyperframes-registry/) | `/hyperframes-registry` | Install registry blocks and components into compositions. |
| [Website to HyperFrames](website-to-hyperframes/) | `/website-to-hyperframes` | Capture a website and turn it into a video composition. |
| [Remotion to HyperFrames](remotion-to-hyperframes/) | `/remotion-to-hyperframes` | Port an existing Remotion project to HyperFrames. |
| [Contribute Catalog](contribute-catalog/) | `/contribute-catalog` | Author and submit a new HyperFrames registry block or component. |
| [GSAP](gsap/) | `/gsap` | GSAP timelines, easing, stagger inside HyperFrames. |
| [Anime.js](animejs/) | `/animejs` | Anime.js adapter patterns for HyperFrames. |
| [WAAPI](waapi/) | `/waapi` | Web Animations API adapter patterns for HyperFrames. |
| [CSS Animations](css-animations/) | `/css-animations` | Seek-deterministic CSS keyframes for HyperFrames. |
| [Lottie](lottie/) | `/lottie` | Lottie and dotLottie inside HyperFrames. |
| [Three.js](three/) | `/three` | Three.js / WebGL canvas layers driven by `hf-seek`. |
| [TypeGPU](typegpu/) | `/typegpu` | TypeGPU and raw WebGPU shader effects for HyperFrames. |
| [Tailwind](tailwind/) | `/tailwind` | Tailwind v4 browser-runtime patterns for HyperFrames. |

### Performance & Architecture

Vendored from [brotzky/performance-skills](https://github.com/brotzky/performance-skills) via [performance.dev/skills](https://performance.dev/skills).

| Skill | Command | What it does |
|-------|---------|-------------|
| [Conductor Rewrite Performance](conductor-rewrite-performance/) | `/conductor-rewrite-performance` | Optimize local-first React desktop apps — taming re-render cascades, slow streaming lists, and profiling Tauri without DevTools. |
| [Linear Local-First Architecture](linear-local-first-architecture/) | `/linear-local-first-architecture` | Make web apps feel instant — local-first sync, optimistic updates, eliminating spinners and perceived latency. |

### Code Review & Engineering

| Skill | Command | What it does |
|-------|---------|-------------|
| [Adversarial Review](adversarial-review/) | `/adversarial-review` | Review a diff like a skeptic — assume it's broken, try to break it, and only report findings that survive an independent refutation pass. Scales from one inline pass to a multi-agent fan-out (one skeptic per domain → adversarial verify → synthesis). |

## Install

Copy a skill to your global Claude Code skills directory:

```bash
# Install a single skill (e.g., ogilvy)
mkdir -p ~/.claude/skills/ogilvy
curl -o ~/.claude/skills/ogilvy/SKILL.md \
  https://raw.githubusercontent.com/boraoztunc/skills/main/ogilvy/SKILL.md
```

Some skills have extra reference files. To get everything:

```bash
# Clone the repo and symlink what you need
git clone https://github.com/boraoztunc/skills.git
ln -s $(pwd)/skills/ogilvy ~/.claude/skills/ogilvy
```

## How Skills Work

A skill is a `SKILL.md` file with YAML frontmatter (`name`, `description`) and markdown body. Claude Code loads it automatically when you invoke the slash command. The description tells Claude when to activate the skill — write it like a trigger condition, not a summary.

## License

MIT
