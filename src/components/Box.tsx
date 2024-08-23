import { FC } from 'react';

type Props = {
    position: [number, number, number]
}

export const Box: FC<Props> = ({ position }) => {

    return (
        <mesh
            position={position}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}
