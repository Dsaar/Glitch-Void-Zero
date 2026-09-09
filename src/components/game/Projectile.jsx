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

import {
	genId,
	useGameStore,
} from "./gameStore";


const PROJECTILE_SPEED =
	120;

const PROJECTILE_LIMIT =
	-210;


const POWER_UP_DROP_CHANCE =
	0.16;


const POWER_UP_TYPES = [
	"rapid",
	"speed",
	"shield",
];


// ------------------------------------------------------
// Deterministic pseudo-random
// ------------------------------------------------------

function pseudoRandom(
	seed
) {
	const value =
		Math.sin(
			seed *
			12.9898
		) *
		43758.5453;


	return (
		value -
		Math.floor(
			value
		)
	);
}


export default function Projectile({
	id,
	position,
}) {
	const bodyRef =
		useRef();

	const zRef =
		useRef(
			position.z
		);

	const hitRef =
		useRef(false);


	// ----------------------------------------------------
	// Move projectile
	// ----------------------------------------------------

	useFrame(
		(
			_,
			delta
		) => {
			zRef.current -=
				PROJECTILE_SPEED *
				delta;


			if (
				bodyRef.current
			) {
				bodyRef.current
					.setNextKinematicTranslation({
						x:
							position.x,

						y:
							position.y,

						z:
							zRef.current,
					});
			}


			if (
				zRef.current <
				PROJECTILE_LIMIT
			) {
				useGameStore
					.getState()
					.removeProjectile(
						id
					);
			}
		}
	);


	// ----------------------------------------------------
	// Projectile → enemy collision
	// ----------------------------------------------------

	const handleHit = ({
		other,
	}) => {
		if (
			hitRef.current
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


		hitRef.current =
			true;


		const {
			addExplosion,
			removeEnemy,
			removeProjectile,
			addScore,
			spawnPowerUp,
		} =
			useGameStore.getState();


		let hitPosition = {
			x:
				position.x,

			y:
				position.y,

			z:
				zRef.current,
		};


		if (
			other.rigidBody
		) {
			const translation =
				other.rigidBody
					.translation();


			hitPosition = {
				x:
					translation.x,

				y:
					translation.y,

				z:
					translation.z,
			};
		}


		// --------------------------------------------------
		// Explosion
		// --------------------------------------------------

		addExplosion(
			hitPosition
		);


		// --------------------------------------------------
		// Remove enemy + laser
		// --------------------------------------------------

		removeEnemy(
			enemyData.id
		);


		removeProjectile(
			id
		);


		// --------------------------------------------------
		// Score
		// --------------------------------------------------

		addScore(
			100
		);


		// --------------------------------------------------
		// Chance to drop power-up
		// --------------------------------------------------

		const dropRoll =
			pseudoRandom(
				enemyData.id
			);


		if (
			dropRoll <
			POWER_UP_DROP_CHANCE
		) {
			const typeIndex =
				Math.floor(
					pseudoRandom(
						enemyData.id +
						1000
					) *
					POWER_UP_TYPES.length
				);


			spawnPowerUp({
				id:
					genId(),

				type:
					POWER_UP_TYPES[
					typeIndex
					],

				position:
					hitPosition,
			});
		}
	};


	return (
		<RigidBody
			ref={bodyRef}

			type="kinematicPosition"

			colliders={false}

			position={[
				position.x,
				position.y,
				position.z,
			]}

			userData={{
				type:
					"projectile",
			}}
		>
			<CuboidCollider
				args={[
					0.16,
					0.16,
					1.3,
				]}

				sensor

				collisionGroups={
					interactionGroups(
						1,
						[
							2,
						]
					)
				}

				onIntersectionEnter={
					handleHit
				}
			/>


			<mesh>
				<boxGeometry
					args={[
						0.2,
						0.2,
						2.6,
					]}
				/>


				<meshBasicMaterial
					color="#9dfdff"
				/>
			</mesh>
		</RigidBody>
	);
}