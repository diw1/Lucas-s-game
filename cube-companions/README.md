# Cube Companions

A separate creature adventure in Lucas's Game Hub. All assets and rendering are local; no account, CDN, or external publishing is required.

With dependencies installed and Node 22.13+ on PATH, run `npm run dev` from the project root and open `/games/cube-companions/` on the local address. `npm run build` includes the game via `build/copy-games.mjs`. Dependencies and the pnpm lockfile are unchanged.

## Play

- Choose any of the seven starting companions.
- WASD, arrow keys, or the on-screen arrows move in straight screen directions. When multiple directions are held, the most recently pressed direction wins; movement never combines into a diagonal.
- Touch a wild creature to enter battle automatically. No E press is required for encounters.
- Weaken a wild creature, then throw a capture cube. Capture is guaranteed at 35% HP or less. Gentle Bump deals 8 damage.
- Click companion cards to change your leader. Switching in battle uses a turn.
- Rest near camp (E or the action button), or use Return to camp when exploring, for full healing and at least five cubes.
- Catch a companion, then touch Ranger Fern north of camp. Fern uses five opponents, one at a time: Embercub, Bubblit, Brawbun, Glimsy, and Ferrit.
- Between boss rounds, your team is healed and the two Guard & Recover uses are refilled. Defeat all five to earn the Grove Badge.
- Boss victories unlock the next ranked challenger at the same arena north of camp, preserving the party and XP. Five named bosses rotate with new team compositions; difficulty grows through rank 9 and then stays capped. Progress is automatically saved in this browser.
- Choose any of the seven species as a starter. Successful captures (including duplicates released back into the grove) grant the lead 40 XP; knockouts grant 20 XP and boss victories grant every companion another 40 XP.
- Evolution is manual: tap Evolve at 80 XP for Super form, then spend 160 more XP for Royal form. Each form adds 18 maximum HP and 5 skill power, heals the companion, and adds visual armor/crown details.
- Open Types in the grove or Type matchups during battle for the full chart and current matchup. Strong hits have a larger burst and stronger recoil; resisted hits have a small diamond burst and gentle recoil. Labels and battle text give the exact multiplier.

Seven collectible types are available: leaf, fire, water, stone, fighting, fairy, and steel. Type advantages are shown during battle. Attacks include a lunge, an impact burst, and a reaction before damage; guard and capture also animate. Inputs are locked during each turn. Reduced-motion preferences shorten the effects.

The grove generates continuously as you move, with a following camera and new creatures beyond the starting area. Distant chunks are discarded to keep memory bounded and regenerate when revisited. The team, XP, boss rank, collection, quests, opened chests and position persist in localStorage. Reloading leaves combat and returns to exploration; the current encounter restarts. Retreat provides a cooldown and requires separation before that encounter can trigger again. Losing heals the team at camp without losing the collection.

## Implementation and checks

- `render.js`: shaded, depth-sorted 3D cuboids, rotating creature poses, running feet, and visible human/creature eyes.
- `world.js`: deterministic terrain and encounters, stable nearby state, bounded chunk caching.
- `rules.js`: combat, capture, five-round boss progression, contact gates, and cardinal movement.
- `effects.js`: awaited attack, guard, capture, and switch animations.
- `game.js`: UI, input, encounter and combat flow. `inspectGame()` returns a read-only copy for canvas gameplay checks.

Run `node --test build/cube-companions.test.mjs` from the project root for nineteen checks covering elemental damage, capture, starter balance, five-round boss progression, manual evolution, ranked bosses, all type pairs, contact cooldowns, straight movement, endless terrain, new types, and world reset.

Browser checks and screenshots are kept in the ignored `output/playwright/` folder. The game retains the existing hub and other games. Block breaking/building remains outside this prototype. Saves stay on the same browser and origin, without account sync.

## Exploration update

- Map: walk or travel between Home Grove, Ember Volcano, Crystal Lake, Iron Mountains and Starlight Forest. Region terrain, scenery and spawn pools differ.
- Journal: seven-species collection, discovered/caught state, evolution history and rare collection. Wild rare gold/violet variants are deterministic, about one in twenty spawns, and can coexist with a normal companion of the same species.
- Five one-time treasure chests: approach, then use E or the visible Open treasure button. Each grants 3 cubes and 20 XP to every companion.
- Five quests: three captures, five regions, an evolution, an effective finishing attack and three chests. Claim each reward once in Journal for 3 cubes and 40 team XP.
- Boss intent is displayed before every turn: charge, powerful strike, then a quick attack, shield or heal depending on the challenger.
- Evolved companions unlock a type-specific burst, healing/drain or shield skill; Super gets two uses and Royal three per encounter/round.
- Controls → New adventure offers a confirmation before replacing the saved adventure.

New modules: save.js validates and persists versioned saves; adventure.js defines regions, chests and quest rewards; combat.js resolves boss intentions and evolution skills.
