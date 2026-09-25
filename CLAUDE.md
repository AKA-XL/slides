@README.md

## Working rules

- **Keep context in `docs/`.** When a session establishes technical context that the slides depend on (method details, parameters, dataset provenance, results and their caveats, design decisions), record it in `docs/` before finishing. Update the existing document on that topic instead of creating a near-duplicate.
- **Slides draw on `docs/`.** Check the relevant docs and memos before writing or revising a deck.
- **`worktree/` is reference-only.** Never edit, commit, or run code from it.
- **Research goes through the agents.** To understand a GitHub repository, use the `github-doc-researcher` agent; to understand a paper, use the `paper-researcher` agent. Both write their memos to `docs/memos/`.
