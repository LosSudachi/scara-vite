import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, SoftShadows } from '@react-three/drei';
import { TextureLoader, Vector3, Matrix4 } from 'three';
import * as THREE from 'three';
import swal from 'sweetalert';
import nekoGif from './gifs/Neko.gif';
import backGif from './gifs/Back.gif';
import Feeling from './background/Feeling.gif';

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
          <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.3} envMapIntensity={0.5} />
        </mesh>

        {barPositions.map((pos, index) => (
          <mesh key={`lower-${index}`} position={[pos.x, 2.0, pos.z]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 3.2, 16]} />
            <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} envMapIntensity={0.8} />
          </mesh>
        ))}

        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.2} envMapIntensity={0.7} />
        </mesh>

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
            <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} envMapIntensity={0.95} />
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

function App() {
  const backgroundTexture = useLoader(TextureLoader, Feeling);
  const nekoTexture = useLoader(TextureLoader, nekoGif);
  const backTexture = useLoader(TextureLoader, backGif);

  const [rotationArm1, setRotationArm1] = useState(0);
  const [rotationArm2, setRotationArm2] = useState(0);
  const [armHeight, setArmHeight] = useState(6.5);
  const [globalRotation, setGlobalRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [expertMode, setExpertMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedActions, setRecordedActions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingStart, setRecordingStart] = useState(null);
  const [isFalling, setIsFalling] = useState(false);
  const [hasFallen, setHasFallen] = useState(false);
  const [nekoPos, setNekoPos] = useState(new Vector3());
  const [matrices, setMatrices] = useState({
    prismatic: [],
    link1: [],
    endEffector: [],
  });

  const [armHeightInput, setArmHeightInput] = useState(armHeight.toString());
  const [arm2Input, setArm2Input] = useState(Math.round(rotationArm2 * (180 / Math.PI)).toString());
  const [globalRotationInput, setGlobalRotationInput] = useState(Math.round(globalRotation * (180 / Math.PI)).toString());
  const [targetXInput, setTargetXInput] = useState('0.00');
  const [targetYInput, setTargetYInput] = useState('0.00');
  const [targetZInput, setTargetZInput] = useState('0.00');

  const orbitControlsRef = useRef();
  const animationRef = useRef();
  const nekoAttachedRef = useRef();
  const nekoFallAnimationRef = useRef();
  const endEffectorRef = useRef();

  const MIN_HEIGHT = 3.0;
  const MAX_HEIGHT = 6.5;
  const deltaStep = 0.1;
  const LINK1_LENGTH = 4;
  const LINK2_LENGTH = 3;
  const MIN_ARM_DEG = -180;
  const MAX_ARM_DEG = 180;
  const ARM1_FIXED_ROTATION = 0;

  const computeForwardKinematics = (rot2, height, globalRot) => {
    const localX = LINK1_LENGTH + (LINK2_LENGTH * Math.cos(rot2));
    const localY = height;
    const localZ = -LINK2_LENGTH * Math.sin(rot2);

    const cosG = Math.cos(globalRot);
    const sinG = Math.sin(globalRot);

    return {
      x: (localX * cosG) + (localZ * sinG),
      y: localY,
      z: (-localX * sinG) + (localZ * cosG)
    };
  };

  const solveInverseKinematics = (targetGlobal, globalRot) => {
    const cosG = Math.cos(-globalRot);
    const sinG = Math.sin(-globalRot);

    const localX = (targetGlobal.x * cosG) + (targetGlobal.z * sinG);
    const localZ = (-targetGlobal.x * sinG) + (targetGlobal.z * cosG);
    const desiredHeight = targetGlobal.y;
    const clampedHeight = Math.min(Math.max(desiredHeight, MIN_HEIGHT), MAX_HEIGHT);

    const radialDistance = Math.sqrt(((localX - LINK1_LENGTH) ** 2) + (localZ ** 2));
    if (Math.abs(radialDistance - LINK2_LENGTH) > 0.15) {
      return { error: 'El punto objetivo esta fuera del alcance del brazo 2.' };
    }

    const cos2 = (localX - LINK1_LENGTH) / LINK2_LENGTH;
    const sin2 = -localZ / LINK2_LENGTH;
    const theta2 = Math.atan2(sin2, cos2);

    return {
      theta2,
      height: clampedHeight,
      heightClamped: Math.abs(clampedHeight - desiredHeight) > 0.001
    };
  };

  useEffect(() => {
    const computeMatrices = () => {
      const globalRotY = new Matrix4().makeRotationY(globalRotation);
      const translateY = new Matrix4().makeTranslation(0, armHeight, 0);
      const rotateZ = new Matrix4().makeRotationZ(ARM1_FIXED_ROTATION);
      const translateX4 = new Matrix4().makeTranslation(4, 0, 0);
      const rotateY = new Matrix4().makeRotationY(rotationArm2);
      const translateX3 = new Matrix4().makeTranslation(3, 0, 0);

      const formatMatrix = (matrix) => {
        const e = matrix.elements;
        return [
          [e[0], e[4], e[8], e[12]],
          [e[1], e[5], e[9], e[13]],
          [e[2], e[6], e[10], e[14]],
          [e[3], e[7], e[11], e[15]],
        ];
      };

      const M1 = globalRotY.clone().multiply(translateY);
      const M3 = M1.clone().multiply(rotateZ).multiply(translateX4);
      const M5 = M3.clone().multiply(rotateY).multiply(translateX3);

      setMatrices({
        prismatic: formatMatrix(M1),
        link1: formatMatrix(M3),
        endEffector: formatMatrix(M5),
      });
    };

    computeMatrices();
  }, [globalRotation, armHeight, rotationArm2]);

  useEffect(() => {
    setArmHeightInput(armHeight.toString());
  }, [armHeight]);

  useEffect(() => {
    setArm2Input(Math.round(rotationArm2 * (180 / Math.PI)).toString());
  }, [rotationArm2]);

  useEffect(() => {
    setGlobalRotationInput(Math.round(globalRotation * (180 / Math.PI)).toString());
  }, [globalRotation]);

  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enableRotate = true;
    }
    return () => {
      cancelAnimationFrame(animationRef.current);
      cancelAnimationFrame(nekoFallAnimationRef.current);
    };
  }, []);

  useEffect(() => {
    if (rotationArm1 !== ARM1_FIXED_ROTATION) {
      setRotationArm1(ARM1_FIXED_ROTATION);
    }
  }, [rotationArm1]);

  const calculateCoordinates = () => {
    if (!endEffectorRef.current) {
      swal("Error", "No se pudo obtener la posición del extremo", "error");
      return;
    }

    const worldPos = new THREE.Vector3();
    endEffectorRef.current.getWorldPosition(worldPos);

    swal({
      title: "Coordenadas del extremo",
      text: `X: ${worldPos.x.toFixed(2)} m\nY: ${worldPos.y.toFixed(2)} m\nZ: ${worldPos.z.toFixed(2)} m`,
      icon: "info",
    });
  };

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter') {
      handler();
    }
  };

  const handleArmHeightInput = (e) => {
    const value = e.target.value;
    
    if (value === "") {
      setArmHeightInput("");
      setArmHeight(MIN_HEIGHT);
      return;
    }
    
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setArmHeightInput(value);
      const numericValue = parseFloat(value);
      
      if (!isNaN(numericValue)) {
        const clampedValue = Math.min(Math.max(numericValue, MIN_HEIGHT), MAX_HEIGHT);
        setArmHeight(clampedValue);
        
        if (numericValue !== clampedValue) {
          swal("Límite excedido", `La altura debe estar entre ${MIN_HEIGHT}m y ${MAX_HEIGHT}m`, "warning");
        }
      }
    }
  };

  const handleArmHeightBlur = () => {
    const numericValue = parseFloat(armHeightInput);
    if (!isNaN(numericValue)) {
      setArmHeightInput(numericValue.toFixed(2));
    } else {
      setArmHeightInput(armHeight.toFixed(2));
    }
  };

  const handleArm2Input = (e) => {
    const value = e.target.value;
    setArm2Input(value);
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.round(Math.max(MIN_ARM_DEG, Math.min(numericValue, MAX_ARM_DEG)));
      if (clampedValue !== numericValue) {
        swal("Limite excedido", `El brazo 2 debe estar entre ${MIN_ARM_DEG}° y ${MAX_ARM_DEG}°`, "warning");
      }
      const radians = (clampedValue * Math.PI) / 180;
      setRotationArm2(radians);
      setArm2Input(clampedValue.toString());
    }
  };

  const handleArm2Blur = () => {
    if (arm2Input === "") {
      setArm2Input(Math.round(rotationArm2 * (180 / Math.PI)).toString());
      return;
    }
    const numericValue = parseFloat(arm2Input);
    if (isNaN(numericValue)) {
      swal("Entrada invalida", "Debe ingresar un numero valido", "error");
      setArm2Input(Math.round(rotationArm2 * (180 / Math.PI)).toString());
      return;
    }
    const clampedValue = Math.round(Math.max(MIN_ARM_DEG, Math.min(numericValue, MAX_ARM_DEG)));
    const radians = (clampedValue * Math.PI) / 180;
    setRotationArm2(radians);
    setArm2Input(clampedValue.toString());
  };

  const handleGlobalRotationInput = (e) => {
    const value = e.target.value;
    setGlobalRotationInput(value);
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const roundedValue = Math.round(numericValue);
      setGlobalRotation((roundedValue * Math.PI) / 180);
      setGlobalRotationInput(roundedValue.toString());
    }
  };

  const handleGlobalRotationBlur = () => {
    if (globalRotationInput === "") {
      setGlobalRotationInput(Math.round(globalRotation * (180 / Math.PI)).toString());
      return;
    }
    const numericValue = parseFloat(globalRotationInput);
    if (isNaN(numericValue)) {
      swal("Entrada inválida", "Debe ingresar un número válido", "error");
      setGlobalRotationInput(Math.round(globalRotation * (180 / Math.PI)).toString());
      return;
    }
    const roundedValue = Math.round(numericValue);
    setGlobalRotation((roundedValue * Math.PI) / 180);
    setGlobalRotationInput(roundedValue.toString());
  };

  const recordAction = (actionObj) => {
    if (isRecording) {
      const timestamp = Date.now();
      setRecordedActions(prev => [...prev, { ...actionObj, timestamp }]);
    }
  };

  const moveVertical = (direction) => {
    const delta = direction === 'up' ? deltaStep : -deltaStep;
    recordAction({ action: 'moveVertical', delta, direction });
    if (isMoving) return;
    setIsMoving(true);
    const target = direction === 'up' ? MAX_HEIGHT : MIN_HEIGHT;
    const animate = () => {
      setArmHeight(prev => {
        const newValue = prev + delta;
        if ((direction === 'up' && newValue >= target) ||
            (direction === 'down' && newValue <= target)) {
          setIsMoving(false);
          return target;
        }
        return newValue;
      });
      if (isMoving) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsMoving(false);
      }
    };
    animate();
  };

  const rotateModel = (direction) => {
    const delta = direction === 'left' ? deltaStep : -deltaStep;
    recordAction({ action: 'rotateModel', delta, direction });
    setGlobalRotation(prev => prev + delta);
  };

  const rotateRedArm = (direction) => {
    const delta = direction === 'left' ? deltaStep : -deltaStep;
    recordAction({ action: 'rotateRedArm', delta, direction });
    setRotationArm2(prev => Math.max(-Math.PI, Math.min(prev + delta, Math.PI)));
  };

  const updateTargetFromCurrent = () => {
    const current = computeForwardKinematics(rotationArm2, armHeight, globalRotation);
    setTargetXInput(current.x.toFixed(2));
    setTargetYInput(current.y.toFixed(2));
    setTargetZInput(current.z.toFixed(2));
  };

  const applyInverseKinematics = () => {
    const x = parseFloat(targetXInput);
    const y = parseFloat(targetYInput);
    const z = parseFloat(targetZInput);

    if ([x, y, z].some(value => Number.isNaN(value))) {
      swal("Entrada invalida", "Debe ingresar valores numericos en X, Y y Z", "error");
      return;
    }

    const result = solveInverseKinematics({ x, y, z }, globalRotation);
    if (result.error) {
      swal("IK no resuelta", result.error, "error");
      return;
    }

    if (result.heightClamped) {
      swal("Altura ajustada", "La altura se ajusto al rango permitido.", "warning");
    }

    setArmHeight(result.height);
    setRotationArm2(result.theta2);
  };

  useEffect(() => {
    updateTargetFromCurrent();
  }, []);
  const soltarNeko = () => {
    if (isFalling || hasFallen) return;
    
    const worldPos = new THREE.Vector3();
    if (nekoAttachedRef.current) {
      nekoAttachedRef.current.getWorldPosition(worldPos);
    }
    
    recordAction({ 
      action: 'soltarNeko',
      position: { x: worldPos.x, y: worldPos.y, z: worldPos.z }
    });
    
    setNekoPos(worldPos);
    setIsFalling(true);
  };

  const resetNeko = () => {
    recordAction({ action: 'resetNeko' });
    setIsFalling(false);
    setHasFallen(false);
  };

  useEffect(() => {
    if (isFalling) {
      const floorY = 1;
      const speed = 0.02;

      const animateFall = () => {
        setNekoPos(prev => {
          const newY = prev.y - speed;
          if (newY <= floorY) {
            setIsFalling(false);
            setHasFallen(true);
            return new Vector3(prev.x, floorY, prev.z);
          }
          return new Vector3(prev.x, newY, prev.z);
        });
        
        if (!hasFallen) {
          nekoFallAnimationRef.current = requestAnimationFrame(animateFall);
        }
      };

      nekoFallAnimationRef.current = requestAnimationFrame(animateFall);
      return () => cancelAnimationFrame(nekoFallAnimationRef.current);
    }
  }, [isFalling, hasFallen]);

  const playRecording = () => {
    if (recordedActions.length === 0) {
      swal("¡Ups!", "No ha hecho ningún movimiento", "warning");
      return;
    }
    
    if (recordingStart) {
      setRotationArm1(ARM1_FIXED_ROTATION);
      setRotationArm2(recordingStart.rotationArm2);
      setArmHeight(recordingStart.armHeight);
      setGlobalRotation(recordingStart.globalRotation);
      setIsFalling(false);
      setHasFallen(false);
    }
    
    setIsRecording(false);
    setIsPlaying(true);
    
    const startTime = recordedActions[0].timestamp;
    const adjustedActions = recordedActions.map(action => ({
      ...action,
      timeOffset: action.timestamp - startTime
    }));
    
    adjustedActions.forEach(action => {
      setTimeout(() => {
        switch(action.action) {
          case 'moveVertical':
            setArmHeight(prev => action.direction === 'up' 
              ? Math.min(prev + action.delta, MAX_HEIGHT) 
              : Math.max(prev + action.delta, MIN_HEIGHT));
            break;
          case 'rotateModel':
            setGlobalRotation(prev => prev + action.delta);
            break;
          case 'rotateRedArm':
            setRotationArm2(prev => Math.max(-Math.PI, Math.min(prev + action.delta, Math.PI)));
            break;
          case 'soltarNeko':
            setNekoPos(new Vector3(action.position.x, action.position.y, action.position.z));
            setIsFalling(true);
            break;
          case 'resetNeko':
            setIsFalling(false);
            setHasFallen(false);
            break;
          default: break;
        }
      }, action.timeOffset);
    });
    
    const totalDuration = adjustedActions[adjustedActions.length - 1].timeOffset + 1000;
    
    setTimeout(() => {
      setIsPlaying(false);
      swal("Reproducción finalizada", "Los movimientos se han reproducido", "success");
    }, totalDuration);
  };

