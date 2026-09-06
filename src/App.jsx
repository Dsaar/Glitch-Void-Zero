import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function RotatingCube() {
  const cubeRef = useRef();

  useFrame((_, delta) => {
    if (!cubeRef.current) return;

    cubeRef.current.rotation.x += delta * 0.4;
    cubeRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#00ffff" />
    </mesh>
  );
}

function App() {
  return (
    <Canvas
      camera={{
        position: [0, 2, 8],
        fov: 62,
        near: 0.1,
        far: 500,
      }}
    >
      <color attach="background" args={["#030304"]} />

      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
      />

      <RotatingCube />
    </Canvas>
  );
}

export default App;