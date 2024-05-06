import React, { useRef, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as THREE from "three";

export default function Particles() {
  const texture = useTexture("./images/ellipse.png");
  // const { scene } = useGLTF("./models/particles/robotic_eye.glb");
  const { scene } = useGLTF("./models/particles/phantoms.glb");
  const mesh = useRef(scene.children[3].children[0]); // 첫 번째 자식을 기본 메시로 사용
  // const mesh = useRef(scene.children[0].children[0].children[0].children[0]); // 첫 번째 자식을 기본 메시로 사용

  // console.log(scene.children[3].children[0]);

  const particlesGeometry = useMemo(() => {
    if (
      !mesh.current ||
      !mesh.current.geometry ||
      !mesh.current.geometry.index
    ) {
      console.error("Mesh is not ready or does not have geometry/index.");
      return null;
    }

    const sampler = new MeshSurfaceSampler(mesh.current).build();
    const numParticles = 15000;
    const particles = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3); // 색상 배열 추가

    let minY = Infinity,
      maxY = -Infinity;

    for (let i = 0; i < numParticles; i++) {
      const position = new THREE.Vector3();
      sampler.sample(position);
      position.toArray(particles, i * 3);
      minY = Math.min(minY, position.y);
      maxY = Math.max(maxY, position.y);
    }

    //색상계산
    for (let i = 0; i < numParticles; i++) {
      const y = particles[i * 3 + 1];
      const t = (y - minY) / (maxY - minY);
      let r, g, b;

      if (t < 0.5) {
        r = 0;
        g = 255 * (t * 2); // t*2 because we need to go from 181 to 255 in half the distance
        b = 250 * (t * 2); // Increase blue less aggressively
      } else {
        r = 0 * (1 - (t - 0.45) * 2); // Decrease red component in the second half
        g = 255 * (1 - (t - 0.45) * 2); // Decrease green component in the second half
        b = 100 + (100 - 80) * ((t - 0.45) * 2); // Increase blue component from 255 to 83
      }

      colors[i * 3 + 0] = r / 255;
      colors[i * 3 + 1] = g / 255;
      colors[i * 3 + 2] = b / 100;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(particles, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); // 색상 속성 설정

    return geometry;
  }, [mesh.current]);

  if (!particlesGeometry) {
    return null;
  }

  return (
    <points geometry={particlesGeometry} scale={0.25} rotation={[0, 0, 0]}>
      <pointsMaterial
        map={texture}
        size={0.05}
        sizeAttenuation={true}
        vertexColors={true}
        transparent
        opacity={0.5}
        alphaTest={0.1}
        depthWrite={false}
      />
    </points>
  );
}
