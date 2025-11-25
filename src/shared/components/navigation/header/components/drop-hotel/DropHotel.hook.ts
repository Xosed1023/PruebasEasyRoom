import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

export function useHover() {
    const [isHovered, setIsHovered] = useState(false)
    const triggerRef = useRef<any>(null)
    const contentRef = useRef<any>(null)

    const { isProfileDrawerOpen, isDrawerWidgetOpen } = useSelector((state: RootState) => state.navigation)

    useEffect(() => {
        const node = triggerRef.current
        if (!node) return

        function handleMouseOver(e) {
            const showDrawer = isProfileDrawerOpen || isDrawerWidgetOpen
            if (!showDrawer && (triggerRef.current?.contains(e.target) || contentRef.current?.contains(e.target))) {
                setIsHovered(true)
            }
        }

        function handleMouseOut(e) {
            // Si el nuevo elemento *no está* dentro del trigger ni del contenido, ocultar
            if (!triggerRef.current?.contains(e.relatedTarget) && !contentRef.current?.contains(e.relatedTarget)) {
                setIsHovered(false)
            }
        }

        node.addEventListener("mouseover", handleMouseOver)
        node.addEventListener("mouseout", handleMouseOut)

        return () => {
            node.removeEventListener("mouseover", handleMouseOver)
            node.removeEventListener("mouseout", handleMouseOut)
        }
    }, [isDrawerWidgetOpen, isProfileDrawerOpen])

    return { isHovered, triggerRef, contentRef, setIsHovered }
}
