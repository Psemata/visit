import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

const Room = () => {
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[30, 200, 100]} />
          <meshStandardMaterial
            color="#f5f5f5"
            side={THREE.DoubleSide}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </RigidBody>
      {/* Walls */}
      <RigidBody type="fixed" colliders={false}>
        {/* Top and bottom */}
        <CuboidCollider args={[15, 10, 1]} position={[0, 0, -50]} />
        <CuboidCollider args={[15, 10, 1]} position={[0, 0, 50]} />
        {/* Left and right */}
        <CuboidCollider args={[1, 10, 50]} position={[-15, 0, 0]} />
        <CuboidCollider args={[1, 10, 50]} position={[15, 0, 0]} />
      </RigidBody>
    </>
  );
};

export default Room;
