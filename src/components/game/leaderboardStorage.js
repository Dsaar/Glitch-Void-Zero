const STORAGE_KEY =
	"glitch-void-zero-leaderboard";

const MAX_ENTRIES = 10;


export function getLeaderboard() {
	try {
		const stored =
			window.localStorage.getItem(
				STORAGE_KEY
			);


		if (!stored) {
			return [];
		}


		const parsed =
			JSON.parse(
				stored
			);


		if (
			!Array.isArray(
				parsed
			)
		) {
			return [];
		}


		return parsed
			.filter(
				(entry) =>
					typeof entry?.score ===
					"number" &&
					typeof entry?.name ===
					"string"
			)
			.sort(
				(a, b) =>
					b.score -
					a.score
			)
			.slice(
				0,
				MAX_ENTRIES
			);
	} catch (
	error
	) {
		console.warn(
			"Unable to read leaderboard:",
			error
		);


		return [];
	}
}


export function saveScore(
	name,
	score
) {
	const cleanName =
		name
			.trim()
			.toUpperCase()
			.replace(
				/[^A-Z0-9]/g,
				""
			)
			.slice(
				0,
				3
			);


	if (
		cleanName.length === 0
	) {
		return getLeaderboard();
	}


	const entry = {
		id:
			`${Date.now()}-${Math.random()}`,

		name:
			cleanName,

		score,

		createdAt:
			new Date()
				.toISOString(),
	};


	const next =
		[
			...getLeaderboard(),
			entry,
		]
			.sort(
				(a, b) =>
					b.score -
					a.score
			)
			.slice(
				0,
				MAX_ENTRIES
			);


	try {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(
				next
			)
		);
	} catch (
	error
	) {
		console.warn(
			"Unable to save leaderboard:",
			error
		);
	}


	return next;
}