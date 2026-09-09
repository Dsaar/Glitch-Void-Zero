import {
  Canvas,
} from "@react-three/fiber";

import FlightRig from "./components/game/FlightRig";

import GameScene from "./components/game/GameScene";

import GameUI from "./components/game/GameUI";

import {
  useKeyboard,
} from "./components/game/useKeyboard";

import GlitchTerrain from "./components/glitch/GlitchTerrain";

import NeonStarfield from "./components/glitch/NeonStarfield";


function App() {
  useKeyboard();


  return (
    <>
      <GameUI />


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
        {/* ------------------------------------------ */}
        {/* Environment */}
        {/* ------------------------------------------ */}

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


        {/* ------------------------------------------ */}
        {/* Lighting */}
        {/* ------------------------------------------ */}

        <ambientLight
          intensity={
            1.4
          }
        />


        <directionalLight
          position={[
            5,
            10,
            8,
          ]}

          intensity={
            3
          }
        />


        <directionalLight
          position={[
            -6,
            4,
            -5,
          ]}

          intensity={
            1.5
          }
        />


        {/* ------------------------------------------ */}
        {/* World */}
        {/* ------------------------------------------ */}

        <NeonStarfield />


        <GlitchTerrain />


        <FlightRig />


        {/* ------------------------------------------ */}
        {/* Game */}
        {/* ------------------------------------------ */}

        <GameScene />
      </Canvas>
    </>
  );
}


export default App;