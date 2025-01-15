import { CSSProperties, FC, useEffect, useState } from 'react';
import { LinearFilter, RGBFormat, VideoTexture } from 'three';
import { useWebcam } from '../contexts/WebcamContext';
import { DisplayPlane, PlaneProps } from './DisplayPlane';
import { useFrame } from '@react-three/fiber';


type Props = {
    deviceId?: string;
    webcamStyle?: CSSProperties

}


export const WebcamPlane: FC<Pick<PlaneProps, 'distance'> & Props> = ({ deviceId, webcamStyle, ...rest }) => {
    // Set the position of the plane at the specified distance from the origin

    const extraStyles = webcamStyle ?? {};

    const { videoRef, rotationRef, dimensions } = useWebcam();
    const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);


    useFrame((state) => {

        if (!rotationRef.current) return;
        state.camera.getWorldQuaternion(rotationRef.current);
    });


    // Create a js VideoTexture once the video is ready
    useEffect(() => {
        if (videoRef.current) {
            const texture = new VideoTexture(videoRef.current);
            texture.minFilter = LinearFilter;
            texture.magFilter = LinearFilter;
            texture.format = RGBFormat;
            setVideoTexture(texture);
        }
    }, [videoRef]);

    if (!videoTexture) return null;

    // Preserve aspect ratio in 3D
    // For example, choose a plane width of 2, then compute height from ratio
    const { width, height } = dimensions;

    return (
        <DisplayPlane rotation={rotationRef.current} distance={rest.distance} height={width} width={height}>

            <meshBasicMaterial map={videoTexture} />
        </DisplayPlane>
    );
}
