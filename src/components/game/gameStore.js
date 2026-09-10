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

export const invulnState = {
	until: 0,
};


// ------------------------------------------------------
// Mutable power-up state
// ------------------------------------------------------

export const powerUpState = {
	rapidFireUntil: 0,

	speedUntil: 0,

	shieldActive: false,

	lastCollectedType: null,

	lastCollectedAt: 0,
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

	powerUps: [],


	// ----------------------------------------------------
	// Game state
	// ----------------------------------------------------

	startGame: () => {
		playerState.x = 0;
		playerState.y = 5;


		invulnState.until = 0;


		powerUpState.rapidFireUntil = 0;

		powerUpState.speedUntil = 0;

		powerUpState.shieldActive = false;

		powerUpState.lastCollectedType = null;

		powerUpState.lastCollectedAt = 0;


		set({
			phase: "playing",

			score: 0,

			lives: 3,

			startedAt:
				performance.now() / 1000,

			projectiles: [],

			enemies: [],

			explosions: [],

			powerUps: [],
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


	// ----------------------------------------------------
	// Power-ups
	// ----------------------------------------------------

	spawnPowerUp: (
		powerUp
	) => {
		set((state) => ({
			powerUps: [
				...state.powerUps,

				powerUp,
			],
		}));
	},


	removePowerUp: (
		id
	) => {
		set((state) => ({
			powerUps:
				state.powerUps.filter(
					(powerUp) =>
						powerUp.id !== id
				),
		}));
	},


	activatePowerUp: (
		type
	) => {
		const now =
			performance.now() /
			1000;

		powerUpState.lastCollectedType =
			type;

		powerUpState.lastCollectedAt =
			now;


		if (
			type === "rapid"
		) {
			powerUpState.rapidFireUntil =
				now + 10;
		}


		if (
			type === "speed"
		) {
			powerUpState.speedUntil =
				now + 10;
		}


		if (
			type === "shield"
		) {
			powerUpState.shieldActive =
				true;
		}
	},
}));