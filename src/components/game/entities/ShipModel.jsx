import { useEffect, useMemo } from "react";
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

const SHIP_GLOW_COLOR = "#00e5ff";
const SHIP_GLOW_INTENSITY = 1.5;


export default function ShipModel() {
	const { scene } =
		useGLTF(MODEL_URL);

	const neonModel = useMemo(() => {
		// Keep the cached GLB materials intact for other model instances.
		const object = scene.clone(true);
		const materials = new Map();

		const withGlow = (original) => {
			if (!materials.has(original)) {
				const material = original.clone();
				if (material.emissive) {
					material.emissive.set(SHIP_GLOW_COLOR);
					material.emissiveIntensity = SHIP_GLOW_INTENSITY;
					// Apply the glow across the hull, retaining its base textures.
					material.emissiveMap = null;
					material.toneMapped = false;
				}
				materials.set(original, material);
			}
			return materials.get(original);
		};

		object.traverse((child) => {
			if (!child.isMesh) return;
			child.material = Array.isArray(child.material)
				? child.material.map(withGlow)
				: withGlow(child.material);
		});

		return { object, materials };
	}, [scene]);

	useEffect(() => () => {
		neonModel.materials.forEach((material) => material.dispose());
	}, [neonModel]);


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
				object={neonModel.object}

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
