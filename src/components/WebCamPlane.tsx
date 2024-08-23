import { useFrame } from '@react-three/fiber';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ImagePlane, ImagePlaneProps } from './ImagePlane';
import { clamp } from 'lodash';


const SPEED = 0.001;

type Props = {
    onScreenshot: (src: string, yaw: number, pitch: number) => void;
}

export const WebcamPlane: FC<Omit<ImagePlaneProps, 'yaw' | 'pitch'> & Props> = ({ onScreenshot, ...rest }) => {
    // Set the position of the plane at the specified distance from the origin

    const [yawDelta, setYawDelta] = useState(0);
    const [pitchDelta, setPitchDelta] = useState(0);
    const webcamRef = useRef<Webcam | null>(null);

    const capture = useCallback(
        () => {
            if (webcamRef.current == null) throw new Error("Cannot screenshot without webcam");
            const imageSrc = webcamRef.current.getScreenshot();
            return imageSrc;
        },
        [webcamRef]
    );


    useEffect(() => {
        const handleKeyChange = (isDown: boolean) => (event: KeyboardEvent,) => {
            const key = event.key.toLocaleLowerCase();

            const delta = isDown ? 1 : -1;

            switch (key) {
                case 'w':
                    return setPitchDelta(d => clamp(d + delta, -1, 1));
                case 's':
                    return setPitchDelta(d => clamp(d - delta, -1, 1));

                case 'a':
                    return setYawDelta(d => clamp(d + delta, -1, 1));
                case 'd':
                    return setYawDelta(d => clamp(d - delta, -1, 1));

            }
        }

        const handleKeyDown = handleKeyChange(true);
        const handleKeyUp = handleKeyChange(true);





        window.addEventListener('keydown', ev => handleKeyDown(ev));
        window.addEventListener('keyup', ev => handleKeyUp(ev));


        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [])

    const [yaw, setYaw] = useState(0);
    const [pitch, setPitch] = useState(0);

    useFrame(() => {
        console.log(yaw)
        setYaw(y => y + yawDelta * SPEED)
        setPitch(p => p + pitchDelta * SPEED)

    });

    return (
        <ImagePlane {...rest} yaw={yaw} pitch={pitch}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>

                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />
                <button onClick={() => onScreenshot(capture() ?? '', yaw, pitch)}>
                    Capture
                </button>
            </div>
        </ImagePlane>
    );
}
