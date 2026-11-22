// Builds a fresh duel state for EMBER & IVY.
import { CARD_BY_ID, DECK_RECIPE, DUELS, PLAYER_LIFE, HAND_SIZE } from './config.js';
import { mulberry32, shuffleInPlace } from './random.js';

export function buildDeck(rng) {
  const deck = [];
  for (const [id, copies] of Object.entries(DECK_RECIPE)) {
    for (let i = 0; i < copies; i++) deck.push(id);
  }
  return shuffleInPlace(rng, deck);
}

export function drawCards(state, n) {
  for (let i = 0; i < n; i++) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) return;
      state.deck = shuffleInPlace(state.rng, state.discard.splice(0));
    }
    state.hand.push(state.deck.pop());
  }
}

export function freshDuel(duelIndex, seed, carriedScore) {
  const duel = DUELS[duelIndex];
  const rng = mulberry32(seed);
  const state = {
    rng,
    duelIndex,
    duel,
    round: 1,
    playerLife: PLAYER_LIFE,
    playerMaxLife: PLAYER_LIFE,
    wardenLife: duel.wardenLife,
    wardenMaxLife: duel.wardenLife,
    playerWard: 0,
    wardenWard: 0,
    sun: 3,
    sunMax: 3,
    deck: [],
    hand: [],
    discard: [],
    kindling: 0,
    intent: null,
    intentCount: 0,
    charge: 0,
    lastPlayed: null,
    log: 'The Ivy Warden stirs. Read its intent, then answer.',
    score: carriedScore || 0,
    damageDealt: 0,
    phase: 'player', // player | won | lost
    turnBanner: '',
  };
  state.deck = buildDeck(rng);
  drawCards(state, HAND_SIZE);
  return state;
}

export function countInDiscard(state, suit) {
  return state.discard.filter((id) => CARD_BY_ID[id].suit === suit).length;
}
