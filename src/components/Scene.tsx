import { Box, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FC, useState } from 'react'
import { ImagePlane } from './ImagePlane'
import { WebcamPlane } from './WebCamPlane'

import { ArrowUturnLeftIcon, MinusIcon, PlusIcon, } from '@heroicons/react/24/solid'

type Shot = {
    yaw: number;
    pitch: number;
    src: string;
}

const removeFirst = <T,>(shots: T[]) => {
    if (shots.length == 0) return [];
    const [, ...rest] = shots;
    return rest;
}

export const Scene: FC = () => {

    const [distance, setDistance] = useState(10);
    const [screenshots, setScreenshots] = useState<Shot[]>([]);



    return (
        <div className='w-screen h-screen relative'>

            <div className='absolute w-full h-full'>

                <Canvas  >

                    {
                        screenshots.map(shot => (
                            <ImagePlane yaw={shot.yaw} pitch={shot.pitch} roll={0} distance={distance}>
                                <img src={shot.src} />
                            </ImagePlane>
                        ))
                    }

                    <OrbitControls
                        minZoom={0.001}
                        maxZoom={0.001}
                        enablePan={false} // Disable panning
                        enableZoom={false} // Disable zooming
                        maxPolarAngle={Math.PI / 2} // Optional: Limit vertical rotation
                        minPolarAngle={0} // Optional: Limit vertical rotation
                    />

                    <Box position={[0, 0, 0]} />

                    <WebcamPlane
                        roll={0} distance={distance}
                        onScreenshot={(src, yaw, pitch) => setScreenshots(shots => [{ src, yaw, pitch }, ...shots])}
                    />


                </Canvas>

            </div>
            <div className='absolute bottom-0'>

                <div className='flex flex-row align-middle justify-center space-x-2'>

                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setScreenshots(shots => removeFirst(shots))}
                    >
                        <ArrowUturnLeftIcon className='size-6' />
                    </button>

                    <div className="inline-flex ">
                        <button
                            className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-l"
                            onClick={() => setDistance(d => d - 0.5)}

                        >
                            <MinusIcon className='size-6' />
                        </button>
                        <button
                            className="bg-green-900 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-r"
                            onClick={() => setDistance(d => d + 0.5)}

                        >
                            <PlusIcon className='size-6' />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}