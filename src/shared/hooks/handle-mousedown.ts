import { MutableRefObject, useEffect } from "react"

export function useEffectMouseDown(
    ref: MutableRefObject<any>,
    onEvent: () => void,
    extraRefs?: MutableRefObject<any>[]
): void {
    useEffect(() => {
        function handleOutside(event: any) {
            if (extraRefs && extraRefs.length > 0) {
                const allRefs = [ref, ...extraRefs]
                const clickedInside = allRefs.some((r) => r.current?.contains(event.target))
                if (!clickedInside && onEvent && typeof onEvent === "function") {
                    onEvent()
                }
            } else {
                if (ref.current && !ref.current.contains(event.target)) {
                    if (onEvent && typeof onEvent === "function") onEvent()
                }
            }
        }
        document.addEventListener("mousedown", handleOutside)
        return () => {
            document.removeEventListener("mousedown", handleOutside)
        }
    }, [ref])
}
