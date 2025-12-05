"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import GIF from "@/type/GIF";
import GifDisplay from "./GifDisplay";

interface GifWallProps {
  gifs: Array<GIF>;
  position: [number, number, number];
  rotation: [number, number, number];
  onEnter?: (authorName: string, currentTitle: string) => void;
  onExit?: () => void;
}

const GifWall = ({
  gifs,
  position,
  rotation,
  onEnter,
  onExit,
}: GifWallProps) => {
  const SIZE: [number, number, number] = [10, 5, 2];
  const COLUMNS = 2;
  const SPACING_X = 4; // Horizontal spacing between GIFs
  const MAX_GIFS = 4;

  const displayGifs = gifs.slice(0, MAX_GIFS);
  displayGifs.sort((a, b) => a.id - b.id);

  const lightRef = useRef<THREE.SpotLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);

  const lightYPosition = 20;
  const halfSpacingX = ((COLUMNS - 1) * SPACING_X) / 2;

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
      lightRef.current.target.updateMatrixWorld(true);
    }
  }, []);

  return (
    <>
      {/* Lights */}
      <spotLight
        ref={lightRef}
        position={[position[0], lightYPosition, position[2] + 10]}
        intensity={80}
        penumbra={0.5}
        angle={0.5}
        castShadow
      />
      <object3D ref={targetRef} position={[position[0], 0, position[2] + 10]} />
      <pointLight
        intensity={6}
        position={[position[0], position[1], position[2]]}
      />

      {/* Walls */}
      <mesh position={position} rotation={rotation} receiveShadow>
        <boxGeometry args={SIZE} />
        <meshStandardMaterial
          color="#f5f5f5"
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* GIFs */}
      {displayGifs.map((gif, index) => {
        const isBackSide = index >= 2;
        const localIndex = index % 2;

        const sideOffset = isBackSide ? -SIZE[2] / 2 - 0.1 : SIZE[2] / 2 + 0.1;
        const col = localIndex;

        const displayPosition: [number, number, number] = [
          position[0] - halfSpacingX + col * SPACING_X,
          position[1],
          position[2] + sideOffset,
        ];

        const gifRotation: [number, number, number] = isBackSide
          ? [0, Math.PI, 0]
          : [0, 0, 0];

        return (
          <GifDisplay
            key={gif.id}
            gif={gif}
            position={displayPosition}
            rotation={gifRotation}
            isBackSide={isBackSide}
            onEnter={onEnter}
            onExit={onExit}
          />
        );
      })}
    </>
  );
};

export default GifWall;
