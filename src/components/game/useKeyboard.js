import { useEffect } from "react";


// ------------------------------------------------------
// Mutable key-state map
// ------------------------------------------------------
//
// Example:
//
// keys.KeyW === true
// keys.ArrowLeft === true
// keys.Space === true
//
// Three.js components can read this directly
// inside useFrame().
// ------------------------------------------------------

export const keys = {};


export function useKeyboard() {
	useEffect(() => {
		const handleKeyDown = (
			event
		) => {
			keys[event.code] = true;


			if (
				event.code === "Space" ||
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
			keys[event.code] = false;
		};


		const handleBlur = () => {
			Object.keys(
				keys
			).forEach((key) => {
				keys[key] = false;
			});
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