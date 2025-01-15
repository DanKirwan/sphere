import { Html } from '@react-three/drei';
import { FC, ReactNode } from 'react';
import { DisplayPlane, PlaneProps } from './DisplayPlane';



type ExtraProps = {
    children: ReactNode;
    zIndex: number;
}
export const HtmlPlane: FC<PlaneProps & ExtraProps> = ({ children, zIndex, distance, ...rest }) => {

    // TODO Distance factor here is completely arbitrary
    return (
        <DisplayPlane distance={distance + 1} {...rest}>
            <meshBasicMaterial opacity={0} />
            <Html transform zIndexRange={[zIndex, zIndex]} style={{ pointerEvents: 'none' }} >
                {children}
            </Html>
        </DisplayPlane >

    );
}
