import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PRIMARY = "#185df2";
const PRIMARY_STRONG = "#164fca";

type PointerState = { x: number; y: number };

const Orb = ({ pointer }: { pointer: PointerState }) => {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const scaleTarget = useRef(new THREE.Vector3(1, 1, 1));

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    node.rotation.y += delta * 0.22;
    node.rotation.x += (pointer.y * 0.35 - node.rotation.x) * 0.03;
    node.rotation.z += (pointer.x * 0.3 - node.rotation.z) * 0.03;

    const target = hovered.current ? 1.1 : 1;
    scaleTarget.current.set(target, target, target);
    node.scale.lerp(scaleTarget.current, 0.08);
  });

  return (
    <group
      ref={group}
      onPointerOver={() => {
        hovered.current = true;
      }}
      onPointerOut={() => {
        hovered.current = false;
      }}
    >
      <mesh>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color={PRIMARY} roughness={0.3} metalness={0.15} transparent opacity={0.14} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color={PRIMARY_STRONG} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const Hero3DScene = ({ pointer }: { pointer: PointerState }) => (
  <Canvas
    dpr={[1, 1.75]}
    camera={{ position: [0, 0, 4.2], fov: 42 }}
    gl={{ alpha: true, antialias: true }}
    style={{ pointerEvents: "auto" }}
  >
    <ambientLight intensity={0.95} />
    <directionalLight position={[3, 4, 5]} intensity={1.1} />
    <Orb pointer={pointer} />
  </Canvas>
);

export default Hero3DScene;
