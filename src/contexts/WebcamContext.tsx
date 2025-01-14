import { createContext, FC, MutableRefObject, ReactNode, useCallback, useContext, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Quaternion } from "three";
interface IWebcamContext {
    webcamRef: MutableRefObject<Webcam | null>;
    capture: () => string | null;
    rotationRef: MutableRefObject<Quaternion>;
}




export const WebcamContext = createContext({} as IWebcamContext);

export const WebcamProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const webcamRef = useRef<Webcam | null>(null);
    const rotationRef = useRef<Quaternion>(new Quaternion());



    const capture = useCallback(
        () => {
            if (webcamRef.current == null) throw new Error("Cannot screenshot without webcam");
            const imageSrc = webcamRef.current.getScreenshot();
            return imageSrc;
        },
        [webcamRef]
    );
    return (
        <WebcamContext.Provider value={{ webcamRef, capture, rotationRef }}>
            {children}
        </WebcamContext.Provider>
    );
}

export const useWebcam = () => {
    const context = useContext(WebcamContext);
    if (!context) throw new Error("useWebcam hook must be used within a WebcamProvider");
    return context;
}