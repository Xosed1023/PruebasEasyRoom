import { RefObject, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

export const useSetCardSize = (containerRef: RefObject<HTMLDivElement>) => {
    const { mesas } = useSelector((root: RootState) => root.restaurant)

    const handleResize = () => {
        if (!containerRef.current) {
            return
        }
        const hasScrollX = containerRef.current.scrollWidth > (containerRef.current.parentElement?.clientWidth || 1)
        const hasScrollY = containerRef.current.scrollHeight > (containerRef.current.parentElement?.clientHeight || 1)
        let scaleX = 1
        let scaleY = 1
        let width = ""
        let height = ""
        containerRef.current.style.transform = ""
        containerRef.current.style.width = ""
        containerRef.current.style.height = ""

        if (hasScrollX) {
            // width sube - scale baja
            const sW = containerRef.current.scrollWidth
            const cW = containerRef.current.parentElement?.clientWidth || 1
            scaleX = cW / sW
            width = `${cW / sW}px`
        }
        if (hasScrollY) {
            // width sube - scale baja
            const sH = containerRef.current.scrollHeight
            const cH = containerRef.current.parentElement?.clientHeight || 1
            scaleY = cH / sH
            height = `${cH / sH}px`
        }
        if (!hasScrollX && !hasScrollY) {
            containerRef.current.style.transform = ""
            containerRef.current.style.width = ""
            containerRef.current.style.height = ""
        }
        if (!hasScrollX && hasScrollY) {
            containerRef.current.style.transform = `scaleY(${scaleY})`
            containerRef.current.style.height = height
            containerRef.current.style.width = ""
        }
        if (hasScrollX && !hasScrollY) {
            containerRef.current.style.transform = `scaleX(${scaleX})`
            containerRef.current.style.width = width
            containerRef.current.style.height = ""
        }
        if (hasScrollX && hasScrollY) {
            containerRef.current.style.transform = `scale(${scaleX}, ${scaleY})`
            containerRef.current.style.width = width
            containerRef.current.style.height = height
        }

        const cardWidth = 161
        const cardHeight = 118
        // Tamaños mayores al original
        for (const item of containerRef.current.children) {
            const scaleX = item.getBoundingClientRect().width / cardWidth
            const scaleY = item.getBoundingClientRect().height / cardHeight;
            (item.firstChild?.firstChild as HTMLDivElement).style.transform = ""
            if (!hasScrollY && !hasScrollX) {
                (item.firstChild?.firstChild as HTMLDivElement).style.transform = `scale(${scaleX}, ${scaleY})`
            }
            if (!hasScrollX && hasScrollY) {
                (item.firstChild?.firstChild as HTMLDivElement).style.transform = `scaleX(${scaleX})`
            }
            if (!hasScrollY && hasScrollX) {
                (item.firstChild?.firstChild as HTMLDivElement).style.transform = `scaleY(${scaleY})`
            }
        }
        containerRef.current.style.visibility = ""
    }

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.visibility = "hidden"
        }
        setTimeout(() => handleResize(), 0)
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        setTimeout(() => handleResize(), 0)
    }, [mesas])
}
