import { useEffect, useState } from "react"

export function useDimensions() {
    const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window
        return {
            width,
            height,
        }
    }

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return windowDimensions
}
