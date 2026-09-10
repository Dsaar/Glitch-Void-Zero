import {
	useRef,
} from "react";

import {
	touchState,
} from "./touchState";


const MAX_DISTANCE = 42;


export default function VirtualJoystick() {
	const baseRef =
		useRef();

	const knobRef =
		useRef();


	const updateJoystick = (
		clientX,
		clientY
	) => {
		if (
			!baseRef.current
		) {
			return;
		}


		const rect =
			baseRef.current
				.getBoundingClientRect();


		const centerX =
			rect.left +
			rect.width / 2;

		const centerY =
			rect.top +
			rect.height / 2;


		let dx =
			clientX -
			centerX;

		let dy =
			clientY -
			centerY;


		const distance =
			Math.hypot(
				dx,
				dy
			);


		if (
			distance >
			MAX_DISTANCE
		) {
			const scale =
				MAX_DISTANCE /
				distance;


			dx *= scale;
			dy *= scale;
		}


		touchState.horizontal =
			dx /
			MAX_DISTANCE;


		// Browser Y increases downward.
		// Game Y increases upward.
		touchState.vertical =
			-dy /
			MAX_DISTANCE;


		if (
			knobRef.current
		) {
			knobRef.current.style.transform =
				`translate(${dx}px, ${dy}px)`;
		}
	};


	const resetJoystick = () => {
		touchState.horizontal = 0;
		touchState.vertical = 0;


		if (
			knobRef.current
		) {
			knobRef.current.style.transform =
				"translate(0px, 0px)";
		}
	};


	const handlePointerDown = (
		event
	) => {
		event.preventDefault();


		event.currentTarget
			.setPointerCapture(
				event.pointerId
			);


		updateJoystick(
			event.clientX,
			event.clientY
		);
	};


	const handlePointerMove = (
		event
	) => {
		if (
			!event.currentTarget
				.hasPointerCapture(
					event.pointerId
				)
		) {
			return;
		}


		event.preventDefault();


		updateJoystick(
			event.clientX,
			event.clientY
		);
	};


	const handlePointerUp = (
		event
	) => {
		if (
			event.currentTarget
				.hasPointerCapture(
					event.pointerId
				)
		) {
			event.currentTarget
				.releasePointerCapture(
					event.pointerId
				);
		}


		resetJoystick();
	};


	return (
		<div
			ref={baseRef}

			className="virtual-joystick"

			onPointerDown={
				handlePointerDown
			}

			onPointerMove={
				handlePointerMove
			}

			onPointerUp={
				handlePointerUp
			}

			onPointerCancel={
				handlePointerUp
			}
		>
			<div className="virtual-joystick__ring" />


			<div
				ref={knobRef}
				className="virtual-joystick__knob"
			/>
		</div>
	);
}