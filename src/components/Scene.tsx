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


type Props = {
    augmentedPossible: boolean;
}


export const Scene: FC<Props> = ({ augmentedPossible }) => {

    const { distance, maskPercentage } = localStoredData.get(data => data.settings);


    const [screenshots, setScreenshots] = useState<Shot[]>([]);

    const [hidden, setHidden] = useState(false);

    const [augmented, setAugmented] = useState(augmentedPossible);



    const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        if (navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then(d => setMediaDevices(d.filter(d => d.kind == 'videoinput')));

        } else {
            console.error("Could not set available media devices");
        }

        navigator.mediaDevices.enumerateDevices().then(d => setMediaDevices(d.filter(d => d.kind == 'videoinput')));

    }, [])

    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);

    const selectedDevice = mediaDevices.length == 0 ? null : mediaDevices[selectedDeviceIndex];

    const cycleDevice = () => {
        setSelectedDeviceIndex(x => (x + 1) % mediaDevices.length);
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

                    {mediaDevices.length > 1 &&
                        <button
                            className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                            onClick={() => cycleDevice()}
                        >
                            <ArrowPathRoundedSquareIcon className='size-6' />
                        </button>
                    }

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
            <Canvas camera={{ position: [0, 0, 0], fov: 100 }}  >


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
                    <WebcamPlane
                        deviceId={selectedDevice?.deviceId}
                        distance={distance}
                    />

                }

            </Canvas>
        </Layout>

    )
}