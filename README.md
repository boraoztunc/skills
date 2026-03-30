# Skills

Claude Code skills for copywriting, advertising, SEO, design, and more.

Each skill is a self-contained markdown file that gives Claude deep domain knowledge. Drop one into your project and invoke it with a slash command.

## Available Skills

| Skill | Command | What it does |
|-------|---------|-------------|
| [Ogilvy Copywriting](ogilvy/) | `/ogilvy` | David Ogilvy's advertising principles — positioning, headlines, promises, brand voice, long-form copy. For copy that sells. |

## Install

Copy a skill to your global Claude Code skills directory:

```bash
# Install a single skill (e.g., ogilvy)
mkdir -p ~/.claude/skills/ogilvy
curl -o ~/.claude/skills/ogilvy/SKILL.md \
  https://raw.githubusercontent.com/boraoztunc/skills/main/ogilvy/SKILL.md
```

Or clone the whole repo and symlink what you need:

```bash
git clone https://github.com/boraoztunc/skills.git
ln -s $(pwd)/skills/ogilvy ~/.claude/skills/ogilvy
```

## How Skills Work

A skill is a `SKILL.md` file with YAML frontmatter (`name`, `description`) and markdown body. Claude Code loads it automatically when you invoke the slash command. The description tells Claude when to activate the skill — write it like a trigger condition, not a summary.

## License

MIT
