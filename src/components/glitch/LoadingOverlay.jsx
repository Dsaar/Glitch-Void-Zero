import {
	useProgress,
} from "@react-three/drei";


export default function LoadingOverlay() {
	const {
		active,
		progress,
		item,
	} =
		useProgress();


	if (!active) {
		return null;
	}


	return (
		<div className="loading-overlay">
			<div className="loading-overlay__content">
				<div className="loading-overlay__status">
					INITIALIZING SIGNAL
				</div>


				<h1 className="loading-overlay__title">
					GLITCH
					<br />
					VOID ZERO
				</h1>


				<div className="loading-overlay__bar">
					<div
						className="loading-overlay__progress"

						style={{
							width:
								`${Math.round(
									progress
								)}%`,
						}}
					/>
				</div>


				<div className="loading-overlay__details">
					<span>
						{Math.round(
							progress
						)}
						%
					</span>


					{item && (
						<span className="loading-overlay__item">
							{item
								.split("/")
								.pop()}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}