import {
	useRef,
} from "react";

import {
	useFrame,
} from "@react-three/fiber";

import {
	CuboidCollider,
	interactionGroups,
	RigidBody,
} from "@react-three/rapier";

import * as THREE from "three";

import {
	keys,
} from "./useKeyboard";

import {
	touchState,
} from "./touchState";

import {
	invulnState,
	playerState,
	powerUpState,
	useGameStore,
} from "./gameStore";

import ShipModel from "./ShipModel";


// ------------------------------------------------------
// Movement
// ------------------------------------------------------

const BASE_MOVE_SPEED = 10;

const SPEED_MULTIPLIER = 1.55;

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
// Weapon
// ------------------------------------------------------

const NORMAL_FIRE_INTERVAL =
	0.18;

const RAPID_FIRE_INTERVAL =
	0.07;

const PROJECTILE_START_Z =
	-2.5;


// ------------------------------------------------------
// Player collider
// ------------------------------------------------------

const PLAYER_COLLIDER = [
	1.1,
	0.5,
	1.5,
];


export default function PlayerShip() {
	const bodyRef =
		useRef();

	const visualRef =
		useRef();

	const shieldRef =
		useRef();

	const fireCooldown =
		useRef(0);


	// ----------------------------------------------------
	// Enemy collision
	// ----------------------------------------------------

	const handleHit = ({
		other,
	}) => {
		const {
			phase,
			addExplosion,
			loseLife,
		} =
			useGameStore.getState();


		if (
			phase !== "playing"
		) {
			return;
		}


		const enemyData =
			other.rigidBody
				?.userData;


		if (
			enemyData?.type !==
			"enemy"
		) {
			return;
		}


		const now =
			performance.now() /
			1000;


		// --------------------------------------------------
		// Ignore collisions while temporarily invulnerable
		// --------------------------------------------------

		if (
			now <
			invulnState.until
		) {
			return;
		}


		// --------------------------------------------------
		// Shield absorbs one hit
		// --------------------------------------------------

		if (
			powerUpState.shieldActive
		) {
			powerUpState.shieldActive =
				false;


			addExplosion({
				x: playerState.x,

				y: playerState.y,

				z: 0,
			});


			return;
		}


		// --------------------------------------------------
		// Normal damage
		// --------------------------------------------------

		addExplosion({
			x: playerState.x,

			y: playerState.y,

			z: 0,
		});


		loseLife();
	};


	// ----------------------------------------------------
	// Frame loop
	// ----------------------------------------------------

	useFrame(
		(
			_,
			delta
		) => {
			const phase =
				useGameStore
					.getState()
					.phase;


			if (
				phase !== "playing"
			) {
				return;
			}


			const now =
				performance.now() /
				1000;


			fireCooldown.current -=
				delta;


			// ------------------------------------------------
			// Power-up state
			// ------------------------------------------------

			const speedActive =
				now <
				powerUpState.speedUntil;


			const rapidFireActive =
				now <
				powerUpState.rapidFireUntil;


			const moveSpeed =
				BASE_MOVE_SPEED *
				(
					speedActive
						? SPEED_MULTIPLIER
						: 1
				);


			const fireInterval =
				rapidFireActive
					? RAPID_FIRE_INTERVAL
					: NORMAL_FIRE_INTERVAL;


			// ------------------------------------------------
			// Horizontal input
			//
			// Touch input gives us an analog value between
			// -1 and +1. Keyboard input is then added to it.
			// ------------------------------------------------

			let horizontal =
				touchState.horizontal;


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


			// ------------------------------------------------
			// Vertical input
			// ------------------------------------------------

			let vertical =
				touchState.vertical;


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


			// ------------------------------------------------
			// Normalize input
			//
			// This works for both:
			//
			// keyboard diagonal movement
			// and
			// analog joystick movement
			// ------------------------------------------------

			const inputLength =
				Math.hypot(
					horizontal,
					vertical
				);


			if (
				inputLength > 1
			) {
				horizontal /=
					inputLength;

				vertical /=
					inputLength;
			}


			// ------------------------------------------------
			// Update position
			// ------------------------------------------------

			playerState.x +=
				horizontal *
				moveSpeed *
				delta;


			playerState.y +=
				vertical *
				moveSpeed *
				delta;


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


			// ------------------------------------------------
			// Move Rapier body
			// ------------------------------------------------

			if (
				bodyRef.current
			) {
				bodyRef.current
					.setNextKinematicTranslation({
						x:
							playerState.x,

						y:
							playerState.y,

						z: 0,
					});
			}


			// ------------------------------------------------
			// Banking / pitching / invulnerability flashing
			// ------------------------------------------------

			if (
				visualRef.current
			) {
				const targetBank =
					-horizontal *
					MAX_BANK;


				visualRef.current.rotation.z =
					THREE.MathUtils.damp(
						visualRef.current
							.rotation.z,

						targetBank,

						6,

						delta
					);


				const targetPitch =
					-vertical *
					MAX_PITCH;


				visualRef.current.rotation.x =
					THREE.MathUtils.damp(
						visualRef.current
							.rotation.x,

						targetPitch,

						6,

						delta
					);


				const isInvulnerable =
					now <
					invulnState.until;


				visualRef.current.visible =
					!isInvulnerable ||
					Math.sin(
						now * 40
					) > 0;
			}


			// ------------------------------------------------
			// Shield visual
			// ------------------------------------------------

			if (
				shieldRef.current
			) {
				shieldRef.current.visible =
					powerUpState.shieldActive;


				shieldRef.current.rotation.y +=
					delta * 1.5;


				shieldRef.current.rotation.x +=
					delta * 0.6;
			}


			// ------------------------------------------------
			// Fire weapon
			//
			// Desktop:
			// Space
			//
			// Touch:
			// FIRE button
			// ------------------------------------------------

			if (
				(
					keys.Space ||
					touchState.fire
				) &&
				fireCooldown.current <= 0
			) {
				fireCooldown.current =
					fireInterval;


				useGameStore
					.getState()
					.spawnProjectile({
						x:
							playerState.x,

						y:
							playerState.y,

						z:
							PROJECTILE_START_Z,
					});
			}
		}
	);


	return (
		<RigidBody
			ref={bodyRef}

			type="kinematicPosition"

			colliders={false}

			position={[
				playerState.x,
				playerState.y,
				0,
			]}

			userData={{
				type:
					"player",
			}}
		>
			{/* -------------------------------------------- */}
			{/* Player collider */}
			{/* -------------------------------------------- */}

			<CuboidCollider
				args={
					PLAYER_COLLIDER
				}

				sensor

				collisionGroups={
					interactionGroups(
						0,
						[
							2,
							3,
						]
					)
				}

				onIntersectionEnter={
					handleHit
				}
			/>


			{/* -------------------------------------------- */}
			{/* Visible ship */}
			{/* -------------------------------------------- */}

			<group
				ref={
					visualRef
				}
			>
				<ShipModel />


				{/* ------------------------------------------ */}
				{/* Shield */}
				{/* ------------------------------------------ */}

				<mesh
					ref={
						shieldRef
					}

					visible={
						false
					}
				>
					<sphereGeometry
						args={[
							2.25,
							24,
							16,
						]}
					/>


					<meshBasicMaterial
						color="#00e5ff"

						wireframe

						transparent

						opacity={
							0.28
						}

						depthWrite={
							false
						}
					/>
				</mesh>
			</group>
		</RigidBody>
	);
}