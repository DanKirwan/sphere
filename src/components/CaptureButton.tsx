import { CameraIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';
import { useWebcam } from '../contexts/WebcamContext';

type Props = {
    onScreenshot: (src: string, yaw: number, pitch: number, roll: number) => void;

}

export const CaptureButton: FC<Props> = ({ onScreenshot }) => {

    const { capture, angle } = useWebcam();

    // TODO this needs to be either inside react canvas or it needs to be got somehow else

    const captureScreenshot = async () => {
        const imgSrc = capture();

        if (!imgSrc) return;
        const { yaw, pitch, roll } = angle;


        onScreenshot(imgSrc, yaw, pitch, roll);


    }

    return (
        <button
            onClick={() => captureScreenshot()}
            className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold  p-4 rounded-full"
        >
            <CameraIcon className='size-8' />
        </button>
    )
}
