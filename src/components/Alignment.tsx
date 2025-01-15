import { Box, DeviceOrientationControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FC, useMemo, useState } from 'react'
import { WebcamPlane } from './WebCamPlane'

import { Layout } from '../Layout'
import { Shot } from '../lib/types'
import { localStoredData } from '../main'
import { CamControls } from './CamControls'
import { ShotPlane } from './ShotPlane'

import { ArrowsPointingInIcon, ArrowUturnLeftIcon, CubeTransparentIcon } from '@heroicons/react/24/solid'
import { OutlinePlane } from './OutlinePlane'
import clsx from 'clsx'
import { CaptureButton } from './CaptureButton'
import { Euler, Quaternion } from 'three'


type Props = {
    augmentedPossible: boolean;
}


export const Alignment: FC<Props> = ({ augmentedPossible }) => {


    const { distance: settingDistance, maskPercentage } = localStoredData.get(data => data.settings);
    const [cameraDistance, setCameraDistance] = useState(settingDistance);
    const [augmented, setAugmented] = useState(augmentedPossible);

    const saveCameraDistance = () => {
        localStoredData.set(s => s.settings.distance, cameraDistance);
    }


    const [firstShot, setFirstShot] = useState<Shot | null>(null);
    const [secondShot, setSecondShot] = useState<Shot | null>(null);


    const undo = () => {
        if (secondShot) return setSecondShot(null);
        if (firstShot) return setFirstShot(null);
    }

    const hidden = firstShot && secondShot;

    const initialRotation = useMemo(() => new Quaternion().setFromEuler(new Euler(0, -Math.PI / 2, 0)), []);
    const shiftedRotation = useMemo(() => new Quaternion().setFromEuler(new Euler(0, -Math.PI / 2 - Math.PI / 8, 0)), []);

    return (
        <Layout bottomControls={



            <div className='flex flex-col w-full items-center justify-center space-y-2 px-2'>

                <div className='flex flex-col w-full items-center'>

                    <div className='bg-slate-100 border-slate-800 border-2 text-center w-64 rounded-md p-2 text-slate-900'>

                        {!firstShot ? 'Align photo with blue marker' : (!secondShot ? 'Align photo with green marker' : 'Move slider to align images')}
                    </div>
                </div>
                {firstShot && secondShot &&
                    <input
                        type="range"
                        min={50}
                        max={200}
                        value={cameraDistance}
                        onChange={e => setCameraDistance(+e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                }

                <div className='flex flex-row align-middle justify-center space-x-2'>

                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setAugmented(a => !a)}
                    >
                        {augmented ? <ArrowsPointingInIcon className='size-6' /> : <CubeTransparentIcon className='size-6' />}
                    </button>

                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => undo()}
                    >
                        <ArrowUturnLeftIcon className='size-6' />
                    </button>




                    <CaptureButton onScreenshot={(src, rotation) => {
                        if (!firstShot) return setFirstShot({ blur: maskPercentage, rotation: rotation.clone(), src });
                        if (!secondShot) return setSecondShot({ blur: maskPercentage, rotation: rotation.clone(), src });
                    }} />



                    <button
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => saveCameraDistance()}
                    >

                        Complete
                    </button>
                </div>

            </div>

        }>

            <Canvas camera={{ position: [0, 0, 0] }}  >


                {firstShot && <ShotPlane index={2} shot={firstShot} distance={cameraDistance} disableMask imageStyle={{ opacity: 0.5, filter: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)" }} />}
                {secondShot && <ShotPlane index={3} shot={secondShot} distance={cameraDistance} disableMask imageStyle={{ opacity: 0.5, filter: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(90deg)" }} />}


                {!firstShot && !secondShot && <OutlinePlane zIndex={1} distance={cameraDistance} rotation={initialRotation} color={clsx('bg-blue-700')}></OutlinePlane>}
                {firstShot && !secondShot && <OutlinePlane zIndex={1} distance={cameraDistance} rotation={shiftedRotation} color={clsx('bg-green-700')}></OutlinePlane>}

                {augmented ?
                    <DeviceOrientationControls /> :
                    <CamControls />
                }


                <Box position={[0, 0, 0]} />

                {!hidden &&
                    <WebcamPlane
                        distance={cameraDistance}
                        webcamStyle={{ opacity: 0.5 }}

                    />

                }

            </Canvas>

        </Layout>

    )
}