"use client";

import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const StarryCeiling = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Animate the stars slowly
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime(); // Increased time multiplier for more visible movement
    }
  });

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh position={[0, 99, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[30, 100]} />
        <shaderMaterial
          ref={materialRef}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uAspect: { value: 100 / 30 }, // height/width ratio
          }}
          vertexShader={`
            varying vec2 vUv;

            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform float uAspect;
            varying vec2 vUv;

            // Random function for star placement
            float random(vec2 st) {
              return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
              vec3 skyColor = vec3(0.01, 0.01, 0.03);

              vec2 uv = vUv;
              uv.y *= uAspect; // Adjust for plane aspect ratio // Correct aspect ratio to prevent stretching

              // Create stars with movement
              uv *= 20.0; // Scale for more stars
              vec2 movingUv = uv + vec2(uTime * 0.5, uTime * 0.25); // Increased movement speed for more visible drift

              vec2 gridUv = fract(movingUv);
              vec2 gridId = floor(movingUv);

              // Random star brightness based on grid cell
              float starRandom = random(gridId);

              // Create star point (center of each cell)
              float star = 0.0;
              if (starRandom > 0.92) { // Only 8% of cells have stars
                float dist = length(gridUv - 0.5);
                star = smoothstep(0.05, 0.0, dist);

                // Twinkle effect
                float twinkle = sin(uTime * 3.0 + starRandom * 100.0) * 0.3 + 0.7;
                star *= twinkle;
              }

              // Mix sky color with stars
              vec3 color = mix(skyColor, vec3(1.0, 1.0, 0.95), star);

              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>
      <CuboidCollider args={[15, 2, 50]} position={[0, 12, 0]} />
    </RigidBody>
  );
};

export default StarryCeiling;
