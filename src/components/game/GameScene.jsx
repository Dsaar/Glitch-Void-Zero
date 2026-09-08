import {
	Suspense,
} from "react";

import {
	Physics,
} from "@react-three/rapier";

import AimReticle from "./AimReticle";

import Enemy from "./Enemy";

import EnemySpawner from "./EnemySpawner";

import Explosion from "./Explosion";

import PlayerShip from "./PlayerShip";

import Projectile from "./Projectile";

import {
	useGameStore,
} from "./gameStore";


export default function GameScene() {
	const phase =
		useGameStore(
			(state) =>
				state.phase
		);


	const projectiles =
		useGameStore(
			(state) =>
				state.projectiles
		);


	const enemies =
		useGameStore(
			(state) =>
				state.enemies
		);


	const explosions =
		useGameStore(
			(state) =>
				state.explosions
		);


	return (
		<Suspense
			fallback={null}
		>
			<Physics
				gravity={[
					0,
					0,
					0,
				]}

				colliders={
					false
				}
			>
				{phase ===
					"playing" && (
						<PlayerShip />
					)}


				{phase ===
					"playing" && (
						<AimReticle />
					)}


				<EnemySpawner />


				{projectiles.map(
					(
						projectile
					) => (
						<Projectile
							key={
								projectile.id
							}

							{...projectile}
						/>
					)
				)}


				{enemies.map(
					(
						enemy
					) => (
						<Enemy
							key={
								enemy.id
							}

							{...enemy}
						/>
					)
				)}


				{explosions.map(
					(
						explosion
					) => (
						<Explosion
							key={
								explosion.id
							}

							{...explosion}
						/>
					)
				)}
			</Physics>
		</Suspense>
	);
}