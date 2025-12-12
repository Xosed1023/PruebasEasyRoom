import { useEffect, useRef, useState } from "react"

const useInfiniteScroll = (onBottomReached: () => void) => {
    const [container, setContainer] = useState<HTMLElement | null>(null)

    const callbackRef = useRef<(() => void) | null>(onBottomReached)
    const containerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        callbackRef.current = onBottomReached

        return () => {
            callbackRef.current = null
        }
    }, [onBottomReached])

    useEffect(() => {
        containerRef.current = container

        return () => {
            callbackRef.current = null
        }
    }, [container])

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const isAtBottom =
                    containerRef.current.scrollHeight - containerRef.current.scrollTop <=
                    containerRef.current.clientHeight
                if (isAtBottom) {
                    container && callbackRef.current?.()
                }
            }
        }

        if (containerRef.current) {
            containerRef.current.removeEventListener("scroll", handleScroll)
            containerRef.current.addEventListener("scroll", handleScroll)
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener("scroll", handleScroll)
            }
        }
    }, [container])

    return setContainer
}

export default useInfiniteScroll
