import { FC, useEffect } from 'react';

type Props = {
    permissionGranted: boolean;
    setPermissionGranted: (granted: boolean) => void;

}


interface DeviceOrientationEventIOS extends DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
}


const handlePermissionCheck = async (reload: boolean) => {

    if (!window.DeviceOrientationEvent) return false;

    const requestPermission = (window.DeviceOrientationEvent as unknown as DeviceOrientationEventIOS).requestPermission;
    const iOS = typeof requestPermission === 'function';
    if (iOS) {
        try {

            const response = await requestPermission();
            if (response === 'granted') {
                if (reload) {
                    window.location.reload();
                }
                return true;
            }
        } catch (e: unknown) {
            console.error(e);
            return false;
        }

        return false;
    } else {
        return true;
    }
}

export const AccelerometerPermissionDialog: FC<Props> = ({ permissionGranted, setPermissionGranted, }) => {




    useEffect(() => {
        if (permissionGranted) return;
        handlePermissionCheck(false).then(granted => setPermissionGranted(granted))
    }, [setPermissionGranted, permissionGranted]);

    return (
        <div>
            <button onClick={() => handlePermissionCheck(true).then(granted => setPermissionGranted(granted))}>
                Request Accelerometer Permission
            </button>
        </div>
    )
}
