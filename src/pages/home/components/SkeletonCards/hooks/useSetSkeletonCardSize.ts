import { RoomCardSizes } from "../../RoomCard/RoomCard"
import { RefObject, useEffect, useLayoutEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const MINIMUM_WINDOW_WIDTH = 450
const CARD_XS_WIDTH = 110

export const useSetSkeletonCardSize = (containerRef: RefObject<HTMLDivElement>) => {
    const { rooms } = useSelector((state: RootState) => state.rooms)

    const [size, setSize] = useState<RoomCardSizes>("xl")

    const [windowSize, setwindowSize] = useState<{ height: number; width: number }>({
        height: window.innerHeight,
        width: window.innerWidth,
    })

    useEffect(() => {
        setwindowSize({ height: window.innerHeight, width: window.innerWidth })
    }, [])

    useEffect(() => {
        const handleOnResize = () => setwindowSize({ height: window.innerHeight, width: window.innerWidth })
        window.addEventListener("resize", handleOnResize)
        return () => {
            document.removeEventListener("resize", handleOnResize)
        }
    }, [])

    useLayoutEffect(() => {
        setSize("xl")
    }, [windowSize, rooms?.length])

    useLayoutEffect(() => {
        const container = containerRef?.current
        const { width } = windowSize

        if (!container) return

        const isOverflowingY = container.scrollHeight > container.clientHeight
        if (width <= MINIMUM_WINDOW_WIDTH) {
            return setSize("lg")
        }

        if (size === "xs" && container.clientWidth + CARD_XS_WIDTH > container.scrollWidth) {
            return
        }

        if (isOverflowingY) {
            if (size === "xl") {
                return setSize("mxl")
            }
            if (size === "mxl") {
                return setSize("lg")
            }
            if (size === "lg") {
                return setSize("md")
            }
            if (size === "md") {
                return setSize("sm")
            }
            if (size === "sm") {
                return setSize("xs")
            }
        }
    }, [size, windowSize, rooms?.length])

    return { size }
}
