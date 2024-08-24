import { useFrame } from '@react-three/fiber';
import { FC, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ImagePlane, ImagePlaneProps } from './ImagePlane';

import { CameraIcon } from '@heroicons/react/24/solid';
import { Vector3 } from 'three';

const SPEED = 0.01;

type Props = {
    onScreenshot: (src: string, yaw: number, pitch: number) => void;
    deviceId?: string;
}


const cameraDir = new Vector3();


export const WebcamPlane: FC<Omit<ImagePlaneProps, 'yaw' | 'pitch'> & Props> = ({ onScreenshot, deviceId, ...rest }) => {
    // Set the position of the plane at the specified distance from the origin

    const webcamRef = useRef<Webcam | null>(null);

    const capture = useCallback(
        () => {
            if (webcamRef.current == null) throw new Error("Cannot screenshot without webcam");
            const imageSrc = webcamRef.current.getScreenshot();
            return imageSrc;
        },
        [webcamRef]
    );

    const [yaw, setYaw] = useState(0);
    const [pitch, setPitch] = useState(0);

    useFrame((state) => {

        state.camera.getWorldDirection(cameraDir);
        const distance = cameraDir.length();

        const pitch = Math.asin(cameraDir.y / distance);
        const yaw = Math.atan2(cameraDir.z, cameraDir.x)

        setYaw(yaw);
        setPitch(pitch);


    });

    return (
        <ImagePlane {...rest} yaw={yaw} pitch={pitch} forceFront>
            <div className='relative z-10'>

                <Webcam
                    videoConstraints={{
                        facingMode: 'environment'
                    }}
                    id={deviceId}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />

                <div className='absolute top-1 right-1'>


                    <button
                        onClick={() => onScreenshot(capture() ?? '', yaw, pitch)}
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                    >
                        <CameraIcon className='size-6' />
                    </button>

                </div>
            </div>
        </ImagePlane>
    );
}
