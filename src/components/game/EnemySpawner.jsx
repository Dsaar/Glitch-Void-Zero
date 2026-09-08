import {
	useRef,
} from "react";

import {
	useFrame,
} from "@react-three/fiber";

import {
	genId,
	useGameStore,
} from "./gameStore";


const SPAWN_Z = -190;

const MIN_X = -11;
const MAX_X = 11;

const MIN_Y = 2.5;
const MAX_Y = 10.5;


// ------------------------------------------------------
// Deterministic random generator
// ------------------------------------------------------

function nextRandom(
	randomState
) {
	randomState.current =
		(
			(
				1664525 *
				randomState.current
			) +
			1013904223
		) >>> 0;


	return (
		randomState.current /
		4294967296
	);
}


function randomRange(
	randomState,
	min,
	max
) {
	return (
		min +
		nextRandom(
			randomState
		) *
		(
			max -
			min
		)
	);
}


export default function EnemySpawner() {
	const timer =
		useRef(0);

	const randomState =
		useRef(
			123456789
		);

	const currentRun =
		useRef(0);


	useFrame(
		(
			_,
			delta
		) => {
			const {
				phase,
				startedAt,
				spawnEnemy,
			} =
				useGameStore.getState();


			if (
				phase !==
				"playing"
			) {
				timer.current = 0;

				return;
			}


			// ------------------------------------------------
			// Give every new run a different random sequence
			// ------------------------------------------------

			if (
				currentRun.current !==
				startedAt
			) {
				currentRun.current =
					startedAt;


				randomState.current =
					Math.max(
						1,

						(
							Math.floor(
								startedAt *
								1000000
							) >>> 0
						)
					);
			}


			const elapsed =
				Math.max(
					0,

					(
						performance.now() /
						1000
					) -
					startedAt
				);


			// ------------------------------------------------
			// Difficulty ramp
			// ------------------------------------------------

			const interval =
				Math.max(
					1.5 -
					elapsed *
					0.022,

					0.35
				);


			const speed =
				Math.min(
					28 +
					elapsed *
					0.9,

					72
				);


			timer.current +=
				delta;


			if (
				timer.current <
				interval
			) {
				return;
			}


			timer.current = 0;


			const seed =
				nextRandom(
					randomState
				);


			spawnEnemy({
				id: genId(),

				position: {
					x:
						randomRange(
							randomState,
							MIN_X,
							MAX_X
						),

					y:
						randomRange(
							randomState,
							MIN_Y,
							MAX_Y
						),

					z:
						SPAWN_Z,
				},

				speed,

				seed,
			});
		}
	);


	return null;
}