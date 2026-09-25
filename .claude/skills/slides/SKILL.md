---
name: slides
description: "Explain a computational biology topic, method, result, code, or error at the level of a specific audience, as concise prose or as horizontal HTML slides in this repo's slides/ folder. Use whenever the user asks to make, draft, or revise slides or a deck, or says 'ELI5', 'explain like I am', 'explain this to', 'break this down for', 'simplify this for', 'make a slide explaining', 'turn this into slides for', or asks how to present a method, figure, or finding to a particular audience (e.g., 'explain UMAP to wet-lab biologists', 'a slide on our pipeline for the grant committee', 'how do I explain attention to a clinician'). Also trigger when the user wants a research concept pitched at a particular level or for a mixed or non-specialist audience."
---

<!-- Adapted from https://github.com/DreambigOu/ELI5 (MIT, see LICENSE) for this repo's computational biology slide decks. -->

# Slides: Explain Like I Am...

This repo hosts horizontal HTML slide decks for computational biology research talks. Decks live in `slides/`, and the technical context behind them lives in `docs/`. Your job is to explain a topic so a specific audience gets the core idea fast. Make it **concise** (few words on screen) and **comprehensive** (nothing important dropped: the detail moves into speaker notes, not onto the slide).

## Step 1: Identify the Audience

Read the audience from the request. **If none is stated, default to a mixed scientific audience**: smart researchers from both the biology and computation sides, with no one an expert in your subfield. Explain every term that belongs to only one side.

If the user says just "ELI5" with no other audience, use **General public** below.

### Research audiences
| Audience | Knows | Needs from you | Analogies / framing |
|----------|-------|----------------|---------------------|
| Mixed scientific (default) | Science broadly, not your subfield | The biological question, the method's key idea, and the result's meaning, with every term defined once | Bridge both ways: biology for the computational side, computation for the biology side |
| Wet-lab biologist | Molecular/cell biology, experimental design | What the model actually tells them, how reliable it is, and what to validate at the bench | Experiments, assays, controls, "it's like a screen that..." |
| Clinician / translational | Patients, disease, diagnostics | Clinical relevance, sensitivity/specificity, cohort size, readiness for real use | Diagnostic tests, risk scores, trial design |
| Computer scientist / ML researcher | Algorithms, models, benchmarks | The biological data's quirks (noise, batch effects, sparsity, small n) and why off-the-shelf methods fail | Standard ML concepts; name the architecture or loss directly |
| Statistician | Inference, uncertainty, design | Assumptions, the multiple-testing correction, effect sizes, confounders | Exact tests, models, and error rates; no hand-waving |
| Bioinformatician / computational biologist | Pipelines, standard tools, file formats | What's new versus the standard pipeline, parameters, and reproducibility | Compare to known tools (e.g., "like DESeq2 but...") |
| PI / grant or hiring committee | The field's big picture | Significance, novelty, feasibility, and the next step | Gap, then approach, then payoff |
| Journal club / students | Coursework-level biology or CS | Intuition first, then the formal method, with one worked example | Textbook concepts, toy datasets |

### General audiences
| Audience | Style |
|----------|-------|
| General public / "ELI5" | No jargon at all. Everyday analogies (recipes, libraries, maps, sorting mail). Answer "why should I care?" |
| High school | Basic biology terms (DNA, cell, protein) are OK; define everything else. Concrete examples. |
| Undergraduate | Can handle proper terms with a one-line definition. Intuition, then mechanism. |
| Industry / investor | Problem size, what's now possible, and the path to impact. Minimal methods detail. |

## Step 2: Understand the Source Material

Start with `docs/`, where the project's recorded context lives: method notes, dataset details, decisions, and repository memos in `docs/memos/repos/<owner>/<repo>.md`, and paper memos in `docs/memos/papers/<key>.md`. Read whatever is relevant before explaining, and build on it rather than contradicting it. If a paper or GitHub repository matters and has no memo yet, suggest running the `paper-researcher` or `github-doc-researcher` agent first.

