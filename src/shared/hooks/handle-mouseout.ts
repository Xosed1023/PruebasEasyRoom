import { MutableRefObject, useEffect } from "react"

export const useEffectMouseOut = (ref: MutableRefObject<any>, callback: () => void) => {
    useEffect(() => {
        setTimeout(() => {
            const handleMouseOut = (event: FocusEvent) => {
                if (ref.current && ref.current.contains(event.target)) {
                    callback();
                }
            }
            document.addEventListener("mouseout", handleMouseOut)
            return () => {
                document.removeEventListener("mouseout", handleMouseOut)
            }
        }, 0);
    }, [])
}
