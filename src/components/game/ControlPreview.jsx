import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import {
	keys,
} from "./useKeyboard";

import {
	playerState,
	useGameStore,
} from "./gameStore";


const MOVE_SPEED = 10;

const MIN_X = -12;
const MAX_X = 12;

const MIN_Y = 1.5;
const MAX_Y = 12;


export default function ControlPreview() {
	const meshRef = useRef();


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
		// Keep player inside the playable area
		// --------------------------------------------------

		playerState.x =
			Math.max(
				MIN_X,
				Math.min(
					MAX_X,
					playerState.x
				)
			);

		playerState.y =
			Math.max(
				MIN_Y,
				Math.min(
					MAX_Y,
					playerState.y
				)
			);


		// --------------------------------------------------
		// Move temporary object
		// --------------------------------------------------

		if (meshRef.current) {
			meshRef.current.position.x =
				playerState.x;

			meshRef.current.position.y =
				playerState.y;


			// Small visual tilt while moving.
			meshRef.current.rotation.z =
				-horizontal * 0.35;

			meshRef.current.rotation.x =
				vertical * 0.15;
		}
	});


	return (
		<mesh
			ref={meshRef}
			position={[
				playerState.x,
				playerState.y,
				0,
			]}
		>
			<octahedronGeometry
				args={[
					0.65,
					0,
				]}
			/>

			<meshBasicMaterial
				color="#00e5ff"
				wireframe
			/>
		</mesh>
	);
}