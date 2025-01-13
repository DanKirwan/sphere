import React, { useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cubeToEquirectangular } from '../lib/equirectangular';
import { Html } from '@react-three/drei';

export const CaptureEquirectButton: React.FC = () => {
    const { scene, gl } = useThree();
    const cubeCameraRef = useRef<THREE.CubeCamera | null>(null);

    // Create a CubeRenderTarget on mount
    // (or you can create it once outside the component)
    const cubeRT = new THREE.WebGLCubeRenderTarget(1024, {
        format: THREE.RGBAFormat,
        generateMipmaps: false,
        type: THREE.UnsignedByteType,
    });

    // Create a CubeCamera
    // near=0.1, far=1000 – adjust as needed
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRT);
    cubeCameraRef.current = cubeCamera;
    cubeCamera.position.set(0, 0, 0);

    // A function to capture the equirectangular image
    const handleCapture = useCallback(() => {
        if (!cubeCameraRef.current) return;

        // 1) Update the CubeCamera to render the scene into cube map
        cubeCameraRef.current.update(gl, scene);

        // 2) Convert the resulting cube map into equirectangular
        const equirectCanvas = cubeToEquirectangular(gl, cubeRT.texture, {
            width: 2048,
            height: 1024,
            flipX: 1.0,
        });

        // 3) Convert to data URL (PNG) and download
        // EXR?

        const dataURL = equirectCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'equirect_capture.png';
        link.href = dataURL;
        link.click();
    }, [gl, scene, cubeRT]);

    // TODO make this less ugly
    // it doesn't render the html elements so we probably need to extract the planes into textures inside of gl

    return (

        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="orange" />
            <Html position={[0, 1.5, 0]} distanceFactor={10} zIndexRange={[5, 5]}>
                <button onClick={handleCapture}>
                    Test
                </button>
            </Html>
        </mesh>
    );
};
