import { FC } from 'react';
import { PlaneProps } from './DisplayPlane';
import clsx from 'clsx';
import { HtmlPlane } from './HtmlPlane';


type Props = {
    color: string
}
export const OutlinePlane: FC<PlaneProps & Props> = ({ color, ...rest }) => {
    return (
        <HtmlPlane {...rest} zIndex={1}>
            <div className="relative p-6 m-10 text-white text-center rounded-lg">
                <div className={clsx(
                    "absolute inset-0 border-2 border-transparent rounded-lg animate-pulse",
                    color
                )}></div>
                <div className="relative z-10 bg-gray-800 p-6 rounded-lg">

                </div>
            </div>
        </HtmlPlane>
    )
}
