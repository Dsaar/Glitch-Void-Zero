import { Canvas } from "@react-three/fiber";

import GlitchTerrain from "./components/glitch/GlitchTerrain";
import TerrainPreviewRig from "./components/glitch/TerrainPreviewRig";


function App() {
  return (
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
        antialias: false,
        powerPreference: "high-performance",
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

      <GlitchTerrain />

      <TerrainPreviewRig />
    </Canvas>
  );
}


export default App;