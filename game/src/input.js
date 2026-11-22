// Mouse + keyboard input: click a card to play it, keys 1–5 play the nth card,
// Enter ends the turn, M mutes the sound.
export function bindInput(els, handlers) {
  els.hand.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (!cardEl || cardEl.dataset.index === undefined) return;
    handlers.play(Number(cardEl.dataset.index), cardEl);
  });
  els.endTurn.addEventListener('click', () => handlers.endTurn());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { handlers.endTurn(); }
    else if (e.key >= '1' && e.key <= '5') { handlers.play(Number(e.key) - 1, null); }
    else if (e.key === 'm' || e.key === 'M') { handlers.mute(); }
  });
}
