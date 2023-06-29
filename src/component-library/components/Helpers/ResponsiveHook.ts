import { useState, useEffect } from 'react';

export type ResponsiveHook = {
    sm: boolean; // sm: 640px
    md: boolean; // md: 768px
    lg: boolean; // lg: 1024px
    xl: boolean; // xl: 1280px
    xxl: boolean; // xxl: 1536px
}

/**
 * @description A React hook that returns handlers on the current window size
 * @returns {ResponsiveHook} corresponding to tailwind pixel width breakpoints
 */
export default function useReponsiveHook() {
    const [windowSize, setWindowSize] = useState([1920, 1080])
    useEffect(() => {
        setWindowSize([window.innerWidth, window.innerHeight])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    return {
        sm: windowSize[0] > 640,
        md: windowSize[0] > 768,
        lg: windowSize[0] > 1024,
        xl: windowSize[0] > 1280,
        xxl: windowSize[0] > 1536,
    } as ResponsiveHook
}