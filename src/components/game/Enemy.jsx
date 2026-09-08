import {
	useRef,
} from "react";

import {
	useFrame,
} from "@react-three/fiber";

import {
	BallCollider,
	interactionGroups,
	RigidBody,
} from "@react-three/rapier";

import {
	useGameStore,
} from "./gameStore";


const COLORS = [
	"#ff2d8a",
	"#00e5ff",
	"#ff7a1a",
];


export default function Enemy({
	id,
	position,
	speed,
	seed,
}) {
	const bodyRef =
		useRef();

	const visualRef =
		useRef();


	const color =
		COLORS[
		Math.floor(
			seed *
			COLORS.length
		) %
		COLORS.length
		];


	useFrame(
		({
			clock,
		}) => {
			// ------------------------------------------------
			// Remove enemies once they pass the camera
			// ------------------------------------------------

			if (
				bodyRef.current
			) {
				const enemyPosition =
					bodyRef.current.translation();


				if (
					enemyPosition.z >
					25
				) {
					useGameStore
						.getState()
						.removeEnemy(
							id
						);
				}
			}


			// ------------------------------------------------
			// Glitchy enemy animation
			// ------------------------------------------------

			if (
				visualRef.current
			) {
				const scale =
					1 +
					Math.sin(
						clock.elapsedTime *
						22 +
						seed *
						40
					) *
					0.14;


				visualRef.current.scale.set(
					scale,
					1 / scale,
					scale
				);
			}
		}
	);


	return (
		<RigidBody
			ref={bodyRef}

			type="dynamic"

			gravityScale={0}

			canSleep={false}

			colliders={false}

			position={[
				position.x,
				position.y,
				position.z,
			]}

			linearVelocity={[
				0,
				0,
				speed,
			]}

			angularVelocity={[
				seed * 2,
				1 +
				seed * 3,
				seed * 2,
			]}

			userData={{
				type: "enemy",
				id,
			}}
		>
			<BallCollider
				args={[
					1.4,
				]}

				collisionGroups={
					interactionGroups(
						2,
						[
							0,
							1,
						]
					)
				}
			/>


			<group
				ref={
					visualRef
				}
			>
				<mesh>
					<icosahedronGeometry
						args={[
							1.4,
							0,
						]}
					/>

					<meshBasicMaterial
						color={
							color
						}
						wireframe
					/>
				</mesh>


				<mesh
					scale={0.72}
				>
					<octahedronGeometry
						args={[
							1.4,
							0,
						]}
					/>

					<meshBasicMaterial
						color="#0a0510"
					/>
				</mesh>
			</group>
		</RigidBody>
	);
}