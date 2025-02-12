import { useFrame } from '@react-three/fiber';
import { FC, ReactNode, useRef } from 'react';
import { Mesh, Quaternion, Vector3 } from 'three';
import { FORWARD_VECTOR, MAX_PLANE_SIZE } from '../lib/consts';
import { adjustSize } from '../lib/aspectRatio';

export type PlaneProps = {
    rotation: Quaternion;
    distance: number;
    width: number;
    height: number;

}




export const DisplayPlane: FC<PlaneProps & { children: ReactNode }> = ({ rotation, distance, width, height, children }) => {
    // Set the position of the plane at the specified distance from the origin

    const meshRef = useRef<Mesh | null>(null);

    const directionRef = useRef<Vector3>(new Vector3());

    useFrame(() => {

        if (!meshRef.current) return;
        const direction: Vector3 = directionRef.current;

        direction.copy(FORWARD_VECTOR);
        direction.multiplyScalar(distance);
        direction.applyQuaternion(rotation);
        meshRef.current.position.copy(direction);

        // Apply roll (rotation around Z-axis)

        // Make the object look at the center
        meshRef.current.setRotationFromQuaternion(rotation);
        // meshRef.current.rotateOnAxis(UP_VECTOR, Math.PI);
    });


    const { width: displayWidth, height: displayHeight } = adjustSize(width, height, MAX_PLANE_SIZE);

    return (
        <mesh ref={meshRef} >
            <planeGeometry args={[displayWidth, displayHeight]} />
            {children}
        </mesh>
    );
}
