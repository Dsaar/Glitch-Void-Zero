import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
	keys,
} from "./useKeyboard";

import {
	playerState,
	useGameStore,
} from "./gameStore";

import ShipModel from "./ShipModel";


const MOVE_SPEED = 10;

const MIN_X = -12;
const MAX_X = 12;

const MIN_Y = 1.5;
const MAX_Y = 12;


// ------------------------------------------------------
// Flight animation
// ------------------------------------------------------

const MAX_BANK =
	THREE.MathUtils.degToRad(
		24
	);

const MAX_PITCH =
	THREE.MathUtils.degToRad(
		10
	);


// ------------------------------------------------------
// Weapon settings
// ------------------------------------------------------

const FIRE_INTERVAL = 0.18;

const PROJECTILE_START_Z = -2.5;


export default function PlayerShip() {
	const shipRef =
		useRef();

	const fireCooldown =
		useRef(0);


	useFrame((_, delta) => {
		const phase =
			useGameStore
				.getState()
				.phase;


		if (
			phase !== "playing"
		) {
			return;
		}


		// --------------------------------------------------
		// Update weapon cooldown
		// --------------------------------------------------

		fireCooldown.current -=
			delta;


		// --------------------------------------------------
		// Horizontal input
		// --------------------------------------------------

		let horizontal = 0;


		if (
			keys.KeyA ||
			keys.ArrowLeft
		) {
			horizontal -= 1;
		}


		if (
			keys.KeyD ||
			keys.ArrowRight
		) {
			horizontal += 1;
		}


		// --------------------------------------------------
		// Vertical input
		// --------------------------------------------------

		let vertical = 0;


		if (
			keys.KeyW ||
			keys.ArrowUp
		) {
			vertical += 1;
		}


		if (
			keys.KeyS ||
			keys.ArrowDown
		) {
			vertical -= 1;
		}


		// --------------------------------------------------
		// Normalize diagonal movement
		// --------------------------------------------------

		if (
			horizontal !== 0 &&
			vertical !== 0
		) {
			const diagonalFactor =
				Math.SQRT1_2;


			horizontal *=
				diagonalFactor;

			vertical *=
				diagonalFactor;
		}


		// --------------------------------------------------
		// Update player position
		// --------------------------------------------------

		playerState.x +=
			horizontal *
			MOVE_SPEED *
			delta;


		playerState.y +=
			vertical *
			MOVE_SPEED *
			delta;


		// --------------------------------------------------
		// Keep player inside playable area
		// --------------------------------------------------

		playerState.x =
			THREE.MathUtils.clamp(
				playerState.x,
				MIN_X,
				MAX_X
			);


		playerState.y =
			THREE.MathUtils.clamp(
				playerState.y,
				MIN_Y,
				MAX_Y
			);


		// --------------------------------------------------
		// Apply position and flight animation
		// --------------------------------------------------

		if (shipRef.current) {
			shipRef.current.position.x =
				playerState.x;


			shipRef.current.position.y =
				playerState.y;


			// ------------------------------------------------
			// Banking
			// ------------------------------------------------

			const targetBank =
				-horizontal *
				MAX_BANK;


			shipRef.current.rotation.z =
				THREE.MathUtils.damp(
					shipRef.current.rotation.z,
					targetBank,
					6,
					delta
				);


			// ------------------------------------------------
			// Pitch
			// ------------------------------------------------

			const targetPitch =
				-vertical *
				MAX_PITCH;


			shipRef.current.rotation.x =
				THREE.MathUtils.damp(
					shipRef.current.rotation.x,
					targetPitch,
					6,
					delta
				);
		}


		// --------------------------------------------------
		// Fire weapon
		// --------------------------------------------------

		if (
			keys.Space &&
			fireCooldown.current <= 0
		) {
			fireCooldown.current =
				FIRE_INTERVAL;


			useGameStore
				.getState()
				.spawnProjectile({
					x: playerState.x,
					y: playerState.y,
					z: PROJECTILE_START_Z,
				});
		}
	});


	return (
		<group
			ref={shipRef}
			position={[
				playerState.x,
				playerState.y,
				0,
			]}
		>
			<ShipModel />
		</group>
	);
}