import { Html } from '@react-three/drei';
import { FC, ReactNode } from 'react';
import { DisplayPlane, PlaneProps } from './DisplayPlane';


export const HtmlPlane: FC<PlaneProps & { children: ReactNode }> = ({ children, ...rest }) => {
    const { zIndex } = rest;

    return (
        <DisplayPlane {...rest}>
            <Html transform zIndexRange={[zIndex, zIndex]} style={{ pointerEvents: 'none' }}>
                {children}
            </Html>
        </DisplayPlane>

    );
}
