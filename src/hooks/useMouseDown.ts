import { useEffect, RefObject } from "react"

export function useEffectMouseDown(ref: RefObject<any>, onEvent: () => void): void {
    useEffect(() => {
        function handleOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (onEvent && typeof onEvent === "function") onEvent()
            }
        }
        document.addEventListener("mousedown", handleOutside)
        return () => {
            document.removeEventListener("mousedown", handleOutside)
        }
    }, [ref])
}