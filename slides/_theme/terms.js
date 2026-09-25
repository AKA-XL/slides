/* Glossary tooltips for every deck in slides/. Load after reveal.js.
 *
 * Mark a term on a slide:
 *   <span class="term" data-term="sandbox">sandbox</span>
 * Define it once, in the deck's glossary (after the .reveal element):
 *   <dl id="glossary" hidden>
 *     <dt data-term="sandbox">Sandbox</dt>
 *     <dd>A sealed-off area where untrusted code runs…</dd>
 *   </dl>
 *
 * Each term gets an info button. Hovering the term, focusing the button, or tapping it
 * shows the definition. A tap pins it open until the next tap, Escape, or slide change.
 */
(() => {
  const GAP = 8;

  const glossary = new Map(
    [...document.querySelectorAll("#glossary dt[data-term]")].map((dt) => [dt.dataset.term, dt])
  );

  const tip = document.createElement("div");
  tip.id = "term-tip";
  tip.className = "term-tip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.append(tip);

  let active = null; // the info button whose definition is showing
  let pinned = false; // opened by a click or tap rather than a hover

  function show(button, pin) {
    const dt = glossary.get(button.dataset.term);
    const name = document.createElement("strong");
    name.textContent = dt.textContent;
    const definition = document.createElement("span");
    definition.innerHTML = dt.nextElementSibling.innerHTML;
    tip.replaceChildren(name, definition);
    tip.hidden = false;

    if (active && active !== button) active.removeAttribute("aria-describedby");
    button.setAttribute("aria-describedby", tip.id);
    active = button;
    pinned = pin;
    place(button);
  }

  function hide() {
    if (!active) return;
    active.removeAttribute("aria-describedby");
    tip.hidden = true;
    active = null;
    pinned = false;
  }

  // Below the button when it fits, otherwise above; always inside the viewport.
  function place(button) {
    const anchor = button.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    const viewWidth = document.documentElement.clientWidth;
    const viewHeight = document.documentElement.clientHeight;

    let top = anchor.bottom + GAP;
    if (top + box.height > viewHeight - GAP) top = Math.max(GAP, anchor.top - GAP - box.height);
    const centered = anchor.left + anchor.width / 2 - box.width / 2;
    const left = Math.min(Math.max(GAP, centered), viewWidth - box.width - GAP);

    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
  }

  // Wrap the term's last word and the button in a no-wrap span, so the icon never
  // starts a line on its own.
  function attachToLastWord(term, button) {
    const walker = document.createTreeWalker(term, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) if (walker.currentNode.data.trim()) last = walker.currentNode;

    const tail = document.createElement("span");
    tail.className = "term-tail";
    if (last) {
      const word = last.splitText(last.data.trimEnd().search(/\S+$/));
      word.before(tail);
      tail.append(word);
    } else {
      term.append(tail);
    }
    tail.append(button);
  }

  for (const term of document.querySelectorAll(".reveal .term[data-term]")) {
    const id = term.dataset.term;
    const dt = glossary.get(id);
    if (!dt) {
      console.error(`Glossary has no entry for data-term="${id}"`);
      continue;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "term-info";
    button.dataset.term = id;
    button.setAttribute("aria-label", `What is ${dt.textContent}?`);
    button.textContent = "i";
    attachToLastWord(term, button);

    term.addEventListener("mouseenter", () => { if (!pinned) show(button, false); });
    term.addEventListener("mouseleave", () => { if (!pinned) hide(); });
    button.addEventListener("focus", () => { if (!pinned) show(button, false); });
    button.addEventListener("blur", () => { if (!pinned) hide(); });
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (pinned && active === button) hide();
      else show(button, true);
    });
  }

  document.addEventListener("click", () => { if (pinned) hide(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") hide(); });
  window.addEventListener("resize", hide);
  Reveal.on("slidechanged", hide);
})();
