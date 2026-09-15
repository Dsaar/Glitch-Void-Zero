import {
	useEffect,
} from "react";


export const keys = {};


function isTypingTarget(
	target
) {
	return (
		target instanceof
		HTMLInputElement ||
		target instanceof
		HTMLTextAreaElement
	);
}


export function useKeyboard() {
	useEffect(() => {
		const handleKeyDown = (
			event
		) => {
			// ----------------------------------------------
			// Ignore game controls while the player is
			// typing into a form field, such as the
			// leaderboard callsign input.
			// ----------------------------------------------

			if (
				isTypingTarget(
					event.target
				)
			) {
				return;
			}


			keys[event.code] =
				true;


			// ----------------------------------------------
			// Prevent browser scrolling while playing.
			// ----------------------------------------------

			if (
				event.code ===
				"Space" ||
				event.code.startsWith(
					"Arrow"
				)
			) {
				event.preventDefault();
			}
		};


		const handleKeyUp = (
			event
		) => {
			if (
				isTypingTarget(
					event.target
				)
			) {
				return;
			}


			keys[event.code] =
				false;
		};


		const handleBlur = () => {
			Object.keys(
				keys
			).forEach(
				(key) => {
					keys[key] =
						false;
				}
			);
		};


		window.addEventListener(
			"keydown",
			handleKeyDown
		);


		window.addEventListener(
			"keyup",
			handleKeyUp
		);


		window.addEventListener(
			"blur",
			handleBlur
		);


		return () => {
			window.removeEventListener(
				"keydown",
				handleKeyDown
			);


			window.removeEventListener(
				"keyup",
				handleKeyUp
			);


			window.removeEventListener(
				"blur",
				handleBlur
			);
		};
	}, []);
}