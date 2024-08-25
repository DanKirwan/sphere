import { FC, ReactNode } from 'react';

type Props = {
    children: ReactNode;
    bottomControls?: ReactNode;
    topControls?: ReactNode;
}

export const Layout: FC<Props> = ({ children, bottomControls = '', topControls = '' }) => {
    return (
        <div className='w-[calc(100dvw)] h-[calc(100dvh)] relative'>


            <div className='absolute bottom-1 z-50 w-full'>
                {bottomControls}
            </div>

            <div className='absolute top-1 z-50 w-full'>
                {topControls}
            </div>
            {children}
        </div>

    )
}
