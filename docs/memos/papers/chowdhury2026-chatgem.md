# ChatGEM: An Agentic Architecture Enabling Interactive Simulation of Genome-Scale Metabolic Models

> A PNNL application of the ADEPT agent framework: an LLM writes COBRApy/StrainDesign/Gurobi code that runs in a sandbox container. Code retrieved from a curated library raised LLM-judged code quality from 2.63 to 4.20 (out of 5) on three *P. putida* modeling tasks, and a ChatGEM-assisted ecGEM analysis ranked four engineered strains for succinate production.

| | |
|---|---|
| Authors | Niaz Bahar Chowdhury, August George, Sumit Purohit, …, Kristin E. Burnum-Johnson, Paul Rigor, Jaydeep P. Bardhan (21 authors; all Pacific Northwest National Laboratory) |
| Published | bioRxiv (Systems Biology), preprint v1 and v2 both posted 2026-07-21; not peer reviewed; CC-BY 4.0 |
| Identifiers | DOI [10.64898/2026.07.20.739662](https://doi.org/10.64898/2026.07.20.739662) · no arXiv / PMID · Semantic Scholar CorpusId 290474687 |
| Full text | Full bioRxiv PDF (v1 and v2), all 4 main figures (high resolution), Supplementary Files 1 and 2 (the generated code plus the LLM-judge reports), and Supplementary Figure 1 (open access). Supplementary File 3 (proteomics) exists in the GitHub repo but was not analysed. Supplementary File 4 (plasmid maps) was not read. |
| Code & data | [github.com/pnnl/ChatGEM](https://github.com/pnnl/ChatGEM) (BSD-2; RAG script corpus, 8 ecGEM runs, iBAQ scripts, a Claude Code skill; **no agent code**). Platform: [github.com/pnnl/adept-agentic](https://github.com/pnnl/adept-agentic) and [pnnl/adept-agentic-framework-core](https://github.com/pnnl/adept-agentic-framework-core). No repo memos exist yet. No public accessions (proteomics raw data are not deposited in PRIDE or MassIVE as far as the paper states). |
| Status | No corrections found (Crossref has no update-to; searches found no errata). Preprint, 0 citations (Crossref and Semantic Scholar, 2026-09-24). |
| Researched | 2026-09-24 |
| Focus | Architecture in depth for AI engineers building a similar agentic GEM system (agents, orchestration and state, tools, simulation execution, guardrails, HITL, evaluation, limitations), plus a claim check of a user-supplied slide brief |

## Summary
- ChatGEM is ADEPT (PNNL's general agentic platform) with a sandbox container that includes COBRApy, StrainDesign and Gurobi, plus a RAG corpus of **52 human-curated COBRApy scripts**. A user types a detailed step-by-step protocol. ADEPT's Scientific Workflow Agent writes Python, which runs in the sandbox, and results come back as printed values and Excel files (Methods, "ChatGEM implementation and workflow"; Fig. 1).
- The paper gives very little architectural detail. It never mentions LangGraph, nsjail, human-approval gates or validators. What it does name: a Keycloak gateway, an orchestration service, stateless MCP tool servers, PostgreSQL/Redis/ChromaDB, Langfuse/LangSmith, A2A federation, and o4-mini as the default model. Most engineering detail must come from the ADEPT repo, and the paper does not say which ADEPT version it used.
- Benchmark: 3 tasks × {no RAG, RAG} × 1 run each, scored by one LLM judge (Claude Sonnet 4.6) as OPS = 0.7·Accuracy + 0.3·Completeness. Mean OPS was 2.63 → 4.20 for o4-mini and 2.18 → 4.20 for GPT-4.1 (Fig. 2A–C; Supp. Fig. 1; Supp. Files 1–2).
- **Critical caveat (checked):** the with-RAG "generated" code is near-verbatim the reference scripts in the RAG corpus. Task 3 matches `51._ecOptMDFPathway.py` on 183 of 184 non-blank lines, and Task 2 matches `44._optknock.py` on 175 of 182. The with-RAG code is also identical between o4-mini and GPT-4.1 for all three tasks. So the RAG gain mostly measures whether the system retrieves the answer key, not whether it generalizes.
- Case study: eight ecGEMs (4 *P. putida* strains × 12/24 h) predicted the Constitutive dCas12a strain to have the lowest "succinate leakage index" (SLI) and the highest succinate excretion. It also had the highest measured titer at 24 h (Figs. 3–4). The evidence is thin: n = 4 strains, rates are compared with titers, the ranking is only partly consistent, and the paper does not show how much the agent did versus the authors.

## Question
GEM workflows such as FBA, OptKnock strain design and ecGEM reconstruction need COBRA/Python or MATLAB skills and familiarity with databases like KEGG and ModelSEED. This expertise barrier limits GEM use in synthetic biology (Introduction, p. 2–3). The authors say no existing tool offers "a conversational interface capable of handling the full stack of quantitative GEM simulations" (p. 3). The closest prior tools are CRISPR-GPT (gene editing), CellWhisperer (scRNA-seq), BioAgents (bioinformatics), D2Cell (literature mining for metabolic engineering) and LLM-assisted Human2 reconstruction. None of them executes constraint-based simulations conversationally.

## Approach

### System architecture (what the paper states)
From Results, "ChatGEM Agentic Framework" (p. 4) and Fig. 1:
- **Three tiers inherited from ADEPT:** (1) a secure gateway for login and access control via Keycloak; (2) a central orchestration service that "acts as the coordinator for AI agents" and persists conversations in PostgreSQL; (3) "stateless MCP tool servers" that run scientific tools (BLAST, UniProt, PubChem), HPC pipelines (Nextflow) and "sandboxed code on demand".
- **State and storage:** conversations in PostgreSQL, tool settings in Redis, the knowledge base in ChromaDB. "Multi-tier session IDs" isolate conversations, tool calls and multi-agent workflows. RAG runs "on demand via automated ingestion into the vector database".
- **Observability:** "LLM calls and tool results can be tracked using Langfuse or LangSmith as well as a baseline Docker logging system … improved auditability and debugging support."
- **Models:** provider-agnostic via a YAML config (OpenAI, Anthropic, Ollama; Fig. 1 also shows Bedrock and Vertex AI). ChatGEM's default is **o4-mini**.
- **Federation:** ADEPT instances federate via the A2A protocol with dual JWT validation. All services are containerized.
- **ChatGEM-specific additions** (Methods, p. 11–12): a custom Python execution environment with COBRApy, StrainDesign and Gurobi; a custom Gurobi license-manager tool; and adjusted "execution code and run-time allowances" so long-running jobs such as multi-knockout strain design can finish. Deployment used infrastructure-as-code on AWS EC2 and on an internal on-site HPC system.
- **Workflow as run in the paper** (Methods, p. 12): the user works in ADEPT's built-in Streamlit chat app and uploads the 52 curated scripts for RAG ingestion. A query "trigger[s] ADEPT's Scientific Workflow Agent". Any code execution "was routed to the custom ChatGEM sandbox container". Outputs then go to a separate LLM-as-judge (Claude Sonnet 4.6) for scoring.
- Fig. 1 was generated with AI assistance (AI Usage Statement, p. 18), so treat it as a schematic, not an engineering diagram.

The paper does not describe any named sub-agents (router, RAG agent, coder, executor), a prompt design, retrieval parameters (chunking, embedding model, top-k), error-recovery or retry loops, output validation, or any approval step. The abstract's phrase "specialized agents" is never broken down. Methods name only one agent, the Scientific Workflow Agent.

### Architecture as implemented in the ADEPT repo (supplementary; not claimed by the paper)
Read from `pnnl/adept-agentic` at commit 9c603ca (2026-06-25). The paper does not pin a version, so these details may differ from what ChatGEM ran.
- **Orchestration is LangGraph.** The README says "Built on the Model Context Protocol (MCP) and LangGraph". The `ScientificWorkflowAgent` is a custom `StateGraph` with three nodes. `agent` calls the LLM and handles context truncation and orphaned-tool-call repair. `action` executes tools, writing large outputs to files and returning sanitized summaries. `terminate` runs when a loop is detected. A conditional edge `should_continue()` ends runaway loops: 3 or more identical `(tool, args-hash)` calls in the last 10 messages, or 3 or more failing calls to the same tool (`docs/architecture/LANGGRAPH_AGENT_EXECUTION_ARCHITECTURE.md`; `orchestration_service/scientific_workflow/graph_builder.py`).
- **State:** an `AgentState` TypedDict holds `messages` (append-only), `full_tool_outputs`, fork metadata and `termination_reason`. Checkpoints go to a singleton `AsyncPostgresSaver` with hierarchical thread IDs (`{session}::supervisor`, `{mcp_session}::{multi_agent_session}::{role}`).
- **Multi-agent modes exist in ADEPT.** Graph mode has a supervisor with structured-output routing to worker ReAct agents. Router mode has a planner and then a supervisor that calls workers as tools, with per-role LLM routing (`multi_agent_manager.py`). The paper does not say ChatGEM used either mode.
- **Sandbox** (`sandbox_mcp_server`): subprocess execution in a dedicated container on an isolated network (it can reach only the orchestration service), with capabilities dropped, a non-root user, CPU and memory limits, an egress allowlist, and AST-based import validation (`strict` whitelist or `medium` blacklist, default medium). **nsjail is supported but optional.** It defaults to `SANDBOX_USE_NSJAIL=false`, and the local docker-compose file disables it with the note "nsjail breaks plot generation". Default execution timeout is 30 s, maximum 300 s. The sandbox image's `requirements-cobrapy.txt` pins cobra 0.31.1, straindesign 1.18, gurobipy 13.0.2, **cameo 0.11.2**, memote 0.17.0 and scikit-glpk. Uploaded files live at `/app/data/uploaded_files`, the same path the no-RAG code in Supp. File 1 searches.
- **HITL:** a search found no LangGraph `interrupt` or approval-gate code in `src/` (only CLI Ctrl-C handling).
- **Validators:** Pydantic is used only for config and schema validation (LLM config, egress allowlist, gateway schemas, agent role names). Nothing validates metabolic-model modifications.
- **Telemetry:** Langfuse is wired in throughout the code (76 files). LangSmith appears only in a couple of files.

### Benchmark design
- Model: *P. putida* KT2440 iJN1463 (irreversible version for Task 3). Solver: Gurobi.
- Tasks (the prompts are verbatim in Supp. File 1). Each prompt is a **human-written, step-by-step protocol** with lettered steps A–K that includes reaction IDs, bounds and algorithm choice:
  1. **FBA + knockouts** ("low" complexity): baseline FBA, knock out FUM, ATPS4rpp, HCO3E and H2CO3D, report biomass and EX_succ_e.
  2. **OptKnock** via StrainDesign ("high"): glucose −6.0 mmol/gDW/h, 8 exchanges set to secretion-only, ≤2 knockouts, ≥10% WT growth, 9 excluded reactions, export to Excel.
  3. **ecOptMDFPathway** ("higher"/"very high"/"complex"; the labels differ between text, figure and supplement): a Gurobi MILP combining mass balance, thermodynamic driving force from ΔG° and concentrations, binary flux–activity coupling, an MDF constraint, a proteome cap of 0.60 g/gDW and minimum biomass.
- Conditions: with vs without RAG over the 52 scripts. The corpus in the repo also contains `cobrapy.pdf` and `straindesign.pdf` docs and the task data files.
- Metric: Claude Sonnet 4.6 scores Coding Accuracy (1–5) and Code Completeness (1–5), combined as OPS = 0.7·Acc + 0.3·Comp. The rubric (Supp. File 1): Accuracy 5 = runs correctly and follows best practices; 3 = runs but gives incorrect output; 2 = partially executes or uses the wrong library; 1 = does not run.
- Timing: manual coding vs ChatGEM coding plus manual inspection vs ChatGEM coding alone (Fig. 2D–F). The paper does not say who did the manual coding, whether execution time is included, or how many repeats were run.
- Model comparison: o4-mini vs GPT-4.1 on the same tasks and conditions (Supp. Fig. 1; Supp. File 2).

### Case study (wet lab plus modeling)
Strains: WT KT2440; AG5577 "Landing Pad" (SAGE-compatible, 3 poly-attB sites); Constitutive dCas12a; crystal-violet-inducible dCas12a. Growth: N-limited M9 + glucose, 24-well plates, 30 °C. Sampling: sampling at 6, 12 or 24 h (Fig. 3D plots 0/12/24 h) for HPLC succinate, plus DIA proteomics (Orbitrap Astral, DIA-NN 2.3.1). Proteomics processing: pmartR normalization, then iBAQ. Enzyme parameters: kcat from TurNuP; enzyme MW from UniProt sequences. ecGEM setup: capacity constraints on 2,479 reactions, a global proteome cap of 0.20 g/gDW, and upper bounds relaxed to 1,000 wherever the iBAQ-derived bound fell more than 100% below the unconstrained flux (Methods, p. 12–17). This gave eight ecGEMs. The SLI is enzyme usage of SUCDi divided by (ICL + SUCOAS) (p. 9–10). All 8 `ecGEM.py` files in the repo are byte-identical (the same script with different data). No chat transcripts are provided.

## Findings

**Code quality (o4-mini; Fig. 2A–C; Supp. File 1)**

| Task | No RAG (Acc/Comp → OPS) | RAG (Acc/Comp → OPS) | What went wrong without RAG |
|---|---|---|---|
| FBA + KO | 3/5 → 3.60 | 4/5 → 4.30 | Found the succinate reaction by string search, set bounds instead of calling `knock_out()`, no context manager |
| OptKnock | 2/3 → 2.30 | 4/4 → 4.00 | Used Cameo instead of the required StrainDesign; syntax errors |
| ecOptMDFPathway | 2/2 → 2.00 | 4/5 → 4.30 | Broken mass-balance loop, wrong MDF Big-M constraint; does not run |
| **Mean** | **2.63** | **4.20** | Discussion calls this a "60% improvement" (4.20/2.63 = 1.60) |

**Model comparison (Supp. Fig. 1; Supp. File 2).** GPT-4.1 without RAG scored 3.40 / 1.30 / 1.85 (mean 2.18). It invented a `strain_design` package API and set glucose uptake to 0. With RAG it scored 4.30 / 4.00 / 4.30 (mean 4.20), identical to o4-mini. The authors conclude that RAG "equalizes" models and that o4-mini is the cost-effective choice (p. 7, 11). Inference costs were not reported.

**Time (Fig. 2D–F; single measurements)**

| Task | Manual coding | ChatGEM + inspection | ChatGEM alone |
|---|---|---|---|
| FBA + KO | 254.1 s | 183.9 s | 3.9 s (the "65×" claim) |
| OptKnock | "more than a day" / "~order of day" (not measured) | 954 s | 774 s |
| ecOptMDFPathway | "more than a day" (not measured) | 221.8 s | 41.8 s |

**Case study (Figs. 3–4).**
- ecGEM-predicted enzyme requirement vs iBAQ abundance: r = 0.50, p < 0.001. The authors call this "strong agreement" (Fig. 3A).
- Predicted growth rates of 0.270–0.285 h⁻¹ are called "biologically plausible" (Fig. 3B). This is not validated against measured growth.
- Predicted succinate excretion is highest for Constitutive (≈1.147 mmol/gDW/h at both time points). The Induced strain is predicted to decline from 12 h to 24 h (Fig. 3C).
- Measured titer at 24 h: Const ≈0.43 > KT2440 ≈0.40 > LP ≈0.25 > Induced ≈0.23 g/L. At 12 h all strains are ≈0.03–0.05 g/L and overlap (Fig. 3D).
- Dominant protein sinks are EDD > GLCDpp > ACONTa, consistent with Entner–Doudoroff dominance in *P. putida* (Fig. 4A–B).
- SLI (Fig. 4C): WT 0.22 → 0.12; LP 0.19 → 0.13; Const 0.12 → 0.13; Induced 0.16 → 0.21 (12 h → 24 h). The authors conclude that Constitutive is "the most promising chassis … a prediction observed experimentally".

## Strength of evidence

**Authors' stated limitations.** Few are stated. The authors note that the Induced strain's predicted decline reflects "a strain-specific regulatory response that the model was unable to capture" (p. 9). They also say they had to adjust run-time allowances for long jobs (Methods). They make no general limitations statement.

**Assessment.**
- **The benchmark is very small and uses one LLM judge.** It has 3 tasks and 1 sample per cell, with no repeats, no variance, no human expert grading, and no execution-based ground truth (for example, comparing the returned fluxes or knockouts to a reference). The judge is not consistent. For byte-identical with-RAG OptKnock code, the o4-mini report says the flux sheet "lacks a delta column", while the GPT-4.1 report says the delta column "is correctly computed and present". The code does contain it (`delta(mut-wt)`). A "60% improvement" computed from three integer-scored samples should not be quoted as a general effect size.
- **With-RAG results mostly reflect retrieval of the answer key (checked).** The RAG corpus in `pnnl/ChatGEM/RAG_COBRApy_codes` contains `44._optknock.py` and `51._ecOptMDFPathway.py`, which solve Tasks 2 and 3 on the same model with the same data files. The corpus OptKnock script even contains the Task 1 knockout list (commented out) and the instruction "DO NOT USE CAMEO". The with-RAG outputs are nearly verbatim copies (see Summary), and both LLMs produced identical with-RAG code. So the finding that "RAG equalizes models" follows automatically. The benchmark has no held-out tasks, so it does not test generalization to analyses missing from the corpus. *(inferred)*
- **The no-RAG condition was penalized partly for a reasonable library choice.** Cameo was installed in the ADEPT sandbox image, which may explain why the model used it. The prompt did ask for StrainDesign, though. *(inferred)*
- **A small discrepancy between text and code (checked).** The paper says the RAG OptKnock code "excluded nine essential reactions from the knockout search space". The code does not pass the exclusion list to StrainDesign. Instead it asks for one solution (`max_solutions=1`) and discards it afterwards if it contains an excluded reaction, so it can return nothing.
- **Timing is anecdotal.** Every value is a single run. Manual times for Tasks 2 and 3 are not measured ("~order of day"). Nothing says who coded manually or whether solver time counts. For FBA, the fair comparison with a human in the loop is 254 s vs 184 s (1.4×), not 65×.
- **The case-study validation is weak.** Only 4 strains are ranked. Predicted rates (mmol/gDW/h) are compared with titers (g/L). The ecGEM predicts KT2440 and LP excretion equal at 24 h, while measured LP is about 35% lower (≈0.25 vs ≈0.40 g/L). The model predicts the Induced strain declines, while measurement shows it rises. At 12 h the measured titers are not distinguishable. The paper's own SLI values have WT (0.12) at or below Constitutive (0.13) at 24 h, which contradicts "lowest SLI at both time points" (Fig. 4C caption; Discussion p. 11). r = 0.50 is moderate agreement. The growth-rate check cites MEMOTE with a wrong reference (Kroll 2023 is TurNuP). A stray "*ref SAGE" placeholder remains in Methods (p. 13), and StrainDesign itself is never cited. The biology is correlational and in silico, with qualitative experimental agreement.
- **The agent's contribution to the case study is not shown.** No transcripts, prompts, number of turns, or evaluation of agent errors are given. The 8 identical `ecGEM.py` scripts look like the ecOptMDF corpus style, but how they were produced is not documented. *(inferred)*
- **Generalization is unknown.** Everything uses one organism, one model family and one lab's curated corpus. The benchmark does not include any study with non-expert users, even though the paper's main pitch is "democratization".

## Claim check

The user-supplied slide brief was treated as possibly hallucinated. The verdict applies to what **the paper** supports. Evidence from the ADEPT/ChatGEM code is marked "repo". Code evidence reflects `pnnl/adept-agentic` at commit 9c603ca (2026-06-25), which may not be the version ChatGEM ran.

| # | Claim | Verdict | Evidence | What the paper actually says |
|---|---|---|---|---|
| 1 | ChatGEM is an application layer built on PNNL's ADEPT framework. | Supported | Abstract; Results "ChatGEM Agentic Framework" (p. 4); Fig. 1; Methods p. 11–12; ADEPT = George et al. 2025, [Zenodo 10.5281/zenodo.17315801](https://doi.org/10.5281/zenodo.17315801), [github.com/pnnl/adept-agentic](https://github.com/pnnl/adept-agentic) | "ChatGEM is a specialized agentic system built from the ADEPT framework … inherits from ADEPT's full architecture"; "developed using ADEPT as the reference architecture." ADEPT is a PNNL framework. |
| 2 | Orchestration uses LangGraph (stateful, multi-turn, multi-agent loops). | Not addressed | The paper never mentions LangGraph. Repo: ADEPT README "Built on … MCP and LangGraph"; `graph_builder.py` custom `StateGraph`; `AsyncPostgresSaver` checkpoints; `multi_agent_manager.py` supervisor modes | The paper says only that a "central orchestration service … acts as the coordinator for AI agents and persist[s] conversations in PostgreSQL", and that queries trigger "ADEPT's Scientific Workflow Agent" (a single agent). ADEPT does use LangGraph (repo), but the paper does not say ChatGEM ran multi-agent loops. |
| 3 | The simulation layer uses COBRApy and StrainDesign. | Supported | p. 4 ("integrating COBRApy, StrainDesign, and commercial solvers like Gurobi"); Fig. 1; Methods p. 11; Supp. File 1 code (`sd.OPTKNOCK`, `sd.compute_strain_designs`) | Correct. Add Gurobi: Task 3 and the ecGEMs are hand-built `gurobipy` MILPs, not COBRApy methods. |
| 4 | Code runs in containerized sandboxes via nsjail. | Partly supported | Methods p. 12 ("routed to the custom ChatGEM sandbox container"); p. 4–5 ("sandboxed code on demand"; "containerization across the services"). nsjail is not in the paper. Repo: `docker-compose.core.yaml` `SANDBOX_USE_NSJAIL=false` ("DISABLED: nsjail breaks plot generation"); security-model doc says nsjail is optional and defaults to false | A containerized sandbox is stated. nsjail is not mentioned. ADEPT supports nsjail as an opt-in, disabled by default, so it is unknown whether ChatGEM used it. |
| 5 | The LLM generates a plan that real scientific software executes, rather than the LLM computing biology itself. | Partly supported | Abstract ("coordinates code generation and execution"); Methods p. 12; Supp. File 1 (prompts and code) | The execution part holds: the LLM writes Python that COBRApy/StrainDesign/Gurobi execute in the sandbox. But the **plan is written by the human**. Each benchmark prompt is a lettered step-by-step protocol (A–K) with reaction IDs, bounds and algorithm. The LLM translates it into code. The SLI metric was defined by the authors ("We defined…", p. 9). |
| 6 | Human-in-the-loop via LangGraph breakpoints lets a scientist approve model modifications before a long (4-hour) simulation. | Not supported | No mention of breakpoints, interrupts, approvals or 4 hours anywhere. Fig. 2D–F is the only HITL content. The longest reported run is 954 s. Repo: no LangGraph `interrupt`/approval code found in `src/` | The paper's only "human in the loop" is a timing condition, "ChatGEM coding with manual inspection" (Fig. 2D–F; p. 7). Methods say only that run-time allowances were raised for long-running jobs. |
| 7 | Multi-agent routing: a RAG agent (literature lookup), a Code-Gen agent (writes simulation scripts), and a Sandbox agent (executes them). | Partly supported | Abstract ("specialized agents"); Methods p. 12; p. 4 (RAG via vector DB ingestion) | Retrieval, code generation and sandboxed execution all exist as functions, but the paper names no RAG, Code-Gen or Sandbox agents. Methods describe one Scientific Workflow Agent routing execution to a sandbox container. **RAG is not literature lookup:** the corpus is 52 curated Python scripts (plus COBRApy/StrainDesign docs in the repo). |
| 8 | It cuts strain-intervention design (e.g., gene knockouts) from days to minutes. | Partly supported | Fig. 2E–F; p. 7 | OptKnock: manual coding "more than a day" (not measured; "~order of day") vs 774 s (≈13 min) ChatGEM alone, or 954 s with inspection. ecOptMDF: "more than a day" vs 41.8 s. These are single runs of coding time, not the whole design cycle. The paper says "a day", not "days". The OptKnock task designs reaction knockouts, not gene knockouts. |
| 9 | Audit trails and telemetry via LangSmith or Langfuse. | Supported | p. 4 ("LLM calls and tool results can be tracked using Langfuse or LangSmith as well as a baseline Docker logging system … improved auditability"); Fig. 1. Repo: Langfuse throughout | Stated as an ADEPT capability ("can be tracked"). The paper does not report using the traces in its experiments. |
| 10 | It lets wet-lab biologists run FBA without Python. | Partly supported | Abstract; Introduction p. 3 ("without the user writing any code"); Discussion p. 11–12 | This is the paper's central aim, but it is **not tested**: there is no user study and no non-expert users. The benchmark prompts need expert knowledge (BiGG reaction IDs, bounds, MILP formulation). Users still had to upload SBML models and data files. |
| 11 | MCP is used: BLAST, UniProt and PubChem are exposed as MCP tools via JSON-RPC; COBRApy and StrainDesign run as separate MCP servers; code execution goes through an MCP server with an nsjail sandbox. | Partly supported | p. 4–5 ("a set of stateless MCP tool servers that run scientific tools (BLAST, UniProt, PubChem), HPC pipelines (Nextflow), and sandboxed code on demand"); Fig. 1; Methods p. 11–12. Repo: README "MCP JSON-RPC protocol"; `sandbox_mcp_server` | Supported: MCP tool servers for BLAST/UniProt/PubChem and for sandboxed code. JSON-RPC: not in the paper (true in the ADEPT repo). **Contradicted: COBRApy/StrainDesign as separate MCP servers.** The paper says they are dependencies installed in a "custom Python code execution environment" inside the sandbox container. nsjail: not in the paper (optional and off by default in the repo). |
| 12 | Example workflow: "find knockouts to optimize succinate production in E. coli" → RAG via PubChem MCP → Code-Gen writes a COBRApy FBA script → sandbox MCP → COBRApy/StrainDesign MCP returns JSON → LLM synthesizes the answer. | Contradicted | Fig. 2B protocol; Supp. File 1 Task 2 prompt and code; Methods p. 12 | The paper has no such workflow. Its closest analogue is Task 2: OptKnock for succinate in ***P. putida* KT2440 (iJN1463)**, not *E. coli*. The prompt is a detailed human protocol. There is no PubChem call. RAG retrieves a curated OptKnock script. The LLM writes a StrainDesign OptKnock (bilevel MILP) script, not an FBA script, which runs inside the sandbox. Results are printed and **exported to Excel**, not returned as JSON from a COBRApy/StrainDesign MCP server. Case-study synthesis and the SLI were authored by the researchers. |
| 13 | It uses Pydantic-style validators on model modifications. | Not addressed | Not in the paper. Repo: Pydantic validators only on config/schemas (`core/llm_config.py`, `sandbox_mcp_server/security/egress_allowlist.py`, `gateway_registry/schemas.py`, `multi_agent_manager.py` role names). The sandbox has AST import validation (`code_validator.py`). `pnnl/ChatGEM` has no agent code | The paper describes no validation of model modifications. Quality control is done after the fact by the LLM judge and by the authors' own reading of MEMOTE-range growth rates. |

## Context
- **Lineage.**
  - **ADEPT**: George, …, Rigor, "ADEPT: A Pedagogical Framework for Integrating Agentic AI with Deterministic Scientific Workflows", Zenodo 2025-10-10, [10.5281/zenodo.17315801](https://doi.org/10.5281/zenodo.17315801). Code at [pnnl/adept-agentic](https://github.com/pnnl/adept-agentic), described as "Agentic Discovery and Exploration Platform for Tools", with 28+ MCP tools, 10 client interfaces and multi-LLM config. This is real PNNL work and it is the substrate for ChatGEM. Two authors (George, Rigor) overlap.
  - **BioAgents** (Mehandru et al., Sci Rep 2025): the source of the accuracy/completeness evaluation approach, and the comparison the authors draw for "degrades with code complexity without RAG".
  - The COBRA stack: COBRApy (Ebrahim 2013), OptKnock (Burgard 2003), OptMDFpathway (Hädicke 2018), and enzyme constraints (Sanchez 2017, GECKO). StrainDesign (Schneider et al.) is used but **not cited**.
- **Versions.** v1 and v2 were both posted 2026-07-21. The only textual change (diff of the extracted text) is the code link: v1 pointed to an internal GitLab (`code.emsl.pnl.gov/opal-chatgem`) and v2 points to `github.com/pnnl/ChatGEM`. The GitHub repo was created 2026-07-21. Its latest default-branch commit b347e47 is dated 2026-07-27, and it now also ships a Claude Code "skill" wrapping the same 52 scripts.
- **Reception.** 0 citations. No commentary or critiques found. Related contemporaneous work (found by search, not read in depth):
  - MechAInistic, an Architect–Reviewer multi-agent LLM system over CBM models (bioRxiv [10.64898/2026.05.11.723319](https://www.biorxiv.org/content/10.64898/2026.05.11.723319v4); arXiv [2607.18249](https://arxiv.org/abs/2607.18249)).
  - "Comprehensive evaluation of LLM capabilities for interpretation and analysis of GEMs in metabolic engineering" (bioRxiv [10.64898/2026.06.03.730004](https://www.biorxiv.org/content/10.64898/2026.06.03.730004v1)).
  - D2Cell, LLMs for metabolic engineering design (Li et al., Trends Biotechnol 2026).
- **Status.** Preprint, no peer-reviewed version found, no corrections or retractions.

## Relevance
**Key idea for a mixed audience.** Don't let the LLM "do" metabolism. Give it a curated library of working COBRApy/StrainDesign scripts to retrieve, let it adapt one, and run the result in a locked-down container with a real solver. On three tasks, code grounded in retrieved scripts was far better than code written from memory. That was largely because the library already held near-exact solutions.

**Design lessons for engineers building a similar GEM agent** *(inferred from the paper and ADEPT repo)*:
- The **curated script corpus is the product**. Its coverage determines what the agent can do reliably. Benchmarks need held-out tasks that are absent from the corpus.
- Use **execution-based evaluation**: compare returned fluxes, knockout sets and objective values to reference outputs, and repeat runs. Don't rely only on a single LLM judge.
- Sandbox details matter for GEMs. You need solver licensing (Gurobi token server or license manager), long-job timeouts (ADEPT's default max of 300 s is below the 774 s OptKnock run, hence the authors' "run-time allowances"), async task polling, and file I/O for SBML and Excel.
- ADEPT's guarded ReAct loop (loop detection, split-stream outputs) and hierarchical thread IDs are reusable patterns. Human approval gates and model-edit validators are **not** present and would need to be built.

**Figures worth reproducing.**
- **Fig. 1**: architecture. Note that it was AI-generated. Consider redrawing it with the ADEPT three-tier plus sandbox detail above.
- **Fig. 2A–F**: OPS with vs without RAG, the task protocols, and timing. This is the core evaluation slide. Pair it with the "RAG corpus contains the solutions" caveat.
- **Supp. Fig. 1**: GPT-4.1 vs o4-mini.
- **Fig. 4C and Fig. 3C–D**: SLI and predicted vs measured succinate, if the biology is covered.

**Caveats to state out loud.**
- This is a preprint with 1 run per condition and an LLM judge.
- With-RAG code is copied from the corpus.
- The "65×" figure is the FBA case without inspection. The multi-day manual times are estimates.
- There is no user study with biologists.
- nsjail, LangGraph HITL, named sub-agents and validators come from the brief (or the ADEPT repo), not from this paper.

## Open questions
- Which ADEPT version and configuration ChatGEM ran: single agent vs multi-agent mode, nsjail on or off, timeout values, retrieval settings (embedding model, chunking, top-k). The paper does not say. The ADEPT repo docs mention an `examples/emsl_chatgem/` on-premises stack that is missing from the public repo, so its deployment config would answer this. Ask the authors (corresponding: niazbahar.chowdhury@pnnl.gov, paul.rigor@pnnl.gov) or check other ADEPT branches.
- Whether the agent loop retried on execution errors, and how many turns each task took. Langfuse traces or chat transcripts would answer this. None are released.
- How much of the case study was agent-driven vs author-driven. Session logs for the eight ecGEM builds would show this.
- Performance on tasks with no matching corpus script (for example, a new organism, gene-level OptKnock, or dFBA on a different model). This would need new held-out tasks.
- Inter-judge and human agreement on OPS. This would need a re-score of Supp. Files 1–2 by humans or several judges.
- Recommended: run `github-doc-researcher` on `pnnl/adept-agentic` (orchestration, sandbox, MCP) and on `pnnl/ChatGEM` (corpus and skill). The code resolves several claims the paper leaves open (LangGraph, MCP/JSON-RPC, nsjail default, absence of HITL and model validators), but it cannot show what configuration was used in the paper.

## Revisions
- 2026-09-24: researched from the full text (bioRxiv v1 and v2 PDFs, figures, Supplementary Files 1–2, Supp. Fig. 1) plus the `pnnl/ChatGEM` (b347e47) and `pnnl/adept-agentic` (9c603ca) repos. Focus: architecture for AI engineers, and a claim check of the slide brief.
