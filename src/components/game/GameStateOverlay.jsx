import {
	useGameStore,
} from "./gameStore";


const overlayStyle = {
	position: "fixed",
	top: 20,
	left: 20,
	zIndex: 10,

	color: "#ffffff",

	fontFamily:
		"monospace",

	pointerEvents: "auto",
};


const buttonStyle = {
	marginTop: 10,
	padding: "10px 16px",

	border:
		"1px solid #00e5ff",

	background:
		"rgba(0, 10, 20, 0.85)",

	color: "#00e5ff",

	fontFamily:
		"monospace",

	cursor: "pointer",
};


export default function GameStateOverlay() {
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

	const endGame =
		useGameStore(
			(state) =>
				state.endGame
		);


	return (
		<div style={overlayStyle}>
			<div>
				PHASE: {phase}
			</div>

			<div>
				SCORE: {score}
			</div>

			<div>
				LIVES: {lives}
			</div>


			{phase !==
				"playing" && (
					<button
						type="button"
						style={
							buttonStyle
						}
						onClick={
							startGame
						}
					>
						START INPUT TEST
					</button>
				)}


			{phase ===
				"playing" && (
					<button
						type="button"
						style={
							buttonStyle
						}
						onClick={
							endGame
						}
					>
						END TEST
					</button>
				)}


			{phase ===
				"playing" && (
					<div
						style={{
							marginTop: 12,
							opacity: 0.7,
							lineHeight: 1.6,
						}}
					>
						WASD / ARROWS
						<br />
						SPACE = FIRE
					</div>
				)}
		</div>
	);
}