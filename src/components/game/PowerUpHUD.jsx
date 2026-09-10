import {
	useEffect,
	useState,
} from "react";

import {
	powerUpState,
} from "./gameStore";


const POWER_UP_NAMES = {
	rapid: "RAPID FIRE",
	speed: "BOOST",
	shield: "SHIELD",
};


const POWER_UP_NOTICE_DURATION =
	1.25;


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


	// ----------------------------------------------------
	// Remaining duration for timed power-ups
	// ----------------------------------------------------

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


	// ----------------------------------------------------
	// Power-up collection notification
	// ----------------------------------------------------

	const collectionAge =
		now -
		powerUpState
			.lastCollectedAt;


	const showCollectionNotice =
		Boolean(
			powerUpState
				.lastCollectedType
		) &&
		collectionAge >= 0 &&
		collectionAge <
		POWER_UP_NOTICE_DURATION;


	// ----------------------------------------------------
	// Whether persistent power-up HUD is needed
	// ----------------------------------------------------

	const hasPowerUp =
		rapidRemaining > 0 ||
		speedRemaining > 0 ||
		shieldActive;


	return (
		<>
			{/* -------------------------------------------- */}
			{/* Collection notification */}
			{/* -------------------------------------------- */}

			{showCollectionNotice && (
				<div
					className={
						`power-up-collected power-up-collected--${powerUpState.lastCollectedType}`
					}
				>
					<span>
						POWER-UP ACQUIRED
					</span>


					<strong>
						{
							POWER_UP_NAMES[
							powerUpState
								.lastCollectedType
							]
						}
					</strong>
				</div>
			)}


			{/* -------------------------------------------- */}
			{/* Active power-up HUD */}
			{/* -------------------------------------------- */}

			{hasPowerUp && (
				<div className="power-up-hud">
					{/* ---------------------------------------- */}
					{/* Rapid Fire */}
					{/* ---------------------------------------- */}

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


					{/* ---------------------------------------- */}
					{/* Speed Boost */}
					{/* ---------------------------------------- */}

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


					{/* ---------------------------------------- */}
					{/* Shield */}
					{/* ---------------------------------------- */}

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
			)}
		</>
	);
}