Then understand what you are explaining:
- **Code / pipeline**: Read it. Know each step's input, output, and purpose before translating.
- **Method / model**: Identify the one key idea that makes it work, and what it assumes.
- **Result / figure**: Know what's on each axis, the sample size, the comparison, and the uncertainty.
- **Error message**: Find the root cause, not just the surface text.

## Step 3: Craft the Explanation

### Structure (for prose and for each slide)
1. **The biological question**: why anyone should care. Always start from biology, even for technical audiences.
2. **The key idea**: one sentence, plus one analogy pitched at the audience.
3. **Just enough detail**: only what this audience needs to trust or use the idea.
4. **So what**: what it means for *them* (to validate, to fund, to reuse, to decide).

### Concise and comprehensive
- One idea per sentence and one message per slide.
- Define each term the first time you use it, in five words or fewer where possible: "embedding (a numeric fingerprint)".
- Give numbers with context: n, units, the comparison, and the uncertainty ("AUROC 0.91 vs 0.84 baseline, n = 1,200 cells, 3 donors").
- Cut filler ("basically", "it is important to note", "in order to").
- Put nuance in speaker notes, not in slide text.

### Accuracy guardrail (research talks)
Simplify ruthlessly, but never say something false or overclaim:
- Keep the strength of each claim as it is: correlation stays correlation, and in silico predictions stay predictions until validated.
- If an analogy breaks in a way that matters, say where in the speaker notes.
- Don't invent numbers, citations, or results. Use clearly marked placeholders such as `[n = ?]` or `[cite]` when the source doesn't give them.

## Step 4: Choose the Output Format

- **Prose** (default in chat): a short explanation of 3–8 sentences for simple audiences, or a tight paragraph plus key terms for technical ones.
- **Slides**: use slides when the user asks for slides or a deck, or when working in this repo's HTML files. Produce the HTML below and write it to the deck at `slides/<deck-name>/index.html` (kebab-case deck name; images and data in `slides/<deck-name>/assets/`). Add to or revise an existing deck rather than starting a parallel one.

### Slide HTML format

Decks run on **reveal.js 5.2.1** with the shared theme `slides/_theme/theme.css`. A new deck starts from this scaffold. Copy it exactly so every deck behaves the same way (1280×720 canvas, top-aligned slides, `S` for the speaker view with notes, `?` for keyboard help):

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deck title</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.2.1/dist/reveal.css">
<link rel="stylesheet" href="../_theme/theme.css">
</head>
<body>
<div class="reveal">
<div class="slides">

<!-- Context: docs/… files this deck draws on -->

<!-- slides go here -->

</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.2.1/dist/reveal.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.2.1/plugin/notes/notes.js"></script>
<script>
  Reveal.initialize({
    width: 1280,
    height: 720,
    margin: 0.04,
    center: false,
    hash: true,
    slideNumber: "c/t",
    transition: "none",
    plugins: [RevealNotes]
  });
</script>
</body>
</html>
```

Horizontal decks only: every slide is a **top-level `<section>`** inside `.slides`, placed one after another, never nested.

```html
<section class="slide" data-audience="mixed">
  <h2>Claim-style title: the one takeaway, stated as a sentence</h2>
  <ul>
    <li>Short bullet, 12 words or fewer</li>
    <li>Short bullet, with numbers and units</li>
    <li>Short bullet, with the term defined inline</li>
  </ul>
  <!-- VISUAL: what to draw (e.g., pipeline diagram raw reads → alignment → counts → clusters; UMAP colored by cell type) -->
  <aside class="notes">
    Full spoken explanation: the analogy, the caveats, where the analogy breaks, and likely audience questions.
  </aside>
