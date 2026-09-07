import { useMemo } from "react";
import { Clone, useGLTF } from "@react-three/drei";
import * as THREE from "three";


const MODEL_URL =
	"/models/Intergalactic Spaceship_Blender_2.79b_BI.glb";


// We scale the largest dimension of the model
// to this size.
//
// This is more reliable than using a hard-coded
// Blender scale because different GLB files can
// use very different native dimensions.
const TARGET_MAX_DIMENSION = 3.4;


export default function ShipModel() {
	const { scene } =
		useGLTF(MODEL_URL);


	const modelData = useMemo(() => {
		const box =
			new THREE.Box3().setFromObject(
				scene
			);

		const size =
			new THREE.Vector3();

		const center =
			new THREE.Vector3();


		box.getSize(size);

		box.getCenter(center);


		const largestDimension =
			Math.max(
				size.x,
				size.y,
				size.z
			);


		const scale =
			TARGET_MAX_DIMENSION /
			largestDimension;


		return {
			scale,

			center: [
				center.x,
				center.y,
				center.z,
			],
		};
	}, [scene]);


	return (
		<group
			scale={
				modelData.scale
			}

			// Native model points toward +Z.
			// Our game travels toward -Z.
			rotation={[
				0,
				Math.PI,
				0,
			]}
		>
			<Clone
				object={scene}

				position={[
					-modelData.center[0],
					-modelData.center[1],
					-modelData.center[2],
				]}
			/>
		</group>
	);
}


useGLTF.preload(
	MODEL_URL
);