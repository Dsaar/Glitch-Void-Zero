import {
	touchState,
} from "./touchState";


export default function FireButton() {
	const startFiring = (
		event
	) => {
		event.preventDefault();


		event.currentTarget
			.setPointerCapture(
				event.pointerId
			);


		touchState.fire =
			true;
	};


	const stopFiring = (
		event
	) => {
		touchState.fire =
			false;


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
	};


	return (
		<button
			type="button"

			className="fire-button"

			aria-label="Fire weapon"

			onPointerDown={
				startFiring
			}

			onPointerUp={
				stopFiring
			}

			onPointerCancel={
				stopFiring
			}

			onContextMenu={
				(
					event
				) =>
					event.preventDefault()
			}
		>
			<span className="fire-button__inner">
				FIRE
			</span>
		</button>
	);
}