import { MutableRefObject, useEffect } from "react"

export const useEffectFocusOutside = (ref: MutableRefObject<any>, callback: () => void) => {
    useEffect(() => {
        setTimeout(() => {
            const handleFocusOutside = (event: FocusEvent) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            }
            document.addEventListener("focusout", handleFocusOutside)
            return () => {
                document.removeEventListener("focusout", handleFocusOutside)
            }
        }, 0);
    }, [])
}
