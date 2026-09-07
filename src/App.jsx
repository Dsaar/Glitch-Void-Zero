import {
  Canvas,
} from "@react-three/fiber";

import AimReticle from "./components/game/AimReticle";

import FlightRig from "./components/game/FlightRig";

import GameStateOverlay from "./components/game/GameStateOverlay";

import PlayerShip from "./components/game/PlayerShip";

import Projectile from "./components/game/Projectile";

import {
  useGameStore,
} from "./components/game/gameStore";

import {
  useKeyboard,
} from "./components/game/useKeyboard";

import GlitchTerrain from "./components/glitch/GlitchTerrain";

import NeonStarfield from "./components/glitch/NeonStarfield";


function App() {
  useKeyboard();


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


  return (
    <>
      <GameStateOverlay />


      <Canvas
        camera={{
          position: [
            0,
            8.5,
            16,
          ],

          fov: 62,

          near: 0.1,

          far: 500,
        }}

        dpr={[
          1,
          1.5,
        ]}

        gl={{
          antialias:
            false,

          powerPreference:
            "high-performance",
        }}
      >
        {/* -------------------------------------------- */}
        {/* Background */}
        {/* -------------------------------------------- */}

        <color
          attach="background"
          args={[
            "#030304",
          ]}
        />


        <fog
          attach="fog"
          args={[
            "#030304",
            60,
            220,
          ]}
        />


        {/* -------------------------------------------- */}
        {/* Lighting */}
        {/* -------------------------------------------- */}

        <ambientLight
          intensity={1.4}
        />


        <directionalLight
          position={[
            5,
            10,
            8,
          ]}
          intensity={3}
        />


        <directionalLight
          position={[
            -6,
            4,
            -5,
          ]}
          intensity={1.5}
        />


        {/* -------------------------------------------- */}
        {/* Environment */}
        {/* -------------------------------------------- */}

        <NeonStarfield />


        <GlitchTerrain />


        {/* -------------------------------------------- */}
        {/* Flight system */}
        {/* -------------------------------------------- */}

        <FlightRig />


        {/* -------------------------------------------- */}
        {/* Player */}
        {/* -------------------------------------------- */}

        {phase ===
          "playing" && (
            <PlayerShip />
          )}


        {/* -------------------------------------------- */}
        {/* Aim reticle */}
        {/* -------------------------------------------- */}

        {phase ===
          "playing" && (
            <AimReticle />
          )}


        {/* -------------------------------------------- */}
        {/* Projectiles */}
        {/* -------------------------------------------- */}

        {projectiles.map(
          (projectile) => (
            <Projectile
              key={
                projectile.id
              }
              {...projectile}
            />
          )
        )}
      </Canvas>
    </>
  );
}


export default App;