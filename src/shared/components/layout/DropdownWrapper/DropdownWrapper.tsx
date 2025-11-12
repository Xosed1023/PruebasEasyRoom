import { CSSProperties, ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"

const convertStyleToString = (style?: CSSProperties): string => {
    if (!style) {
        return ""
    }
    return Object.entries(style)
        .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()

            const cssValue = typeof value === "number" && !isNaN(value) ? `${value}` : value

            return `${cssKey}: ${cssValue}`
        })
        .join("; ")
}

export const DropdownWrapper = ({
    children,
    onClickOnBackground,
    style,
}: {
    children: ReactNode
    style?: CSSProperties
    onClickOnBackground?: (e: MouseEvent) => void
}) => {
    const portalRoot = document.getElementById("dropdowns-background")

    const child = document.createElement("div")
    child.setAttribute(
        "style",
        "width: 100dvw; height: 100dvh; position: fixed; z-index: 2000; top: 0; left: 0;" + convertStyleToString(style)
    )

    useEffect(() => {
        if (!portalRoot) return

        portalRoot.appendChild(child)

        if (onClickOnBackground) {
            child.addEventListener("click", onClickOnBackground)
        }

        return () => {
            if (onClickOnBackground) {
                child.removeEventListener("click", onClickOnBackground)
            }
            portalRoot.removeChild(child)
        }
    }, [child, portalRoot, onClickOnBackground])

    return createPortal(children, child)
}
