import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import { FC } from 'react';
import { useWebcam } from '../contexts/WebcamContext';

type Props = {

}

export const CameraSelectorButton: FC<Props> = ({ }) => {

    const { availableDevices, selectedDeviceId, setSelectedDeviceId } = useWebcam();

    const cycleDevice = () => {
        const currentIndex = availableDevices.findIndex(x => x.deviceId === selectedDeviceId);

        setSelectedDeviceId(availableDevices[(currentIndex + 1) % availableDevices.length].deviceId);
    }

    return (
        availableDevices.length > 1 ?
            <button
                className="inline-flex bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => cycleDevice()}
            >
                <ArrowPathRoundedSquareIcon className='size-6' />
            </button>
            : null
    );
}
