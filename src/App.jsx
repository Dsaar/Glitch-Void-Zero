import {
  Canvas,
} from "@react-three/fiber";

import FlightRig from "./components/game/FlightRig";

import GameStateOverlay from "./components/game/GameStateOverlay";

import PlayerShip from "./components/game/PlayerShip";

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


        <NeonStarfield />


        <GlitchTerrain />


        <FlightRig />


        {phase ===
          "playing" && (
            <PlayerShip />
          )}
      </Canvas>
    </>
  );
}


export default App;