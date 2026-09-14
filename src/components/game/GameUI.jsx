import {
	useState,
	useEffect,
	useRef,
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
			[]
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


	const [leaderboardLoading, setLeaderboardLoading] = useState(true);
	const [leaderboardError, setLeaderboardError] = useState("");
	const [savingScore, setSavingScore] = useState(false);
	const [saveError, setSaveError] = useState("");
	const submissionPending = useRef(false);
	const mission = useRef(0);
	const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		getLeaderboard(AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]))
			.then((entries) => {
				if (!controller.signal.aborted) {
					setLeaderboard(entries);
					setLeaderboardError("");
				}
			})
			.catch(() => {
				if (!controller.signal.aborted) setLeaderboardError("HIGH SCORES UNAVAILABLE");
			})
			.finally(() => {
				if (!controller.signal.aborted) setLeaderboardLoading(false);
			});
		return () => controller.abort();
	}, [phase, refreshLeaderboard]);


	// ----------------------------------------------------
	// Start / restart
	// ----------------------------------------------------

	const handleStartGame =
		() => {
			setCallsign("");
			mission.current += 1;
			submissionPending.current = false;
			setSavingScore(false);
			setSaveError("");

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

	const handleSubmitScore = async (event) => {
		event.preventDefault();
		if (scoreSubmitted || submissionPending.current || !callsign.length) return;
		const submittedMission = mission.current;
		submissionPending.current = true;
		setSavingScore(true);
		setSaveError("");
		try {
			await saveScore(callsign, score);
			if (mission.current !== submittedMission) return;
			setScoreSubmitted(true);
			setRefreshLeaderboard((value) => value + 1);
		} catch {
			if (mission.current === submittedMission) setSaveError("TRANSMISSION FAILED. PLEASE TRY AGAIN.");
		} finally {
			if (mission.current === submittedMission) {
				submissionPending.current = false;
				setSavingScore(false);
			}
		}
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
                            loading={leaderboardLoading}
                            error={leaderboardError}
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
										savingScore || callsign.length ===
										0
									}
								>
									{savingScore ? "TRANSMITTING…" : "TRANSMIT SCORE"}
								</button>
							{saveError && <div role="alert" className="leaderboard__empty">{saveError}</div>}
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
                            loading={leaderboardLoading}
                            error={leaderboardError}
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