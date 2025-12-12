import { useCallback, useEffect, useState } from "react"

export const useDoubleTap = (callback: () => void, delay = 300) => {
    const [tapCount, setTapCount] = useState(0)

    useEffect(() => {
        let timer: any = null

        if (tapCount === 2) {
            callback()
            setTapCount(0)
        } else if (tapCount === 1) {
            timer = setTimeout(() => {
                setTapCount(0)
            }, delay)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [tapCount, callback, delay])

    const handleTap = useCallback(() => {
        setTapCount((prevTapCount) => prevTapCount + 1)
    }, [])

    return handleTap
}
