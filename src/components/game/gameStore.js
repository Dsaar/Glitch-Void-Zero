import { create } from "zustand";


// ------------------------------------------------------
// Mutable player position
// ------------------------------------------------------
//
// The Three.js render loop will read/write this directly.
//
// We deliberately do NOT put constantly changing X/Y
// coordinates into React state because that would cause
// React to re-render dozens of times per second.
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


	startGame: () => {
		playerState.x = 0;
		playerState.y = 5;

		set({
			phase: "playing",
			score: 0,
			lives: 3,
			startedAt:
				performance.now() / 1000,
		});
	},


	endGame: () => {
		set({
			phase: "gameover",
		});
	},


	addScore: (amount) => {
		set((state) => ({
			score:
				state.score +
				amount,
		}));
	},


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
}));