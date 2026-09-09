import {
	useEffect,
	useMemo,
	useState,
} from "react";

import {
	Bloom,
	ChromaticAberration,
	EffectComposer,
	Noise,
	Scanline,
} from "@react-three/postprocessing";

import {
	BlendFunction,
} from "postprocessing";

import {
	Vector2,
} from "three";

import {
	glitchState,
} from "./glitchState";


// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

function clamp01(value) {
	return Math.max(
		0,
		Math.min(
			value,
			1
		)
	);
}


function readEffectState() {
	return {
		intensity:
			clamp01(
				glitchState.intensity
			),

		velocity:
			clamp01(
				glitchState.velocity
			),
	};
}


// ------------------------------------------------------
// Post-processing
// ------------------------------------------------------

export default function Effects() {
	const [
		effectState,
		setEffectState,
	] =
		useState(
			readEffectState
		);


	// ----------------------------------------------------
	// React does not need to update these effects
	// every rendered frame.
	//
	// 10 updates per second is more than enough for
	// smoothly evolving fullscreen effects.
	// ----------------------------------------------------

	useEffect(() => {
		const intervalId =
			window.setInterval(
				() => {
					const next =
						readEffectState();


					setEffectState(
						(
							previous
						) => {
							const intensityChanged =
								Math.abs(
									previous.intensity -
									next.intensity
								) >
								0.002;


							const velocityChanged =
								Math.abs(
									previous.velocity -
									next.velocity
								) >
								0.002;


							if (
								!intensityChanged &&
								!velocityChanged
							) {
								return previous;
							}


							return next;
						}
					);
				},

				100
			);


		return () => {
			window.clearInterval(
				intervalId
			);
		};
	}, []);


	const {
		intensity,
		velocity,
	} =
		effectState;


	// ----------------------------------------------------
	// Chromatic aberration
	// ----------------------------------------------------
	//
	// Keep normal gameplay fairly subtle.
	// Strong corruption arrives naturally as
	// glitchState.intensity increases.
	// ----------------------------------------------------

	const chromaticOffset =
		useMemo(
			() =>
				new Vector2(
					0.0002 +
					intensity *
					0.0012,

					0.0001 +
					velocity *
					0.0004
				),

			[
				intensity,
				velocity,
			]
		);


	// ----------------------------------------------------
	// Bloom
	// ----------------------------------------------------

	const bloomIntensity =
		0.55 +
		intensity *
		0.9 +
		velocity *
		0.15;


	// ----------------------------------------------------
	// Noise
	// ----------------------------------------------------

	const noiseOpacity =
		0.008 +
		intensity *
		0.035;


	// ----------------------------------------------------
	// Scanlines
	// ----------------------------------------------------

	const scanlineDensity =
		1.15 +
		velocity *
		0.6 +
		intensity *
		0.25;


	return (
		<EffectComposer
			multisampling={0}
		>
			{/* -------------------------------------------- */}
			{/* RGB separation */}
			{/* -------------------------------------------- */}

			<ChromaticAberration
				blendFunction={
					BlendFunction.NORMAL
				}

				offset={
					chromaticOffset
				}
			/>


			{/* -------------------------------------------- */}
			{/* Neon glow */}
			{/* -------------------------------------------- */}

			<Bloom
				mipmapBlur

				intensity={
					bloomIntensity
				}

				luminanceThreshold={
					0.42
				}

				luminanceSmoothing={
					0.25
				}
			/>


			{/* -------------------------------------------- */}
			{/* CRT-style scanlines */}
			{/* -------------------------------------------- */}
			<Scanline
				blendFunction={
					BlendFunction.OVERLAY
				}

				density={
					scanlineDensity
				}

				opacity={
					0.16
				}
			/>


			{/* -------------------------------------------- */}
			{/* Digital grain */}
			{/* -------------------------------------------- */}

			<Noise
				blendFunction={
					BlendFunction.ADD
				}

				opacity={
					noiseOpacity
				}
			/>
		</EffectComposer>
	);
}