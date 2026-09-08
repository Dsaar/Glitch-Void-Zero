import { create } from "zustand";


let nextId = 1;


export const genId = () => {
	const id = nextId;

	nextId += 1;

	return id;
};


// ------------------------------------------------------
// Mutable player position
// ------------------------------------------------------

export const playerState = {
	x: 0,
	y: 5,
};


// ------------------------------------------------------
// Mutable invulnerability state
// ------------------------------------------------------
//
// Stored as an absolute performance.now() timestamp.
//
// Example:
//
// invulnState.until = 120.5
//
// means the player remains invulnerable until
// performance.now() / 1000 reaches 120.5.
// ------------------------------------------------------

export const invulnState = {
	until: 0,
};


const INVULNERABILITY_DURATION = 2;


// ------------------------------------------------------
// Main game store
// ------------------------------------------------------

export const useGameStore = create((set) => ({
	phase: "menu",

	score: 0,

	lives: 3,

	startedAt: 0,

	projectiles: [],

	enemies: [],

	explosions: [],


	// ----------------------------------------------------
	// Game state
	// ----------------------------------------------------

	startGame: () => {
		playerState.x = 0;
		playerState.y = 5;

		invulnState.until = 0;


		set({
			phase: "playing",

			score: 0,

			lives: 3,

			startedAt:
				performance.now() / 1000,

			projectiles: [],

			enemies: [],

			explosions: [],
		});
	},


	endGame: () => {
		set({
			phase: "gameover",
		});
	},


	// ----------------------------------------------------
	// Score
	// ----------------------------------------------------

	addScore: (amount) => {
		set((state) => ({
			score:
				state.score +
				amount,
		}));
	},


	// ----------------------------------------------------
	// Lives
	// ----------------------------------------------------

	loseLife: () => {
		set((state) => {
			const nextLives =
				Math.max(
					state.lives - 1,
					0
				);


			// ----------------------------------------------
			// No lives left
			// ----------------------------------------------

			if (
				nextLives === 0
			) {
				invulnState.until = 0;


				return {
					lives: 0,

					phase:
						"gameover",
				};
			}


			// ----------------------------------------------
			// Survived the hit
			// ----------------------------------------------

			invulnState.until =
				performance.now() /
				1000 +
				INVULNERABILITY_DURATION;


			return {
				lives:
					nextLives,
			};
		});
	},


	// ----------------------------------------------------
	// Projectiles
	// ----------------------------------------------------

	spawnProjectile: (
		position
	) => {
		set((state) => ({
			projectiles: [
				...state.projectiles,

				{
					id: genId(),

					position,
				},
			],
		}));
	},


	removeProjectile: (
		id
	) => {
		set((state) => ({
			projectiles:
				state.projectiles.filter(
					(projectile) =>
						projectile.id !== id
				),
		}));
	},


	// ----------------------------------------------------
	// Enemies
	// ----------------------------------------------------

	spawnEnemy: (
		enemy
	) => {
		set((state) => ({
			enemies: [
				...state.enemies,
				enemy,
			],
		}));
	},


	removeEnemy: (
		id
	) => {
		set((state) => ({
			enemies:
				state.enemies.filter(
					(enemy) =>
						enemy.id !== id
				),
		}));
	},


	// ----------------------------------------------------
	// Explosions
	// ----------------------------------------------------

	addExplosion: (
		position
	) => {
		set((state) => ({
			explosions: [
				...state.explosions,

				{
					id: genId(),

					position,
				},
			],
		}));
	},


	removeExplosion: (
		id
	) => {
		set((state) => ({
			explosions:
				state.explosions.filter(
					(explosion) =>
						explosion.id !== id
				),
		}));
	},
}));