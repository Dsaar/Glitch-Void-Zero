export const touchState = {
	horizontal: 0,
	vertical: 0,
	fire: false,
};


export function resetTouchState() {
	touchState.horizontal = 0;
	touchState.vertical = 0;
	touchState.fire = false;
}