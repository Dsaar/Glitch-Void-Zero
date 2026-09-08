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
	invulnState,
	playerState,
	useGameStore,
} from "./gameStore";

import ShipModel from "./ShipModel";


// ------------------------------------------------------
// Movement
// ------------------------------------------------------

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
// Weapon
// ------------------------------------------------------

const FIRE_INTERVAL =
	0.18;

const PROJECTILE_START_Z =
	-2.5;


// ------------------------------------------------------
// Player collider
// ------------------------------------------------------
//
// Rapier uses half-extents for CuboidCollider.
//
// Therefore:
// x = 1.1 means total width 2.2
// y = 0.5 means total height 1.0
// z = 1.5 means total length 3.0
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
			phase !==
			"playing"
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


		// Ignore damage during the
		// invulnerability window.
		if (
			now <
			invulnState.until
		) {
			return;
		}


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
				phase !==
				"playing"
			) {
				return;
			}


			fireCooldown.current -=
				delta;


			// ------------------------------------------------
			// Horizontal input
			// ------------------------------------------------

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


			// ------------------------------------------------
			// Vertical input
			// ------------------------------------------------

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


			// ------------------------------------------------
			// Normalize diagonal movement
			// ------------------------------------------------

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


			// ------------------------------------------------
			// Update player position
			// ------------------------------------------------

			playerState.x +=
				horizontal *
				MOVE_SPEED *
				delta;


			playerState.y +=
				vertical *
				MOVE_SPEED *
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
			// Move Rapier player body
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
			// Banking / pitching / invulnerability flash
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


				// --------------------------------------------
				// Flash while invulnerable
				// --------------------------------------------

				const now =
					performance.now() /
					1000;


				const isInvulnerable =
					now <
					invulnState.until;


				visualRef.current.visible =
					!isInvulnerable ||
					Math.sin(
						now * 40
					) >
					0;
			}


			// ------------------------------------------------
			// Fire weapon
			// ------------------------------------------------

			if (
				keys.Space &&
				fireCooldown.current <=
				0
			) {
				fireCooldown.current =
					FIRE_INTERVAL;


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
			{/* Player collision sensor */}
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
						]
					)
				}

				onIntersectionEnter={
					handleHit
				}
			/>


			{/* -------------------------------------------- */}
			{/* Visible spaceship */}
			{/* -------------------------------------------- */}

			<group
				ref={
					visualRef
				}
			>
				<ShipModel />
			</group>
		</RigidBody>
	);
}