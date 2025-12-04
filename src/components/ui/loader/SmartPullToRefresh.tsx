import { Capacitor } from "@capacitor/core"
import { useEffect } from "react"
import "./SmartPullToRefresh.css"

type Props = {
    onRefresh?: () => Promise<void>
    children: React.ReactNode
}

export default function SmartPullToRefresh({ onRefresh, children }: Props) {
    const isNative = Capacitor.isNativePlatform()

    useEffect(() => {
        if (!isNative || !onRefresh) return

        let startY = 0
        let pulling = false
        let currentY = 0
        let container: HTMLElement | null = null
        let loaderWrapper: HTMLElement | null = null
        let loader: HTMLElement | null = null

        const TRIGGER_DIST = 120

        const findScrollableContent = () => {
            let screenContent: HTMLElement | null = null

            const screenWrapper = document.querySelector("[class*='screen__wrapper']") as HTMLElement | null
            if (screenWrapper) {
                const children = Array.from(screenWrapper.children) as HTMLElement[]

                for (const child of children) {
                    const style = window.getComputedStyle(child)
                    if (style.overflowY === "auto" || style.overflowY === "scroll") {
                        screenContent = child
                        break
                    }
                }
            }

            if (!screenContent) {
                screenContent = document.querySelector("div[class*='overflow-y-scroll']") as HTMLElement | null
            }

            return screenContent
        }

        const onTouchStart = (e: TouchEvent) => {
            if (window.scrollY <= 0) {
                pulling = true
                startY = e.touches[0].clientY
            }
        }

        const onTouchMove = (e: TouchEvent) => {
            if (!pulling) return

            currentY = e.touches[0].clientY
            const diff = currentY - startY

            if (diff <= 0) return

            const screenContent = findScrollableContent()
            if (!screenContent) return

            // Crear contenedor si no existe
            if (!container) {
                container = document.createElement("div")
                container.className = "pull-to-refresh-container"

                loaderWrapper = document.createElement("div")
                loaderWrapper.className = "pull-refresh-loader-wrapper"

                loader = document.createElement("div")
                loader.className = "custom-loader-mobile"

                loaderWrapper.appendChild(loader)
                container.appendChild(loaderWrapper)

                screenContent.insertBefore(container, screenContent.firstChild)
            }

            const progress = Math.min(diff / TRIGGER_DIST, 1)
            const scale = 0.5 + progress * 0.6

            if (loaderWrapper) {
                loaderWrapper.style.transform = `scale(${scale})`
                loaderWrapper.style.opacity = progress.toString()
            }

            container.style.height = diff + "px"
        }

        const onTouchEnd = async () => {
            if (!pulling) return

            pulling = false
            const diff = currentY - startY

            if (diff >= TRIGGER_DIST) {
                try {
                    await onRefresh()
                } catch (e) {
                    console.error("Refresh error: ", e)
                }
            }

            if (container?.parentNode) container.parentNode.removeChild(container)
            container = null
            loaderWrapper = null
            loader = null
        }

        window.addEventListener("touchstart", onTouchStart, { passive: true })
        window.addEventListener("touchmove", onTouchMove, { passive: true })
        window.addEventListener("touchend", onTouchEnd)

        return () => {
            window.removeEventListener("touchstart", onTouchStart)
            window.removeEventListener("touchmove", onTouchMove)
            window.removeEventListener("touchend", onTouchEnd)
        }
    }, [isNative, onRefresh])

    return <>{children}</>
}
