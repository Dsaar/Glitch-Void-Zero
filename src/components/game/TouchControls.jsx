import {
	useEffect,
} from "react";

import FireButton from "./FireButton";

import VirtualJoystick from "./VirtualJoystick";

import {
	resetTouchState,
} from "./touchState";


export default function TouchControls() {
	useEffect(() => {
		return () => {
			resetTouchState();
		};
	}, []);


	return (
		<div className="touch-controls">
			<div className="touch-controls__left">
				<VirtualJoystick />
			</div>


			<div className="touch-controls__right">
				<FireButton />
			</div>
		</div>
	);
}