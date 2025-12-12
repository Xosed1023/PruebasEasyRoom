import { MutableRefObject, useEffect } from "react"

export const useEffectClick = (ref: MutableRefObject<any>, callback: () => void) => {
    useEffect(() => {
        setTimeout(() => {
            const handleClick = (event: MouseEvent) => {
                if (ref.current && ref.current.contains(event.target)) {
                    callback();
                }
            }
            document.addEventListener("click", handleClick)
            return () => {
                document.removeEventListener("click", handleClick)
            }
        }, 0);
    }, [])
}




