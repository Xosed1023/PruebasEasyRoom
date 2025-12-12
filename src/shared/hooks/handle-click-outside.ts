import { MutableRefObject, useEffect, useRef } from "react"

export const useEffectClickOutside = (ref: MutableRefObject<any>, callback: (e: MouseEvent) => void) => {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callbackRef.current(event)
            }
        }
        setTimeout(() => {
            document.addEventListener("click", handleClickOutside)
        }, 0)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])
}

export function useOutside(ref: any, onEvent: () => void): void {
    useEffect(() => {
        function handleOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (onEvent && typeof onEvent === "function") onEvent()
            }
        }
        function handlekeyOutside(event: any) {
            if (event.key === "Escape") {
                if (onEvent && typeof onEvent === "function") onEvent()
            }
        }
        document.addEventListener("keydown", handlekeyOutside, true)
        document.addEventListener("mousedown", handleOutside)
        return () => {
            document.addEventListener("keydown", handlekeyOutside, true)
            document.removeEventListener("mousedown", handleOutside)
        }
    }, [ref])
}
