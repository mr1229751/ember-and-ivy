[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/mr1229751/ember-and-ivy/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/mr1229751/ember-and-ivy/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

# EMBER & IVY

An original card duel against the Ivy Warden, an ancient garden spirit, played across a green felt table.

You are the Ember Keeper. Both duelists start at 20 Life with a ~30-card deck. Each turn you gain Sun (energy), draw up to 5 cards, and play any cards you can afford. The twist: **the Warden's next move is always telegraphed** in an amber banner before your turn — "THE WARDEN WILL STRIKE FOR 8" — and your hand is the answer to that sentence. Block it with Ward, cut it down with Thornlash, halve it with Hexvine, out-heal it with Ivy, or simply race it with Ember and Moon.

**14 unique cards in four suits**, told apart by colour and pip shape: EMBER (flame — Spark, Wildfire, Kindling, Cinder Bolt), IVY (leaf — Mend, Overgrowth, Bramble Shield), THORN (spike — Thornlash, Briarwall, Hexvine) and MOON (crescent — Moonwell, Starfall, Second Dawn, Moonpetal). Combo families: Kindling chains into your next Ember card, Wildfire and Overgrowth scale with your discard pile, and Thorn cards edit the telegraphed intent itself.

**Campaign:** win a duel to face Duel II (a tougher Warden), then Duel III — The Thicket Crown. Your score is Embers banked (damage dealt + Life kept + duel bonuses), shown on every screen, with your best score kept on the title screen. CSS-transform animation, original WebAudio tones (M to mute), seeded deterministic play, and staged `?shot=title|duel|victory|defeat` screenshot states.

Controls: click a card to play it · keys 1–5 play the nth card · Enter ends your turn · M mutes.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests — plain static files under `game/`.

To produce the make.fun hand-in output locally:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
