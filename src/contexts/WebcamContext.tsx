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

/** The shape of the context we’ll provide */
export interface WebcamContextValue {
    /** A ref to the underlying <video> element that’s streaming the camera. */
    videoRef: React.RefObject<HTMLVideoElement>;

    /** Call this to capture a screenshot of the current video frame as a base64 PNG. */
    capture: () => string;

    /** A rotation reference (e.g., if you need to store camera orientation in 3D). */
    rotationRef: React.MutableRefObject<Quaternion>;

    /** Current video dimensions (based on the actual camera stream). */
    dimensions: { width: number; height: number };

    /** All available video devices on the user’s machine. */
    availableDevices: MediaDeviceInfo[];

    /** The deviceId currently in use for streaming. */
    selectedDeviceId: string | null;

    /** 
     * Switch to a different video device by its deviceId. 
     * This re-initializes the webcam with the new device. 
     */
    setSelectedDeviceId: (deviceId: string) => Promise<void>;

    /** The capabilities of the currently active video track (e.g. exposure, focus, etc.). */
    capabilities: MediaTrackCapabilities | null;

    /** 
     * Apply constraints (e.g., manual exposure, etc.) to the active track. 
     * If the track or browser doesn’t support a constraint, it may be ignored. 
     */
    applyConstraints: (constraints: MediaTrackConstraints) => Promise<void>;
}

export const WebcamContext = createContext<WebcamContextValue | null>(null);

export const WebcamProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const rotationRef = useRef<Quaternion>(new Quaternion());

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceIdState] = useState<string | null>(null);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [capabilities, setCapabilities] = useState<MediaTrackCapabilities | null>(null);

    /**
     * Capture: draws the current video frame to an offscreen canvas and returns base64.
     */
    const capture = useCallback(() => {
        if (!videoRef.current) {
            throw new Error('Cannot screenshot without an active webcam video element');
        }

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context for screenshot');
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    }, []);

    /**
     * Apply constraints (e.g., for exposure, focus, etc.) to the current video track.
     */
    const applyConstraints = useCallback(
        async (constraints: MediaTrackConstraints) => {
            if (!stream) return;
            const videoTrack = stream.getVideoTracks()[0];
            if (!videoTrack) return;

            try {
                await videoTrack.applyConstraints(constraints);
                // After applying constraints, update capabilities if needed
                const updatedCapabilities = videoTrack.getCapabilities();
                setCapabilities(updatedCapabilities);
            } catch (error) {
                console.error('Error applying constraints:', error);
            }
        },
        [stream]
    );

    /**
     * Initialize the webcam with the given deviceId (or default if none).
     */
    const initWebcam = useCallback(
        async (deviceId?: string | null) => {
            // Stop existing stream if any
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: deviceId
                        ? { deviceId: { exact: deviceId } }
                        : true, // if no deviceId, let the browser pick a default
                    audio: false,
                });
                setStream(newStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                    await videoRef.current.play();
                }
            } catch (err) {
                console.error('Error initializing webcam:', err);
            }
        },
        [stream]
    );

    /**
     * Set selected device and re-initialize the webcam.
     */
    const setSelectedDeviceId = useCallback(
        async (deviceId: string) => {
            setSelectedDeviceIdState(deviceId);
            await initWebcam(deviceId);
        },
        [initWebcam]
    );

    /**
     * Get the list of available video input devices.
     */
    useEffect(() => {
        async function getDevices() {
            try {
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = allDevices.filter(
                    (d) => d.kind === 'videoinput'
                );
                setAvailableDevices(videoDevices);

                // If we don’t have a selected device yet, pick the first one
                if (videoDevices.length > 0 && !selectedDeviceId) {
                    setSelectedDeviceIdState(videoDevices[0].deviceId);
                    // Don’t await here so we can run in parallel
                    initWebcam(videoDevices[0].deviceId);
                }
            } catch (error) {
                console.error('Error enumerating devices:', error);
            }
        }
        getDevices();
    }, [initWebcam, selectedDeviceId]);

    /**
     * Update video dimensions and track capabilities after the video metadata loads.
     */
    useEffect(() => {
        const handleLoadedMetadata = () => {
            if (videoRef.current) {
                setDimensions({
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight,
                });
            }
            if (stream) {
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack) {
                    setCapabilities(videoTrack.getCapabilities());
                }
            }
        };

        const currentVideo = videoRef.current;
        if (currentVideo) {
            currentVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
            if (currentVideo) {
                currentVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [stream]);

    /**
     * Cleanup: stop tracks on unmount
     */
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return (
        <WebcamContext.Provider
            value={{
                videoRef,
                capture,
                rotationRef,
                dimensions,
                availableDevices,
                selectedDeviceId,
                setSelectedDeviceId,
                capabilities,
                applyConstraints,
            }}
        >
            {/* Hidden <video> element for streaming camera */}
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