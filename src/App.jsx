import React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, SoftShadows, Html } from '@react-three/drei';
import { TextureLoader } from 'three';
import SCARA from './components/SCARA.jsx';
import Controls from './components/Controls.jsx';
import { useScaraController } from './components/useScaraController.js';
import nekoGif from './gifs/Neko.gif';
import backGif from './gifs/Back.gif';
import Feeling from './background/Feeling.gif';

function App() {
  const backgroundTexture = useLoader(TextureLoader, Feeling);
  const nekoTexture = useLoader(TextureLoader, nekoGif);
  const backTexture = useLoader(TextureLoader, backGif);

  const controller = useScaraController();

  const {
    rotationArm2,
    rotationArm1,
    armHeight,
    globalRotation,
    isFalling,
    hasFallen,
    nekoPos,
    nekoAttachedRef,
    endEffectorRef,
    orbitControlsRef
  } = controller;

  const forwardPosition = controller.computeForwardKinematics(rotationArm2, armHeight, globalRotation);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Controls controller={controller} forwardPosition={forwardPosition} />

      <Canvas
        shadows
        camera={{ position: [15, 10, 15], fov: 45 }}
        onCreated={({ scene }) => {
          scene.background = backgroundTexture;
        }}
      >
        <Environment preset="warehouse" />
        <SoftShadows size={25} focus={0.5} samples={10} />
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
        <directionalLight position={[-10, 5, -5]} intensity={0.6} color="#ffffee" />
        <pointLight position={[0, 15, 0]} intensity={1.5} color="#4466ff" distance={30} />
        <gridHelper args={[20, 20]} position={[0, 0, 0]} />
        <axesHelper args={[5]} />

        <group rotation={[0, globalRotation, 0]}>
          <SCARA
            rotationArm1={rotationArm1}
            rotationArm2={rotationArm2}
            armHeight={armHeight}
            nekoTexture={nekoTexture}
            backTexture={backTexture}
            isFalling={isFalling || hasFallen}
            nekoAttachedRef={nekoAttachedRef}
            endEffectorRef={endEffectorRef}
          />
        </group>

        {(isFalling || hasFallen) && (
          <group position={[nekoPos.x, nekoPos.y, nekoPos.z]} rotation={[0, 0.5, 0]}>
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

        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
}

export default App;
