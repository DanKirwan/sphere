import { CSSProperties, FC } from 'react';
import { Shot } from '../lib/types';
import { ImagePlane } from './ImagePlane';

type Props = {
    shot: Shot;
    distance: number;
    disableMask?: boolean;
    imageStyle?: CSSProperties
}
const getGradient = (to: string, maskPercentage: number) => `linear-gradient(to ${to}, transparent 0%,  #fff ${maskPercentage}%, #fff ${100 - maskPercentage}%, transparent 100%)`


export const ShotPlane: FC<Props> = ({ shot, distance, imageStyle = {}, disableMask = false }) => {


    const { yaw, pitch, roll, blur, src } = shot;
    const mask = `${getGradient('left', blur)},${getGradient('top', blur)}`

    const maskStyles: CSSProperties = disableMask ? {} : { maskComposite: 'intersect', maskImage: mask };

    return (
        <ImagePlane yaw={yaw} pitch={pitch} roll={roll} distance={distance}>

            <img style={{
                ...maskStyles,
                ...imageStyle
            }} src={src} />
        </ImagePlane>
    )
}
