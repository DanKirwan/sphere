import { FC } from 'react';
import { ImagePlane, ImagePlaneProps } from './ImagePlane';
import clsx from 'clsx';


type Props = {
    color: string
}
export const OutlinePlane: FC<ImagePlaneProps & Props> = ({ color, ...rest }) => {
    return (
        <ImagePlane {...rest}>
            <div className="relative p-6 m-10 text-white text-center rounded-lg">
                <div className={clsx(
                    "absolute inset-0 border-2 border-transparent rounded-lg animate-pulse",
                    color
                )}></div>
                <div className="relative z-10 bg-gray-800 p-6 rounded-lg">

                </div>
            </div>
        </ImagePlane>
    )
}
