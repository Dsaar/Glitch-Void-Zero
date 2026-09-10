import LivesCounter from "./LivesCounter";

import PowerUpHUD from "./PowerUpHUD";

import TouchControls from "./TouchControls";

import {
	useGameStore,
} from "./gameStore";

import useTouchDevice from "./useTouchDevice";


export default function GameUI() {
	const phase =
		useGameStore(
			(state) =>
				state.phase
		);


	const score =
		useGameStore(
			(state) =>
				state.score
		);


	const lives =
		useGameStore(
			(state) =>
				state.lives
		);


	const startGame =
		useGameStore(
			(state) =>
				state.startGame
		);


	const isTouchDevice =
		useTouchDevice();


	return (
		<div className="game-ui">
			{/* -------------------------------------------- */}
			{/* In-game HUD */}
			{/* -------------------------------------------- */}

			{phase ===
				"playing" && (
					<>
						<div className="hud-top">
							{/* -------------------------------------- */}
							{/* Score */}
							{/* -------------------------------------- */}

							<div className="score-display">
								<span className="hud-label">
									SCORE
								</span>


								<span className="score-value">
									{score
										.toString()
										.padStart(
											6,
											"0"
										)}
								</span>
							</div>


							{/* -------------------------------------- */}
							{/* Lives */}
							{/* -------------------------------------- */}

							<LivesCounter
								lives={
									lives
								}
							/>
						</div>


						{/* ---------------------------------------- */}
						{/* Power-up indicators */}
						{/* ---------------------------------------- */}

						<PowerUpHUD />


						{/* ---------------------------------------- */}
						{/* Desktop control hint */}
						{/* ---------------------------------------- */}

						{!isTouchDevice && (
							<div className="controls-hint">
								<span>
									WASD / ARROWS
								</span>


								<span className="controls-divider">
                //
								</span>


								<span>
									SPACE TO FIRE
								</span>
							</div>
						)}


						{/* ---------------------------------------- */}
						{/* Mobile controls */}
						{/* ---------------------------------------- */}

						{isTouchDevice && (
							<TouchControls />
						)}
					</>
				)}


			{/* -------------------------------------------- */}
			{/* Main menu */}
			{/* -------------------------------------------- */}

			{phase ===
				"menu" && (
					<div className="screen-panel">
						<div className="signal-tag">
							SYSTEM ONLINE
						</div>


						<h1 className="game-title">
							GLITCH
							<br />
							VOID ZERO
						</h1>


						<p className="game-subtitle">
							ENTER THE SIGNAL.
							<br />
							SURVIVE THE VOID.
						</p>


						<button
							type="button"

							className="game-button"

							onClick={
								startGame
							}
						>
							START MISSION
						</button>


						<div className="menu-controls">
							<span>
								MOVE
							</span>


							<strong>
								{isTouchDevice
									? "JOYSTICK"
									: "WASD / ARROWS"}
							</strong>


							<span>
								FIRE
							</span>


							<strong>
								{isTouchDevice
									? "FIRE BUTTON"
									: "SPACE"}
							</strong>
						</div>
					</div>
				)}


			{/* -------------------------------------------- */}
			{/* Game over */}
			{/* -------------------------------------------- */}

			{phase ===
				"gameover" && (
					<div className="screen-panel screen-panel--gameover">
						<div className="signal-tag signal-tag--danger">
							CONNECTION TERMINATED
						</div>


						<h2 className="game-over-title">
							SIGNAL
							<br />
							LOST
						</h2>


						<div className="final-score">
							<span>
								FINAL SCORE
							</span>


							<strong>
								{score
									.toString()
									.padStart(
										6,
										"0"
									)}
							</strong>
						</div>


						<button
							type="button"

							className="game-button game-button--danger"

							onClick={
								startGame
							}
						>
							RESTART MISSION
						</button>
					</div>
				)}
		</div>
	);
}