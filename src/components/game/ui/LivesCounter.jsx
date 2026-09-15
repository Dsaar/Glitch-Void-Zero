const MAX_LIVES = 3;

function ShipIcon({ dim }) {
	return (
		<svg
			viewBox="0 0 24 24"
			className="life-icon"
			aria-hidden="true"
			style={{
				filter: dim ? "none" : "drop-shadow(0 0 6px rgba(0,229,255,0.8))",
				opacity: dim ? 0.2 : 1,
				transition: "opacity 0.3s",
			}}
		>
			<path d="M12 2 L15 14 L12 11.5 L9 14 Z M9 14 L4 20 L11 17 Z M15 14 L20 20 L13 17 Z" fill="#00e5ff" />
		</svg>
	);
}


export default function LivesCounter({
	lives,
}) {
	return (
		<div
			className="lives-counter"
			aria-label={`${lives} lives remaining`}
		>
			<span className="hud-label">
				HULL
			</span>


			<div className="life-icons">
				{Array.from(
					{
						length:
							MAX_LIVES,
					},
					(
						_,
						index
					) => {
						const active =
							index <
							lives;


						return (
							<ShipIcon key={index} dim={!active} />
						);
					}
				)}
			</div>
		</div>
	);
}