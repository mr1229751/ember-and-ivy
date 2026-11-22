// The Ivy Warden: an honest telegraphed intent cycle with reactive choices.
// The next intent is chosen at the end of the Warden's turn and always shown.
export function intentLabel(intent) {
  if (!intent) return '';
  switch (intent.kind) {
    case 'strike': return `THE WARDEN WILL STRIKE FOR ${intent.amount}`;
    case 'thornstorm': return `THORNSTORM — STRIKE FOR ${intent.amount} AND CHARGE`;
    case 'gather': return 'THE WARDEN GATHERS — ITS NEXT STRIKE GROWS';
    case 'ward': return `THE WARDEN WILL RAISE ${intent.amount} WARD`;
    case 'heal': return `THE WARDEN WILL MEND ITSELF FOR ${intent.amount}`;
    default: return '';
  }
}

export function chooseNextIntent(state) {
  const duel = state.duel;
  state.intentCount += 1;
  const n = state.intentCount;
  // Reactive: heal when badly hurt, charge when the player turtles behind Ward.
  if (state.wardenLife <= state.wardenMaxLife * 0.4 && n % 3 === 0) {
    return { kind: 'heal', amount: 5 };
  }
  if (state.playerWard >= 8 && n % 2 === 0) {
    state.charge += 1;
    return { kind: 'gather', amount: 0 };
  }
  if (n % duel.thornstormEvery === 0) {
    return { kind: 'thornstorm', amount: duel.strikeBase + state.charge + Math.floor(state.round / 2) };
  }
  const cycle = ['strike', 'ward', 'strike', 'gather', 'strike'];
  const kind = cycle[(n - 1) % cycle.length];
  if (kind === 'strike') {
    return { kind, amount: duel.strikeBase + state.charge + Math.floor((state.round - 1) / 2) };
  }
  if (kind === 'ward') return { kind, amount: 5 };
  return { kind, amount: 0 };
}

// Resolve the telegraphed intent against the player's Ward, then pick the next one.
export function resolveWardenTurn(state, fx) {
  const intent = state.intent;
  if (!intent) return;
  if (intent.kind === 'strike' || intent.kind === 'thornstorm') {
    let dmg = intent.amount;
    const absorbed = Math.min(state.playerWard, dmg);
    state.playerWard -= absorbed;
    dmg -= absorbed;
    state.playerLife -= dmg;
    fx.push({ type: 'strike', amount: intent.amount, absorbed, through: dmg });
    state.log = absorbed > 0
      ? `The Warden strikes for ${intent.amount} — your Ward absorbs ${absorbed}, ${dmg} gets through.`
      : `The Warden strikes for ${intent.amount}!`;
    if (intent.kind === 'thornstorm') state.charge += 1;
  } else if (intent.kind === 'gather') {
    state.charge += 2;
    state.log = 'The Warden gathers creeping power. Its next strike grows.';
    fx.push({ type: 'gather' });
  } else if (intent.kind === 'ward') {
    state.wardenWard += intent.amount;
    state.log = `The Warden raises ${intent.amount} Ward behind its leaves.`;
    fx.push({ type: 'ward' });
  } else if (intent.kind === 'heal') {
    const healed = Math.min(intent.amount, state.wardenMaxLife - state.wardenLife);
    state.wardenLife += healed;
    state.log = `The Warden mends itself for ${healed}.`;
    fx.push({ type: 'heal', amount: healed });
  }
  if (state.playerLife <= 0) {
    state.playerLife = 0;
    state.phase = 'lost';
    return;
  }
  state.intent = chooseNextIntent(state);
}
