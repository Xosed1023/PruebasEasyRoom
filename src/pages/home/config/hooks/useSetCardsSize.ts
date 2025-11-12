import { RefObject, useEffect, useLayoutEffect, useState } from "react"
import { Size } from "../types/Size"

const MINIMUM_WINDOW_WIDTH = 450
const CARD_XS_WIDTH = 110

export const useSetCardsSize = ({
    size,
    setSize,
    containerRef,
    itemsCount,
}: {
    size: Size
    setSize: any
    containerRef: RefObject<HTMLDivElement>
    itemsCount: number
}) => {
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
    }, [windowSize, itemsCount])

    useLayoutEffect(() => {
        const container = containerRef?.current
        const { width } = windowSize

        if (!container) return

        const isOverflowingY = container.scrollHeight > container.clientHeight
        const isOverflowingX = container.scrollWidth > container.clientWidth

        if (width <= MINIMUM_WINDOW_WIDTH) {
            container.style.display = "flex"
            container.style.flexDirection = "column"
            return setSize("lg")
        } else {
            container.style.display = ""
            container.style.flexDirection = ""
        }

        if (size === "xs" && container.clientWidth + CARD_XS_WIDTH > container.scrollWidth) {
            return
        }

        if (isOverflowingY || isOverflowingX) {
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
    }, [size, windowSize, itemsCount])

    return { size }
}
