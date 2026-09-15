let nextId = 1;


export const genId = () => {
	const id = nextId;

	nextId += 1;

	return id;
};


// ------------------------------------------------------
// Mutable player position
// ------------------------------------------------------

export const playerState = {
	x: 0,
	y: 5,
};


// ------------------------------------------------------
// Mutable invulnerability state
// ------------------------------------------------------

export const invulnState = {
	until: 0,
};


// ------------------------------------------------------
// Mutable power-up state
// ------------------------------------------------------

export const powerUpState = {
	rapidFireUntil: 0,

	speedUntil: 0,

	shieldActive: false,

	lastCollectedType: null,

	lastCollectedAt: 0,
};
