import { useState } from 'react';
import { AccelerometerPermissionDialog } from '../components/AccelerometerPermissionDialog';
import { Scene } from '../components/Scene';
import { WebcamProvider } from '../contexts/WebcamContext';

export const ScenePC = () => {


    // TODO augmented possible isn't working
    window.addEventListener('deviceorientation', e => console.log(e.beta))
    const augmentedPossible: boolean = !!window.DeviceOrientationEvent?.apply;

    const [permissionGranted, setPermissionGranted] = useState(false);

    return (

        augmentedPossible && !permissionGranted ?
            <AccelerometerPermissionDialog
                permissionGranted={permissionGranted}
                setPermissionGranted={setPermissionGranted}
            /> :

            <WebcamProvider>
                {/* Everything under this provider seems to get reloaded */}



                <Scene
                    augmentedPossible={permissionGranted && augmentedPossible}
                />
            </WebcamProvider>

    )
}
