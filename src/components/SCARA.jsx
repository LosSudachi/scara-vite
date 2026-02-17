import React, { useRef } from 'react';

function SCARA({ rotationArm1, rotationArm2, armHeight, nekoTexture, backTexture, isFalling, nekoAttachedRef, endEffectorRef }) {
  const arm1Ref = useRef();
  const arm2Ref = useRef();
  const clawLeftRef = useRef();
  const clawRightRef = useRef();

  const barPositions = [
    { x: 0.6, z: 0.6 },
    { x: -0.6, z: 0.6 },
    { x: -0.6, z: -0.6 },
    { x: 0.6, z: -0.6 }
  ];

  return (
    <group>
      <group>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} envMapIntensity={0.5} />
        </mesh>

        {barPositions.map((pos, index) => (
          <mesh key={`lower-${index}`} position={[pos.x, 2.0, pos.z]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 3.2, 16]} />
            <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} envMapIntensity={0.8} />
          </mesh>
        ))}

        {barPositions.map((pos, index) => (
          <mesh key={`upper-${index}`} position={[pos.x, 5.0, pos.z]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 3.2, 16]} />
            <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} envMapIntensity={0.8} />
          </mesh>
        ))}

        <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
          <meshStandardMaterial color="#555" metalness={0.7} roughness={0.2} envMapIntensity={0.7} />
        </mesh>

        <group position={[0, armHeight + 0.3, 0]} rotation={[0, 0, rotationArm1]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.6, 32]} />
            <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} envMapIntensity={1} />
          </mesh>
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.8]} />
            <meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} envMapIntensity={0.9} />
          </mesh>
          <mesh position={[0, -0.9, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
            <meshStandardMaterial color="#201b41" metalness={0.85} roughness={0.15} envMapIntensity={0.95} />
          </mesh>
        </group>

        <group ref={arm1Ref} position={[0, armHeight, 0]} rotation={[0, 0, rotationArm1]}>
          <mesh position={[2, -0.9, 0]} castShadow>
            <boxGeometry args={[5, 0.4, 1]} />
            <meshStandardMaterial color="#3498db" metalness={0.4} roughness={0.3} envMapIntensity={0.8} />
          </mesh>
        </group>

        <group position={[Math.cos(rotationArm1) * 4, Math.sin(rotationArm1) * 4 + armHeight, 0]}>
          <group rotation={[0, rotationArm2, 0]}>
            <mesh position={[0.1, -1.6, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
              <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} envMapIntensity={1} />
            </mesh>

            <group ref={arm2Ref} position={[0.9, -1.98, 1.2]} rotation={[0, -1, 0]}>
              <mesh castShadow>
                <boxGeometry args={[3, 0.3, 0.4]} />
                <meshStandardMaterial color="#e74c3c" metalness={0.4} roughness={0.3} envMapIntensity={0.8} />
              </mesh>

              <group position={[1.4, 0, 0]} ref={endEffectorRef}>
                <mesh position={[0, 0, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.5, 0.8]} />
                  <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
                </mesh>

                <group ref={clawLeftRef} position={[0, 0, 0.5]} rotation={[0, -0.3, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.8, 0.3, 0.2]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.3} />
                  </mesh>
                  <mesh position={[0.4, 0, 0.1]} castShadow>
                    <boxGeometry args={[0.4, 0.3, 0.4]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.3} />
                  </mesh>
                </group>

                <group ref={clawRightRef} position={[0, 0, -0.5]} rotation={[0, 0.3, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.8, 0.3, 0.2]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.3} />
                  </mesh>
                  <mesh position={[0.4, 0, -0.1]} castShadow>
                    <boxGeometry args={[0.4, 0.3, 0.4]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.3} />
                  </mesh>
                </group>

                <mesh position={[0.2, -0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
                  <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            </group>

            {!isFalling && (
              <group ref={nekoAttachedRef} position={[2, -2, 2.9]} rotation={[0, 0.5, 0]}>
                <mesh>
                  <planeGeometry args={[2, 2]} />
                  <meshBasicMaterial map={nekoTexture} transparent />
                </mesh>
                <mesh rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[2, 2]} />
                  <meshBasicMaterial map={backTexture} transparent />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

export default SCARA;
