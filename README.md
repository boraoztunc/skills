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
| [Web Design Guidelines](web-design-guidelines/) | `/web-design-guidelines` | Review UI code for Web Interface Guidelines compliance. |
| [Vercel React Best Practices](vercel-react-best-practices/) | `/vercel-react-best-practices` | React and Next.js performance optimization from Vercel. |
| [App Store Screenshots](app-store-screenshots/) | `/app-store-screenshots` | Generate App Store screenshots as advertisements with Next.js. |
| [Impeccable](impeccable/) | `/impeccable` | 23-command design suite — craft, shape, critique, audit, polish, animate, colorize, and more. Vendored from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) under Apache-2.0 (see [`impeccable/NOTICE.md`](impeccable/NOTICE.md)). |

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
