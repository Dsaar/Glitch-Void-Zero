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


const COLORS = {
	rapid: "#ff8a1f",

	speed: "#41ff87",

	shield: "#00e5ff",
};


const POWER_UP_SPEED =
	24;


export default function PowerUp({
	id,
	type,
	position,
}) {
	const bodyRef =
		useRef();

	const visualRef =
		useRef();

	const collectedRef =
		useRef(false);


	useFrame(
		(
			{
				clock,
			}
		) => {
			// ------------------------------------------------
			// Remove when it passes the camera
			// ------------------------------------------------

			if (
				bodyRef.current
			) {
				const current =
					bodyRef.current
						.translation();


				if (
					current.z >
					25
				) {
					useGameStore
						.getState()
						.removePowerUp(
							id
						);
				}
			}


			// ------------------------------------------------
			// Animated pickup
			// ------------------------------------------------

			if (
				visualRef.current
			) {
				visualRef.current.rotation.y =
					clock.elapsedTime *
					2.2;


				visualRef.current.rotation.x =
					Math.sin(
						clock.elapsedTime *
						1.7
					) *
					0.4;


				const pulse =
					1 +
					Math.sin(
						clock.elapsedTime *
						5 +
						id
					) *
					0.12;


				visualRef.current.scale.setScalar(
					pulse
				);
			}
		}
	);


	// ----------------------------------------------------
	// Player collection
	// ----------------------------------------------------

	const handleCollect = ({
		other,
	}) => {
		if (
			collectedRef.current
		) {
			return;
		}


		const playerData =
			other.rigidBody
				?.userData;


		if (
			playerData?.type !==
			"player"
		) {
			return;
		}


		collectedRef.current =
			true;


		const {
			activatePowerUp,
			removePowerUp,
		} =
			useGameStore.getState();


		activatePowerUp(
			type
		);


		removePowerUp(
			id
		);
	};


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
				POWER_UP_SPEED,
			]}

			userData={{
				type:
					"powerup",
				id,
			}}
		>
			<BallCollider
				args={[
					1,
				]}

				sensor

				collisionGroups={
					interactionGroups(
						3,
						[
							0,
						]
					)
				}

				onIntersectionEnter={
					handleCollect
				}
			/>


			<group
				ref={
					visualRef
				}
			>
				{/* ------------------------------------------ */}
				{/* Outer wireframe */}
				{/* ------------------------------------------ */}

				<mesh>
					<octahedronGeometry
						args={[
							0.9,
							0,
						]}
					/>


					<meshBasicMaterial
						color={
							COLORS[type]
						}

						wireframe
					/>
				</mesh>


				{/* ------------------------------------------ */}
				{/* Inner glow */}
				{/* ------------------------------------------ */}

				<mesh
					scale={
						0.55
					}
				>
					<sphereGeometry
						args={[
							0.75,
							12,
							8,
						]}
					/>


					<meshBasicMaterial
						color={
							COLORS[type]
						}

						transparent

						opacity={
							0.35
						}
					/>
				</mesh>
			</group>
		</RigidBody>
	);
}