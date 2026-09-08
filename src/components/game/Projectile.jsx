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
	useGameStore,
} from "./gameStore";


const PROJECTILE_SPEED =
	120;

const PROJECTILE_LIMIT =
	-210;


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
	// Projectile → enemy
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


		addExplosion(
			hitPosition
		);


		removeEnemy(
			enemyData.id
		);


		removeProjectile(
			id
		);


		addScore(
			100
		);
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