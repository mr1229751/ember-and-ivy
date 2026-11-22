// Draws EMBER & IVY state into the DOM: rows, bars, pips, hand and the intent banner.
import { CARD_BY_ID, SUITS } from './config.js';
import { intentLabel } from './warden.js';

export function pipHTML(suit) {
  return `<span class="pip pip-${SUITS[suit].pip}" aria-hidden="true"></span>`;
}

export function cardHTML(id, opts = {}) {
  const c = CARD_BY_ID[id];
  const suit = SUITS[c.suit];
  const cls = ['card', `suit-${c.suit}`];
  if (opts.unaffordable) cls.push('unaffordable');
  if (opts.fan !== undefined) cls.push('fan-card');
  const style = opts.fan !== undefined ? `style="--fan:${opts.fan}"` : '';
  return `<div class="${cls.join(' ')}" ${style} data-card-id="${id}">
    <div class="card-top"><span class="card-cost">${c.cost}</span>${pipHTML(c.suit)}<span class="card-suit">${suit.name}</span></div>
    <div class="card-name">${c.name}</div>
    <div class="card-art art-${c.suit}">${pipHTML(c.suit)}</div>
    <div class="card-text">${c.text}</div>
  </div>`;
}

function barHTML(fillId, pct, text) {
  return `<div class="bar"><div class="bar-fill" id="${fillId}" style="width:${pct}%"></div><span class="bar-text">${text}</span></div>`;
}

export function render(state, els) {
  // Warden row
  els.wardenLife.innerHTML = barHTML('warden-life-fill', (state.wardenLife / state.wardenMaxLife) * 100,
    `WARDEN LIFE ${state.wardenLife} / ${state.wardenMaxLife}`);
  els.wardenWard.textContent = state.wardenWard > 0 ? `Ward ${state.wardenWard}` : 'Ward —';
  els.wardenHand.textContent = `Face-down hand: ${Math.max(3, 7 - state.round)} cards`;
  els.intentBanner.textContent = state.phase === 'player' ? intentLabel(state.intent) : '';
  const danger = state.intent && (state.intent.kind === 'strike' || state.intent.kind === 'thornstorm') && state.intent.amount >= 8;
  els.intentBanner.classList.toggle('intent-danger', Boolean(danger));
  els.intentBanner.style.display = state.phase === 'player' && state.intent ? 'block' : 'none';
  els.wardenCrest.classList.toggle('crest-dead', state.wardenLife <= 0);

  // Centre
  els.centreCard.innerHTML = state.lastPlayed
    ? `<div class="centre-label">LAST PLAYED</div>` + cardHTML(state.lastPlayed)
    : `<div class="centre-empty">The felt is clear.<br>Play a card to answer the Warden.</div>`;
  els.logLine.textContent = state.log;
  els.duelName.textContent = `${state.duel.name} · Round ${state.round}`;
  els.scoreLine.textContent = `Embers banked: ${state.score}`;

  // Player row
  els.playerLife.innerHTML = barHTML('player-life-fill', (state.playerLife / state.playerMaxLife) * 100,
    `YOUR LIFE ${state.playerLife} / ${state.playerMaxLife}`);
  els.playerWard.textContent = state.playerWard > 0 ? `Ward ${state.playerWard}` : 'Ward —';
  els.sunPips.innerHTML = Array.from({ length: state.sunMax }, (_, i) =>
    `<span class="sun-pip${i < state.sun ? ' lit' : ''}"></span>`).join('') + `<span class="sun-text">${state.sun} Sun</span>`;
  els.piles.textContent = `Deck ${state.deck.length} · Discard ${state.discard.length}${state.kindling ? ` · Kindling +${state.kindling}` : ''}`;
  els.hand.innerHTML = state.hand.map((id, i) =>
    cardHTML(id, { unaffordable: CARD_BY_ID[id].cost > state.sun })).join('');
  [...els.hand.children].forEach((el, i) => { el.dataset.index = String(i); });
}

export function renderFan(els, ids) {
  els.titleFan.innerHTML = ids.map((id, i) => cardHTML(id, { fan: i - 2 })).join('');
}
