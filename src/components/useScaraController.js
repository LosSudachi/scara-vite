import { useState, useRef, useEffect } from 'react';
import { Vector3, Matrix4 } from 'three';
import * as THREE from 'three';
import swal from 'sweetalert';

export function useScaraController() {
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
  const LINK1_LENGTH = 5;
  const LINK2_LENGTH = 3;
  const MIN_ARM_DEG = -85;
  const MAX_ARM_DEG = 195;
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

  const normalizeAngle = (angle) => {
    let result = angle;
    while (result > Math.PI) result -= Math.PI * 2;
    while (result < -Math.PI) result += Math.PI * 2;
    return result;
  };

  const solveInverseKinematics = (targetGlobal, currentState) => {
    const desiredHeight = targetGlobal.y;
    const clampedHeight = Math.min(Math.max(desiredHeight, MIN_HEIGHT), MAX_HEIGHT);
    const heightClamped = Math.abs(clampedHeight - desiredHeight) > 0.001;
    const radius = Math.sqrt((targetGlobal.x ** 2) + (targetGlobal.z ** 2));
    const minReach = Math.abs(LINK1_LENGTH - LINK2_LENGTH);
    const maxReach = LINK1_LENGTH + LINK2_LENGTH;
    const reachTolerance = 0.15;
    if (radius < minReach - reachTolerance || radius > maxReach + reachTolerance) {
      return { error: 'El punto objetivo esta fuera del alcance del robot.' };
    }
    const cos2 = (radius ** 2 - (LINK1_LENGTH ** 2) - (LINK2_LENGTH ** 2)) / (2 * LINK1_LENGTH * LINK2_LENGTH);
    const clampedCos2 = Math.max(-1, Math.min(1, cos2));
    const theta2Options = [Math.acos(clampedCos2), -Math.acos(clampedCos2)];
    const worldAngle = Math.atan2(targetGlobal.z, targetGlobal.x);
    const solutions = theta2Options.map((theta2) => {
      const localX = LINK1_LENGTH + (LINK2_LENGTH * Math.cos(theta2));
      const localZ = -LINK2_LENGTH * Math.sin(theta2);
      const localAngle = Math.atan2(localZ, localX);
      const globalRot = normalizeAngle(localAngle - worldAngle);
      const forward = computeForwardKinematics(theta2, clampedHeight, globalRot);
      const error = Math.hypot(forward.x - targetGlobal.x, forward.z - targetGlobal.z);
      return {
        theta2,
        globalRot,
        error,
      };
    });
    const sorted = solutions
      .filter((solution) => solution.error <= reachTolerance)
      .sort((a, b) => {
        const costA = Math.abs(a.theta2 - currentState.rotationArm2) + Math.abs(a.globalRot - currentState.globalRotation);
        const costB = Math.abs(b.theta2 - currentState.rotationArm2) + Math.abs(b.globalRot - currentState.globalRotation);
        return costA - costB;
      });
    const best = sorted[0];
    if (!best) {
      return { error: 'El punto objetivo no es consistente con la geometria del modelo.' };
    }
    return {
      theta2: best.theta2,
      globalRotation: best.globalRot,
      height: clampedHeight,
      heightClamped,
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
    const result = solveInverseKinematics(
      { x, y, z },
      { rotationArm2, globalRotation }
    );
    if (result.error) {
      swal("IK no resuelta", result.error, "error");
      return;
    }
    if (result.heightClamped) {
      swal("Altura ajustada", "La altura se ajusto al rango permitido.", "warning");
    }
    setArmHeight(result.height);
    setRotationArm2(result.theta2);
    setGlobalRotation(result.globalRotation);
  };

  useEffect(() => {
    updateTargetFromCurrent();
  }, []);

  const soltarNeko = () => {
    if (isFalling || hasFallen) return;
    const worldPos = new THREE.Vector3();
    if (nekoAttachedRef.current) {
      nekoAttachedRef.current.getWorldPosition(worldPos);
      try { nekoAttachedRef.current.visible = false; } catch (e) {}
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
    setNekoPos(new Vector3(2, -2, 2.9));
    if (nekoAttachedRef.current) {
      try {
        nekoAttachedRef.current.visible = true;
        nekoAttachedRef.current.position.set(2, -2, 2.9);
        nekoAttachedRef.current.rotation.set(0, 0.5, 0);
      } catch (e) {}
    }
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
        if (
          config.rotationArm1 === undefined ||
          config.armHeight === undefined ||
          config.recordedActions === undefined
        ) {
          throw new Error('Formato de archivo inválido');
        }
        if (
          typeof config.rotationArm1 !== 'number' ||
          typeof config.armHeight !== 'number' ||
          !Array.isArray(config.recordedActions)
        ) {
          throw new Error('Formato de archivo inválido');
        }
        setRotationArm1(ARM1_FIXED_ROTATION);
        setRotationArm2(config.rotationArm2);
        setArmHeight(config.armHeight);
        setGlobalRotation(config.globalRotation);
        setRecordedActions(config.recordedActions);
        setNekoPos(new Vector3(...(config.nekoPos || [2, -2, 2.9])));
        setHasFallen(config.hasFallen || false);
        setIsRecording(false);
        setIsPlaying(false);
        setIsFalling(false);
        if (nekoAttachedRef.current) {
          try {
            nekoAttachedRef.current.visible = true;
            nekoAttachedRef.current.position.set(2, -2, 2.9);
            nekoAttachedRef.current.rotation.set(0, 0.5, 0);
          } catch (e) {}
        }
        swal("Configuración importada", "El estado se ha restaurado correctamente", "success");
      } catch (error) {
        swal("Error", "No se pudo cargar el archivo de configuración", "error");
      }
    };
    reader.readAsText(file);
  };

  return {
    rotationArm1,
    rotationArm2,
    armHeight,
    globalRotation,
    isMoving,
    expertMode,
    isRecording,
    recordedActions,
    isPlaying,
    recordingStart,
    isFalling,
    hasFallen,
    nekoPos,
    matrices,
    armHeightInput,
    arm2Input,
    globalRotationInput,
    targetXInput,
    targetYInput,
    targetZInput,
    orbitControlsRef,
    animationRef,
    nekoAttachedRef,
    nekoFallAnimationRef,
    endEffectorRef,
    MIN_HEIGHT,
    MAX_HEIGHT,
    deltaStep,
    LINK1_LENGTH,
    LINK2_LENGTH,
    MIN_ARM_DEG,
    MAX_ARM_DEG,
    ARM1_FIXED_ROTATION,
    computeForwardKinematics,
    solveInverseKinematics,
    calculateCoordinates,
    handleKeyPress,
    handleArmHeightInput,
    handleArmHeightBlur,
    handleArm2Input,
    handleArm2Blur,
    handleGlobalRotationInput,
    handleGlobalRotationBlur,
    recordAction,
    moveVertical,
    rotateModel,
    rotateRedArm,
    updateTargetFromCurrent,
    applyInverseKinematics,
    soltarNeko,
    resetNeko,
    playRecording,
    exportConfig,
    importConfig,
    setRotationArm1,
    setRotationArm2,
    setArmHeight,
    setGlobalRotation,
    setIsRecording,
    setRecordedActions,
    setIsPlaying,
    setRecordingStart,
    setIsFalling,
    setHasFallen,
    setNekoPos,
    setExpertMode
  };
}
