import {
	useEffect,
	useState,
} from "react";


function getInitialValue() {
	if (
		typeof window ===
		"undefined"
	) {
		return false;
	}


	return window
		.matchMedia(
			"(pointer: coarse)"
		)
		.matches;
}


export default function useTouchDevice() {
	const [
		isTouchDevice,
		setIsTouchDevice,
	] =
		useState(
			getInitialValue
		);


	useEffect(() => {
		const mediaQuery =
			window.matchMedia(
				"(pointer: coarse)"
			);


		const handleChange = (
			event
		) => {
			setIsTouchDevice(
				event.matches
			);
		};


		mediaQuery.addEventListener(
			"change",
			handleChange
		);


		return () => {
			mediaQuery.removeEventListener(
				"change",
				handleChange
			);
		};
	}, []);


	return isTouchDevice;
}