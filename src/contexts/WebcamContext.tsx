import React, {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Quaternion } from 'three';

type WebcamContextValue = {
    videoRef: React.RefObject<HTMLVideoElement>;
    capture: () => string;
    rotationRef: React.MutableRefObject<Quaternion>;
    dimensions: { width: number; height: number };
}

// Create the context
export const WebcamContext = createContext<WebcamContextValue | null>(null);

// Provide it in your app
export const WebcamProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // This videoRef points to a plain <video> element (not using react-webcam)
    const videoRef = useRef<HTMLVideoElement>(null);
    const rotationRef = useRef<Quaternion>(new Quaternion());
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    /**
     * Capture: draws the current video frame to an offscreen canvas and returns Base64
     */
    const capture = useCallback(() => {
        if (!videoRef.current) {
            throw new Error('Cannot screenshot without an active webcam');
        }
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context for screenshot');
        }

        // Draw current video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Return image as base64
        return canvas.toDataURL('image/png');
    }, []);

    /**
     * Request user’s webcam and attach to the <video> element
     */
    useEffect(() => {
        let stream: MediaStream;
        async function initWebcam() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                if (!videoRef.current)
                    return;
                if (videoRef.current.srcObject) return;

                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            } catch (err) {
                console.error('Error accessing webcam', err);
            }
        }
        initWebcam();

        // Cleanup: stop webcam if provider unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    /**
     * Update video dimensions once metadata is loaded
     */
    useEffect(() => {
        const handleLoadedMetadata = () => {
            if (videoRef.current) {
                setDimensions({
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight,
                });
            }
        };
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener(
                    'loadedmetadata',
                    handleLoadedMetadata
                );
            }
        };
    }, []);

    return (
        <WebcamContext.Provider
            value={{
                videoRef,
                capture,
                rotationRef,
                dimensions,
            }}
        >
            {/* We keep the actual <video> element hidden somewhere in the DOM */}
            <video
                ref={videoRef}
                style={{ display: 'none' }}
                playsInline
                muted
            />
            {children}
        </WebcamContext.Provider>
    );
};


export const useWebcam = () => {
    const context = useContext(WebcamContext);
    if (!context) throw new Error("useWebcam hook must be used within a WebcamProvider");
    return context;
}