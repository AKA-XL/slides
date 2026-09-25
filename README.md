# slides

Horizontal HTML slide decks for computational biology research talks, together with the technical documentation behind them.

**Live decks:** https://aka-xl.github.io/slides/

## Publishing

GitHub Pages serves this repository as static files from the `main` branch root (Settings → Pages → Deploy from a branch → `main` / `/ (root)`). Every push to `main` updates the site within a minute or two. Each deck is live at `https://aka-xl.github.io/slides/slides/<deck-name>/`.

The published site is public and includes everything in the repository, `docs/` included, even though the repository itself is private.

## Layout

| Path | Contents |
|------|----------|
| `slides/<deck-name>/index.html` | One deck per folder, with its images and data in `assets/` alongside it. Decks run on reveal.js 5.2.1; each slide is a top-level `<section>`. Open the file in a browser; press `S` for speaker notes. |
| `slides/_theme/theme.css` | The shared theme every deck loads. |
| `index.html` | GitHub Pages home page listing every deck. `.nojekyll` keeps Pages from dropping `_theme/`. |
| `docs/` | Technical documentation: methods, datasets, parameters, results and their caveats, and decisions. This is the durable record of the context behind the slides. |
| `docs/memos/repos/<owner>/<repo>.md` | Research memos on GitHub repositories, one per repository. |
| `docs/memos/papers/<key>.md` | Research memos on papers, one per paper, keyed like `lopez2018-deep`. |
| `worktree/` | Downloaded source material: repository clones in `repos/<owner>/<repo>/` and paper PDFs in `papers/<key>/`. Git-ignored, and reproducible from the commit or identifiers recorded in each memo. |
| `.claude/` | Claude Code setup for this repository (see below). |

## Claude Code

- **`slides` skill** ([.claude/skills/slides](.claude/skills/slides/SKILL.md)): explains a topic for a chosen audience, as prose or as slides written into `slides/`. Try "make a slide explaining UMAP for wet-lab biologists" or "ELI5 CRISPR screens".
- **`github-doc-researcher` agent** ([.claude/agents](.claude/agents/github-doc-researcher.md)): clones a GitHub repository into `worktree/`, studies its code and history, and writes a memo to `docs/memos/repos/`. Try "research github.com/scverse/scanpy".
- **`paper-researcher` agent** ([.claude/agents](.claude/agents/paper-researcher.md)): finds a paper on the web from a title, DOI, ID, or description, reads the full text when it is openly available, and writes a memo to `docs/memos/papers/`. Try "research the scVI paper (Lopez et al. 2018)".
- **Superpowers plugin** (enabled in [.claude/settings.json](.claude/settings.json)): skills for brainstorming, planning, debugging, and code review.
