const MAX_LIVES = 3;


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
							<span
								key={
									index
								}

								className={
									active
										? "life-icon life-icon--active"
										: "life-icon life-icon--lost"
								}
							>
								◆
							</span>
						);
					}
				)}
			</div>
		</div>
	);
}