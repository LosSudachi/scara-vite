import React, { useRef } from 'react';
import { Html } from '@react-three/drei';

function Arm1VerticalAxisIndicator() {
  return (
    <group position={[2, -0.9, 0.65]}>
      
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
        <meshStandardMaterial color="#2ecc71" emissive="#1d8f4f" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, 0.83, 0]}>
        <coneGeometry args={[0.08, 0.18, 12]} />
        <meshStandardMaterial color="#2ecc71" emissive="#1d8f4f" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
        <meshStandardMaterial color="#a7321d" emissive="#1d8f4f" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, -0.73, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.18, 12]} />
        <meshStandardMaterial color="#a7321d" emissive="#1d8f4f" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function BaseRotationIndicator() {
  return (
    <group position={[0, 0.62, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.04, 12, 90]} />
        <meshStandardMaterial color="#f1c40f" emissive="#8a6d00" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, 0, 1.9]} rotation={[ 3.2, 0.05,-7.9]}>
        <coneGeometry args={[0.12, 0.28, 12]} />
        <meshStandardMaterial color="#f1c40f" emissive="#8a6d00" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[1.9, 0, 0]} rotation={[4.7, 0,0]}>
        <coneGeometry args={[0.12, 0.28, 12]} />
        <meshStandardMaterial color="#f1c40f" emissive="#8a6d00" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, 0.02, -2.2]}>
        <planeGeometry args={[0.85, 0.28]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.75} side={2} />
      </mesh>

      <mesh position={[0, 0.03, -2.2]}>
        <ringGeometry args={[0.09, 0.11, 24]} />
        <meshBasicMaterial color="#f1c40f" side={2} />
      </mesh>

      <Html position={[0, 0.16, -2.2]} center>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#f1c40f',
            background: 'rgba(0, 0, 0, 0.65)',
            padding: '2px 6px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          360°
        </div>
      </Html>
    </group>
  );
}

function JointRotationIndicator() {
  return (
    <group position={[0.1, -1.6, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.58, 0.025, 10, 72]} />
        <meshStandardMaterial color="#f39c12" emissive="#8a4b00" emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[0, 0, 0.58]} rotation={[3.2, 0.05, -7.9]}>
        <coneGeometry args={[0.07, 0.16, 12]} />
        <meshStandardMaterial color="#f39c12" emissive="#8a4b00" emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[0.58, 0, 0]} rotation={[4.7, 0, 0]}>
        <coneGeometry args={[0.07, 0.16, 12]} />
        <meshStandardMaterial color="#f39c12" emissive="#8a4b00" emissiveIntensity={0.3} />
      </mesh>

      <Html position={[0, 0.12, -0.78]} center>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#f39c12',
            background: 'rgba(0, 0, 0, 0.65)',
            padding: '2px 6px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          360°
        </div>
      </Html>
    </group>
  );
}

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
        <BaseRotationIndicator />

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
          <Arm1VerticalAxisIndicator />
        </group>

        <group position={[Math.cos(rotationArm1) * 4, Math.sin(rotationArm1) * 4 + armHeight, 0]}>
          <group rotation={[0, rotationArm2, 0]}>
            <mesh position={[0.1, -1.6, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
              <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} envMapIntensity={1} />
            </mesh>
            <JointRotationIndicator />

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
