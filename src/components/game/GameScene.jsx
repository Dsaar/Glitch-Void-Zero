import { useGameStore } from "../../hooks/useGameStore";

import {
	Suspense,
} from "react";

import {
	Physics,
} from "@react-three/rapier";

import AimReticle from "./ui/AimReticle";

import Enemy from "./entities/Enemy";

import EnemySpawner from "./EnemySpawner";

import Explosion from "./entities/Explosion";

import PlayerShip from "./entities/PlayerShip";

import PowerUp from "./entities/PowerUp";

import Projectile from "./entities/Projectile";



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


	const powerUps =
		useGameStore(
			(state) =>
				state.powerUps
		);


	const explosions =
		useGameStore(
			(state) =>
				state.explosions
		);


	return (
		<Suspense
			fallback={
				null
			}
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
				{/* ------------------------------------------ */}
				{/* Player */}
				{/* ------------------------------------------ */}

				{phase ===
					"playing" && (
						<PlayerShip />
					)}


				{/* ------------------------------------------ */}
				{/* Targeting */}
				{/* ------------------------------------------ */}

				{phase ===
					"playing" && (
						<AimReticle />
					)}


				{/* ------------------------------------------ */}
				{/* Enemy spawning */}
				{/* ------------------------------------------ */}

				<EnemySpawner />


				{/* ------------------------------------------ */}
				{/* Projectiles */}
				{/* ------------------------------------------ */}

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


				{/* ------------------------------------------ */}
				{/* Enemies */}
				{/* ------------------------------------------ */}

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


				{/* ------------------------------------------ */}
				{/* Power-ups */}
				{/* ------------------------------------------ */}

				{powerUps.map(
					(
						powerUp
					) => (
						<PowerUp
							key={
								powerUp.id
							}

							{...powerUp}
						/>
					)
				)}


				{/* ------------------------------------------ */}
				{/* Explosions */}
				{/* ------------------------------------------ */}

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