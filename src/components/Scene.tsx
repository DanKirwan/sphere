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
        const webcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(function (stream) {
                    //Display the video stream in the video object
                })
                .catch(function (e) { logError(e.name + ": " + e.message); });
        }
        else {
            navigator.getWebcam({ audio: true, video: true },
                function (stream) {
                    //Display the video stream in the video object
                },
                function () { logError("Web cam is not accessible."); });
        }


    }, [])

    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);

    const selectedDevice = mediaDevices.length == 0 ? null : mediaDevices[selectedDeviceIndex];

    const cycleDevice = () => {
        setSelectedDeviceIndex(x => (x + 1) % mediaDevices.length);
    }

    return (

        <Layout
            bottomControls={
                <div className='flex flex-row align-middle justify-center space-x-2'>
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
                        onScreenshot={(src, yaw, pitch, roll) => setScreenshots(shots => [{ src, yaw, pitch, roll, blur: maskPercentage }, ...shots])}

                    />



                </div>
            }
        >
            <Canvas camera={{ position: [0, 0, 0] }}  >


                <CaptureEquirectButton />


                {
                    screenshots.map(shot => (
                        <ShotPlane shot={shot} distance={distance} />
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