//!Funcion de exportar configuracion 
  const exportConfig = () => {
    const config = {
      rotationArm1,
      rotationArm2,
      armHeight,
      globalRotation,
      recordedActions,
      nekoPos: nekoPos.toArray(),
      hasFallen,
      timestamp: Date.now()
    };
    
    const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scara_config_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    swal("Configuración exportada", "El estado actual se ha descargado correctamente", "success");
  };

  const importConfig = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        
        // Validar estructura básica comprobando que las propiedades no sean undefined
        if (
          config.rotationArm1 === undefined ||
          config.armHeight === undefined ||
          config.recordedActions === undefined
        ) {
          throw new Error('Formato de archivo inválido');
        }
  
        // Opcional: Validar tipos de datos
        if (
          typeof config.rotationArm1 !== 'number' ||
          typeof config.armHeight !== 'number' ||
          !Array.isArray(config.recordedActions)
        ) {
          throw new Error('Formato de archivo inválido');
        }
  
        // Actualizar estados principales
        setRotationArm1(ARM1_FIXED_ROTATION);
        setRotationArm2(config.rotationArm2);
        setArmHeight(config.armHeight);
        setGlobalRotation(config.globalRotation);
        setRecordedActions(config.recordedActions);
        setNekoPos(new Vector3(...(config.nekoPos || [0, 0, 0])));
        setHasFallen(config.hasFallen || false);
        
        // Detener cualquier animación en curso
        setIsRecording(false);
        setIsPlaying(false);
        setIsFalling(false);
        
        swal("Configuración importada", "El estado se ha restaurado correctamente", "success");
      } catch (error) {
        swal("Error", "No se pudo cargar el archivo de configuración", "error");
      }
    };
    reader.readAsText(file);
  };
  
  //!Fin de exportacion
  const forwardPosition = computeForwardKinematics(rotationArm2, armHeight, globalRotation);
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 100,
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        padding: '16px',
        minWidth: '250px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{
          margin: '0 0 16px 0',
          color: '#2c3e50',
          fontSize: '18px',
          borderBottom: '1px solid #eee',
          paddingBottom: '8px'
        }}>
          Controles de SCARA
        </h2>
        
        {expertMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#e74c3c', fontSize: '14px' }}>Modo Experto</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#34495e', fontWeight: 'bold' }}>Altura (m):</label>
                <input
                  type="number"
                  value={armHeightInput}
                  onChange={handleArmHeightInput}
                  onBlur={handleArmHeightBlur}
                  onKeyPress={(e) => handleKeyPress(e, handleArmHeightBlur)}
                  min={MIN_HEIGHT}
                  max={MAX_HEIGHT}
                  step="0.01"
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#34495e', fontWeight: 'bold' }}>Brazo 2 (grados):</label>
                <input
                  type="number"
                  value={arm2Input}
                  onChange={handleArm2Input}
                  onBlur={handleArm2Blur}
                  onKeyPress={(e) => handleKeyPress(e, handleArm2Blur)}
                  min={MIN_ARM_DEG}
                  max={MAX_ARM_DEG}
                  step="1"
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#34495e', fontWeight: 'bold' }}>Rotación Global (grados):</label>
                <input
                  type="number"
                  value={globalRotationInput}
                  onChange={handleGlobalRotationInput}
                  onBlur={handleGlobalRotationBlur}
                  onKeyPress={(e) => handleKeyPress(e, handleGlobalRotationBlur)}
                  step="1"
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                />
              </div>

              <button 
                onClick={calculateCoordinates}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  marginTop: '8px'
                }}
              >
                Calcular Coordenadas
              </button>

              <button 
                onClick={() => setExpertMode(false)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                Volver a Modo Normal
              </button>

              
              <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                
                {/* Funciones de grabación y reproducción
                <h3 style={{ fontSize: '16px', color: '#2c3e50', marginBottom: '8px' }}>
                  Matrices de Transformación Homogénea
                </h3>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', color: '#34495e', margin: '8px 0' }}>
                    Base a Brazo 1 (Prismático)
                  </h4>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                    {matrices.prismatic.map((row, i) => (
                      <div key={i}>
                        {row.map((val, j) => (
                          <span key={j} style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                            {val.toFixed(3)}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', color: '#34495e', margin: '8px 0' }}>
                    Brazo 1 a Brazo 2 (Revoluto 1)
                  </h4>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                    {matrices.link1.map((row, i) => (
                      <div key={i}>
                        {row.map((val, j) => (
                          <span key={j} style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                            {val.toFixed(3)}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', color: '#34495e', margin: '8px 0' }}>
                    Brazo 2 a Efector Final
                  </h4>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                    {matrices.endEffector.map((row, i) => (
                      <div key={i}>
                        {row.map((val, j) => (
                          <span key={j} style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                            {val.toFixed(3)}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                */}
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', color: '#040b12', margin: '8px 0' }}>
                    Cinematica Directa (Posicion Actual)
                  </h4>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#2c3e50', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                    <div>X: {forwardPosition.x.toFixed(2)} m</div>
                    <div>Y: {forwardPosition.y.toFixed(2)} m</div>
                    <div>Z: {forwardPosition.z.toFixed(2)} m</div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', color: '#34495e', margin: '8px 0' }}>
                    Cinematica Inversa (Objetivo)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <input
                      type="number"
                      value={targetXInput}
                      onChange={(e) => setTargetXInput(e.target.value)}
                      placeholder="X"
                      step="0.01"
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                    />
                    <input
                      type="number"
                      value={targetYInput}
                      onChange={(e) => setTargetYInput(e.target.value)}
                      placeholder="Y"
                      step="0.01"
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                    />
                    <input
                      type="number"
                      value={targetZInput}
                      onChange={(e) => setTargetZInput(e.target.value)}
                      placeholder="Z"
                      step="0.01"
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={applyInverseKinematics}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#2980b9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        flex: 1
                      }}
                    >
                      Aplicar IK
                    </button>
                    <button
                      onClick={updateTargetFromCurrent}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#7f8c8d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        flex: 1
                      }}
                    >
                      Usar Actual
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => moveVertical('up')}
              disabled={isMoving || armHeight >= MAX_HEIGHT || isPlaying}
              style={{
                padding: '10px 16px',
                backgroundColor: isMoving || armHeight >= MAX_HEIGHT ? '#bdc3c7' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isMoving || armHeight >= MAX_HEIGHT ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>↑</span>
              Subir Brazo
            </button>
            <button 
              onClick={() => moveVertical('down')}
              disabled={isMoving || armHeight <= MIN_HEIGHT || isPlaying}
              style={{
                padding: '10px 16px',
                backgroundColor: isMoving || armHeight <= MIN_HEIGHT ? '#bdc3c7' : '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isMoving || armHeight <= MIN_HEIGHT ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>↓</span>
              Bajar Brazo
            </button>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <button 
                onClick={() => rotateModel('left')}
                disabled={isPlaying}
                style={{
                  padding: '10px',
                  backgroundColor: '#8e44ad',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '18px' }}>↻</span>
                Rotar Modelo Izquierda
              </button>
              <button 
                onClick={() => rotateModel('right')}
                disabled={isPlaying}
                style={{
                  padding: '10px',
                  backgroundColor: '#8e44ad',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '18px' }}>↺</span>
                Rotar Modelo Derecha
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <button 
                onClick={() => rotateRedArm('left')}
                disabled={isPlaying}
                style={{
                  padding: '10px',
                  backgroundColor: '#16a085',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '18px' }}>↻</span>
                Rotar Brazo Rojo +
              </button>
              <button 
                onClick={() => rotateRedArm('right')}
                disabled={isPlaying}
                style={{
                  padding: '10px',
                  backgroundColor: '#16a085',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '18px' }}>↺</span>
                Rotar Brazo Rojo -
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <button 
                onClick={() => {
                  setRecordingStart({ 
                    rotationArm1: ARM1_FIXED_ROTATION,
                    rotationArm2, 
                    armHeight, 
                    globalRotation,
                    isFalling: false,
                    hasFallen: false
                  });
                  setRecordedActions([]);
                  setIsRecording(true);
                  swal("Grabación iniciada", "Se están registrando los movimientos", "success");
                }}
                disabled={isRecording || isPlaying}
                style={{
                  padding: '8px',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Iniciar Grabación
              </button>
              <button 
                onClick={() => {
                  setIsRecording(false);
                  swal("Grabación detenida", "Se han registrado los movimientos", "info");
                }}
                disabled={!isRecording || isPlaying}
                style={{
                  padding: '8px',
                  backgroundColor: '#d35400',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Detener Grabación
              </button>
              <button 
                onClick={playRecording}
                disabled={isRecording || isPlaying || recordedActions.length === 0}
                style={{
                  padding: '8px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: recordedActions.length === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Reproducir Grabación
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <button 
                onClick={soltarNeko}
                disabled={isPlaying || isFalling || hasFallen}
                style={{
                  padding: '8px',
                  backgroundColor: isPlaying || isFalling || hasFallen ? '#bdc3c7' : 'white',
                  color: 'black',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: isPlaying || isFalling || hasFallen ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Soltar Neko
              </button>
              <button 
                onClick={resetNeko}
                disabled={isPlaying || (!isFalling && !hasFallen)}
                style={{
                  padding: '8px',
                  backgroundColor: isPlaying || (!isFalling && !hasFallen) ? '#bdc3c7' : 'white',
                  color: 'black',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: isPlaying || (!isFalling && !hasFallen) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Reset Neko
              </button>
            </div>
<div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
  <button 
    onClick={() => document.getElementById('configFileInput').click()}
    style={{
      padding: '8px',
      backgroundColor: '#2980b9',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      flex: 1
    }}
  >
    Importar Config
  </button>
  <button 
    onClick={exportConfig}
    style={{
      padding: '8px',
      backgroundColor: '#169b89',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      flex: 1
    }}
  >
    Exportar Config
  </button>
</div>
<input
  type="file"
  accept=".json"
  onChange={importConfig}
  style={{ display: 'none' }}
  id="configFileInput"
/>
            <button 
              onClick={() => setExpertMode(true)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Modo Experto
            </button>
          </div>
        )}
      </div>
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
            rotationArm1={ARM1_FIXED_ROTATION} 
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