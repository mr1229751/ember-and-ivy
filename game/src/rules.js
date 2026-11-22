// Playing a card: costs, combo families, damage, ward, healing, win/lose checks.
import { CARD_BY_ID } from './config.js';
import { countInDiscard, drawCards } from './state.js';

export function canPlay(state, handIndex) {
  const id = state.hand[handIndex];
  if (!id || state.phase !== 'player') return false;
  return CARD_BY_ID[id].cost <= state.sun;
}

function dealDamage(state, amount, fx) {
  let dmg = amount;
  const absorbed = Math.min(state.wardenWard, dmg);
  state.wardenWard -= absorbed;
  dmg -= absorbed;
  state.wardenLife -= dmg;
  state.damageDealt += dmg;
  state.score += dmg;
  fx.push({ type: 'damage', amount, absorbed, through: dmg });
  return dmg;
}

export function playCard(state, handIndex) {
  const fx = [];
  if (!canPlay(state, handIndex)) return fx;
  const id = state.hand[handIndex];
  const card = CARD_BY_ID[id];
  state.sun -= card.cost;
  state.hand.splice(handIndex, 1);
  state.lastPlayed = id;

  switch (card.kind) {
    case 'damage': {
      let amt = card.amount;
      if (card.suit === 'ember' && state.kindling > 0) { amt += state.kindling; state.kindling = 0; }
      const through = dealDamage(state, amt, fx);
      state.log = `${card.name} hits the Warden for ${through}.`;
      break;
    }
    case 'wildfire': {
      let amt = card.amount + (countInDiscard(state, 'ember') > 0 ? 2 : 0);
      if (state.kindling > 0) { amt += state.kindling; state.kindling = 0; }
      const through = dealDamage(state, amt, fx);
      state.log = `Wildfire roars for ${through}${countInDiscard(state, 'ember') > 0 ? ' — fed by embers in your discard' : ''}.`;
      break;
    }
    case 'kindling':
      state.kindling += card.amount;
      state.log = 'Kindling catches. Your next Ember card deals +3.';
      fx.push({ type: 'buff' });
      break;
    case 'heal': {
      const healed = Math.min(card.amount, state.playerMaxLife - state.playerLife);
      state.playerLife += healed;
      state.log = `Mend restores ${healed} Life.`;
      fx.push({ type: 'heal', amount: healed });
      break;
    }
    case 'overgrowth': {
      const per = card.amount;
      const healed = Math.min(per * countInDiscard(state, 'ivy'), state.playerMaxLife - state.playerLife);
      state.playerLife += healed;
      state.log = `Overgrowth restores ${healed} Life from the ivy in your discard.`;
      fx.push({ type: 'heal', amount: healed });
      break;
    }
    case 'ward':
      state.playerWard += card.amount;
      state.log = `Bramble Shield raises ${card.amount} Ward.`;
      fx.push({ type: 'ward' });
      break;
    case 'thornlash': {
      const through = dealDamage(state, card.amount, fx);
      if (state.intent && (state.intent.kind === 'strike' || state.intent.kind === 'thornstorm')) {
        state.intent.amount = Math.max(0, state.intent.amount - 2);
        state.log = `Thornlash deals ${through} and cuts the telegraphed strike down to ${state.intent.amount}.`;
      } else {
        state.log = `Thornlash deals ${through}.`;
      }
      break;
    }
    case 'briarwall': {
      state.playerWard += 4;
      const through = dealDamage(state, card.amount, fx);
      state.log = `Briarwall raises 4 Ward and pricks the Warden for ${through}.`;
      fx.push({ type: 'ward' });
      break;
    }
    case 'hexvine':
      if (state.intent && (state.intent.kind === 'strike' || state.intent.kind === 'thornstorm')) {
        state.intent.amount = Math.floor(state.intent.amount / 2);
        state.log = `Hexvine halves the Warden's next strike to ${state.intent.amount}.`;
      } else {
        state.log = 'Hexvine curls around the Warden, but no strike is telegraphed.';
      }
      fx.push({ type: 'hex' });
      break;
    case 'draw':
      drawCards(state, card.amount);
      state.log = `Moonwell draws ${card.amount} cards.`;
      fx.push({ type: 'draw' });
      break;
    case 'sun':
      state.sun += card.amount;
      state.log = `Second Dawn grants ${card.amount} Sun.`;
      fx.push({ type: 'buff' });
      break;
    case 'moonpetal':
      state.playerWard += card.amount;
      drawCards(state, 1);
      state.log = `Moonpetal raises ${card.amount} Ward and draws a card.`;
      fx.push({ type: 'ward' });
      break;
    default:
      break;
  }

  state.discard.push(id);
  if (state.wardenLife <= 0) {
    state.wardenLife = 0;
    state.phase = 'won';
    state.score += state.playerLife + 10 * state.duel.n; // Life kept + duel bonus
  }
  return fx;
}

// End the player's turn: Warden acts on its telegraph, then a new round begins.
export function endTurn(state, resolveWardenTurn) {
  const fx = [];
  if (state.phase !== 'player') return fx;
  // Unplayed cards stay in hand; the Warden strikes.
  resolveWardenTurn(state, fx);
  if (state.phase === 'lost') return fx;
  state.round += 1;
  state.sunMax = Math.min(5, 3 + Math.floor((state.round - 1) / 2));
  state.sun = state.sunMax;
  while (state.hand.length < 5) {
    const before = state.hand.length;
    drawCards(state, 1);
    if (state.hand.length === before) break;
  }
  return fx;
}
