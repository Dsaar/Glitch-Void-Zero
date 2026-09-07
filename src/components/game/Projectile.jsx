import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import {
	useGameStore,
} from "./gameStore";


const PROJECTILE_SPEED = 120;

const PROJECTILE_LIMIT = -210;


export default function Projectile({
	id,
	position,
}) {
	const meshRef = useRef();

	const zRef =
		useRef(
			position.z
		);


	useFrame((_, delta) => {
		zRef.current -=
			PROJECTILE_SPEED *
			delta;


		if (meshRef.current) {
			meshRef.current.position.z =
				zRef.current;
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
	});


	return (
		<mesh
			ref={meshRef}
			position={[
				position.x,
				position.y,
				position.z,
			]}
		>
			<boxGeometry
				args={[
					0.18,
					0.18,
					2.6,
				]}
			/>

			<meshBasicMaterial
				color="#9dfdff"
			/>
		</mesh>
	);
}