import {
	useEffect,
	useState,
} from "react";

import {
	powerUpState,
} from "./gameStore";


function getCurrentTime() {
	return (
		performance.now() /
		1000
	);
}


export default function PowerUpHUD() {
	const [
		now,
		setNow,
	] =
		useState(
			getCurrentTime
		);


	useEffect(() => {
		const intervalId =
			window.setInterval(
				() => {
					setNow(
						getCurrentTime()
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


	const rapidRemaining =
		Math.max(
			0,
			powerUpState
				.rapidFireUntil -
			now
		);


	const speedRemaining =
		Math.max(
			0,
			powerUpState
				.speedUntil -
			now
		);


	const shieldActive =
		powerUpState
			.shieldActive;


	const hasPowerUp =
		rapidRemaining > 0 ||
		speedRemaining > 0 ||
		shieldActive;


	if (!hasPowerUp) {
		return null;
	}


	return (
		<div className="power-up-hud">
			{rapidRemaining >
				0 && (
					<div className="power-up-status power-up-status--rapid">
						<span className="power-up-icon">
							R
						</span>

						<span>
							RAPID FIRE
						</span>

						<span className="power-up-time">
							{Math.ceil(
								rapidRemaining
							)}
							s
						</span>
					</div>
				)}


			{speedRemaining >
				0 && (
					<div className="power-up-status power-up-status--speed">
						<span className="power-up-icon">
							S
						</span>

						<span>
							BOOST
						</span>

						<span className="power-up-time">
							{Math.ceil(
								speedRemaining
							)}
							s
						</span>
					</div>
				)}


			{shieldActive && (
				<div className="power-up-status power-up-status--shield">
					<span className="power-up-icon">
						O
					</span>

					<span>
						SHIELD
					</span>

					<span className="power-up-time">
						READY
					</span>
				</div>
			)}
		</div>
	);
}