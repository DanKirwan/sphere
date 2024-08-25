import { createContext, FC, MutableRefObject, ReactNode, useCallback, useContext, useRef, useState } from "react";
import Webcam from "react-webcam";
interface IWebcamContext {
    webcamRef: MutableRefObject<Webcam | undefined>;
    capture: () => string | null;
    angle: Angle
    setAngle: (angle: Angle) => void;
}


type Angle = {
    yaw: number;
    pitch: number;
    roll: number;
}
export const WebcamContext = createContext({} as IWebcamContext);

export const WebcamProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const webcamRef = useRef<Webcam>();

    const [angle, setAngle] = useState<Angle>({ yaw: 0, pitch: 0, roll: 0 });


    const capture = useCallback(
        () => {
            if (webcamRef.current == null) throw new Error("Cannot screenshot without webcam");
            const imageSrc = webcamRef.current.getScreenshot();
            return imageSrc;
        },
        [webcamRef]
    );
    return (
        <WebcamContext.Provider value={{ webcamRef, capture, angle, setAngle }}>
            {children}
        </WebcamContext.Provider>
    );
}

export const useWebcam = () => {
    const context = useContext(WebcamContext);
    if (!context) throw new Error("useWebcam hook must be used within a WebcamProvider");
    return context;
}