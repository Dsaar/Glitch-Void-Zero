import { useFrame } from "@react-three/fiber";
import { glitchState } from "./glitchState";


export default function TerrainPreviewRig() {
	useFrame((_, delta) => {
		const previewSpeed = 12;

		glitchState.smooth +=
			previewSpeed * delta;

		glitchState.distance =
			glitchState.smooth;

		glitchState.intensity =
			0.12;
	});


	return null;
}