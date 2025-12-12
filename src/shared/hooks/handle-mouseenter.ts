import { MutableRefObject, useEffect } from "react"

export const useEffectMouseOver = (ref: MutableRefObject<any>, callback: () => void) => {
    useEffect(() => {
        setTimeout(() => {
            const handleMouseOver = (event: FocusEvent) => {
                if (ref.current && ref.current.contains(event.target)) {
                    callback();
                }
            }
            document.addEventListener("mouseover", handleMouseOver)
            return () => {
                document.removeEventListener("mouseover", handleMouseOver)
            }
        }, 0);
    }, [])
}
