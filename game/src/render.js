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

export function cardBackHTML(fan) {
  return `<div class="card-back" style="--fan:${fan}" aria-hidden="true"><span class="back-frame"><span class="back-crest">I</span></span></div>`;
}

function barHTML(fillId, pct, text) {
  return `<div class="bar"><div class="bar-fill" id="${fillId}" style="width:${pct}%"></div><span class="bar-text">${text}</span></div>`;
}

export function render(state, els) {
  // Warden row
  els.wardenLife.innerHTML = barHTML('warden-life-fill', (state.wardenLife / state.wardenMaxLife) * 100,
    `WARDEN LIFE ${state.wardenLife} / ${state.wardenMaxLife}`);
  els.wardenWard.textContent = `Ward ${state.wardenWard}`;
  const wardenCount = Math.max(3, 7 - state.round);
  const mid = (wardenCount - 1) / 2;
  els.wardenHand.innerHTML = `<span class="warden-backs">${Array.from({ length: wardenCount }, (_, i) => cardBackHTML(i - mid)).join('')}</span><span class="hand-caption">Warden's hand: ${wardenCount} cards</span>`;
  els.intentBanner.textContent = state.phase === 'player' ? intentLabel(state.intent) : '';
  const danger = state.intent && (state.intent.kind === 'strike' || state.intent.kind === 'thornstorm') && state.intent.amount >= 8;
  els.intentBanner.classList.toggle('intent-danger', Boolean(danger));
  els.intentBanner.style.display = state.phase === 'player' && state.intent ? 'block' : 'none';
  els.wardenCrest.classList.toggle('crest-dead', state.wardenLife <= 0);

  // Centre: last played card flanked by live deck / discard mini-stacks.
  const topDiscard = state.discard[state.discard.length - 1];
  const discardFace = topDiscard
    ? `<div class="mini-card suit-${CARD_BY_ID[topDiscard].suit}"><div class="mini-top"><span class="card-cost mini-cost">${CARD_BY_ID[topDiscard].cost}</span>${pipHTML(CARD_BY_ID[topDiscard].suit)}</div><div class="mini-name">${CARD_BY_ID[topDiscard].name}</div></div>`
    : `<div class="mini-card mini-empty">Discard<br>empty</div>`;
  const pilesHTML = `<div class="centre-piles">
      <div class="pile"><div class="card-back pile-back"><span class="back-frame"><span class="back-crest">I</span></span><span class="pile-count">${state.deck.length}</span></div><div class="pile-label">DECK</div></div>
      <div class="pile"><div class="pile-face">${discardFace}<span class="pile-count">${state.discard.length}</span></div><div class="pile-label">DISCARD</div></div>
    </div>`;
  const lastHTML = state.lastPlayed
    ? `<div class="centre-label">LAST PLAYED</div>` + cardHTML(state.lastPlayed)
    : `<div class="centre-empty">The felt is clear.<br>Play a card to answer the Warden.</div>`;
  els.centreCard.innerHTML = `<div class="centre-row"><div class="centre-last">${lastHTML}</div>${pilesHTML}</div>`;
  els.logLine.textContent = state.log;
  els.duelName.textContent = `${state.duel.name} · Round ${state.round}`;
  els.scoreLine.textContent = `Embers banked: ${state.score}`;

  // Player row
  els.playerLife.innerHTML = barHTML('player-life-fill', (state.playerLife / state.playerMaxLife) * 100,
    `YOUR LIFE ${state.playerLife} / ${state.playerMaxLife}`);
  els.playerWard.textContent = `Ward ${state.playerWard}`;
  els.sunPips.innerHTML = Array.from({ length: state.sunMax }, (_, i) =>
    `<span class="sun-pip${i < state.sun ? ' lit' : ''}"></span>`).join('') + `<span class="sun-text">${state.sun} Sun</span>`;
  els.piles.textContent = state.kindling ? `Kindling +${state.kindling}` : '';
  els.hand.innerHTML = state.hand.map((id, i) =>
    cardHTML(id, { unaffordable: CARD_BY_ID[id].cost > state.sun })).join('');
  [...els.hand.children].forEach((el, i) => { el.dataset.index = String(i); });
}

export function renderFan(els, ids) {
  els.titleFan.innerHTML = ids.map((id, i) => cardHTML(id, { fan: i - 2 })).join('');
}
