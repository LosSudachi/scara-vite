import React from 'react';

export default function Controls({ controller, forwardPosition }) {
  const {
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
    calculateCoordinates,
    handleKeyPress,
    handleArmHeightInput,
    handleArmHeightBlur,
    handleArm2Input,
    handleArm2Blur,
    handleGlobalRotationInput,
    handleGlobalRotationBlur,
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
    setRecordedActions,
    setIsRecording,
    setRecordingStart,
    setExpertMode
  } = controller;

  return (
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
                    onChange={(e) => controller.setTargetXInput ? controller.setTargetXInput(e.target.value) : null}
                    placeholder="X"
                    step="0.01"
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                  />
                  <input
                    type="number"
                    value={targetYInput}
                    onChange={(e) => controller.setTargetYInput ? controller.setTargetYInput(e.target.value) : null}
                    placeholder="Y"
                    step="0.01"
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '12px' }}
                  />
                  <input
                    type="number"
                    value={targetZInput}
                    onChange={(e) => controller.setTargetZInput ? controller.setTargetZInput(e.target.value) : null}
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
  );
}
