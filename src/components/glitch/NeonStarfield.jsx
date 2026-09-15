import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import starVertexShader from "./shaders/starfield/vertex.glsl?raw";
import starFragmentShader from "./shaders/starfield/fragment.glsl?raw";

const STAR_COUNT = 900;

const PALETTE = [
	new THREE.Color("#00e5ff"),
	new THREE.Color("#ff2d8a"),
	new THREE.Color("#9be9ff"),
	new THREE.Color("#ffffff"),
];


// ------------------------------------------------------
// Deterministic pseudo-random number generator
// ------------------------------------------------------

function seededRandom(seed) {
	const value =
		Math.sin(seed * 12.9898) *
		43758.5453;

	return value - Math.floor(value);
}


// ------------------------------------------------------
// Component
// ------------------------------------------------------

export default function NeonStarfield() {
	const groupRef = useRef();
	const materialRef = useRef();


	const geometry = useMemo(() => {
		const positions =
			new Float32Array(
				STAR_COUNT * 3
			);

		const seeds =
			new Float32Array(
				STAR_COUNT
			);

		const colors =
			new Float32Array(
				STAR_COUNT * 3
			);


		for (
			let i = 0;
			i < STAR_COUNT;
			i++
		) {
			const xRandom =
				seededRandom(
					i * 4 + 1
				);

			const yRandom =
				seededRandom(
					i * 4 + 2
				);

			const zRandom =
				seededRandom(
					i * 4 + 3
				);

			const seed =
				seededRandom(
					i * 4 + 4
				);


			positions[i * 3] =
				(
					xRandom -
					0.5
				) *
				480;

			positions[i * 3 + 1] =
				12 +
				yRandom *
				150;

			positions[i * 3 + 2] =
				-80 -
				zRandom *
				260;


			seeds[i] =
				seed;


			const colorIndex =
				Math.floor(
					seededRandom(
						i * 7 + 10
					) *
					PALETTE.length
				);

			const color =
				PALETTE[colorIndex];


			colors[i * 3] =
				color.r;

			colors[i * 3 + 1] =
				color.g;

			colors[i * 3 + 2] =
				color.b;
		}


		const starGeometry =
			new THREE.BufferGeometry();


		starGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(
				positions,
				3
			)
		);


		starGeometry.setAttribute(
			"aSeed",
			new THREE.BufferAttribute(
				seeds,
				1
			)
		);


		starGeometry.setAttribute(
			"aColor",
			new THREE.BufferAttribute(
				colors,
				3
			)
		);


		return starGeometry;
	}, []);


	const uniforms = useMemo(
		() => ({
			uTime: {
				value: 0,
			},
		}),
		[]
	);


	useEffect(() => {
		return () => {
			geometry.dispose();
		};
	}, [geometry]);


	useFrame(
		({
			camera,
			clock,
		}) => {
			if (materialRef.current) {
				materialRef.current.uniforms.uTime.value =
					clock.elapsedTime;
			}


			if (groupRef.current) {
				groupRef.current.position.z =
					camera.position.z;
			}
		}
	);


	return (
		<group ref={groupRef}>
			<points geometry={geometry}>
				<shaderMaterial
					ref={materialRef}
					vertexShader={starVertexShader}
					fragmentShader={starFragmentShader}
					uniforms={uniforms}
					transparent
					depthWrite={false}
					blending={
						THREE.AdditiveBlending
					}
				/>
			</points>
		</group>
	);
}