import {
	useMemo,
	useRef,
} from "react";

import {
	useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import {
	useGameStore,
} from "./gameStore";


const LIFE = 0.7;

const PARTICLE_COUNT = 42;


// ------------------------------------------------------
// Deterministic pseudo-random
// ------------------------------------------------------

function seededRandom(
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


export default function Explosion({
	id,
	position,
}) {
	const geometryRef =
		useRef();

	const materialRef =
		useRef();

	const ageRef =
		useRef(0);

	const removedRef =
		useRef(false);


	const positions =
		useMemo(
			() =>
				new Float32Array(
					PARTICLE_COUNT *
					3
				),
			[]
		);


	const velocities =
		useMemo(() => {
			const values =
				new Float32Array(
					PARTICLE_COUNT *
					3
				);


			for (
				let i = 0;
				i <
				PARTICLE_COUNT;
				i++
			) {
				let x =
					seededRandom(
						id *
						1000 +
						i *
						4 +
						1
					) -
					0.5;

				let y =
					seededRandom(
						id *
						1000 +
						i *
						4 +
						2
					) -
					0.5;

				let z =
					seededRandom(
						id *
						1000 +
						i *
						4 +
						3
					) -
					0.5;


				const length =
					Math.sqrt(
						x * x +
						y * y +
						z * z
					) || 1;


				x /= length;
				y /= length;
				z /= length;


				const speed =
					8 +
					seededRandom(
						id *
						1000 +
						i *
						4 +
						4
					) *
					14;


				values[
					i * 3
				] =
					x * speed;

				values[
					i * 3 + 1
				] =
					y * speed;

				values[
					i * 3 + 2
				] =
					z * speed;
			}


			return values;
		}, [
			id,
		]);


	useFrame(
		(
			_,
			delta
		) => {
			ageRef.current +=
				delta;


			if (
				geometryRef.current
			) {
				const attribute =
					geometryRef.current
						.attributes
						.position;


				const array =
					attribute.array;


				for (
					let i = 0;
					i <
					PARTICLE_COUNT;
					i++
				) {
					array[
						i * 3
					] +=
						velocities[
						i * 3
						] *
						delta;


					array[
						i * 3 +
						1
					] +=
						velocities[
						i * 3 +
						1
						] *
						delta;


					array[
						i * 3 +
						2
					] +=
						velocities[
						i * 3 +
						2
						] *
						delta;
				}


				attribute.needsUpdate =
					true;
			}


			if (
				materialRef.current
			) {
				materialRef.current.opacity =
					Math.max(
						1 -
						ageRef.current /
						LIFE,

						0
					);
			}


			if (
				ageRef.current >=
				LIFE &&
				!removedRef.current
			) {
				removedRef.current =
					true;


				useGameStore
					.getState()
					.removeExplosion(
						id
					);
			}
		}
	);


	return (
		<points
			position={[
				position.x,
				position.y,
				position.z,
			]}

			frustumCulled={
				false
			}
		>
			<bufferGeometry
				ref={
					geometryRef
				}
			>
				<bufferAttribute
					attach="attributes-position"

					args={[
						positions,
						3,
					]}
				/>
			</bufferGeometry>


			<pointsMaterial
				ref={
					materialRef
				}

				color="#ff2d8a"

				size={0.4}

				transparent

				opacity={1}

				blending={
					THREE.AdditiveBlending
				}

				depthWrite={
					false
				}
			/>
		</points>
	);
}