import { Html } from '@react-three/drei';
import { FC, ReactNode } from 'react';
import { DisplayPlane, PlaneProps } from './DisplayPlane';



type ExtraProps = {
    children: ReactNode;
    zIndex: number;
}
export const HtmlPlane: FC<PlaneProps & ExtraProps> = ({ children, zIndex, ...rest }) => {

    // TODO Distance factor here is completely arbitrary
    return (
        <DisplayPlane {...rest}>
            <Html transform zIndexRange={[zIndex, zIndex]} style={{ pointerEvents: 'none' }} className='bg-blue-700' distanceFactor={45} >
                {children}
            </Html>
        </DisplayPlane >

    );
}
