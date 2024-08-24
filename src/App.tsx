import { useState } from 'react';
import { Scene } from './components/Scene'
import { AccelerometerPermissionDialog } from './components/AccelerometerPermissionDialog';

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

      <Scene
        augmentedPossible={permissionGranted && augmentedPossible}
      />

  )
}

export default App
