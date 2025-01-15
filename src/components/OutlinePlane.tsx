import { FC } from 'react';
import { PlaneProps } from './DisplayPlane';
import clsx from 'clsx';
import { HtmlPlane } from './HtmlPlane';


type Props = {
    color: string
}
export const OutlinePlane: FC<PlaneProps & Props> = ({ color, ...rest }) => {
    return (
        <HtmlPlane {...rest} zIndex={0} >
            <div className="relative p-2 text-white text-center rounded-sm">
                <div className={clsx(
                    "absolute inset-0 border-2 border-transparent rounded-sm animate-pulse",
                    color
                )}></div>
                <div className="relative z-1 bg-gray-800 p-6 rounded-sm">

                </div>
            </div>
        </HtmlPlane>
    )
}
