"use client";

import * as THREE from "three";
import GifLoader from "three-gif-loader";
import { useMemo } from "react";
import type GIF from "@/type/GIF";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

interface GifProps {
  gif: GIF;
  position: [number, number, number];
  rotation: [number, number, number];
  isBackSide: boolean;
  onEnter?: (authorName: string, currentTitle: string) => void;
  onExit?: () => void;
}

const GifDisplay = ({
  gif,
  position,
  rotation,
  isBackSide,
  onEnter,
  onExit,
}: GifProps) => {
  const gifTexture = useMemo(() => {
    const loader = new GifLoader();
    return loader.load(gif.thumbnail_url, () => {});
  }, [gif.thumbnail_url]);

  let gifSize: [number, number] = [3, 3];
  if (gif.tags.some((tag) => tag.slug === "rect")) {
    gifSize = [2, 4];
  }
  if (gif.tags.some((tag) => tag.slug === "horizontal")) {
    gifSize = [3.5, 2];
  }

  const colliderDistance = 3;
  const adjustedPosition: [number, number, number] = isBackSide
    ? [position[0], position[1], position[2] - colliderDistance]
    : [position[0], position[1], position[2] + colliderDistance];

  const colliderSize: [number, number, number] = [
    gifSize[0] / 2,
    gifSize[1] / 2,
    6,
  ];

  return (
    <group>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={gifSize} />
        <meshBasicMaterial map={gifTexture} side={THREE.DoubleSide} />
      </mesh>
      <RigidBody
        type="fixed"
        colliders={false}
        position={adjustedPosition}
        rotation={rotation}
      >
        <CuboidCollider
          args={colliderSize}
          sensor
          onIntersectionEnter={() => onEnter?.(gif.author.name, gif.title)}
          onIntersectionExit={() => onExit?.()}
        />
      </RigidBody>
    </group>
  );
};

export default GifDisplay;
