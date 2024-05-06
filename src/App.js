import React from "react";
import { Canvas } from "@react-three/fiber";

import Particle from "./Components/Particle";
import { Float, OrbitControls, Ring, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { RoboticEye } from "./Components/RoboticEye";

export default function App() {
  const modelPaths = [
    "./models/particles/DamagedHelmet.glb",
    "./models/particles/phantoms.glb",
    "./models/particles/robotic_eye.glb",
  ];
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <color attach="background" args={["#111"]} />
      <ambientLight intensity={50} />
      <spotLight
        position={[10, 10, 10]}
        angle={THREE.MathUtils.degToRad(30)}
        penumbra={1}
        intensity={100}
      />
      <OrbitControls />

      <Sparkles size={4} color={"#fff"} scale={[20, 20, 20]}></Sparkles>
      <Float
        speed={4} // Animation speed, defaults to 1
        rotationIntensity={1} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatingRange={[0, 0]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        <Particle modelPaths={modelPaths} />
      </Float>
      {/* <RoboticEye scale={50} rotation={[0, 2.4, 0]} /> */}
    </Canvas>
  );
}
