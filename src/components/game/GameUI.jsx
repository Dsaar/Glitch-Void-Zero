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


	const [menuPage, setMenuPage] = useState("home");
	const leaderboardButtonRef = useRef(null);
	const backButtonRef = useRef(null);
	const navigateMenu = (page) => {
		setMenuPage(page);
		if (page === "leaderboard") {
			setLeaderboardLoading(true);
			setLeaderboardError("");
			setRefreshLeaderboard((value) => value + 1);
		}
	};
	useEffect(() => {
		if (phase !== "menu") return;
		if (menuPage === "leaderboard") backButtonRef.current?.focus();
	}, [menuPage, phase]);
	const backToMenu = () => {
		setMenuPage("home");
		requestAnimationFrame(() => leaderboardButtonRef.current?.focus());
	};

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

            {phase === "menu" && menuPage === "home" && (
                <section className="screen-panel screen-panel--home" aria-label="Main menu">
                    <div className="signal-tag">INCOMING TRANSMISSION</div>
                    <h1 className="game-title">GLITCH<br />VOID<br />ZERO</h1>
                    <p className="game-subtitle">
                        {isTouchDevice ? "JOYSTICK TO FLY · FIRE BUTTON TO SHOOT" : "WASD / ARROWS TO FLY · SPACE TO FIRE"}
                    </p>
                    <div className="menu-actions">
                        <button type="button" className="game-button" onClick={handleStartGame}>START MISSION</button>
                        <button ref={leaderboardButtonRef} type="button" className="game-button" onClick={() => navigateMenu("leaderboard")}>LEADERBOARD</button>
                    </div>
                </section>
            )}

            {phase === "menu" && menuPage === "leaderboard" && (
                <section className="screen-panel screen-panel--leaderboard" aria-label="Leaderboard" onKeyDown={(event) => {
                    if (event.key === "Escape") backToMenu();
                }}>
                    <button ref={backButtonRef} type="button" className="game-button" onClick={backToMenu}>BACK</button>
                    <Leaderboard title="TOP PILOTS" loading={leaderboardLoading} error={leaderboardError} entries={leaderboard} />
                    {leaderboardError && <button type="button" className="game-button leaderboard-retry" onClick={() => navigateMenu("leaderboard")}>RETRY</button>}
                </section>
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
