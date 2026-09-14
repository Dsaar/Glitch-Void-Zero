export default function Leaderboard({
	entries,
	loading = false,
	error = "",
}) {
	return (
		<div className="leaderboard">
			<div className="leaderboard__heading">
				HIGH SCORES
			</div>


			{loading || error ? (
                <div className="leaderboard__empty" role="status">{loading ? "LOADING HIGH SCORES…" : error}</div>
            ) : entries.length ===
				0 ? (
				<div className="leaderboard__empty">
					NO SIGNALS RECORDED
				</div>
			) : (
				<div className="leaderboard__entries">
					{entries.map(
						(
							entry,
							index
						) => (
							<div
								key={
									entry.id
								}

								className="leaderboard__row"
							>
								<span className="leaderboard__rank">
									{String(
										index + 1
									).padStart(
										2,
										"0"
									)}
								</span>


								<span className="leaderboard__name">
									{
										entry.name
									}
								</span>


								<span className="leaderboard__score">
									{entry.score
										.toString()
										.padStart(
											6,
											"0"
										)}
								</span>
							</div>
						)
					)}
				</div>
			)}
		</div>
	);
}