import { useState } from 'react';
import { AccelerometerPermissionDialog } from './components/AccelerometerPermissionDialog';
import { Alignment } from './components/Alignment';

function App() {


  window.addEventListener('deviceorientation', e => console.log(e.beta))
  const augmentedPossible: boolean = !!window.DeviceOrientationEvent.apply;

  const [permissionGranted, setPermissionGranted] = useState(false);

  console.log(window.DeviceOrientationEvent, augmentedPossible)
  return (

    augmentedPossible && !permissionGranted ?
      <AccelerometerPermissionDialog
        permissionGranted={permissionGranted}
        setPermissionGranted={setPermissionGranted}
      /> :

      <Alignment augmentedPossible={permissionGranted && augmentedPossible} />

  )
}


{/* <Scene
augmentedPossible={permissionGranted && augmentedPossible}
/> */}

export default App
