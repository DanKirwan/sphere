import { Box, DeviceOrientationControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FC, useState } from 'react'
import { ImagePlane } from './ImagePlane'
import { WebcamPlane } from './WebCamPlane'

import { ArrowUturnLeftIcon, MinusIcon, PlusIcon, CubeTransparentIcon, ArrowsPointingInIcon } from '@heroicons/react/24/solid'
import { CamControls } from './CamControls'


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

type Props = {
    augmentedPossible: boolean;
}




const getGradient = (to: string, maskPercentage: number) => `linear-gradient(to ${to}, transparent 0%,  #fff ${maskPercentage}%, #fff ${100 - maskPercentage}%, transparent 100%)`


export const Scene: FC<Props> = ({ augmentedPossible }) => {

    const [distance, setDistance] = useState(10);
    const [screenshots, setScreenshots] = useState<Shot[]>([]);

    const [augmented, setAugmented] = useState(augmentedPossible);


    const maskPercentage = 5;



    const mask = `${getGradient('left', maskPercentage)},${getGradient('top', maskPercentage)}`
    console.log(mask);
    return (
        <div className='w-screen h-screen relative'>

            <div className='absolute w-full h-full'>

                <Canvas camera={{ position: [0, 0, 0] }}  >

                    {
                        screenshots.map(shot => (
                            <ImagePlane yaw={shot.yaw} pitch={shot.pitch} roll={0} distance={distance}>


                                <img style={{
                                    maskComposite: 'intersect',
                                    maskImage: mask,
                                }} src={shot.src} />
                            </ImagePlane>
                        ))
                    }

                    {augmented ?
                        <DeviceOrientationControls /> :
                        <CamControls />
                    }


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

                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setAugmented(a => !a)}
                    >
                        {augmented ? <ArrowsPointingInIcon className='size-6' /> : <CubeTransparentIcon className='size-6' />}
                    </button>
                </div>
            </div>

        </div>
    )
}