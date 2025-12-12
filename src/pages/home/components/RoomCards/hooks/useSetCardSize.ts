import { RoomCardSizes } from "../../RoomCard/RoomCard"
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useProfile } from "src/shared/hooks/useProfile"
import { RootState } from "src/store/store"

const MINIMUM_WINDOW_WIDTH = 450
const CARD_XS_WIDTH = 110

export const useSetCardSize = (containerRef: RefObject<HTMLDivElement>) => {
    const { rooms } = useSelector((state: RootState) => state.rooms)
    const { configurations } = useProfile()

    const [size, setSize] = useState<RoomCardSizes>("xl")

    const [windowSize, setwindowSize] = useState<{ height: number; width: number }>({
        height: window.innerHeight,
        width: window.innerWidth,
    })

    useEffect(() => {
        setwindowSize({ height: window.innerHeight, width: window.innerWidth })
    }, [])

    const timeout = useRef<NodeJS.Timeout>()

    useEffect(() => {
        clearTimeout(timeout.current)
        const handleOnResize = () => {
            timeout.current = setTimeout(() => {
                setwindowSize({ height: window.innerHeight, width: window.innerWidth })
            }, 500)
        }
        window.addEventListener("resize", handleOnResize)
        return () => {
            document.removeEventListener("resize", handleOnResize)
        }
    }, [])

    // const handleResize = () => {
    //     if (!containerRef.current || !configurations?.cardHabitacion?.tamano_fijo) {
    //         return
    //     }
    //     containerRef.current.style.visibility = "hidden"
    //     const hasScrollX = containerRef.current.scrollWidth > (containerRef.current.parentElement?.clientWidth || 1)
    //     const hasScrollY = containerRef.current.scrollHeight > (containerRef.current.parentElement?.clientHeight || 1)
    //     let scaleX = 1
    //     let scaleY = 1
    //     let width = ""
    //     let height = ""
    //     containerRef.current.style.transform = ""
    //     containerRef.current.style.width = ""
    //     containerRef.current.style.height = ""

    //     if (hasScrollX) {
    //         // width sube - scale baja
    //         const sW = containerRef.current.scrollWidth
    //         const cW = containerRef.current.parentElement?.clientWidth || 1
    //         scaleX = cW / sW
    //         width = `${sW}px`
    //     }
    //     if (hasScrollY) {
    //         // width sube - scale baja
    //         const sH = containerRef.current.scrollHeight
    //         const cH = containerRef.current.parentElement?.clientHeight || 1
    //         scaleY = cH / sH
    //         height = `${sH}px`
    //     }
    //     if (!hasScrollX && !hasScrollY) {
    //         containerRef.current.style.transform = ""
    //         containerRef.current.style.width = ""
    //         containerRef.current.style.height = ""
    //     }
    //     if (!hasScrollX && hasScrollY) {
    //         containerRef.current.style.transform = `scaleY(${scaleY})`
    //         containerRef.current.style.height = height
    //         containerRef.current.style.width = ""
    //     }
    //     if (hasScrollX && !hasScrollY) {
    //         containerRef.current.style.transform = `scaleX(${scaleX})`
    //         containerRef.current.style.width = width
    //         containerRef.current.style.height = ""
    //     }
    //     if (hasScrollX && hasScrollY) {
    //         containerRef.current.style.transform = `scale(${scaleX}, ${scaleY})`
    //         containerRef.current.style.width = width
    //         containerRef.current.style.height = height
    //     }

    //     const cardWidth = 112
    //     const cardHeight = 66
    //     // Tamaños mayores al original
    //     for (const item of containerRef.current.children) {
    //         const scaleX = item.getBoundingClientRect().width / cardWidth
    //         const scaleY = item.getBoundingClientRect().height / cardHeight
    //         ;(item.firstChild?.firstChild as HTMLDivElement).style.transform = ""
    //         if (!hasScrollY && !hasScrollX) {
    //             (item.firstChild?.firstChild as HTMLDivElement).style.transform = `scale(${scaleX}, ${scaleY})`
    //         }
    //         if (!hasScrollX && hasScrollY) {
    //             (item.firstChild?.firstChild as HTMLDivElement).style.transform = `scaleX(${scaleX})`
    //         }
    //         if (!hasScrollY && hasScrollX) {
    //             (item.firstChild?.firstChild as HTMLDivElement).style.transform = `scaleY(${scaleY})`
    //         }
    //     }
    //     containerRef.current.style.visibility = ""
    // }

    useEffect(() => {
        if (!configurations?.cardHabitacion?.tamano_fijo) {
            return
        }
        if(containerRef.current) {
            containerRef.current.style.visibility = "hidden"
        }
        // setTimeout(() => handleResize(), 0)
        // window.addEventListener("resize", handleResize)
        return () => {
            // window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        // setTimeout(() => handleResize(), 0)
    }, [rooms])

    useLayoutEffect(() => {
        if (configurations?.cardHabitacion?.tamano_fijo) {
            return setSize((configurations?.cardHabitacion?.tamano || "xs") as RoomCardSizes)
        }
        setSize("xl")
    }, [windowSize, rooms?.length])

    useLayoutEffect(() => {
        const container = containerRef?.current
        const { width } = windowSize

        if (configurations?.cardHabitacion?.tamano_fijo) {
            return setSize((configurations?.cardHabitacion?.tamano || "xs") as RoomCardSizes)
        }

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
    }, [size, windowSize, rooms?.length])

    return { size }
}
