import { Box, DeviceOrientationControls, Html } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FC, useEffect, useState } from 'react'
import { WebcamPlane } from './WebCamPlane'

import { ArrowPathRoundedSquareIcon, ArrowsPointingInIcon, ArrowUturnLeftIcon, CubeTransparentIcon } from '@heroicons/react/24/solid'
import { Shot } from '../lib/types'
import { removeFirst } from '../lib/utils'
import { localStoredData } from '../main'
import { CamControls } from './CamControls'
import { ShotPlane } from './ShotPlane'
import { Layout } from '../Layout'
import { CaptureButton } from './CaptureButton'
import { CaptureEquirectButton } from './CaptureEquirectButton'
import { useWebcam } from '../contexts/WebcamContext'
import { CameraSelectorButton } from './CameraSelectorButton'


type Props = {
    augmentedPossible: boolean;
}


export const Scene: FC<Props> = ({ augmentedPossible }) => {

    const { distance, maskPercentage, fov } = localStoredData.get(data => data.settings);
    const [screenshots, setScreenshots] = useState<Shot[]>([]);
    const [hidden, setHidden] = useState(false);
    const [augmented, setAugmented] = useState(augmentedPossible);



    const { availableDevices, selectedDeviceId, setSelectedDeviceId } = useWebcam();

    const cycleDevice = () => {
        const currentIndex = availableDevices.findIndex(x => x.deviceId === selectedDeviceId);

        setSelectedDeviceId(availableDevices[(currentIndex + 1) % availableDevices.length].deviceId);
    }

    return (

        <Layout
            bottomControls={
                <div className='flex flex-row align-middle justify-center space-x-2 '>
                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setScreenshots(shots => removeFirst(shots))}
                    >
                        <ArrowUturnLeftIcon className='size-6' />
                    </button>


                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setAugmented(a => !a)}
                    >
                        {augmented ? <ArrowsPointingInIcon className='size-6' /> : <CubeTransparentIcon className='size-6' />}
                    </button>

                    <CameraSelectorButton />
                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setHidden(h => !h)}
                    >
                        {hidden ? 'Show' : 'Hide'}
                    </button>

                    <CaptureButton
                        onScreenshot={(src, rotation) => setScreenshots(shots => [{ src, rotation, blur: maskPercentage }, ...shots])}

                    />



                </div>
            }
        >
            <Canvas camera={{ position: [0, 0, 0], fov: 140 }}  >


                <CaptureEquirectButton />


                {
                    screenshots.map((shot, index) => (
                        <ShotPlane shot={shot} distance={distance} index={index} />
                    ))
                }

                {augmented ?
                    <DeviceOrientationControls /> :
                    <CamControls />
                }


                <Box position={[0, 0, 0]} />


                {!hidden &&
                    <WebcamPlane distance={distance} />
                }

            </Canvas>
        </Layout>

    )
}