import { Html } from '@react-three/drei';
import { FC, ReactNode } from 'react';
import { Euler } from 'three';

export type ImagePlaneProps = {
    yaw: number;
    pitch: number;
    roll: number;
    distance: number;
}

export const ImagePlane: FC<ImagePlaneProps & { children: ReactNode }> = ({ yaw, pitch, roll, distance, children }) => {
    // Set the position of the plane at the specified distance from the origin

    const x = distance * Math.cos(pitch) * Math.sin(yaw);
    const y = -distance * Math.sin(pitch);
    const z = -distance * Math.cos(pitch) * Math.cos(yaw);


    const rotation = new Euler(-pitch, -yaw, roll);

    return (
        <mesh position={[x, y, z]} rotation={rotation}>
            <planeGeometry args={[1, 1]} /> {/* Adjust size of the plane here */}
            <meshBasicMaterial color="lightblue" />
            <Html transform>
                {children}
            </Html>
        </mesh>
    );
}
