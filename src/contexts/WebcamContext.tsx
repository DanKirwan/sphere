import { createContext, FC, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Quaternion } from "three";
interface IWebcamContext {
    webcamRef: MutableRefObject<Webcam | null>;
    capture: () => string | null;
    rotationRef: MutableRefObject<Quaternion>;
    dimensions: { width: number, height: number };
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



    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (webcamRef.current) {
                const video = webcamRef.current?.video;
                if (video) {
                    setDimensions({
                        width: video.videoWidth,
                        height: video.videoHeight,
                    });
                }
            }
        };

        // Call it once initially
        updateDimensions();

        // Optional: Add resize listener if needed
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);
    return (
        <WebcamContext.Provider value={{ webcamRef, capture, rotationRef, dimensions }}>
            {children}
        </WebcamContext.Provider>
    );
}

export const useWebcam = () => {
    const context = useContext(WebcamContext);
    if (!context) throw new Error("useWebcam hook must be used within a WebcamProvider");
    return context;
}