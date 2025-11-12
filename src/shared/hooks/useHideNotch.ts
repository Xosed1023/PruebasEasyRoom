import { useEffect, useState } from "react"

export function useHideNotch() {
    const [hide, setHide] = useState<boolean>(false)

    useEffect(() => {
        const observer = new MutationObserver((params) => setHide(params?.[0]?.addedNodes?.length > 0))
        const element = document.getElementById("modal") as HTMLDivElement

        observer.observe(element, { attributes: false, childList: true })

        return () => observer.disconnect()
    }, [])

    return {
        hideNotch: hide,
    }
}
