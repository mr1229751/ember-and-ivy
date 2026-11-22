// EMBER & IVY — card catalogue and the three-duel campaign ladder (data only).
export const SUITS = {
  ember: { name: 'EMBER', color: '#ff7a26', pip: 'flame' },
  ivy: { name: 'IVY', color: '#4ecb5d', pip: 'leaf' },
  thorn: { name: 'THORN', color: '#b06ee8', pip: 'spike' },
  moon: { name: 'MOON', color: '#c9d4e8', pip: 'crescent' },
};

export const CARDS = [
  { id: 'spark', name: 'Spark', suit: 'ember', cost: 1, text: 'Deal 3 damage.', kind: 'damage', amount: 3 },
  { id: 'wildfire', name: 'Wildfire', suit: 'ember', cost: 3, text: 'Deal 5 damage. +2 if an Ember card is in your discard.', kind: 'wildfire', amount: 5 },
  { id: 'kindling', name: 'Kindling', suit: 'ember', cost: 0, text: 'Your next Ember card deals +3 damage.', kind: 'kindling', amount: 3 },
  { id: 'cinder', name: 'Cinder Bolt', suit: 'ember', cost: 2, text: 'Deal 4 damage.', kind: 'damage', amount: 4 },
  { id: 'mend', name: 'Mend', suit: 'ivy', cost: 1, text: 'Restore 4 Life.', kind: 'heal', amount: 4 },
  { id: 'overgrowth', name: 'Overgrowth', suit: 'ivy', cost: 3, text: 'Restore 2 Life per Ivy card in your discard.', kind: 'overgrowth', amount: 2 },
  { id: 'bramble', name: 'Bramble Shield', suit: 'ivy', cost: 1, text: 'Gain 6 Ward.', kind: 'ward', amount: 6 },
  { id: 'thornlash', name: 'Thornlash', suit: 'thorn', cost: 2, text: 'Deal 4 damage and reduce the telegraphed strike by 2.', kind: 'thornlash', amount: 4 },
  { id: 'briarwall', name: 'Briarwall', suit: 'thorn', cost: 2, text: 'Gain 4 Ward and deal 2 damage.', kind: 'briarwall', amount: 2 },
  { id: 'hexvine', name: 'Hexvine', suit: 'thorn', cost: 1, text: "The Warden's next strike is halved.", kind: 'hexvine', amount: 0 },
  { id: 'moonwell', name: 'Moonwell', suit: 'moon', cost: 0, text: 'Draw 2 cards.', kind: 'draw', amount: 2 },
  { id: 'starfall', name: 'Starfall', suit: 'moon', cost: 4, text: 'Deal 7 damage.', kind: 'damage', amount: 7 },
  { id: 'seconddawn', name: 'Second Dawn', suit: 'moon', cost: 2, text: 'Gain 2 Sun this turn.', kind: 'sun', amount: 2 },
  { id: 'moonpetal', name: 'Moonpetal', suit: 'moon', cost: 1, text: 'Gain 3 Ward and draw 1 card.', kind: 'moonpetal', amount: 3 },
];

export const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

// Deck recipe: id -> copies (30 cards total).
export const DECK_RECIPE = {
  spark: 3, wildfire: 2, kindling: 2, cinder: 2,
  mend: 3, overgrowth: 2, bramble: 3,
  thornlash: 3, briarwall: 2, hexvine: 2,
  moonwell: 2, starfall: 2, seconddawn: 1, moonpetal: 1,
};

export const DUELS = [
  { n: 1, name: 'Duel I — The Garden Gate', wardenLife: 20, strikeBase: 5, thornstormEvery: 5 },
  { n: 2, name: 'Duel II — The Deep Hedge', wardenLife: 26, strikeBase: 6, thornstormEvery: 4 },
  { n: 3, name: 'Duel III — The Thicket Crown', wardenLife: 32, strikeBase: 7, thornstormEvery: 3 },
];

export const PLAYER_LIFE = 20;
export const HAND_SIZE = 5;
