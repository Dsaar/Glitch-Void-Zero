import {
	useState,
} from "react";


import LivesCounter from "./LivesCounter";

import PowerUpHUD from "./PowerUpHUD";

import TouchControls from "./TouchControls";

import {
	getLeaderboard,
	saveScore,
} from "./leaderboardStorage.js";

import {
	useGameStore,
} from "./gameStore";

import useTouchDevice from "./useTouchDevice";
import Leaderboard from "./Leaderboard.jsx";


export default function GameUI() {
	// ----------------------------------------------------
	// Game state
	// ----------------------------------------------------

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


	// ----------------------------------------------------
	// Device detection
	// ----------------------------------------------------

	const isTouchDevice =
		useTouchDevice();


	// ----------------------------------------------------
	// Leaderboard
	// ----------------------------------------------------

	const [
		leaderboard,
		setLeaderboard,
	] =
		useState(
			getLeaderboard
		);


	const [
		callsign,
		setCallsign,
	] =
		useState("");


	const [
		scoreSubmitted,
		setScoreSubmitted,
	] =
		useState(
			false
		);


	// ----------------------------------------------------
	// Start / restart
	// ----------------------------------------------------

	const handleStartGame =
		() => {
			setCallsign("");

			setScoreSubmitted(
				false
			);


			startGame();
		};


	// ----------------------------------------------------
	// Callsign input
	// ----------------------------------------------------

	const handleCallsignChange =
		(
			event
		) => {
			const value =
				event.target.value
					.toUpperCase()
					.replace(
						/[^A-Z0-9]/g,
						""
					)
					.slice(
						0,
						3
					);


			setCallsign(
				value
			);
		};


	// ----------------------------------------------------
	// Save score
	// ----------------------------------------------------

	const handleSubmitScore =
		(
			event
		) => {
			event.preventDefault();


			if (
				scoreSubmitted ||
				callsign.length ===
				0
			) {
				return;
			}


			const nextLeaderboard =
				saveScore(
					callsign,
					score
				);


			setLeaderboard(
				nextLeaderboard
			);


			setScoreSubmitted(
				true
			);
		};


	return (
		<div className="game-ui">
			{/* ============================================ */}
			{/* Playing */}
			{/* ============================================ */}

			{phase ===
				"playing" && (
					<>
						{/* ---------------------------------------- */}
						{/* Top HUD */}
						{/* ---------------------------------------- */}

						<div className="hud-top">
							{/* Score */}

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


							{/* Lives */}

							<LivesCounter
								lives={
									lives
								}
							/>
						</div>


						{/* ---------------------------------------- */}
						{/* Power-ups */}
						{/* ---------------------------------------- */}

						<PowerUpHUD />


						{/* ---------------------------------------- */}
						{/* Desktop controls */}
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


			{/* ============================================ */}
			{/* Main menu */}
			{/* ============================================ */}

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
								handleStartGame
							}
						>
							START MISSION
						</button>


						{/* ---------------------------------------- */}
						{/* Controls */}
						{/* ---------------------------------------- */}

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


						{/* ---------------------------------------- */}
						{/* Leaderboard */}
						{/* ---------------------------------------- */}

						<Leaderboard
							entries={
								leaderboard
							}
						/>
					</div>
				)}


			{/* ============================================ */}
			{/* Game over */}
			{/* ============================================ */}

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


						{/* ---------------------------------------- */}
						{/* Final score */}
						{/* ---------------------------------------- */}

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


						{/* ---------------------------------------- */}
						{/* Callsign / score submission */}
						{/* ---------------------------------------- */}

						{!scoreSubmitted ? (
							<form
								className="score-entry"

								onSubmit={
									handleSubmitScore
								}
							>
								<label
									htmlFor="callsign"

									className="score-entry__label"
								>
									RECORD CALLSIGN
								</label>


								<input
									id="callsign"

									className="score-entry__input"

									type="text"

									inputMode="text"

									autoComplete="off"

									maxLength={3}

									value={
										callsign
									}

									onChange={
										handleCallsignChange
									}

									placeholder="AAA"

									aria-label="Three character callsign"
								/>


								<button
									type="submit"

									className="score-entry__button"

									disabled={
										callsign.length ===
										0
									}
								>
									TRANSMIT SCORE
								</button>
							</form>
						) : (
							<div className="score-entry__confirmed">
								SCORE TRANSMITTED
							</div>
						)}


						{/* ---------------------------------------- */}
						{/* Leaderboard */}
						{/* ---------------------------------------- */}

						<Leaderboard
							entries={
								leaderboard
							}
						/>


						{/* ---------------------------------------- */}
						{/* Restart */}
						{/* ---------------------------------------- */}

						<button
							type="button"

							className="game-button game-button--danger"

							onClick={
								handleStartGame
							}
						>
							RESTART MISSION
						</button>
					</div>
				)}
		</div>
	);
}