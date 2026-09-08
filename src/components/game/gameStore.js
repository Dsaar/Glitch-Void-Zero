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


			return {
				lives: nextLives,

				phase:
					nextLives === 0
						? "gameover"
						: state.phase,
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