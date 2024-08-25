import { useFrame } from '@react-three/fiber';
import { CSSProperties, FC } from 'react';
import Webcam from 'react-webcam';
import { ImagePlane, ImagePlaneProps } from './ImagePlane';

import { Vector3 } from 'three';
import { useWebcam } from '../contexts/WebcamContext';


type Props = {
    deviceId?: string;
    webcamStyle?: CSSProperties

}


const cameraDir = new Vector3();


export const WebcamPlane: FC<Omit<ImagePlaneProps, 'yaw' | 'pitch' | 'roll'> & Props> = ({ deviceId, webcamStyle, ...rest }) => {
    // Set the position of the plane at the specified distance from the origin

    const extraStyles = webcamStyle ?? {};

    const { webcamRef, setAngle, angle } = useWebcam();


    const { yaw, pitch, roll } = angle;
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

        setAngle({ yaw, pitch, roll })


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


            </div>
        </ImagePlane>
    );
}
