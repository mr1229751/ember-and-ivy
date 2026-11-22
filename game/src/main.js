// EMBER & IVY — boot, screen flow, campaign progression and restart.
import { freshDuel } from './state.js';
import { playCard, endTurn } from './rules.js';
import { chooseNextIntent, resolveWardenTurn } from './warden.js';
import { render, renderFan } from './render.js';
import { bindInput } from './input.js';
import { shake, flash, emberBurst } from './animate.js';
import { sfx, toggleMute, isMuted } from './sound.js';
import { stagedScene } from './shots.js';

const $ = (id) => document.getElementById(id);
const els = {
  hand: $('hand'), endTurn: $('btn-end-turn'),
  wardenLife: $('warden-life'), wardenWard: $('warden-ward'), wardenHand: $('warden-hand'),
  wardenCrest: $('warden-crest'), intentBanner: $('intent-banner'),
  centreCard: $('centre-card'), logLine: $('log-line'), duelName: $('duel-name'), scoreLine: $('score-line'),
  playerLife: $('player-life'), playerWard: $('player-ward'), sunPips: $('sun-pips'), piles: $('piles'),
  playerCrest: $('player-crest'), titleFan: $('title-fan'), table: $('screen-table'),
};
const screens = { title: $('screen-title'), table: $('screen-table'), victory: $('screen-victory'), defeat: $('screen-defeat') };

let state = null;
let campaignScore = 0;
let best = Number(localStorage.getItem('ember-ivy-best') || 0);

function showScreen(name) {
  for (const [k, el] of Object.entries(screens)) el.style.display = k === name ? 'flex' : 'none';
}
function saveBest() {
  if (campaignScore > best) { best = campaignScore; localStorage.setItem('ember-ivy-best', String(best)); }
  $('best-line').textContent = best > 0 ? `Best Embers: ${best}` : 'Best Embers: —';
}

function startDuel(duelIndex, carried) {
  state = freshDuel(duelIndex, 1000 + duelIndex * 77 + Date.now() % 997, carried);
  state.intent = chooseNextIntent(state);
  campaignScore = carried;
  showScreen('table');
  render(state, els);
  sfx.deal();
}

function afterAction(fx) {
  render(state, els);
  for (const f of fx) {
    if (f.type === 'damage') { shake(els.wardenCrest); flash(els.wardenCrest, 'hit-flash'); }
    if (f.type === 'strike') { shake(els.playerCrest); flash(els.playerCrest, 'hit-flash'); }
  }
  if (state.phase === 'won') {
    campaignScore = state.score;
    saveBest();
    sfx.win();
    $('victory-text').textContent = state.duelIndex >= 2
      ? `Campaign complete! The Thicket Crown is yours. Embers banked: ${state.score}`
      : `${state.duel.name} won · Embers banked: ${state.score}`;
    $('btn-next-duel').textContent = state.duelIndex >= 2 ? 'PLAY AGAIN' : 'NEXT DUEL';
    showScreen('victory');
    emberBurst(screens.victory, 30);
  } else if (state.phase === 'lost') {
    campaignScore = state.score;
    saveBest();
    sfx.lose();
    $('defeat-text').textContent = `Campaign score: ${campaignScore} Embers banked before the ivy took you.`;
    showScreen('defeat');
  }
}

const handlers = {
  play(i) {
    if (!state || state.phase !== 'player') return;
    const fx = playCard(state, i);
    if (fx.length || state.phase !== 'player') { sfx.play(); afterAction(fx); }
    else render(state, els);
  },
  endTurn() {
    if (!state || state.phase !== 'player') return;
    const fx = endTurn(state, resolveWardenTurn);
    if (fx.some((f) => f.type === 'strike')) sfx.strike();
    afterAction(fx);
  },
  mute() {
    toggleMute();
    $('btn-mute').textContent = isMuted() ? 'SOUND: OFF (M)' : 'SOUND: ON (M)';
  },
};

bindInput(els, handlers);
$('btn-mute').addEventListener('click', handlers.mute);
$('btn-begin').addEventListener('click', () => startDuel(0, 0));
$('btn-next-duel').addEventListener('click', () => {
  if (state && state.duelIndex >= 2) startDuel(0, 0);
  else startDuel((state ? state.duelIndex : 0) + 1, campaignScore);
});
$('btn-retry').addEventListener('click', () => startDuel(0, 0));
$('btn-title').addEventListener('click', () => { showScreen('title'); saveBest(); });

// Boot: staged screenshot scene, or the live title screen.
const shot = new URLSearchParams(location.search).get('shot');
const scene = shot ? stagedScene(shot) : null;
if (scene) {
  document.body.classList.add('shot-mode');
  if (scene.screen === 'title') {
    renderFan(els, scene.fan);
    showScreen('title');
  } else {
    state = scene.state;
    campaignScore = state.score;
    showScreen(scene.screen === 'table' ? 'table' : scene.screen);
    render(state, els);
    if (scene.screen === 'victory') {
      $('victory-text').textContent = `Duel I won · Embers banked: ${state.score}`;
      $('btn-next-duel').textContent = 'NEXT DUEL';
      emberBurst(screens.victory, 0); // settled burst marks are drawn by CSS in shot mode
      screens.victory.classList.add('burst-settled');
    }
    if (scene.screen === 'defeat') {
      $('defeat-text').textContent = `Campaign score: ${state.score} Embers banked before the ivy took you.`;
    }
  }
  saveBest();
} else {
  renderFan(els, ['kindling', 'spark', 'bramble', 'starfall', 'moonwell']);
  showScreen('title');
  saveBest();
}
