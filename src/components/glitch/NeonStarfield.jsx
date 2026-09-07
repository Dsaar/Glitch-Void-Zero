import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
// Star vertex shader
// ------------------------------------------------------

const starVertexShader = /* glsl */ `
uniform float uTime;

attribute float aSeed;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;


float hash(float n) {
  return fract(
    sin(n) *
    43758.5453123
  );
}


void main() {
  vColor = aColor;


  // ----------------------------------------------------
  // Gentle twinkle
  // ----------------------------------------------------

  float twinkle =
    0.55 +
    0.45 *
    sin(
      uTime *
      (
        1.2 +
        aSeed * 2.0
      ) +
      aSeed * 40.0
    );


  // ----------------------------------------------------
  // Digital glitch flicker
  // ----------------------------------------------------

  float slot =
    floor(
      uTime * 3.0 +
      aSeed * 90.0
    );

  float randomValue =
    hash(
      slot +
      aSeed * 17.0
    );

  float flicker = 1.0;

  if (randomValue > 0.96) {
    flicker = 2.2;
  }

  if (randomValue < 0.03) {
    flicker = 0.0;
  }


  vAlpha =
    twinkle *
    flicker;


  // ----------------------------------------------------
  // Position and apparent star size
  // ----------------------------------------------------

  vec4 modelViewPosition =
    modelViewMatrix *
    vec4(
      position,
      1.0
    );

  gl_PointSize =
    (
      1.4 +
      aSeed * 2.4
    ) *
    (
      280.0 /
      -modelViewPosition.z
    );


  gl_Position =
    projectionMatrix *
    modelViewPosition;
}
`;


// ------------------------------------------------------
// Star fragment shader
// ------------------------------------------------------

const starFragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;


void main() {
  vec2 center =
    gl_PointCoord -
    0.5;

  float distanceFromCenter =
    length(center);


  // Turn the square point into a soft circular star.
  float mask =
    smoothstep(
      0.5,
      0.15,
      distanceFromCenter
    );


  gl_FragColor =
    vec4(
      vColor,
      vAlpha * mask
    );
}
`;


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