import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
	terrainFragment,
	terrainVertex,
} from "./terrainShaders";

import { glitchState } from "./glitchState";


function createTerrainMaterial(wireframe) {
	return new THREE.ShaderMaterial({
		vertexShader: terrainVertex,
		fragmentShader: terrainFragment,

		uniforms: {
			uTime: {
				value: 0,
			},

			uOffset: {
				value: 0,
			},

			uGlitchIntensity: {
				value: 0.12,
			},

			uWire: {
				value: wireframe ? 1 : 0,
			},
		},

		wireframe,

		transparent: wireframe,

		depthWrite: !wireframe,
	});
}


export default function GlitchTerrain() {
	const groupRef = useRef();
	const elapsedTime = useRef(0);


	const geometry = useMemo(() => {
		return new THREE.PlaneGeometry(
			240,
			320,
			256,
			340
		);
	}, []);


	const solidMaterial = useMemo(() => {
		return createTerrainMaterial(false);
	}, []);


	const wireMaterial = useMemo(() => {
		return createTerrainMaterial(true);
	}, []);


	useEffect(() => {
		return () => {
			geometry.dispose();
			solidMaterial.dispose();
			wireMaterial.dispose();
		};
	}, [
		geometry,
		solidMaterial,
		wireMaterial,
	]);


	useFrame(({ camera }, delta) => {
		elapsedTime.current += delta;


		// Keep the terrain positioned in front
		// of the current camera.
		if (groupRef.current) {
			groupRef.current.position.z =
				camera.position.z - 60;
		}


		const materials = [
			solidMaterial,
			wireMaterial,
		];


		materials.forEach((material) => {
			material.uniforms.uTime.value =
				elapsedTime.current;

			material.uniforms.uOffset.value =
				glitchState.smooth;

			material.uniforms.uGlitchIntensity.value =
				glitchState.intensity;
		});
	});


	return (
		<group
			ref={groupRef}
			rotation={[
				-Math.PI / 2,
				0,
				0,
			]}
			position={[
				0,
				0,
				-60,
			]}
		>
			<mesh
				geometry={geometry}
				material={solidMaterial}
			/>

			<mesh
				geometry={geometry}
				material={wireMaterial}
				position={[
					0,
					0,
					0.15,
				]}
			/>
		</group>
	);
}