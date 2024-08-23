import { Box, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FC, useState } from 'react'
import { ImagePlane } from './ImagePlane'
import { WebcamPlane } from './WebCamPlane'


type Shot = {
    yaw: number;
    pitch: number;
    src: string;
}

export const Scene: FC = () => {

    const [screenshots, setScreenshots] = useState<Shot[]>([]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>

            <Canvas  >

                {
                    screenshots.map(shot => (
                        <ImagePlane yaw={shot.yaw} pitch={shot.pitch} roll={0} distance={10}>
                            <img src={shot.src} />
                        </ImagePlane>
                    ))
                }
                <ImagePlane yaw={0} pitch={Math.PI / 4} roll={0} distance={4}>
                    Test
                </ImagePlane>


                <ImagePlane yaw={5} pitch={0} roll={0} distance={4}>
                    Test 2
                </ImagePlane>
                <OrbitControls
                    minZoom={0.001}
                    maxZoom={0.001}
                    enablePan={false} // Disable panning
                    enableZoom={false} // Disable zooming
                    maxPolarAngle={Math.PI / 2} // Optional: Limit vertical rotation
                    minPolarAngle={0} // Optional: Limit vertical rotation
                />

                <Box position={[0, 0, 0]} />

                <WebcamPlane roll={0} distance={10} onScreenshot={(src, yaw, pitch) => setScreenshots(shots => [...shots, { src, yaw, pitch }])} />


            </Canvas>
        </div>
    )
}