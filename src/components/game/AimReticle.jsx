import {
	useEffect,
	useMemo,
	useRef,
} from "react";

import {
	useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import {
	playerState,
} from "./gameStore";


const RETICLE_Z = -45;


export default function AimReticle() {
	const groupRef =
		useRef();


	const ringGeometry =
		useMemo(
			() =>
				new THREE.RingGeometry(
					0.85,
					1,
					32
				),
			[]
		);


	const tickGeometry =
		useMemo(
			() =>
				new THREE.PlaneGeometry(
					0.08,
					0.5
				),
			[]
		);


	const dotGeometry =
		useMemo(
			() =>
				new THREE.CircleGeometry(
					0.12,
					16
				),
			[]
		);


	useEffect(() => {
		return () => {
			ringGeometry.dispose();
			tickGeometry.dispose();
			dotGeometry.dispose();
		};
	}, [
		ringGeometry,
		tickGeometry,
		dotGeometry,
	]);


	useFrame(
		({
			clock,
		}) => {
			if (!groupRef.current) {
				return;
			}


			groupRef.current.position.set(
				playerState.x,
				playerState.y,
				RETICLE_Z
			);


			groupRef.current.rotation.z =
				clock.elapsedTime *
				0.6;


			const pulse =
				1 +
				Math.sin(
					clock.elapsedTime *
					5
				) *
				0.06;


			groupRef.current.scale.setScalar(
				pulse
			);
		}
	);


	return (
		<group
			ref={groupRef}
			position={[
				playerState.x,
				playerState.y,
				RETICLE_Z,
			]}
			renderOrder={10}
		>
			<mesh
				geometry={
					ringGeometry
				}
			>
				<meshBasicMaterial
					color="#00e5ff"
					transparent
					opacity={0.85}
					depthWrite={false}
				/>
			</mesh>


			<mesh
				geometry={
					dotGeometry
				}
			>
				<meshBasicMaterial
					color="#ff2d8a"
					transparent
					opacity={0.9}
					depthWrite={false}
				/>
			</mesh>


			<mesh
				geometry={
					tickGeometry
				}
				position={[
					0,
					1.35,
					0,
				]}
			>
				<meshBasicMaterial
					color="#00e5ff"
					transparent
					opacity={0.85}
					depthWrite={false}
				/>
			</mesh>


			<mesh
				geometry={
					tickGeometry
				}
				position={[
					0,
					-1.35,
					0,
				]}
			>
				<meshBasicMaterial
					color="#00e5ff"
					transparent
					opacity={0.85}
					depthWrite={false}
				/>
			</mesh>


			<mesh
				geometry={
					tickGeometry
				}
				position={[
					1.35,
					0,
					0,
				]}
				rotation={[
					0,
					0,
					Math.PI / 2,
				]}
			>
				<meshBasicMaterial
					color="#00e5ff"
					transparent
					opacity={0.85}
					depthWrite={false}
				/>
			</mesh>


			<mesh
				geometry={
					tickGeometry
				}
				position={[
					-1.35,
					0,
					0,
				]}
				rotation={[
					0,
					0,
					Math.PI / 2,
				]}
			>
				<meshBasicMaterial
					color="#00e5ff"
					transparent
					opacity={0.85}
					depthWrite={false}
				/>
			</mesh>
		</group>
	);
}