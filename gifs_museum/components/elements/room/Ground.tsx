import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[30, 100]} />
        <meshStandardMaterial
          color="#e8e8e8"
          side={THREE.DoubleSide}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      <CuboidCollider args={[15, 2, 50]} position={[0, -2, 0]} />
    </RigidBody>
  );
};

export default Ground;
