/* Glossary definitions for every deck in slides/. Load after reveal.js.
 *
 * Mark a term on a slide:
 *   <span class="term" data-term="sandbox">sandbox</span>
 * Define it once, in the deck's glossary (after the .reveal element):
 *   <dl id="glossary" hidden>
 *     <dt data-term="sandbox">Sandbox</dt>
 *     <dd>A sealed-off area where untrusted code runs…</dd>
 *   </dl>
 *
 * Each term gets an info button. Hovering the term (or focusing the button) shows the
 * definition in a popup card beside it; clicking or tapping the button opens it in a
 * centered modal, closed with ×, Escape, or a click outside.
 */
(() => {
  const GAP = 10;

  const glossary = new Map(
    [...document.querySelectorAll("#glossary dt[data-term]")].map((dt) => [dt.dataset.term, dt])
  );

  // Fill a container with the term's name as a heading and its definition.
  function renderDefinition(container, id, headingTag) {
    const dt = glossary.get(id);
    const name = document.createElement(headingTag);
    name.className = "term-name";
    name.textContent = dt.textContent;
    const definition = document.createElement("p");
    definition.className = "term-definition";
    definition.innerHTML = dt.nextElementSibling.innerHTML;
    container.replaceChildren(name, definition);
    return name;
  }

  /* Hover card */

  const card = document.createElement("div");
  card.id = "term-card";
  card.className = "term-card";
  card.setAttribute("role", "tooltip");
  card.hidden = true;
  document.body.append(card);
  let cardOwner = null;

  function showCard(button) {
    renderDefinition(card, button.dataset.term, "strong");
    card.hidden = false;
    if (cardOwner && cardOwner !== button) cardOwner.removeAttribute("aria-describedby");
    button.setAttribute("aria-describedby", card.id);
    cardOwner = button;
    placeCard(button);
  }

  function hideCard() {
    if (!cardOwner) return;
    cardOwner.removeAttribute("aria-describedby");
    card.hidden = true;
    cardOwner = null;
  }

  // Below the button when it fits, otherwise above; always inside the viewport.
  function placeCard(button) {
    const anchor = button.getBoundingClientRect();
    const box = card.getBoundingClientRect();
    const viewWidth = document.documentElement.clientWidth;
    const viewHeight = document.documentElement.clientHeight;

    let top = anchor.bottom + GAP;
    if (top + box.height > viewHeight - GAP) top = Math.max(GAP, anchor.top - GAP - box.height);
    const centered = anchor.left + anchor.width / 2 - box.width / 2;
    const left = Math.min(Math.max(GAP, centered), viewWidth - box.width - GAP);

    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
  }

  /* Modal */

  const dialog = document.createElement("dialog");
  dialog.className = "term-dialog";
  dialog.setAttribute("aria-labelledby", "term-dialog-title");
  const dialogBody = document.createElement("div");
  dialogBody.className = "term-dialog-body";
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "term-dialog-close";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.textContent = "×";
  dialog.append(dialogBody, closeButton);
  document.body.append(dialog);

  function openModal(button) {
    hideCard();
    renderDefinition(dialogBody, button.dataset.term, "h2").id = "term-dialog-title";
    Reveal.configure({ keyboard: false }); // arrow keys must not move the slides behind the modal
    dialog.showModal();
    closeButton.focus();
  }

  closeButton.addEventListener("click", () => dialog.close());
  // A click on the dialog element itself, rather than its contents, is a click on the backdrop.
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => Reveal.configure({ keyboard: true }));

  /* Wire up every term */

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
    button.setAttribute("aria-haspopup", "dialog");
    button.textContent = "i";
    attachToLastWord(term, button);

    term.addEventListener("mouseenter", () => showCard(button));
    term.addEventListener("mouseleave", hideCard);
    button.addEventListener("focus", () => { if (!dialog.open) showCard(button); });
    button.addEventListener("blur", hideCard);
    button.addEventListener("click", () => openModal(button));
  }

  window.addEventListener("resize", hideCard);
  Reveal.on("slidechanged", hideCard);
})();
