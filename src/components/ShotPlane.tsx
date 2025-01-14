import { CSSProperties, FC } from 'react';
import { Shot } from '../lib/types';
import { HtmlPlane } from './HtmlPlane';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { DisplayPlane } from './DisplayPlane';

type Props = {
    shot: Shot;
    distance: number;
    index: number;
    disableMask?: boolean;
    imageStyle?: CSSProperties
}
const getGradient = (to: string, maskPercentage: number) => `linear-gradient(to ${to}, transparent 0%,  #fff ${maskPercentage}%, #fff ${100 - maskPercentage}%, transparent 100%)`


export const ShotPlane: FC<Props> = ({ shot, distance, index, imageStyle = {}, disableMask = false }) => {


    const { rotation, blur, src } = shot;
    const texture = useLoader(TextureLoader, src);

    const mask = `${getGradient('left', blur)},${getGradient('top', blur)}`

    const maskStyles: CSSProperties = disableMask ? {} : { maskComposite: 'intersect', maskImage: mask };

    return (
        <DisplayPlane rotation={rotation} distance={distance} zIndex={index} >
            <meshBasicMaterial map={texture} />

            {/* <img style={{
                ...maskStyles,
                ...imageStyle,
                pointerEvents: 'none'
            }} src={src} /> */}
        </DisplayPlane >
    )
}
