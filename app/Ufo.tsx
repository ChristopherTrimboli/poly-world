import { useRef } from "react";
import { Sphere, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  Vector3,
} from "three";

interface UfoProps {
  position: Vector3;
}

const numSpotLights = 8;
const spotlightPositions = Array.from({ length: numSpotLights }, (_, i) => {
  const angle = (i / numSpotLights) * Math.PI * 2;
  const x = Math.cos(angle) * 4;
  const y = Math.sin(angle) * 4;
  return [x, y, 0];
});

const numParticles = 1000;
const particlePositions = new Float32Array(numParticles * 3);

for (let i = 0; i < numParticles * 3; i++) {
  particlePositions[i] = (Math.random() - 0.5) * 2;
}

const particleGeometry = new BufferGeometry();
particleGeometry.setAttribute(
  "position",
  new Float32BufferAttribute(particlePositions, 3)
);

const Ufo = ({ position }: UfoProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const innerSphereMesh = useRef<Mesh>(null);
  const particleRef = useRef(null);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const translation = rigidBodyRef.current.translation();
      if (translation.y < 1) {
        rigidBodyRef.current.setLinvel(new Vector3(0, 0.5, 0), true);
      } else {
        rigidBodyRef.current.setLinvel(new Vector3(0, 0, 0), true);
      }
      rigidBodyRef.current.setAngvel(new Vector3(0, 0.5, 0), true);
    }
    if (innerSphereMesh.current) {
      innerSphereMesh.current.rotation.x += 0.01;
      innerSphereMesh.current.rotation.y += 0.01;
    }
  });

  useFrame(() => {
    if (particleRef?.current) {
      const { position } = particleGeometry.attributes;
      for (let i = 0; i < numParticles; i++) {
        position.array[i * 3 + 0] += 0.01 * (Math.random() - 0.5); // x
        position.array[i * 3 + 1] += 0.01 * (Math.random() - 0.5); // y
        position.array[i * 3 + 2] += 0.01 * (Math.random() - 0.5); // z
      }
      position.needsUpdate = true;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="hull"
      gravityScale={0.1}
    >
      <Torus
        args={[3, 1, 3, 32]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow
      >
        <meshPhongMaterial
          color="red"
          flatShading
          shininess={5}
          side={DoubleSide}
        />
        {spotlightPositions.map((pos, i) => (
          <Sphere key={i} position={new Vector3(...pos)} args={[0.1, 10, 10]}>
            <meshPhongMaterial color="yellow" flatShading shininess={5} />
            <pointLight intensity={8} castShadow receiveShadow />
          </Sphere>
        ))}
      </Torus>

      <Sphere
        ref={innerSphereMesh}
        args={[1.5, 32, 32]}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <meshPhongMaterial color="blue" flatShading shininess={5} />
        <points ref={particleRef}>
          <primitive object={particleGeometry} attach="geometry" />
          <pointsMaterial color="yellow" size={0.1} />
        </points>
      </Sphere>
    </RigidBody>
  );
};

export default Ufo;
