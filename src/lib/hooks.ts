import { useEffect, useState } from "react";

export const useImageMetadata = (src: string) => {

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | Event | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const img = new Image();
        img.src = src;
        img.onload = () => {
            setIsLoading(false);
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = (error) => {
            setIsLoading(false);
            setError(error);
        };
    }, [src]);

    return { dimensions, isLoading, error };


}