import { useEffect, useRef } from "react";
import {
	useFrame,
	useThree,
} from "@react-three/fiber";

import {
	glitchState,
} from "../glitch/glitchState";

import {
	playerState,
	useGameStore,
} from "./gameStore";


// ------------------------------------------------------
// Forward-flight settings
// ------------------------------------------------------

const MENU_SPEED = 12;

const BASE_GAME_SPEED = 34;

const SPEED_RAMP_PER_SECOND = 0.7;

const MAX_SPEED_BONUS = 36;


// ------------------------------------------------------
// Glitch settings
// ------------------------------------------------------

const BASE_GLITCH_INTENSITY = 0.12;

const GLITCH_RAMP_PER_SECOND = 0.004;

const MAX_GLITCH_BONUS = 0.22;

const GAME_OVER_GLITCH_BONUS = 0.45;


export default function FlightRig() {
	const camera =
		useThree(
			(state) =>
				state.camera
		);

	const cameraRef =
		useRef(camera);


	useEffect(() => {
		cameraRef.current =
			camera;
	}, [camera]);


	useFrame((_, delta) => {
		const {
			phase,
			startedAt,
		} =
			useGameStore.getState();


		const now =
			performance.now() /
			1000;


		const elapsed =
			phase === "playing"
				? Math.max(
					0,
					now - startedAt
				)
				: 0;


		// --------------------------------------------------
		// Forward speed
		// --------------------------------------------------

		const speed =
			phase === "playing"
				? BASE_GAME_SPEED +
				Math.min(
					elapsed *
					SPEED_RAMP_PER_SECOND,
					MAX_SPEED_BONUS
				)
				: MENU_SPEED;


		// --------------------------------------------------
		// Drive procedural terrain
		// --------------------------------------------------

		glitchState.smooth +=
			speed * delta;

		glitchState.distance =
			glitchState.smooth;


		// A normalized 0 → 1 value that other systems
		// can use later.
		glitchState.velocity =
			phase === "playing"
				? Math.min(
					(
						speed -
						BASE_GAME_SPEED
					) /
					MAX_SPEED_BONUS,
					1
				)
				: 0;


		// --------------------------------------------------
		// Increase corruption as survival time rises
		// --------------------------------------------------

		glitchState.intensity =
			BASE_GLITCH_INTENSITY +
			Math.min(
				elapsed *
				GLITCH_RAMP_PER_SECOND,
				MAX_GLITCH_BONUS
			) +
			(
				phase === "gameover"
					? GAME_OVER_GLITCH_BONUS
					: 0
			);


		// --------------------------------------------------
		// Chase camera
		// --------------------------------------------------

		const activeCamera =
			cameraRef.current;


		if (!activeCamera) {
			return;
		}


		const cameraEase =
			Math.min(
				delta * 4.5,
				1
			);


		const targetCameraX =
			playerState.x * 0.55;


		const targetCameraY =
			6.5 +
			playerState.y * 0.4;


		activeCamera.position.x +=
			(
				targetCameraX -
				activeCamera.position.x
			) *
			cameraEase;


		activeCamera.position.y +=
			(
				targetCameraY -
				activeCamera.position.y
			) *
			cameraEase;


		activeCamera.position.z =
			16;


		activeCamera.lookAt(
			playerState.x * 0.75,
			playerState.y * 0.6 +
			1.5,
			-60
		);
	});


	return null;
}