"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
  CapsuleCollider,
  type RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Visitor = () => {
  const ref = useRef<RapierRigidBody | null>(null);
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    if (!ref.current) return;

    const { forward, backward, left, right } = get();
    const velocity = ref.current.linvel();

    const translation = ref.current.translation();
    state.camera.position.set(translation.x, translation.y, translation.z);

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);

    ref.current.setLinvel(
      { x: direction.x, y: velocity.y, z: direction.z },
      true
    );
  });

  return (
    <RigidBody
      ref={ref}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 1.8, -48]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[1.75, 0.5]} />
    </RigidBody>
  );
};

export default Visitor;
