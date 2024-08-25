import { useState } from 'react';
import { AccelerometerPermissionDialog } from './components/AccelerometerPermissionDialog';
import { Alignment } from './components/Alignment';
import { WebcamProvider } from './contexts/WebcamContext';

function App() {


  window.addEventListener('deviceorientation', e => console.log(e.beta))
  const augmentedPossible: boolean = !!window.DeviceOrientationEvent.apply;

  const [permissionGranted, setPermissionGranted] = useState(false);

  return (

    augmentedPossible && !permissionGranted ?
      <AccelerometerPermissionDialog
        permissionGranted={permissionGranted}
        setPermissionGranted={setPermissionGranted}
      /> :

      <WebcamProvider>
        {/* Everything under this provider seems to get reloaded */}

        <Alignment augmentedPossible={permissionGranted && augmentedPossible} />
      </WebcamProvider>

  )
}


{/* <Scene
augmentedPossible={permissionGranted && augmentedPossible}
/> */}

export default App
