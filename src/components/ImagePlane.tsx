import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FC, ReactNode, useRef } from 'react';
import { Mesh, Vector3 } from 'three';

export type ImagePlaneProps = {
    yaw: number;
    pitch: number;
    roll: number;
    distance: number;
    forceFront?: boolean;

}


export const ImagePlane: FC<ImagePlaneProps & { children: ReactNode }> = ({ yaw, pitch, roll, distance, children, forceFront = false }) => {
    // Set the position of the plane at the specified distance from the origin

    const meshRef = useRef<Mesh>();

    useFrame(() => {

        if (!meshRef.current) return;
        // Set the initial position based on the yaw and pitch
        meshRef.current.position.set(
            distance * Math.cos(yaw) * Math.cos(pitch),
            distance * Math.sin(pitch),
            distance * Math.sin(yaw) * Math.cos(pitch)
        );

        // Apply roll (rotation around Z-axis)

        // Make the object look at the center
        meshRef.current.lookAt(new Vector3(0, 0, 0));
    });

    return (
        <mesh ref={meshRef} >
            <planeGeometry args={[1, 1]} /> {/* Adjust size of the plane here */}
            <meshBasicMaterial color="lightblue" />
            <Html transform zIndexRange={forceFront ? [1, 1] : [0, 0]}>

                {children}
            </Html>
        </mesh>
    );
}
