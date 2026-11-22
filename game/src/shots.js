// Deterministic staged states for screenshots: ?shot=title|duel|victory|defeat.
// Each builds the exact scene with animations settled — real renders of the game's own code.
import { freshDuel } from './state.js';

export function stagedScene(shot) {
  if (shot === 'title') {
    return { screen: 'title', fan: ['kindling', 'spark', 'bramble', 'starfall', 'moonwell'] };
  }
  const state = freshDuel(0, 7, 0);
  state.hand = ['spark', 'bramble', 'thornlash', 'starfall', 'moonwell'];
  state.intent = { kind: 'strike', amount: 8 };
  if (shot === 'duel') {
    state.playerLife = 16;
    state.wardenLife = 13;
    state.playerWard = 6;
    state.sun = 3;
    state.lastPlayed = 'briarwall';
    state.discard = ['briarwall', 'mend'];
    state.score = 12;
    state.log = 'Briarwall raises 4 Ward and pricks the Warden for 2. The strike is coming — answer it.';
    return { screen: 'table', state };
  }
  if (shot === 'victory') {
    state.wardenLife = 0;
    state.phase = 'won';
    state.score = 47;
    state.damageDealt = 21;
    state.log = 'Starfall splits the canopy — the Warden falls!';
    return { screen: 'victory', state };
  }
  if (shot === 'defeat') {
    state.playerLife = 0;
    state.phase = 'lost';
    state.score = 23;
    state.log = 'The ivy closes over the table. The garden keeps its keeper… this time.';
    return { screen: 'defeat', state };
  }
  return null;
}
