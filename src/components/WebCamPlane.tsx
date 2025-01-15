import { useFrame } from '@react-three/fiber';
import { CSSProperties, FC } from 'react';
import Webcam from 'react-webcam';
import { PlaneProps } from './DisplayPlane';
import { useWebcam } from '../contexts/WebcamContext';
import { MAX_IMAGE_COUNT } from '../lib/consts';
import { HtmlPlane } from './HtmlPlane';


type Props = {
    deviceId?: string;
    webcamStyle?: CSSProperties

}


export const WebcamPlane: FC<Pick<PlaneProps, 'distance'> & Props> = ({ deviceId, webcamStyle, ...rest }) => {
    // Set the position of the plane at the specified distance from the origin

    const extraStyles = webcamStyle ?? {};

    const { webcamRef, rotationRef, dimensions } = useWebcam();


    useFrame((state) => {

        if (!rotationRef.current) return;
        state.camera.getWorldQuaternion(rotationRef.current);
    });
    console.log(dimensions)



    return (
        <HtmlPlane {...rest} rotation={rotationRef.current} zIndex={MAX_IMAGE_COUNT + 1} {...dimensions} >
            {/* <div className='bg-slate-500 w-full h-full'>
                TEST
            </div> */}
            {/* <div className='relative z-10'> */}
            {/* <div style={extraStyles}> */}
            <Webcam
                videoConstraints={{
                    facingMode: 'environment'

                }}
                id={deviceId}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            {/* </div> */}
            {/* </div> */}
        </HtmlPlane>
    );
}
