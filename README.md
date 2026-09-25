# slides

Horizontal HTML slide decks for computational biology research talks, together with the technical documentation behind them.

## Layout

| Path | Contents |
|------|----------|
| `slides/<deck-name>/index.html` | One deck per folder, with its images and data in `assets/` alongside it. Each slide is a top-level `<section>`. |
| `docs/` | Technical documentation: methods, datasets, parameters, results and their caveats, and decisions. This is the durable record of the context behind the slides. |
| `docs/memos/repos/<owner>/<repo>.md` | Research memos on GitHub repositories, one per repository. |
| `worktree/repos/<owner>/<repo>/` | Local clones of researched repositories. Git-ignored, and reproducible from the commit recorded in each memo. |
| `.claude/` | Claude Code setup for this repository (see below). |

## Claude Code

- **`slides` skill** ([.claude/skills/slides](.claude/skills/slides/SKILL.md)): explains a topic for a chosen audience, as prose or as slides written into `slides/`. Try "make a slide explaining UMAP for wet-lab biologists" or "ELI5 CRISPR screens".
- **`github-doc-researcher` agent** ([.claude/agents](.claude/agents/github-doc-researcher.md)): clones a GitHub repository into `worktree/`, studies its code and history, and writes a memo to `docs/memos/repos/`. Try "research github.com/scverse/scanpy".
- **Superpowers plugin** (enabled in [.claude/settings.json](.claude/settings.json)): skills for brainstorming, planning, debugging, and code review.
