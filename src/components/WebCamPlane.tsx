import { useFrame } from '@react-three/fiber';
import { CSSProperties, FC, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ImagePlane, ImagePlaneProps } from './ImagePlane';

import { CameraIcon } from '@heroicons/react/24/solid';
import { Vector3 } from 'three';


type Props = {
    onScreenshot: (src: string, yaw: number, pitch: number, roll: number) => void;
    deviceId?: string;
    webcamStyle?: CSSProperties

}


const cameraDir = new Vector3();


export const WebcamPlane: FC<Omit<ImagePlaneProps, 'yaw' | 'pitch' | 'roll'> & Props> = ({ onScreenshot, deviceId, webcamStyle, ...rest }) => {
    // Set the position of the plane at the specified distance from the origin

    const extraStyles = webcamStyle ?? {};
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
    const [roll, setRoll] = useState(0);

    useFrame((state) => {

        state.camera.getWorldDirection(cameraDir);
        const distance = cameraDir.length();

        const pitch = Math.asin(cameraDir.y / distance);
        const yaw = Math.atan2(cameraDir.z, cameraDir.x);
        // Reference up vector, usually (0, 1, 0)
        const referenceUp = new Vector3(0, 1, 0);

        // Calculate roll
        const rollVector = new Vector3();
        rollVector.crossVectors(referenceUp, cameraDir).normalize();

        // The roll is the angle between the camera's up vector and the reference up vector in the plane perpendicular to the direction vector
        const cameraUp = new Vector3(0, 1, 0).applyAxisAngle(cameraDir, Math.PI / 2); // Assuming the camera's original up is (0, 1, 0)
        const roll = Math.acos(cameraUp.dot(referenceUp));

        setYaw(yaw);
        setPitch(pitch);
        setRoll(roll);


    });

    return (
        <ImagePlane {...rest} roll={roll} yaw={yaw} pitch={pitch} forceFront>
            <div className='relative z-10'>

                <div style={extraStyles}>

                    <Webcam

                        videoConstraints={{
                            facingMode: 'environment'
                        }}
                        id={deviceId}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                </div>

                <div className='absolute top-1 right-1'>


                    <button
                        onClick={() => onScreenshot(capture() ?? '', yaw, pitch, roll)}
                        className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                    >
                        <CameraIcon className='size-6' />
                    </button>

                </div>
            </div>
        </ImagePlane>
    );
}