</section>
```

Slide rules:
- **Title is the takeaway** ("Batch correction recovers 3 hidden T-cell states"), not a topic label ("Batch correction").
- **At most 4 bullets** per slide, each 12 words or fewer. If it doesn't fit, split it into another horizontal slide.
- **Suggest one visual** per slide in the `VISUAL` comment. Prefer diagrams and figures over text.
- **Speaker notes carry the comprehensiveness**: everything the presenter needs to say or defend.
- For technical depth that the main audience doesn't need, add a final slide with `class="slide backup"` and the title prefix "Backup:".
- Use semantic HTML only. No inline styles: build layouts from the theme's classes, and add a new class to `slides/_theme/theme.css` when none fits. That way every deck gains it.
- Replace each `VISUAL` comment with the real figure or diagram once it exists. Reused paper figures go in `assets/`, credited in a `<figcaption>` (figure number, authors, year, license).
- Render every slide at 1280×720 and look at it before calling a deck done. Nothing may overflow into the footer or off the canvas.

Theme classes (see `slides/_theme/theme.css`):

| Class | Use |
|-------|-----|
| `title` (on `section`) | Title slide; pair with `h1`, `.subtitle`, `.meta` |
| `backup` (on `section`) | Backup slides at the end |
| `.eyebrow` | Small section label above the `h2` |
| `.cols`, `.cols.text-figure`, `.cols.three` | Two columns, text beside a figure, three panels |
| `.block` | Stacked groups within one column, each with an `h3` |
| `.panel` | Boxed card, usually inside `.cols.three` |
| `.kpis` > `.kpi` > `b` + `span` | Headline numbers with a label |
| `ol.flow` | Numbered process steps; start each `li` with `<strong>Step name</strong>` |
| `table`, `table.dense` | Comparisons; `dense` for backup tables |
| `.tag.ok` / `.partial` / `.no` / `.na` | Verdict pills |
| `.small`, `.muted`, `.footnote` | Smaller text, grey text, a note under a table |
| `.source` | Footer line for sources and footnotes |

## Examples

**User says**: "Explain what an embedding is" (no audience given, so mixed scientific)
**Response style**: "An embedding turns each cell into a short list of numbers, a coordinate, so that cells with similar gene expression land close together. Think of it as a map: 20,000 gene measurements compressed into a location where neighbors are biologically similar. That's what lets us cluster cell types and spot rare populations. One caveat: distances in 2-D plots like UMAP are distorted, so compare clusters, not exact distances."

**User says**: "ELI5 CRISPR screens"
**Audience**: General public
**Response style**: "Imagine a car with 20,000 parts and no manual. To learn what each part does, you build 20,000 cars, each missing one part, and see which ones won't start. A CRISPR screen does this with genes: it switches off one gene per cell and watches which cells struggle. That's how scientists find the genes that matter for a disease."

**User says**: "Make a slide explaining our differential expression result for the wet-lab team"
**Response style**:
```html
<section class="slide" data-audience="wet-lab">
  <h2>[Gene X] is 4× higher in resistant tumors: a candidate to validate</h2>
  <ul>
    <li>Compared [n = ?] resistant vs [n = ?] sensitive tumor samples</li>
    <li>Gene X up 4-fold; adjusted p = [?] (multiple testing corrected)</li>
    <li>Association only: knockdown needed to test causality</li>
    <li>Suggested assay: siRNA knockdown + drug response curve</li>
  </ul>
  <!-- VISUAL: volcano plot with Gene X labeled; inset boxplot of Gene X expression by group -->
  <aside class="notes">
    Think of this as a screening hit, not a mechanism... (walk through what "adjusted p" means, why fold change alone isn't enough, and which batch effects we controlled for)
  </aside>
</section>
```

## Important Reminders

- Never talk down to anyone. Experts from the other side of the field are experts, just not in this.
- Explain purpose before mechanism: why a method exists before how it works.
- Start from the biology. Even an ML audience needs to know what question the model answers.
- Keep slide text short and speaker notes complete.
