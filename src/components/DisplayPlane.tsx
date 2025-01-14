import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FC, ReactNode, useRef } from 'react';
import { Mesh, Quaternion, Vector3 } from 'three';
import { FORWARD_VECTOR } from '../lib/consts';

export type PlaneProps = {
    rotation: Quaternion;
    distance: number;
    zIndex: number;

}




export const DisplayPlane: FC<PlaneProps & { children: ReactNode }> = ({ rotation, distance, children, zIndex }) => {
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


    return (
        <mesh ref={meshRef} >
            <planeGeometry args={[20, 16]} />
            <meshBasicMaterial color="lightblue" />
            {/* <Html transform zIndexRange={[zIndex, zIndex]} style={{ pointerEvents: 'none' }}> */}
            {children}
            {/* </Html> */}
        </mesh>
    );
}
